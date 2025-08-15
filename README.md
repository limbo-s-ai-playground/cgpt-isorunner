# x86 ISO Runner (for GitHub Pages)

This is a minimal site that boots x86 ISOs in the browser using **v86** (WebAssembly). It works on static hosting like **GitHub Pages** and never uploads your ISO: everything runs locally in the browser.

> ⚠️ Limitations
>
> * v86 emulates a Pentium-class 32-bit machine with basic devices. Lightweight OS images (Linux, FreeDOS, hobby OS) work best. Modern Windows/64-bit ISOs will not work.
> * Networking and advanced hardware are out of scope here.
> * We use the v86 binaries and BIOS from the official npm package via **jsDelivr** CDN.

## Quick start (GitHub Pages)

1. Create a new public repo, e.g. `x86-iso-runner`.
2. Upload the contents of this folder (or the provided ZIP) to the repo root.
3. In **Settings → Pages**, choose *Deploy from a branch*, select `main` and root (`/`). Open the Pages link once it builds.
4. On the site, click **Load ISO…** (or drop an ISO onto the black screen), tweak RAM if needed, and press **Start**.

## Files

- `index.html` – UI markup, loads v86 from CDN.
- `style.css` – simple layout.
- `app.js` – boot logic, ISO/HDD loader, v86 config.
- `assets/` – favicon (SVG).

## Licenses

- This wrapper is MIT-licensed (see below).
- v86 is © the v86 authors, BSD-2-Clause; binaries are loaded from the official npm package via jsDelivr.
- BIOS files (SeaBIOS, VGABIOS) are provided by v86/npm and loaded from CDN. See the upstream licenses.

## Local development

Just open `index.html` in a browser. Some browsers block WASM from `file://` origins; if that happens, run a local server (e.g. `python -m http.server`).

## MIT License (wrapper only)

Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
