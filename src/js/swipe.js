// Photo pages: swipe left for the next photo, right for the previous one (phones and tablets).
// The arrow keys do the same on a keyboard. The Previous/Next buttons still work as always.
(function () {
  var frame = document.querySelector(".artwork-frame");
  if (!frame) return;
  var prev = document.querySelector('a[rel="prev"]');
  var next = document.querySelector('a[rel="next"]');
  if (!prev && !next) return;
  var img = frame.querySelector("picture") || frame;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var startX = 0, startY = 0, dx = 0, tracking = false, horizontal = null;

  function zoomed() { return window.visualViewport && window.visualViewport.scale > 1.01; }
  function move(x, animate) {
    if (reduce) return;
    img.style.transition = animate ? "transform 0.25s ease, opacity 0.25s ease" : "none";
    img.style.transform = x ? "translateX(" + x + "px)" : "";
    img.style.opacity = x ? String(Math.max(0.4, 1 - Math.abs(x) / 600)) : "";
  }
  function go(link, dir) {
    if (!link) { move(0, true); return; }
    move(dir * frame.clientWidth, true);
    setTimeout(function () { window.location.href = link.href; }, reduce ? 0 : 180);
  }

  frame.addEventListener("touchstart", function (e) {
    if (e.touches.length !== 1 || zoomed()) { tracking = false; return; }
    tracking = true; horizontal = null; dx = 0;
    startX = e.touches[0].clientX; startY = e.touches[0].clientY;
  }, { passive: true });

  frame.addEventListener("touchmove", function (e) {
    if (!tracking) return;
    var x = e.touches[0].clientX - startX, y = e.touches[0].clientY - startY;
    if (horizontal === null && (Math.abs(x) > 8 || Math.abs(y) > 8)) horizontal = Math.abs(x) > Math.abs(y);
    if (!horizontal) return;              // a mostly-up/down swipe just scrolls the page
    dx = x;
    // Resist a little when there's no photo in that direction.
    var blocked = (dx < 0 && !next) || (dx > 0 && !prev);
    move(blocked ? dx * 0.25 : dx, false);
  }, { passive: true });

  frame.addEventListener("touchend", function () {
    if (!tracking) return;
    tracking = false;
    if (!horizontal) return;
    var threshold = Math.min(80, frame.clientWidth * 0.2);
    if (dx <= -threshold) go(next, -1);
    else if (dx >= threshold) go(prev, 1);
    else move(0, true);
  });
  frame.addEventListener("touchcancel", function () { tracking = false; move(0, true); });

  document.addEventListener("keydown", function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    var t = e.target;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    if (e.key === "ArrowLeft" && prev) window.location.href = prev.href;
    if (e.key === "ArrowRight" && next) window.location.href = next.href;
  });

  // Bring the photo back if someone returns with the browser's Back button.
  window.addEventListener("pageshow", function () { move(0, false); });
})();
