/* Первый экран: статичное фото героя → зацикленное видео производства + оформление. */
(function () {
  "use strict";
  var d = document;
  function css() {
    if (d.getElementById("zr-hero-css")) return;
    var s = d.createElement("style"); s.id = "zr-hero-css";
    s.textContent =
      ".zr-hero-v{display:block;object-fit:cover;border-radius:22px;box-shadow:0 30px 60px -18px rgba(10,18,25,.4);background:#0f1c26;animation:zrHeroZoom 18s ease-in-out infinite alternate}" +
      "@keyframes zrHeroZoom{from{transform:scale(1)}to{transform:scale(1.06)}}" +
      ".zr-hero-wrap{position:relative;border-radius:22px;overflow:hidden;isolation:isolate}" +
      ".zr-hero-grad{position:absolute;left:0;right:0;bottom:0;height:55%;background:linear-gradient(to top,rgba(10,18,25,.72),rgba(10,18,25,0));pointer-events:none;z-index:1}" +
      ".zr-hero-live{position:absolute;top:14px;left:14px;z-index:3;display:inline-flex;align-items:center;gap:8px;padding:7px 13px;border-radius:999px;background:rgba(10,18,25,.55);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);color:#fff;font:700 11.5px/1 'Archivo',system-ui,sans-serif;letter-spacing:.03em;text-transform:uppercase}" +
      ".zr-hero-live .d{width:8px;height:8px;border-radius:50%;background:#ff5a1f;box-shadow:0 0 0 0 rgba(255,90,31,.6);animation:zrPulse 1.8s infinite}" +
      "@keyframes zrPulse{0%{box-shadow:0 0 0 0 rgba(255,90,31,.6)}70%{box-shadow:0 0 0 9px rgba(255,90,31,0)}100%{box-shadow:0 0 0 0 rgba(255,90,31,0)}}" +
      ".zr-hero-play{position:absolute;top:14px;right:14px;z-index:3;width:34px;height:34px;border-radius:50%;border:none;background:rgba(10,18,25,.55);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);color:#fff;cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center}" +
      ".zr-hero-play:hover{background:#ff5a1f}";
    d.head.appendChild(s);
  }

  function mount() {
    var img = d.querySelector('img[src*="prod-d1"]');
    if (!img) { img = [].slice.call(d.querySelectorAll("img")).filter(function (im) { var r = im.getBoundingClientRect(); return r.width > 300 && r.height > 220 && r.top + window.scrollY < 900; })[0]; }
    if (!img || d.querySelector(".zr-hero-v")) return !!d.querySelector(".zr-hero-v");
    var w = img.offsetWidth || 440, h = img.offsetHeight || 330;
    var card = img.parentElement;

    var wrap = d.createElement("div"); wrap.className = "zr-hero-wrap";
    wrap.style.width = "100%"; wrap.style.maxWidth = Math.max(w, 480) + "px"; wrap.style.aspectRatio = (w / h).toFixed(3);
    var v = d.createElement("video");
    v.className = "zr-hero-v"; v.src = "assets/hero.mp4"; v.poster = "assets/hero_poster.webp";
    v.muted = true; v.defaultMuted = true; v.loop = true; v.autoplay = true;
    v.setAttribute("muted", ""); v.setAttribute("autoplay", ""); v.setAttribute("loop", ""); v.setAttribute("playsinline", ""); v.setAttribute("preload", "metadata");
    v.style.width = "100%"; v.style.height = "100%";
    var grad = d.createElement("div"); grad.className = "zr-hero-grad";
    var live = d.createElement("div"); live.className = "zr-hero-live"; live.innerHTML = '<span class="d"></span>Производство · Челябинск';
    var mute = d.createElement("button"); mute.className = "zr-hero-play"; mute.type = "button"; mute.title = "Звук"; mute.textContent = "🔇";
    mute.addEventListener("click", function () { v.muted = !v.muted; mute.textContent = v.muted ? "🔇" : "🔊"; if (!v.muted) v.play().catch(function () {}); });

    wrap.appendChild(v); wrap.appendChild(grad); wrap.appendChild(live); wrap.appendChild(mute);
    // переносим существующий ценовой бейдж поверх видео (если он рядом с картинкой)
    img.parentNode.replaceChild(wrap, img);
    var badge = [].slice.call(card.children).filter(function (e) { return e !== wrap && /от\s*128\s*000|EVL 197/.test(e.textContent || ""); })[0];
    if (badge) { badge.style.position = "absolute"; badge.style.left = "16px"; badge.style.bottom = "16px"; badge.style.right = "16px"; badge.style.zIndex = "3"; badge.style.margin = "0"; card.style.position = "relative"; if (getComputedStyle(card).overflow !== "visible") card.style.overflow = "visible"; wrap.appendChild(badge); }
    function tryPlay() { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
    tryPlay();
    v.addEventListener("canplay", tryPlay);
    v.addEventListener("loadeddata", tryPlay);
    ["pointerdown", "touchstart", "scroll", "keydown", "mousemove"].forEach(function (ev) { d.addEventListener(ev, function once() { tryPlay(); d.removeEventListener(ev, once); }, { passive: true }); });
    if ("IntersectionObserver" in window) { try { new IntersectionObserver(function (en) { if (en[0] && en[0].isIntersecting) tryPlay(); }).observe(v); } catch (e) {} }
    return true;
  }
  var n = 0; (function loop() { css(); if (mount()) return; if (n++ < 60) setTimeout(loop, 80); })();
})();
