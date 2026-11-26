// Site-wide settings. Edit these to change your name, email and links everywhere.
export default {
  name: "Amy Sutherland",
  // The site's main address (no slash at the end). Used for search engines and link previews.
  url: "https://amysutherlandsart.com",
  tagline: "Photographer",
  // The headline and line under it on the home page. Change these to your own words.
  intro: {
    heading: "Animals, family and the light in between.",
    subheading: "Photography by Amy Sutherland",
  },
  description: "Photography by Amy Sutherland: animals, family and the moments in between.",
  // Forwards to a personal inbox via Cloudflare Email Routing.
  email: "amy@amysutherlandsart.com",
  // Add or remove links. Leave the list empty to hide the section.
  social: [
    { label: "GitHub", url: "https://github.com/AmyMSutherland" },
  ],
  nav: [
    { label: "Photography", url: "/photography/" },
    // Hidden for now (see HIDDEN_PAGES in eleventy.config.js):
    // { label: "Art", url: "/art/" },
    // { label: "Projects", url: "/projects/" },
    { label: "About", url: "/about/" },
  ],
};
