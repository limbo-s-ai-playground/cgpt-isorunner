/* v86 boot wrapper for GitHub Pages
 * - Loads v86 from CDN
 * - Lets user supply ISO/HDD (local file)
 * - Boots with selected config
 */
let emulator = null;
let isoBuffer = null;
let hddBuffer = null;

const logEl = document.getElementById("log");
const screen = document.getElementById("screen");
const dropHint = document.getElementById("dropHint");
const isoInput = document.getElementById("isoInput");
const hddInput = document.getElementById("hddInput");
const btnStart = document.getElementById("btnStart");
const btnReset = document.getElementById("btnReset");
const btnStop = document.getElementById("btnStop");
const btnFullscreen = document.getElementById("btnFullscreen");

function log(msg){
  const t = new Date().toLocaleTimeString();
  logEl.value += `[${t}] ${msg}\n`;
  logEl.scrollTop = logEl.scrollHeight;
}

async function readFileAsArrayBuffer(file){
  return new Uint8Array(await file.arrayBuffer());
}

function uiConfig(){
  const mem = Math.max(32, Math.min(2048, Number(document.getElementById("mem").value||512))) * 1024 * 1024;
  const vgamem = Math.max(1, Math.min(32, Number(document.getElementById("vgamem").value||8))) * 1024 * 1024;
  const acpi = document.getElementById("acpi").checked;
  const smp = document.getElementById("smp").checked;
  const wasmFallback = document.getElementById("wasmFallback").checked;
  return { mem, vgamem, acpi, smp, wasmFallback };
}

function createEmulator(){
  if (emulator) { emulator.stop(); emulator = null; }
  const { mem, vgamem, acpi, smp, wasmFallback } = uiConfig();

  const cfg = {
    wasm_path: "https://cdn.jsdelivr.net/npm/v86/build/" + (wasmFallback ? "v86-fallback.wasm" : "v86.wasm"),
    memory_size: mem,
    vga_memory_size: vgamem,
    acpi: acpi,
    screen_container: screen,
    bios: { url: "https://cdn.jsdelivr.net/npm/v86/bios/seabios.bin" },
    vga_bios: { url: "https://cdn.jsdelivr.net/npm/v86/bios/vgabios.bin" },
    autostart: false,
  };

  if (isoBuffer) cfg.cdrom = { buffer: isoBuffer };
  if (hddBuffer) cfg.hda = { buffer: hddBuffer };

  emulator = new V86(cfg);

  emulator.add_listener("emulator-ready", () => log("Emulator ready."));
  emulator.add_listener("download-progress", e => {
    if (e.file_name && e.loaded && e.total) {
      log(`Downloading ${e.file_name}: ${((e.loaded/e.total)*100)|0}%`);
    }
  });
  emulator.add_listener("serial0-output-char", chr => {
    // Optionally mirror serial to logs
    // if(chr) log(String(chr));
  });
  emulator.add_listener("exit", code => log("VM exited: " + code));
  emulator.add_listener("crash", () => log("VM crashed"));

  return emulator;
}

function ensureEmu(){
  if(!emulator) createEmulator();
  return emulator;
}

// File inputs
isoInput.addEventListener("change", async (e) => {
  const f = e.target.files[0];
  if (!f) return;
  isoBuffer = await readFileAsArrayBuffer(f);
  log("ISO loaded: " + f.name + " (" + f.size + " bytes)");
  dropHint.style.display = "none";
});

hddInput.addEventListener("change", async (e) => {
  const f = e.target.files[0];
  if (!f) return;
  hddBuffer = await readFileAsArrayBuffer(f);
  log("HDD image loaded: " + f.name + " (" + f.size + " bytes)");
});

// Drag & drop
screen.addEventListener("dragover", e => { e.preventDefault(); screen.classList.add("drag"); });
screen.addEventListener("dragleave", e => { screen.classList.remove("drag"); });
screen.addEventListener("drop", async (e) => {
  e.preventDefault(); screen.classList.remove("drag");
  const file = e.dataTransfer.files[0];
  if (!file) return;
  const ext = file.name.toLowerCase().split('.').pop();
  const buf = await readFileAsArrayBuffer(file);
  if (ext === "iso" || ext === "img" || ext === "bin" || ext === "raw") {
    isoBuffer = buf; log("ISO loaded via drop: " + file.name);
    dropHint.style.display = "none";
  } else {
    hddBuffer = buf; log("HDD image loaded via drop: " + file.name);
  }
});

btnStart.addEventListener("click", () => {
  const e = ensureEmu();
  if (!isoBuffer && !hddBuffer) {
    log("No ISO/HDD selected yet.");
  }
  e.run();
  log("VM started.");
});

btnReset.addEventListener("click", () => {
  if (!emulator) return;
  emulator.restart();
  log("VM reset.");
});

btnStop.addEventListener("click", () => {
  if (!emulator) return;
  emulator.stop();
  log("VM stopped.");
});

btnFullscreen.addEventListener("click", () => {
  if (!screen.requestFullscreen) return;
  screen.requestFullscreen();
});

// Accessibility: focus screen for keyboard
window.addEventListener("load", () => {
  screen.focus();
});
