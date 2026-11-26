// Balances the gallery wall into evenly sized rows (a "justified" layout).
// Without JavaScript the CSS-only layout still works; this just makes the rows tidier.
(function () {
  function layout(wall) {
    var items = Array.prototype.slice.call(wall.children);
    if (!items.length) return;
    var style = getComputedStyle(wall);
    var width = wall.clientWidth;
    var gap = parseFloat(style.columnGap) || 0;
    // Target row height comes from the CSS variable --row-h (in rem).
    var rootPx = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    var target = (parseFloat(style.getPropertyValue("--row-h")) || 16) * rootPx;
    var ratios = items.map(function (el) { return parseFloat(el.style.getPropertyValue("--r")) || 1; });

    // Height a row would need so its photos exactly fill the width.
    function rowHeight(start, end) {
      var sum = 0;
      for (var i = start; i < end; i++) sum += ratios[i];
      return (width - gap * (end - start - 1)) / sum;
    }

    var start = 0;
    var heightSum = 0, fullRows = 0;   // track the full rows so a short last row can match them
    while (start < items.length) {
      var end = start + 1;
      // Add photos until the row would get shorter than the target height,
      // then keep whichever break point is closer to the target.
      while (end < items.length && rowHeight(start, end + 1) >= target) end++;
      if (end < items.length) {
        var withNext = rowHeight(start, end + 1);
        if (Math.abs(withNext - target) < Math.abs(rowHeight(start, end) - target)) end++;
      }
      var isLast = end >= items.length;
      var h = rowHeight(start, end);
      if (isLast) {
        // A short last row shouldn't be stretched (or end up bigger than the rest):
        // give it the same height as the full rows above it.
        var usual = fullRows ? heightSum / fullRows : target;
        h = Math.min(h, usual);
      } else {
        heightSum += h; fullRows++;
      }
      for (var i = start; i < end; i++) {
        var w = Math.floor(ratios[i] * h);
        items[i].style.flex = (i === end - 1 && !isLast) ? "1 1 " + w + "px" : "0 0 " + w + "px";
        items[i].style.maxWidth = "none";
      }
      start = end;
    }
  }

  var walls = document.querySelectorAll(".wall");
  if (!walls.length || !("ResizeObserver" in window)) return;
  var observer = new ResizeObserver(function (entries) {
    entries.forEach(function (e) { layout(e.target); });
  });
  walls.forEach(function (wall) {
    wall.classList.add("is-justified");
    observer.observe(wall);
  });
})();
