# Amy Sutherland: portfolio website

A simple, accessible photography portfolio built with [Eleventy](https://www.11ty.dev/),
live at https://amysutherlandsart.com.
It's plain HTML and CSS. The only JavaScript is the light/dark toggle and a small script that
balances the photo rows; the site works without either.

## What's where

| To change… | Edit |
|---|---|
| Photos (home page and Photography page) | `src/_data/photography.json` + images in `src/images/photography/` |
| Other projects (illustration, relief carving…) | `src/_data/projects.json` + images in `src/images/projects/` |
| The playable BlackJack game (at `/play/blackjack/`) | `src/play/blackjack/` (copied as-is, not run through the templates) |
| About page bio and photo | `src/about.njk` (photo in `src/images/about/`) |
| Name, email, social links, menu | `src/_data/site.js` |
| Colors and layout | `src/css/styles.css` |

## Add a photo in 3 steps

1. **Copy the image** into `src/images/photography/`.
   Use the full-size JPEG; the site makes the smaller, faster versions for you.
   Use a simple file name with no spaces, e.g. `harbor-at-dawn.jpg`.
2. **Add an entry** to `src/_data/photography.json`. Copy an existing block and edit it:
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
   - Photos appear in the order of the list, on both the home page and the Photography page.
     Each photo keeps its own shape (wide, tall or square). Nothing gets cropped.
3. **Commit and push.** The host rebuilds the site automatically within about 5 minutes.

Projects work the same way, using `src/_data/projects.json` (each entry also has a `category`
and a `summary`).

## Hidden pages

The Art page is built but hidden. To bring it back, remove it from `HIDDEN_PAGES` in
`eleventy.config.js`, restore its menu entry in `src/_data/site.js`, replace the sample
entries in `src/_data/art.json`, and delete the `/art/` lines in `src/_redirects`
(they currently send old Art addresses to Other projects).

**After removing or renaming any page**, purge Cloudflare's cache (Cloudflare dashboard →
amysutherlandsart.com → Caching → Configuration → Purge Everything). Otherwise Cloudflare
may keep showing the old page at its old address for up to a week.

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
