# Momentra website

Landing page: https://bikalbst.github.io/momentra/

Windows download: `dist/assets/downloads/Momentra-Source-Setup-v16.zip` (fresh source setup).

The site is standalone HTML, CSS and JavaScript in `dist`, with lavender, mint and peach colors, scroll reveals and a reduced-motion control. Edit `index.html`, `cozy.css` and `cozy.js`. The studio and feature interactions are illustrative previews; they make no AI calls or uploads. Three supplied full video samples open on demand, with a small silent hero teaser. Web copies retain original duration and audio.

Extract the setup ZIP and launch `Start Momentra.cmd`. It contains no personal keys, accounts, projects or bundled EXE. First setup downloads its private runtime and video tools. The adjacent SHA-256 file verifies the download.

## Update the website

Edit the files in `dist`, commit, and push to `main`. The GitHub Actions workflow in `.github/workflows/pages.yml` publishes that folder to GitHub Pages. Keep Settings → Pages → Source set to GitHub Actions.

Edit `dist/site-config.js` when changing the Windows download or repository link. Every Download button and GitHub icon uses those two values.

The `.openai/hosting.json` file retains the original private Sites deployment identity; GitHub Pages deploys only `dist`.
