// Photo and project pages: move between pieces without reloading the page.
// Swipe the photo, click/tap either half (or its arrows), or use the arrow keys.
// The next photo slides in, is swapped in place, and the frame eases to the new shape.
// Everything still works as normal links if JavaScript is off or anything goes wrong.
(function () {
  if (!document.querySelector(".artwork-frame")) return;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var busy = false;
  var pageCache = {};

  // A quiet announcement for screen readers when the photo changes.
  var live = document.createElement("p");
  live.className = "visually-hidden";
  live.setAttribute("aria-live", "polite");
  document.body.appendChild(live);

  function els() {
    var frame = document.querySelector(".artwork-frame");
    return {
      frame: frame,
      img: frame && (frame.querySelector(":scope > picture") || frame),
      peekPrev: frame && frame.querySelector(".swipe-peek-prev"),
      peekNext: frame && frame.querySelector(".swipe-peek-next"),
      prev: document.querySelector('a[rel="prev"]'),
      next: document.querySelector('a[rel="next"]')
    };
  }
  function pad(frame) { return parseFloat(getComputedStyle(frame).paddingLeft) || 0; }
  function zoomed() { return window.visualViewport && window.visualViewport.scale > 1.01; }

  // Slide the photo and its neighbours together, so the next one follows your finger in.
  function move(x, animate) {
    var e = els(); if (!e.frame || reduce) return;
    var p = pad(e.frame);
    var t = animate ? "transform 0.3s cubic-bezier(.2,.7,.2,1)" : "none";
    [e.img, e.peekPrev, e.peekNext].forEach(function (el) { if (el) el.style.transition = t; });
    e.img.style.transform = x ? "translateX(" + x + "px)" : "";
    if (e.peekPrev) e.peekPrev.style.transform = "translateX(calc(-100% - " + p + "px + " + x + "px))";
    if (e.peekNext) e.peekNext.style.transform = "translateX(calc(100% + " + p + "px + " + x + "px))";
  }

  function fetchPage(url) {
    if (!pageCache[url]) {
      pageCache[url] = fetch(url, { credentials: "same-origin" }).then(function (r) {
        if (!r.ok) throw new Error(r.status);
        return r.text();
      });
    }
    return pageCache[url];
  }
  // Wait (briefly) until the new photo is decoded, so it appears instantly.
  function ready(img) {
    if (!img || !img.decode) return Promise.resolve();
    return Promise.race([img.decode().catch(function () {}), new Promise(function (r) { setTimeout(r, 1500); })]);
  }

  // Swap in the main content of another photo page.
  function load(url, dir, push) {
    if (busy) return;
    busy = true;
    var e = els();
    var oldH = e.frame.getBoundingClientRect().height;
    var hadFocus = document.activeElement && document.activeElement.closest && document.activeElement.closest(".frame-nav");
    var slid = new Promise(function (r) {
      if (!dir || reduce) return r();
      move(dir * (e.frame.clientWidth - pad(e.frame)), true);
      setTimeout(r, 300);
    });
    fetchPage(url).then(function (html) {
      var doc = new DOMParser().parseFromString(html, "text/html");
      var newMain = doc.querySelector("main");
      if (!newMain) throw new Error("no main");
      // Decode the incoming photo off-screen first (it's usually already cached from the peek).
      var probe = newMain.querySelector(".artwork-frame > picture img");
      var pre = null;
      if (probe) {
        pre = new Image();
        pre.sizes = probe.getAttribute("sizes") || "100vw";
        var srcset = probe.closest("picture").querySelector("source[type='image/avif']") || probe.closest("picture").querySelector("source[type='image/webp']");
        if (srcset) pre.srcset = srcset.getAttribute("srcset"); else pre.src = probe.getAttribute("src");
      }
      return Promise.all([slid, ready(pre)]).then(function () { return doc; });
    }).then(function (doc) {
      var main = document.querySelector("main");
      main.innerHTML = doc.querySelector("main").innerHTML;
      document.title = doc.title;
      if (push) history.pushState({ photo: true }, "", url);
      // Ease the frame from the old photo's height to the new one's.
      var f = els().frame;
      if (f && !reduce) {
        var newH = f.getBoundingClientRect().height;
        if (Math.abs(newH - oldH) > 2) {
          f.style.height = oldH + "px";
          f.offsetHeight; // apply the starting height
          f.style.transition = "height 0.3s cubic-bezier(.2,.7,.2,1)";
          f.style.height = newH + "px";
          setTimeout(function () { f.style.height = ""; f.style.transition = ""; }, 320);
        }
      }
      var h1 = main.querySelector("h1");
      live.textContent = h1 ? h1.textContent.trim() : doc.title;
      if (hadFocus) {
        var again = document.querySelector(dir < 0 ? 'a[rel="next"]' : 'a[rel="prev"]') || document.querySelector(".frame-nav");
        if (again) again.focus({ preventScroll: true });
      }
      // Keep the photo in view if the page was scrolled past it.
      var top = f ? f.getBoundingClientRect().top : 0;
      if (top < 0) window.scrollBy({ top: top - 16, behavior: reduce ? "auto" : "smooth" });
      bind();
      prefetchNeighbours();
      busy = false;
    }).catch(function () {
      window.location.href = url; // fall back to a normal page load
    });
  }

  function go(link, dir) {
    if (!link) { move(0, true); return; }
    load(link.href, dir, true);
  }
  function prefetchNeighbours() {
    var e = els();
    [e.prev, e.next].forEach(function (a) { if (a) fetchPage(a.href).catch(function () {}); });
  }

  // Touch, click and hover handlers live on the frame, which is replaced on every swap.
  function bind() {
    var frame = els().frame;
    if (!frame || frame.dataset.bound) return;
    frame.dataset.bound = "1";
    var startX = 0, startY = 0, dx = 0, tracking = false, horizontal = null, swiped = 0;

    frame.addEventListener("touchstart", function (ev) {
      if (busy || ev.touches.length !== 1 || zoomed()) { tracking = false; return; }
      tracking = true; horizontal = null; dx = 0;
      startX = ev.touches[0].clientX; startY = ev.touches[0].clientY;
    }, { passive: true });

    frame.addEventListener("touchmove", function (ev) {
      if (!tracking) return;
      var x = ev.touches[0].clientX - startX, y = ev.touches[0].clientY - startY;
      if (horizontal === null && (Math.abs(x) > 8 || Math.abs(y) > 8)) horizontal = Math.abs(x) > Math.abs(y);
      if (!horizontal) return; // a mostly up/down swipe just scrolls the page
      dx = x;
      var e = els();
      var blocked = (dx < 0 && !e.next) || (dx > 0 && !e.prev);
      move(blocked ? dx * 0.25 : dx, false);
    }, { passive: true });

    frame.addEventListener("touchend", function () {
      if (!tracking) return;
      tracking = false;
      if (!horizontal) return;
      swiped = Date.now();
      var e = els();
      var threshold = Math.min(80, frame.clientWidth * 0.2);
      if (dx <= -threshold) go(e.next, -1);
      else if (dx >= threshold) go(e.prev, 1);
      else move(0, true);
    });
    frame.addEventListener("touchcancel", function () { tracking = false; move(0, true); });

    frame.addEventListener("click", function (ev) {
      if (Date.now() - swiped < 400 || zoomed()) { ev.preventDefault(); return; }
      var e = els(), left;
      // The arrows always go their own way (also when pressed with Enter, which has no position).
      var arrow = ev.target.closest && ev.target.closest(".frame-nav");
      if (arrow) left = arrow.getAttribute("rel") === "prev";
      else { var r = frame.getBoundingClientRect(); left = (ev.clientX - r.left) < r.width / 2; }
      var link = left ? e.prev : e.next;
      if (!link) return;
      ev.preventDefault();
      go(link, left ? 1 : -1);
    });
    frame.addEventListener("mousemove", function (ev) {
      var r = frame.getBoundingClientRect(), left = (ev.clientX - r.left) < r.width / 2, e = els();
      frame.classList.toggle("go-prev", left && !!e.prev);
      frame.classList.toggle("go-next", !left && !!e.next);
    });
    frame.addEventListener("mouseleave", function () { frame.classList.remove("go-prev", "go-next"); });
  }

  document.addEventListener("keydown", function (ev) {
    if (ev.altKey || ev.ctrlKey || ev.metaKey || ev.shiftKey) return;
    var t = ev.target;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    var e = els();
    if (ev.key === "ArrowLeft" && e.prev) { ev.preventDefault(); go(e.prev, 1); }
    if (ev.key === "ArrowRight" && e.next) { ev.preventDefault(); go(e.next, -1); }
  });

  // Back / Forward buttons: swap to that photo too (no slide).
  history.replaceState({ photo: true }, "");
  window.addEventListener("popstate", function (ev) {
    if (!ev.state || !ev.state.photo) return;
    busy = false;
    load(location.href, 0, false);
  });
  // Coming back to this page from elsewhere: make sure nothing is left mid-slide.
  window.addEventListener("pageshow", function () { move(0, false); });

  bind();
  prefetchNeighbours();
})();
