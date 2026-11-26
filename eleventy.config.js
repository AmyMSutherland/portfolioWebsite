import path from "node:path";
import Image from "@11ty/eleventy-img";

const IMAGE_ROOT = "src/images";

/**
 * Builds a responsive <picture> (AVIF + WebP + JPEG, several widths).
 * Stops the build if alt text is missing, so nothing goes live without it.
 *
 * Usage: {% picture "photography/harbor.jpg", item.alt, "(min-width: 60rem) 25vw, 100vw", "lazy" %}
 */
async function picture(file, alt, sizes = "100vw", loading = "lazy", widths = [400, 800, 1200, 2000]) {
  if (!file) {
    throw new Error(`[picture] An image entry has no "file". Check your data files in src/_data/.`);
  }
  if (typeof alt !== "string" || alt.trim() === "") {
    throw new Error(
      `[picture] "${file}" has no alt text. Add an "alt" describing the image in its data file (src/_data/).`
    );
  }

  const metadata = await Image(path.join(IMAGE_ROOT, file), {
    widths: [...widths, "auto"],
    formats: ["avif", "webp", "jpeg"],
    outputDir: "_site/img/",
    urlPath: "/img/",
    sharpJpegOptions: { quality: 82, progressive: true },
    sharpWebpOptions: { quality: 80 },
    sharpAvifOptions: { quality: 60 },
  });

  return Image.generateHTML(metadata, {
    alt,
    sizes,
    loading,
    decoding: "async",
  });
}

export default function (eleventyConfig) {
  eleventyConfig.addAsyncShortcode("picture", picture);

  // Pages that are hidden for now. To bring one back, delete its line here
  // and restore its menu entry in src/_data/site.js.
  const HIDDEN_PAGES = ["src/art.njk", "src/art-item.njk", "src/projects.njk"];
  HIDDEN_PAGES.forEach((file) => eleventyConfig.ignores.add(file));

  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy({ "src/favicon.svg": "favicon.svg", "src/logo.png": "logo.png", "src/logo-light-text.png": "logo-light-text.png" });

  eleventyConfig.addWatchTarget("src/images/");

  eleventyConfig.addFilter("year", () => new Date().getFullYear());
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
