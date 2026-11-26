// Site-wide settings. Edit these to change your name, email and links everywhere.
export default {
  name: "Amy Sutherland",
  // The site's main address (no slash at the end). Used for search engines and link previews.
  url: "https://amysutherlandsart.com",
  description: "Photography by Amy Sutherland: animals, family and the moments in between.",
  // Forwards to a personal inbox via Cloudflare Email Routing.
  email: "amy@amysutherlandsart.com",
  // Add or remove links, e.g. { label: "Instagram", url: "https://instagram.com/yourname" }.
  // Leave the list empty to hide the section.
  social: [],
  nav: [
    { label: "Photography", url: "/photography/" },
    { label: "Other projects", url: "/projects/" },
    // Hidden for now (see HIDDEN_PAGES in eleventy.config.js):
    // { label: "Art", url: "/art/" },
    { label: "About", url: "/about/" },
  ],
};
