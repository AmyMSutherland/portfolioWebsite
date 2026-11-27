// "Copy email" buttons: copy the address and say "Copied!" for a moment.
// Hidden without JavaScript, where the address is still shown as text to copy by hand.
(function () {
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    var label = btn.querySelector(".copy-label");
    var status = document.getElementById(btn.getAttribute("data-status")) || null;
    var original = label.textContent;
    btn.hidden = false;
    btn.addEventListener("click", function () {
      var text = btn.getAttribute("data-copy");
      var done = function () {
        btn.classList.add("is-copied");
        label.textContent = "Copied!";
        if (status) status.textContent = "Email address copied";
        setTimeout(function () { btn.classList.remove("is-copied"); label.textContent = original; if (status) status.textContent = ""; }, 2000);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done, fallback);
      } else { fallback(); }
      function fallback() {
        var t = document.createElement("textarea");
        t.value = text; t.setAttribute("readonly", ""); t.style.position = "absolute"; t.style.left = "-9999px";
        document.body.appendChild(t); t.select();
        try { document.execCommand("copy"); done(); } catch (e) {}
        t.remove();
      }
    });
  });
})();
