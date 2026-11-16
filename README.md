# Momentra website

Landing page: https://bikalbst.github.io/momentra/

Windows download: https://github.com/bikalbst/momentra/releases/download/v7/Momentra.exe

The site is standalone HTML, CSS and JavaScript in `dist`. The software interface is an interactive illustrative preview, not the video-processing app itself. The sample image comes from the Momentra project.

## Update the website

Edit the files in `dist`, commit, and push to `main`. The GitHub Actions workflow in `.github/workflows/pages.yml` publishes that folder to GitHub Pages. Keep Settings → Pages → Source set to GitHub Actions.

Edit `dist/site-config.js` when changing the Windows download or repository link. Every Download button and GitHub icon uses those two values.

The `.openai/hosting.json` file retains the original private Sites deployment identity; GitHub Pages deploys only `dist`.
