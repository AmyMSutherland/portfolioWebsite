import path from "node:path";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import Image from "@11ty/eleventy-img";

/**
 * Adds a fingerprint of the file's contents to its URL, e.g. /css/styles.css?v=1a2b3c4d.
 * Browsers may keep stylesheets and scripts for hours; a new fingerprint makes them
 * download the new version as soon as it changes.
 */
function bust(url) {
  const hash = createHash("md5").update(readFileSync(path.join("src", url))).digest("hex").slice(0, 8);
  return `${url}?v=${hash}`;
}

const IMAGE_ROOT = "src/images";

export default function (eleventyConfig) {
  // Image settings shared by the page images and the link-preview images.
  // Output follows the build's output folder (normally _site), wherever that is.
  const imageOptions = (widths, formats) => ({
    widths,
    formats,
    outputDir: path.join(eleventyConfig.directories.output, "img"),
    urlPath: "/img/",
    // Quality is set high because this is a photography site; fine detail matters
    // more than a few extra kilobytes.
    sharpJpegOptions: { quality: 86, progressive: true },
    sharpWebpOptions: { quality: 86 },
    sharpAvifOptions: { quality: 72 },
  });

  /**
   * Builds a responsive <picture> (AVIF + WebP + JPEG, several widths).
   * Stops the build if alt text is missing, so nothing goes live without it.
   *
   * Usage: {% picture "photography/harbor.jpg", item.alt, "(min-width: 60rem) 25vw, 100vw", "lazy" %}
   */
  eleventyConfig.addAsyncShortcode("picture", async (file, alt, sizes = "100vw", loading = "lazy", widths = [400, 800, 1200, 2000]) => {
    if (!file) {
      throw new Error(`[picture] An image entry has no "file". Check your data files in src/_data/.`);
    }
    if (typeof alt !== "string" || alt.trim() === "") {
      throw new Error(
        `[picture] "${file}" has no alt text. Add an "alt" describing the image in its data file (src/_data/).`
      );
    }
    const metadata = await Image(path.join(IMAGE_ROOT, file), imageOptions([...widths, "auto"], ["avif", "webp", "jpeg"]));
    return Image.generateHTML(metadata, { alt, sizes, loading, decoding: "async" });
  });

  /**
   * A purely decorative <picture> (alt=""), e.g. previews inside a link that already has a text label.
   * Usage: {% decorativePicture "photography/cookie.jpg", "34vw", "eager", [500, 900] %}
   */
  eleventyConfig.addAsyncShortcode("decorativePicture", async (file, sizes = "100vw", loading = "lazy", widths = [500, 900, 1400]) => {
    const metadata = await Image(path.join(IMAGE_ROOT, file), imageOptions([...widths, "auto"], ["avif", "webp", "jpeg"]));
    return Image.generateHTML(metadata, { alt: "", sizes, loading, decoding: "async" });
  });

  /**
   * URL of a 1200px JPEG for link previews (texts, social media).
   * Usage: {% shareImage "photography/harbor.jpg" %}
   */
  eleventyConfig.addAsyncShortcode("shareImage", async (file) => {
    const metadata = await Image(path.join(IMAGE_ROOT, file), imageOptions([1200], ["jpeg"]));
    return metadata.jpeg[0].url;
  });

  /**
   * URL of a small JPEG, for thumbnails and blurred backdrops.
   * Usage: {% imageUrl "photography/harbor.jpg", 400 %}
   */
  eleventyConfig.addAsyncShortcode("imageUrl", async (file, width = 400) => {
    const metadata = await Image(path.join(IMAGE_ROOT, file), imageOptions([width], ["jpeg"]));
    return metadata.jpeg[0].url;
  });

  // Playable projects (e.g. the BlackJack game) are copied as-is, not run through the templates.
  eleventyConfig.ignores.add("src/play/**");
  eleventyConfig.addPassthroughCopy("src/play");

  eleventyConfig.addPassthroughCopy("src/robots.txt"); // points search engines to the sitemap
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/fonts"); // Open Sans, only the letters of the home page name (SIL Open Font License)
  eleventyConfig.addPassthroughCopy({
    "src/favicon.svg": "favicon.svg",
    "src/favicon.ico": "favicon.ico",
    "src/_redirects": "_redirects",
    "src/apple-touch-icon.png": "apple-touch-icon.png",
    "src/logo.svg": "logo.svg",
    "src/logo-light-text.svg": "logo-light-text.svg",
  });

  eleventyConfig.addWatchTarget("src/images/");

  eleventyConfig.addFilter("year", () => new Date().getFullYear());
  eleventyConfig.addFilter("bust", bust);
  eleventyConfig.addFilter("throwError", (message) => {
    throw new Error(message);
  });

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
