// Adds previous/next buttons, dots and arrow keys to the home page carousel.
// Without JavaScript the photos are still a sideways-scrolling row.
(function () {
  var root = document.querySelector(".carousel");
  if (!root) return;
  var track = root.querySelector(".carousel-track");
  var slides = Array.prototype.slice.call(track.children);
  var dots = Array.prototype.slice.call(root.querySelectorAll(".carousel-dot"));
  var status = root.querySelector("#carousel-status");
  var current = 0;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function show(i, announce) {
    current = (i + slides.length) % slides.length;
    track.scrollTo({ left: slides[current].offsetLeft - track.offsetLeft, behavior: reduce ? "auto" : "smooth" });
    update(announce);
  }
  function update(announce) {
    slides.forEach(function (s, n) {
      var on = n === current;
      s.setAttribute("aria-hidden", on ? "false" : "true");
      var link = s.querySelector("a");
      if (on) link.removeAttribute("tabindex"); else link.setAttribute("tabindex", "-1");
    });
    dots.forEach(function (d, n) {
      if (n === current) d.setAttribute("aria-current", "true"); else d.removeAttribute("aria-current");
    });
    if (announce) status.textContent = "Photo " + (current + 1) + " of " + slides.length + ": " + slides[current].querySelector(".carousel-title").textContent;
  }

  root.querySelector(".carousel-controls").hidden = false;
  root.classList.add("is-enhanced");
  root.querySelectorAll(".carousel-btn").forEach(function (b) {
    b.addEventListener("click", function () { show(current + Number(b.dataset.dir), true); });
  });
  dots.forEach(function (d) {
    d.addEventListener("click", function () { show(Number(d.dataset.index), true); });
  });
  root.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") { show(current - 1, true); e.preventDefault(); }
    if (e.key === "ArrowRight") { show(current + 1, true); e.preventDefault(); }
  });
  // Keep the dots in step when someone swipes on a touch screen.
  var t;
  track.addEventListener("scroll", function () {
    clearTimeout(t);
    t = setTimeout(function () {
      var i = Math.round(track.scrollLeft / track.clientWidth);
      if (i !== current && i >= 0 && i < slides.length) { current = i; update(false); }
    }, 120);
  }, { passive: true });
  update(false);
})();
