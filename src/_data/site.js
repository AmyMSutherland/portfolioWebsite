// Site-wide settings. Edit these to change your name, email and links everywhere.
export default {
  name: "Amy Sutherland",
  // The site's main address (no slash at the end). Used for search engines and link previews.
  url: "https://amysutherlandsart.com",
  description: "Amy Sutherland is a photographer and artist in Auburn, Maine, sharing photography, art and design, and new media, from UX case studies to a JavaScript game.",
  // Added after the name in the home page title, to tell this Amy Sutherland apart in search results.
  tagline: "Photographer and artist in Auburn, Maine",
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
