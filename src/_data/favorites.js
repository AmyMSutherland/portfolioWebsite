// Photos shown in the big carousel on the home page, in this order.
// Use the exact "title" of a photo from photography.json.
const FAVORITES = [
  "Totality",
  "Marry me",
  "Light columns",
  "Cookie",
  "Grammy",
  "Best friends",
];

import { readFileSync } from "node:fs";

export default function () {
  const photos = JSON.parse(readFileSync("src/_data/photography.json", "utf8"));
  return FAVORITES.map((title) => {
    const photo = photos.find((p) => p.title === title);
    if (!photo) throw new Error(`[favorites] "${title}" isn't a photo title in src/_data/photography.json.`);
    return photo;
  });
}
