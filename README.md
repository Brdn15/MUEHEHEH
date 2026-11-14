# Pixel Valentine Letter — Interactive Web Page

Recreation of the design/interactions in the user-provided short video. It is a **standalone project**, not a replacement for the Neon Snake Game.

## How to run in VS Code

1. Extract the ZIP to a folder.
2. Open that folder in VS Code: **File → Open Folder**.
3. Install **Live Server** extension (by Ritwick Dey), if you have not already.
4. Right-click `index.html` and choose **Open with Live Server**.
5. Tap the bow or envelope to fire Cupid's arrow and reveal the letter.
6. Move your mouse over **NO** to see it evade you. Click **YES** for the happy animation.
7. Click **Play again** or the toolbar's refresh icon to restart.

## Files

- `index.html`: structure (no dependencies on local assets)
- `style.css`: pixel-pastel design, movement, responsive layout
- `script.js`: pixel-art cat, background hearts, letter and buttons, celebration

## Publish on GitHub Pages

Create a **new repository** (recommended name: `valentine-letter`), upload these three project files to the repository root, then go to **Settings → Pages → Deploy from a branch → main → /(root)**.

> This project uses no Firebase/database. It is a front-end-only demo and works offline except that the optional Google font requires internet; a monospace fallback is provided.

## Customization

- Change the words in `index.html` under `questionState` and `successState`.
- Change pink/purple colors at the top of `style.css` (`:root`).
- Make the NO button stop moving: remove the four `noBtn.addEventListener(...)` lines in `script.js`.

This is an original implementation based on the visible behavior of the video, not its original source code/assets.
