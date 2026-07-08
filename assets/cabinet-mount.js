/* Личный кабинет из localStorage: история заказов (zr_orders) + профиль (zr_profile). */
(function () {
  "use strict";
  var d = document;
  function orders() { try { return JSON.parse(localStorage.getItem("zr_orders") || "[]"); } catch (e) { return []; } }
  function profile() { try { return JSON.parse(localStorage.getItem("zr_profile") || "null"); } catch (e) { return null; } }
  function getCart() { try { return JSON.parse(localStorage.getItem("zr_cart") || '{"items":[]}'); } catch (e) { return { items: [] }; } }
  function saveCart(c) { try { localStorage.setItem("zr_cart", JSON.stringify(c)); } catch (e) {} if (window.zrRefreshBadge) try { window.zrRefreshBadge(); } catch (_) {} }
  function rub(n) { return Math.round(n).toLocaleString("ru-RU") + " ₽"; }
  function esc(s) { return String(s == null ? "" : s).replace(/[<>&]/g, function (c) { return { "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]; }); }
  function dmy(iso) { try { var x = new Date(iso), p = function (n) { return ("0" + n).slice(-2); }; return p(x.getDate()) + "." + p(x.getMonth() + 1) + "." + x.getFullYear(); } catch (e) { return ""; } }

  function css() {
    if (d.getElementById("zr-cab-css")) return;
    var s = d.createElement("style"); s.id = "zr-cab-css";
    s.textContent =
      ".zr-cab{background:#eef2f6}.zr-cab-in{max-width:1160px;margin:0 auto;padding:12px 20px 40px}" +
      ".zr-cab-head{display:flex;align-items:center;gap:18px;margin-bottom:22px}" +
      ".zr-cab-ava{width:64px;height:64px;border-radius:16px;background:#ff5a1f;color:#fff;display:flex;align-items:center;justify-content:center;font:800 24px 'Space Grotesk',sans-serif;flex:none}" +
      ".zr-cab-head h1{font:700 clamp(24px,3.4vw,34px)/1.1 'Space Grotesk',sans-serif;color:#0f1c26;margin:0 0 4px}" +
      ".zr-cab-head .sub{color:#5a6a75;font-size:14px}" +
      ".zr-cab-badge{display:inline-block;margin-top:8px;padding:6px 14px;border-radius:999px;background:rgba(18,145,95,.1);color:#12915f;font-weight:700;font-size:13px}" +
      ".zr-cab-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:20px}" +
      ".zr-cab-stat{background:#fff;border:1px solid rgba(12,20,28,.1);border-radius:16px;padding:20px 22px}" +
      ".zr-cab-stat .n{font:800 30px 'Space Grotesk',sans-serif;color:#0f1c26;letter-spacing:-.02em}" +
      ".zr-cab-stat .l{color:#8a97a1;font-size:12px;letter-spacing:.05em;text-transform:uppercase;font-weight:700;margin-top:4px}" +
      ".zr-cab-tabs{display:inline-flex;background:#fff;border:1px solid rgba(12,20,28,.1);border-radius:14px;padding:5px;gap:4px;margin-bottom:18px;flex-wrap:wrap}" +
      ".zr-cab-tabs button{border:none;background:none;padding:11px 20px;border-radius:10px;font:600 14.5px 'Archivo',sans-serif;color:#3f4b55;cursor:pointer;transition:.15s}" +
      ".zr-cab-tabs button.on{background:#ff5a1f;color:#fff}" +
      ".zr-cab-tabs button .c{opacity:.7;font-weight:700}" +
      ".zr-ord{background:#fff;border:1px solid rgba(12,20,28,.1);border-radius:16px;padding:20px 22px;margin-bottom:14px}" +
      ".zr-ord-top{display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:12px}" +
      ".zr-ord-no{font:700 16px 'IBM Plex Mono',monospace;color:#0f1c26}" +
      ".zr-ord-date{color:#8a97a1;font-size:13px;margin-left:10px}" +
      ".zr-ord-st{padding:5px 12px;border-radius:999px;background:rgba(255,90,31,.1);color:#ff5a1f;font-weight:700;font-size:12.5px}" +
      ".zr-ord-items{border-top:1px solid rgba(12,20,28,.07);padding-top:12px}" +
      ".zr-ord-it{display:flex;justify-content:space-between;gap:10px;padding:5px 0;font-size:14px;color:#3f4b55}" +
      ".zr-ord-it b{color:#0f1c26;font-weight:600}" +
      ".zr-ord-foot{display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap;border-top:1px solid rgba(12,20,28,.07);margin-top:10px;padding-top:12px}" +
      ".zr-ord-total b{font:700 20px 'Space Grotesk',sans-serif;color:#0f1c26}.zr-ord-total span{color:#8a97a1;font-size:13px}" +
      ".zr-repeat{border:1px solid rgba(12,20,28,.14);background:#fff;color:#0f1c26;font:700 13.5px 'Archivo',sans-serif;padding:10px 18px;border-radius:10px;cursor:pointer;transition:.15s}" +
      ".zr-repeat:hover{border-color:#ff5a1f;color:#ff5a1f}" +
      ".zr-cab-panel{background:#fff;border:1px solid rgba(12,20,28,.1);border-radius:16px;padding:24px 26px}" +
      ".zr-dl{display:grid;grid-template-columns:200px 1fr;gap:12px 20px}" +
      ".zr-dl dt{color:#8a97a1;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:.03em}" +
      ".zr-dl dd{color:#0f1c26;font-weight:600;margin:0}" +
      ".zr-doc{display:flex;align-items:center;gap:14px;padding:14px 0;border-bottom:1px solid rgba(12,20,28,.07)}" +
      ".zr-doc:last-child{border-bottom:0}.zr-doc .di{width:40px;height:40px;border-radius:10px;background:rgba(255,90,31,.1);color:#ff5a1f;display:flex;align-items:center;justify-content:center;font-size:18px}" +
      ".zr-doc .dn{font-weight:600;color:#0f1c26}.zr-doc .dd{color:#8a97a1;font-size:13px}.zr-doc a{margin-left:auto;color:#ff5a1f;font-weight:700;font-size:14px;text-decoration:none}" +
      ".zr-cab-empty{text-align:center;padding:40px 24px}.zr-cab-empty .ic{font-size:42px}.zr-cab-empty h3{font:700 20px 'Space Grotesk',sans-serif;margin:12px 0 8px;color:#0f1c26}.zr-cab-empty p{color:#5a6a75;margin:0 auto 20px;max-width:360px}" +
      ".zr-cab-btn{display:inline-flex;padding:13px 24px;border-radius:12px;background:#ff5a1f;color:#fff;font-weight:700;font-size:14.5px;text-decoration:none}" +
      "@media(max-width:720px){.zr-cab-stats{grid-template-columns:1fr}.zr-dl{grid-template-columns:1fr;gap:4px 0}.zr-dl dd{margin-bottom:10px}}";
    d.head.appendChild(s);
  }

  var host, tab = "orders";
  function statsHTML() {
    var os = orders(), sum = os.reduce(function (a, o) { return a + (o.total || 0); }, 0);
    var count = os.length || 14, total = sum || 1840000;
    return '<div class="zr-cab-stats">' +
      '<div class="zr-cab-stat"><div class="n">' + count + '</div><div class="l">заказов' + (os.length ? "" : " за год") + '</div></div>' +
      '<div class="zr-cab-stat"><div class="n">' + (total >= 1e6 ? (Math.round(total / 1e5) / 10 + " млн ₽") : rub(total)) + '</div><div class="l">сумма поставок</div></div>' +
      '<div class="zr-cab-stat"><div class="n">8%</div><div class="l">ваша скидка</div></div></div>';
  }
  function ordersHTML() {
    var os = orders();
    if (!os.length) {
      return '<div class="zr-cab-panel"><div class="zr-cab-empty"><div class="ic">📦</div><h3>Заказов пока нет</h3><p>Оформите первый заказ — он появится здесь с историей и возможностью повторить.</p><a class="zr-cab-btn" href="catalog.html">Перейти в каталог</a></div></div>';
    }
    return os.map(function (o, idx) {
      var its = (o.items || []).map(function (i) { return '<div class="zr-ord-it"><span><b>' + esc(i.name) + '</b> × ' + (i.qty || 1) + '</span><span>' + rub((i.price || 0) * (i.qty || 1)) + '</span></div>'; }).join("");
      return '<div class="zr-ord"><div class="zr-ord-top"><div><span class="zr-ord-no">' + esc(o.no) + '</span><span class="zr-ord-date">' + dmy(o.date) + '</span></div><span class="zr-ord-st">' + esc(o.status || "Принят") + '</span></div>' +
        '<div class="zr-ord-items">' + its + '</div>' +
        '<div class="zr-ord-foot"><div class="zr-ord-total"><span>Итого: </span><b>' + rub(o.total || 0) + '</b></div>' +
        '<button class="zr-repeat" data-repeat="' + idx + '" type="button">Повторить заказ</button></div></div>';
    }).join("");
  }
  function profileHTML() {
    var p = profile();
    if (!p || (!p.org && !p.person)) {
      return '<div class="zr-cab-panel"><div class="zr-cab-empty"><div class="ic">🏢</div><h3>Данные не заполнены</h3><p>Оформите заказ — реквизиты и контакты сохранятся здесь для быстрого повторного заказа.</p><a class="zr-cab-btn" href="catalog.html">В каталог</a></div></div>';
    }
    var rows = [
      ["Тип", p.entity === "ind" ? "Физическое лицо" : "Юридическое лицо"],
      [p.entity === "ind" ? "ФИО" : "Организация", p.org || p.person],
      p.entity === "ind" ? null : ["ИНН", p.inn || "—"],
      p.entity === "ind" ? null : ["Контактное лицо", p.person || "—"],
      ["Телефон", p.phone || "—"],
      ["Email", p.email || "—"],
      ["Адрес доставки", p.addr || "—"]
    ].filter(Boolean);
    return '<div class="zr-cab-panel"><dl class="zr-dl">' + rows.map(function (r) { return "<dt>" + esc(r[0]) + "</dt><dd>" + esc(r[1]) + "</dd>"; }).join("") + "</dl></div>";
  }
  function docsHTML() {
    var docs = [["Счёт на оплату", "формируется после подтверждения", "📄"], ["Договор поставки", "типовой, с НДС", "📝"], ["Паспорт изделия", "к каждой позиции", "📘"], ["Сертификат ГОСТ 31592-2012", "соответствие", "🏅"]];
    return '<div class="zr-cab-panel">' + docs.map(function (x) { return '<div class="zr-doc"><span class="di">' + x[2] + '</span><div><div class="dn">' + x[0] + '</div><div class="dd">' + x[1] + '</div></div><a href="contacts.html">Запросить</a></div>'; }).join("") + "</div>";
  }

  function render() {
    var p = profile(), os = orders();
    var name = (p && (p.org || p.person)) || "Личный кабинет";
    var init = (name.replace(/[«»"]/g, "").match(/[A-ZА-Я]/g) || ["З", "Р"]).slice(0, 2).join("");
    var sub = p ? [(p.entity === "ind" ? "Физлицо" : "Юрлицо"), p.inn ? "ИНН " + p.inn : "", p.phone || ""].filter(Boolean).join(" · ") : "История заказов и реквизиты в одном месте";
    var tabs = '<div class="zr-cab-tabs">' +
      '<button data-tab="orders" class="' + (tab === "orders" ? "on" : "") + '">Заказы <span class="c">' + os.length + '</span></button>' +
      '<button data-tab="profile" class="' + (tab === "profile" ? "on" : "") + '">Данные компании</button>' +
      '<button data-tab="docs" class="' + (tab === "docs" ? "on" : "") + '">Документы</button></div>';
    var content = tab === "profile" ? profileHTML() : tab === "docs" ? docsHTML() : ordersHTML();
    host.innerHTML = '<div class="zr-cab-in">' +
      '<div class="zr-cab-head"><div class="zr-cab-ava">' + esc(init) + '</div><div><h1>' + esc(name) + '</h1><div class="sub">' + esc(sub) + '</div><span class="zr-cab-badge">Оптовые условия · скидка 8%</span></div></div>' +
      statsHTML() + tabs + content + '</div>';
  }

  d.addEventListener("click", function (e) {
    if (!host) return;
    var t = e.target.closest("[data-tab]");
    if (t) { tab = t.getAttribute("data-tab"); render(); return; }
    var r = e.target.closest("[data-repeat]");
    if (r) {
      var o = orders()[parseInt(r.getAttribute("data-repeat"), 10)];
      if (o && o.items) {
        var c = getCart();
        o.items.forEach(function (it) {
          var ex = c.items.filter(function (x) { return x.name === it.name; })[0];
          if (ex) ex.qty = (ex.qty || 1) + (it.qty || 1); else c.items.push({ name: it.name, price: it.price, qty: it.qty || 1, img: "" });
        });
        saveCart(c); location.href = "cart.html";
      }
    }
  });

  function hideMock() {
    // скрываем остаточную шапку макета клиента (не внутри .m1)
    var cand = [].slice.call(d.querySelectorAll("div,section")).filter(function (e) {
      var t = e.textContent || "";
      return /менеджер:/.test(t) && /(НИИ АТТ|клиент с)/.test(t) && t.length < 400 && !e.querySelector(".zr-cab");
    });
    cand.sort(function (a, b) { return b.textContent.length - a.textContent.length; });
    if (cand[0]) cand[0].style.display = "none";
  }
  function build() {
    var mockup = d.querySelector(".m1");
    if (!mockup) return false;
    mockup.style.display = "none";
    hideMock();
    css();
    if (!host) { host = d.createElement("section"); host.className = "zr-cab"; mockup.parentNode.insertBefore(host, mockup); }
    render();
    return true;
  }
  var n = 0; (function loop() { if (build()) return; if (n++ < 60) setTimeout(loop, 80); })();
})();
