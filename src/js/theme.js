// Light/dark theme toggle.
// Default follows the visitor's device setting; clicking the button saves their choice.
(function () {
  var button = document.getElementById("theme-toggle");
  if (!button) return;
  var root = document.documentElement;
  var media = window.matchMedia("(prefers-color-scheme: dark)");

  function isDark() {
    var chosen = root.dataset.theme;
    return chosen ? chosen === "dark" : media.matches;
  }

  function update() {
    button.setAttribute("aria-pressed", String(isDark()));
  }

  button.addEventListener("click", function () {
    var next = isDark() ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
    update();
  });

  media.addEventListener("change", update);
  button.hidden = false; // Only show the button when JavaScript can run it.
  update();
})();
