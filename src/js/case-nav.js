// Case study jump bar: highlights the section you're reading and adds a shadow once
// the bar sticks to the top. Without JavaScript the links still jump to each section.
(function () {
  var nav = document.querySelector(".case-jump");
  if (!nav || !("IntersectionObserver" in window)) return;

  // Which link each section belongs to (both test rounds count as "Testing").
  var linkFor = {};
  nav.querySelectorAll("a[href^='#']").forEach(function (a) { linkFor[a.getAttribute("href").slice(1)] = a; });
  var sections = Array.prototype.filter.call(document.querySelectorAll(".case-study section[id]"), function (s) { return s.id; });
  function owner(id) {
    if (linkFor[id]) return linkFor[id];
    if (id === "testing-2") return linkFor.testing;
    if (id === "design-system") return linkFor.refining;
    return null;
  }
  function setCurrent(a) {
    nav.querySelectorAll("a").forEach(function (l) { l.removeAttribute("aria-current"); });
    if (a) {
      a.setAttribute("aria-current", "true");
      // keep the active pill visible when the bar scrolls sideways on phones
      var left = a.offsetLeft - nav.clientWidth / 2 + a.offsetWidth / 2;
      nav.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
    }
  }
  var visible = {};
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { visible[e.target.id] = e.isIntersecting; });
    var current = null;
    for (var i = 0; i < sections.length; i++) { if (visible[sections[i].id]) { current = sections[i].id; break; } }
    setCurrent(current ? owner(current) : null);
  }, { rootMargin: "-20% 0px -60% 0px" });
  sections.forEach(function (s) { io.observe(s); });

  // Shadow when stuck: watch a 1px marker placed just before the bar.
  var marker = document.createElement("div");
  marker.setAttribute("aria-hidden", "true");
  marker.style.height = "1px";
  nav.parentNode.insertBefore(marker, nav);
  new IntersectionObserver(function (entries) {
    nav.classList.toggle("is-stuck", !entries[0].isIntersecting);
  }).observe(marker);
})();
