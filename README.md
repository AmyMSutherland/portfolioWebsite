# Amy Sutherland: portfolio website

A simple, accessible art and photography portfolio built with [Eleventy](https://www.11ty.dev/).
It's plain HTML and CSS, and the only JavaScript is the light/dark toggle.

## Add a photo (or artwork) in 3 steps

1. **Copy the image** into `src/images/photography/` (or `src/images/art/`).
   Use the full-size JPEG; the site makes the smaller, faster versions for you.
   Use a simple file name with no spaces, e.g. `harbor-at-dawn.jpg`.
2. **Add an entry** to `src/_data/photography.json` (or `art.json`). Copy an existing block and edit it:
   ```json
   {
     "file": "photography/harbor-at-dawn.jpg",
     "title": "Harbor at dawn",
     "alt": "Fishing boats moored in a calm harbor, lit orange by the rising sun.",
     "caption": "Optional: the story behind the shot.",
     "year": 2026
   }
   ```
   - **`alt` is required.** Describe what someone would need to know if they couldn't see the image.
     The build stops with an error if it's missing.
   - Titles must be unique. They become the page address (`/photography/harbor-at-dawn/`).
   - Separate entries with commas, and don't put a comma after the last one.
   - The first entries in the list show first, and the first three appear on the home page.
3. **Commit and push.** The host rebuilds the site automatically within a minute or two.

Delete the `sample-*.jpg` files and their entries once you've added your own work.
Edit your name, email and links in `src/_data/site.js`, and your bio in `src/about.njk`.

## Run it on your computer

```powershell
npm install
npm start
```
Then open http://localhost:8080. The page reloads as you save changes.

## Change the colors

All colors are at the top of `src/css/styles.css`. If you change them, keep text contrast at
4.5:1 or higher (check with https://webaim.org/resources/contrastchecker/).

## Accessibility checks

After big changes, check a few pages with the free [axe DevTools](https://www.deque.com/axe/devtools/)
or [WAVE](https://wave.webaim.org/extension/) browser extension, or Chrome's Lighthouse → Accessibility.
Also try moving through the site with only the Tab and Enter keys.

Hosting and domain setup: see [DEPLOY.md](DEPLOY.md).
