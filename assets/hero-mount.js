/* Первый экран: полноэкранный герой с видео-фоном производства и плавающим
   редуктором (как на zavod-red.ru). Заменяет секцию героя на index.html. */
(function () {
  "use strict";
  var d = document;

  function css() {
    if (d.getElementById("zr-hero-css")) return;
    var s = d.createElement("style"); s.id = "zr-hero-css";
    s.textContent =
      ".zr-hero{position:relative;display:flex;align-items:center;overflow:hidden;background:#0b1219;min-height:min(86vh,720px);padding:0;margin:0}" +
      ".zr-hero-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0}" +
      ".zr-hero::after{content:'';position:absolute;inset:0;z-index:1;background:linear-gradient(100deg,rgba(8,15,21,.96) 0%,rgba(8,15,21,.82) 44%,rgba(8,15,21,.42) 100%)}" +
      ".zr-hero-wrap{position:relative;z-index:2;width:100%;max-width:1240px;margin:0 auto;padding:54px 24px;display:grid;grid-template-columns:1.06fr .94fr;gap:40px;align-items:center}" +
      ".zr-hero-eye{display:inline-flex;align-items:center;gap:8px;color:#ff5a1f;font:700 12px/1 'Space Grotesk',system-ui,sans-serif;letter-spacing:.09em;text-transform:uppercase;margin-bottom:16px}" +
      ".zr-hero-eye .dt{width:7px;height:7px;border-radius:50%;background:#ff2e2e}" +
      ".zr-hero-main h1{font:800 clamp(30px,4.3vw,55px)/1.07 'Space Grotesk','Archivo',system-ui,sans-serif;color:#fff;text-transform:uppercase;letter-spacing:-.01em;margin:0;max-width:900px}" +
      ".zr-hero-main h1 .ac{color:#ff2e2e}" +
      ".zr-hero-sub{color:#c4d2dc;font-size:clamp(15px,1.35vw,19px);max-width:600px;line-height:1.55;margin:20px 0 0}" +
      ".zr-hero-cta{display:flex;gap:14px;flex-wrap:wrap;margin-top:28px}" +
      ".zr-hbtn{display:inline-flex;align-items:center;justify-content:center;padding:16px 30px;border-radius:12px;font:700 15.5px 'Archivo',system-ui,sans-serif;text-decoration:none;transition:.16s;border:1px solid transparent;cursor:pointer}" +
      ".zr-hbtn.red{background:#ff2e2e;color:#fff;box-shadow:0 12px 30px -8px rgba(255,46,46,.5)}.zr-hbtn.red:hover{background:#e81f1f}" +
      ".zr-hbtn.ghost{background:rgba(255,255,255,.06);color:#fff;border-color:rgba(255,255,255,.3)}.zr-hbtn.ghost:hover{border-color:#fff;background:rgba(255,255,255,.12)}" +
      ".zr-hero-trust{color:#8ea0ad;font-size:13.5px;margin-top:16px;max-width:600px;line-height:1.5}" +
      ".zr-hero-badges{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:30px;max-width:620px}" +
      ".zr-hero-badges .b b{display:block;font:800 clamp(20px,2vw,27px)/1.05 'Space Grotesk',system-ui,sans-serif;color:#fff}" +
      ".zr-hero-badges .b span{color:#8ea0ad;font-size:12.5px;line-height:1.32;display:block;margin-top:5px}" +
      ".zr-hero-3d{position:relative;display:flex;align-items:center;justify-content:center}" +
      ".zr-hero-3d img{width:100%;max-width:560px;height:auto;object-fit:contain;filter:drop-shadow(0 28px 48px rgba(0,0,0,.6));animation:zrFloat 6s ease-in-out infinite}" +
      "@keyframes zrFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}" +
      ".zr-hero-mute{position:absolute;bottom:16px;right:16px;z-index:3;width:36px;height:36px;border-radius:50%;border:1px solid rgba(255,255,255,.25);background:rgba(10,18,25,.5);backdrop-filter:blur(6px);color:#fff;cursor:pointer;font-size:13px}" +
      ".zr-hero-mute:hover{background:#ff2e2e;border-color:#ff2e2e}" +
      "@media(max-width:960px){.zr-hero{min-height:auto}.zr-hero-wrap{grid-template-columns:1fr;gap:22px;padding:34px 20px}.zr-hero-3d{order:-1;max-width:340px;margin:0 auto}.zr-hero-badges{grid-template-columns:1fr 1fr;gap:14px}}" +
      "@media(max-width:520px){.zr-hero-cta .zr-hbtn{flex:1 1 100%}}";
    d.head.appendChild(s);
  }

  var HTML =
    '<img class="zr-hero-bg" src="assets/hero_poster.webp" alt="" aria-hidden="true">' +
    '<video class="zr-hero-bg" autoplay muted loop playsinline preload="metadata" poster="assets/hero_poster.webp"><source src="assets/hero.mp4" type="video/mp4"></video>' +
    '<div class="zr-hero-wrap"><div class="zr-hero-main">' +
    '<div class="zr-hero-eye"><span class="dt"></span>Завод полного цикла · EVL · ПР · МР</div>' +
    '<h1>Промышленные <span class="ac">редукторы</span> и мотор-редукторы от&nbsp;производителя</h1>' +
    '<p class="zr-hero-sub">Производим и подбираем понижающие редукторы и мотор-редукторы EVL, ПР, МР под оборудование, маркировку, фото, шильдик или параметры. Цена от&nbsp;производителя, поставка по&nbsp;России.</p>' +
    '<div class="zr-hero-cta"><a class="zr-hbtn red" href="contacts.html">Получить расчёт</a><a class="zr-hbtn ghost" href="podbor.html">Подбор по параметрам</a></div>' +
    '<p class="zr-hero-trust">Инженер ответит за&nbsp;15&nbsp;минут · подбор по&nbsp;шильдику, фото и&nbsp;параметрам · отгрузка от&nbsp;3&nbsp;дней по&nbsp;России</p>' +
    '<div class="zr-hero-badges">' +
    '<div class="b"><b>от 3 дней</b><span>редукторы в наличии</span></div>' +
    '<div class="b"><b>24 месяца</b><span>гарантия или переделаем за наш счёт</span></div>' +
    '<div class="b"><b>100%</b><span>замена импортных аналогов</span></div></div>' +
    '</div><div class="zr-hero-3d"><picture><source srcset="assets/reduktor_float.webp" type="image/webp"><img src="assets/reduktor_float.png" alt="Промышленный мотор-редуктор" loading="eager"></picture></div></div>' +
    '<button class="zr-hero-mute" type="button" title="Звук">🔇</button>';

  function mount() {
    if (d.querySelector(".zr-hero")) return true;
    var h1 = [].slice.call(d.querySelectorAll("h1")).filter(function (e) { return /Промышленные редукторы/.test(e.textContent); })[0];
    if (!h1) return false;
    var sec = h1.closest("section") || h1.parentElement;
    // поднимаемся до полноширинной секции
    var full = sec; for (var i = 0; i < 3 && full.parentElement; i++) { if (full.tagName === "SECTION") break; full = full.parentElement; }
    sec = full;
    css();
    sec.className = "zr-hero"; sec.removeAttribute("style"); sec.innerHTML = HTML;
    var v = sec.querySelector("video.zr-hero-bg");
    var mute = sec.querySelector(".zr-hero-mute");
    if (mute && v) mute.addEventListener("click", function () { v.muted = !v.muted; mute.textContent = v.muted ? "🔇" : "🔊"; if (!v.muted) v.play().catch(function () {}); });
    if (v) {
      function tryPlay() { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
      tryPlay(); v.addEventListener("canplay", tryPlay); v.addEventListener("loadeddata", tryPlay);
      ["pointerdown", "touchstart", "scroll", "keydown", "mousemove"].forEach(function (ev) { d.addEventListener(ev, function once() { tryPlay(); d.removeEventListener(ev, once); }, { passive: true }); });
      if ("IntersectionObserver" in window) { try { new IntersectionObserver(function (en) { if (en[0] && en[0].isIntersecting) tryPlay(); }).observe(v); } catch (e) {} }
    }
    return true;
  }
  var n = 0; (function loop() { if (mount()) return; if (n++ < 80) setTimeout(loop, 80); })();
})();
