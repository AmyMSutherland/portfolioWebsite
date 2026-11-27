// Adds previous/next buttons, thumbnails, arrow keys and a slow auto-advance to the home page carousel.
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

  // Moves on by itself every 10 seconds. It holds still while the pointer is over it
  // or keyboard focus is inside it, while the tab is hidden, and when the visitor's
  // device asks for less motion. The pause button stops it until it's pressed again.
  var DELAY = 10000, timer = null, hovering = false, focused = false;
  var playing = !reduce;
  var playBtn = root.querySelector(".carousel-play");
  var playLabel = playBtn.querySelector(".visually-hidden");
  function schedule() {
    clearTimeout(timer);
    if (playing && !hovering && !focused && !document.hidden) {
      timer = setTimeout(function () { show(current + 1, false); schedule(); }, DELAY);
    }
  }
  function updatePlay() {
    root.classList.toggle("is-playing", playing);
    playLabel.textContent = playing ? "Pause slideshow" : "Play slideshow";
  }

  root.querySelector(".carousel-controls").hidden = false;
  root.classList.add("is-enhanced");
  root.querySelectorAll(".carousel-btn[data-dir]").forEach(function (b) {
    b.addEventListener("click", function () { show(current + Number(b.dataset.dir), true); schedule(); });
  });
  dots.forEach(function (d) {
    d.addEventListener("click", function () { show(Number(d.dataset.index), true); schedule(); });
  });
  root.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") { show(current - 1, true); schedule(); e.preventDefault(); }
    if (e.key === "ArrowRight") { show(current + 1, true); schedule(); e.preventDefault(); }
  });
  playBtn.addEventListener("click", function () { playing = !playing; updatePlay(); schedule(); });
  root.addEventListener("mouseenter", function () { hovering = true; schedule(); });
  root.addEventListener("mouseleave", function () { hovering = false; schedule(); });
  root.addEventListener("focusin", function (e) { focused = e.target !== playBtn; schedule(); });
  root.addEventListener("focusout", function (e) { if (!root.contains(e.relatedTarget)) { focused = false; schedule(); } });
  document.addEventListener("visibilitychange", schedule);

  // Keep the thumbnails in step when someone swipes on a touch screen.
  var t;
  track.addEventListener("scroll", function () {
    clearTimeout(t);
    t = setTimeout(function () {
      var i = Math.round(track.scrollLeft / track.clientWidth);
      if (i !== current && i >= 0 && i < slides.length) { current = i; update(false); schedule(); }
    }, 120);
  }, { passive: true });

  update(false);
  updatePlay();
  schedule();
})();
