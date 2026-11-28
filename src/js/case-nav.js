// Case study jump bar: highlights the section you're reading, and once the bar sticks to
// the top it gets a shadow and a "Top" button. Without JavaScript the links still work.
(function () {
  var nav = document.querySelector(".case-jump");
  if (!nav) return;

  // Which pill each section belongs to (both test rounds count as "Testing").
  var track = nav.querySelector(".case-jump-track") || nav;
  var linkFor = {};
  nav.querySelectorAll("a[href^='#']:not(.case-jump-top)").forEach(function (a) { linkFor[a.getAttribute("href").slice(1)] = a; });
  var extra = { "testing-2": "testing", "design-system": "refining" };
  var sections = Array.prototype.slice.call(document.querySelectorAll(".case-study section[id]"))
    .filter(function (s) { return linkFor[s.id] || extra[s.id]; });

  // A 1px marker where the bar starts; once it's above the screen, the bar is stuck.
  var marker = document.createElement("div");
  marker.setAttribute("aria-hidden", "true");
  marker.style.height = "1px";
  nav.parentNode.insertBefore(marker, nav);

  var current = null;
  function update() {
    nav.classList.toggle("is-stuck", marker.getBoundingClientRect().top < 0);

    // Current section: the last one whose top has passed a third of the way down the screen.
    var line = window.innerHeight / 3, id = null;
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].getBoundingClientRect().top <= line) id = sections[i].id; else break;
    }
    var link = id ? (linkFor[id] || linkFor[extra[id]]) : null;
    if (link === current) return;
    if (current) current.removeAttribute("aria-current");
    current = link;
    if (link) {
      link.setAttribute("aria-current", "true");
      // keep the active pill in view when the pills scroll sideways on phones
      track.scrollTo({ left: Math.max(0, link.offsetLeft - track.offsetLeft - track.clientWidth / 2 + link.offsetWidth / 2), behavior: "smooth" });
    }
  }

  // Fade the edge of the pill row on the side that has more to swipe to.
  function edges() {
    var max = track.scrollWidth - track.clientWidth;
    track.classList.toggle("more-left", track.scrollLeft > 2);
    track.classList.toggle("more-right", track.scrollLeft < max - 2);
  }
  track.addEventListener("scroll", edges, { passive: true });
  window.addEventListener("resize", edges);
  edges();

  var queued = false;
  function onScroll() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () { queued = false; update(); });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();
})();
