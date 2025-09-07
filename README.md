# Duckify+ — BadUSB Script → Arduino Code Converter

Convert DuckyScript/BadUSB scripts to ready-to-upload Arduino sketches with an enhanced, modern UI.

- **Tech**: React + TypeScript + Vite, Material UI
- **Features**: Live preview, copy/download `.ino`, keyboard layout and board target selectors
- **Inspired by**: Duckify by SpacehuhnTech [`https://github.com/SpacehuhnTech/duckify`](https://github.com/SpacehuhnTech/duckify)

## Quick start

```bash
npm install
npm run dev
```

Open the app at the URL printed by Vite (usually `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```

## Usage

1. Paste your DuckyScript into the left editor.
2. Adjust the keyboard layout and target board.
3. Copy or download the generated `.ino` sketch from the right panel.

Supported commands include `STRING`, `DELAY`, `REPEAT`, modifier combos like `CTRL ALT DELETE`, simple keys like `ENTER`, `TAB`, arrow keys, etc. This project focuses on common subsets and may not cover every dialect.

## Notes

- Generated code uses `Keyboard.h` and simple helpers.
- Upload to boards that support native USB HID (e.g., Arduino Leonardo, Pro Micro).

## License

MIT. Credits to SpacehuhnTech for Duckify inspiration: [`https://github.com/SpacehuhnTech/duckify`](https://github.com/SpacehuhnTech/duckify).

