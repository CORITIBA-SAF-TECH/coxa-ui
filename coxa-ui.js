/* ══════════════════════════════════════════════════════════════════
   CoxaUI — JavaScript Utilities
   Coritiba Foot Ball Club Internal Design System
   ══════════════════════════════════════════════════════════════════ */

const COXAUI_VERSION = '0.1.1';

console.info(
  '%c CoxaUI v' + COXAUI_VERSION + ' %c 🇧🇷 Coritiba Foot Ball Club — Internal Design System',
  'background:#006B3C;color:#fad716;font-weight:800;padding:2px 6px;border-radius:4px 0 0 4px',
  'background:#f0f9f4;color:#005530;font-weight:600;padding:2px 6px;border-radius:0 4px 4px 0'
);

/* ── Dependências auto-injetadas ── */
(function () {
  /* Dark mode antes de qualquer render (evita flash) */
  if (localStorage.getItem('coxaui-dark') === '1')
    document.documentElement.classList.add('dark');

  /* Sidebar recolhida por padrão no desktop — antes do primeiro paint
     para não animar a largura na carga. Se o usuário expandir,
     a preferência fica salva em localStorage ('coxaui-sb'). */
  var sb = document.getElementById('sidebar');
  if (sb && window.innerWidth > 768 && localStorage.getItem('coxaui-sb') !== 'open')
    sb.classList.add('collapsed');

  /* SweetAlert2 */
  if (!window.Swal) {
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
    document.head.appendChild(s);
  }

  /* Chart.js v4 */
  if (!window.Chart) {
    var c = document.createElement('script');
    c.src = 'https://cdn.jsdelivr.net/npm/chart.js@4';
    document.head.appendChild(c);
  }
})();

/* ── Sidebar ── */
const SB_KEY = 'coxaui-sb';

function toggleSidebar() {
  const sb = document.getElementById('sidebar');
  const ov = document.getElementById('overlay');
  if (!sb) return;
  if (window.innerWidth <= 768) {
    sb.classList.toggle('open');
    if (ov) ov.classList.toggle('open');
  } else {
    sb.classList.toggle('collapsed');
    localStorage.setItem(SB_KEY, sb.classList.contains('collapsed') ? 'collapsed' : 'open');
  }
}
function closeSidebar() {
  const sb = document.getElementById('sidebar');
  const ov = document.getElementById('overlay');
  if (sb) sb.classList.remove('open');
  if (ov) ov.classList.remove('open');
}
function toggleSec(btn) {
  btn.closest('.sb-sec').classList.toggle('open');
}

/* ── Tooltip da sidebar recolhida ──
   Injetado no <body> com position:fixed para não ser cortado
   pelo overflow do .sb-scroll. Usa data-label se existir,
   senão o texto do <span> do próprio link. */
function initSidebarTooltips() {
  let tip = null, curLnk = null;
  function hideTip() {
    if (tip) { tip.remove(); tip = null; }
    curLnk = null;
  }
  document.addEventListener('mouseover', function (e) {
    const lnk = e.target.closest ? e.target.closest('.sb-lnk, .sb-home') : null;
    if (!lnk || !lnk.closest('.sidebar.collapsed')) { hideTip(); return; }
    if (lnk === curLnk) return;
    hideTip();
    const span = lnk.querySelector('span');
    const label = lnk.getAttribute('data-label') || (span ? span.textContent.trim() : '');
    if (!label) return;
    curLnk = lnk;
    tip = document.createElement('div');
    tip.className = 'sb-tooltip';
    tip.textContent = label;
    document.body.appendChild(tip);
    const r = lnk.getBoundingClientRect();
    tip.style.left = (r.right + 12) + 'px';
    tip.style.top = (r.top + r.height / 2) + 'px';
    requestAnimationFrame(function () { if (tip) tip.classList.add('show'); });
  });
  document.addEventListener('scroll', hideTip, true);
  document.addEventListener('click', hideTip, true);
  document.documentElement.addEventListener('mouseleave', hideTip);
}

/* ── Combobox (select com busca) ──
   Markup: .combo > .combo-input (texto) + .combo-arrow + .combo-list
   com .combo-opt (button) e .combo-empty opcional.
   Se existir um input hidden .combo-value, ele recebe data-value
   da opção escolhida (para quando o valor difere do rótulo). */
function comboNorm(s) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}
function initCombos() {
  function closeAll(except) {
    document.querySelectorAll('.combo.open').forEach(function (c) {
      if (c !== except) c.classList.remove('open');
    });
  }
  function filterCombo(combo, qOverride) {
    const inp = combo.querySelector('.combo-input');
    const q = comboNorm(qOverride !== undefined ? qOverride : inp.value.trim());
    let visible = 0;
    combo.querySelectorAll('.combo-opt').forEach(function (o) {
      const show = !q || comboNorm(o.textContent).indexOf(q) !== -1;
      o.hidden = !show;
      o.classList.remove('hl');
      if (show) visible++;
    });
    const empty = combo.querySelector('.combo-empty');
    if (empty) empty.style.display = visible ? 'none' : 'block';
  }
  document.addEventListener('focusin', function (e) {
    if (!e.target.classList || !e.target.classList.contains('combo-input')) return;
    const combo = e.target.closest('.combo');
    if (!combo) return;
    closeAll(combo);
    combo.classList.add('open');
    filterCombo(combo, '');           /* mostra todas ao focar */
    e.target.select();
  });
  document.addEventListener('input', function (e) {
    if (!e.target.classList || !e.target.classList.contains('combo-input')) return;
    const combo = e.target.closest('.combo');
    if (!combo) return;
    combo.classList.add('open');
    filterCombo(combo);
  });
  document.addEventListener('click', function (e) {
    const opt = e.target.closest('.combo-opt');
    if (opt) {
      const combo = opt.closest('.combo');
      const inp = combo.querySelector('.combo-input');
      const hid = combo.querySelector('.combo-value');
      const label = opt.textContent.trim();
      inp.value = label;
      if (hid) hid.value = opt.dataset.value !== undefined ? opt.dataset.value : label;
      combo.classList.remove('open');
      inp.dispatchEvent(new Event('change', { bubbles: true }));
      return;
    }
    if (!e.target.closest('.combo')) closeAll();
  });
  document.addEventListener('keydown', function (e) {
    const inp = e.target;
    if (!inp.classList || !inp.classList.contains('combo-input')) return;
    const combo = inp.closest('.combo');
    if (!combo) return;
    if (e.key === 'Escape') { combo.classList.remove('open'); return; }
    const opts = Array.prototype.filter.call(
      combo.querySelectorAll('.combo-opt'),
      function (o) { return !o.hidden; }
    );
    if (e.key === 'Enter') {
      const hl = combo.querySelector('.combo-opt.hl');
      if (combo.classList.contains('open') && (hl || opts.length === 1)) {
        e.preventDefault();
        (hl || opts[0]).click();
      }
      return;
    }
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    combo.classList.add('open');
    if (!opts.length) return;
    let i = -1;
    opts.forEach(function (o, idx) { if (o.classList.contains('hl')) i = idx; });
    i = e.key === 'ArrowDown' ? Math.min(i + 1, opts.length - 1) : Math.max(i - 1, 0);
    opts.forEach(function (o) { o.classList.remove('hl'); });
    opts[i].classList.add('hl');
    opts[i].scrollIntoView({ block: 'nearest' });
  });
}

/* ── Dark mode ── */
const DARK_KEY = 'coxaui-dark';

function syncDarkIcon() {
  const di = document.getElementById('darkIcon');
  if (!di) return;
  const isDark = document.documentElement.classList.contains('dark');
  di.className = 'ti ' + (isDark ? 'ti-sun' : 'ti-moon');
}
function toggleDark() {
  document.documentElement.classList.toggle('dark');
  localStorage.setItem(DARK_KEY, document.documentElement.classList.contains('dark') ? '1' : '0');
  syncDarkIcon();
  syncChartsTheme();
}
function initDark(storageKey) {
  const key = storageKey || DARK_KEY;
  if (localStorage.getItem(key) === '1') {
    document.documentElement.classList.add('dark');
  }
  syncDarkIcon();
}

/* ── Gráficos (Chart.js v4 auto-injetado) ──
   coxaChart(idOuCanvas, config) cria o gráfico já com a paleta da
   marca e o tema claro/escuro correto. Datasets sem cor definida
   recebem as cores automaticamente — todas variações do verde
   primary, alternando tons escuros e claros para contraste. */
const COXA_CHART_COLORS = [
  '#006B3C', /* verde Coritiba (primary) */
  '#34d399', /* esmeralda claro          */
  '#004526', /* verde escuro             */
  '#6ee7b7', /* esmeralda mais claro     */
  '#059669', /* esmeralda médio          */
  '#a7f3d0', /* verde pastel             */
  '#065f46', /* verde profundo           */
  '#10b981'  /* esmeralda                */
];
const _coxaCharts = [];

function _chartTheme() {
  const dark = document.documentElement.classList.contains('dark');
  return {
    text: dark ? '#d1d5db' : '#4b5563',
    grid: dark ? 'rgba(255,255,255,.09)' : 'rgba(0,0,0,.07)',
    ring: dark ? '#1f2937' : '#fff'
  };
}

function coxaChart(target, config) {
  /* Chart.js é injetado de forma assíncrona — aguarda se necessário */
  if (typeof Chart === 'undefined') {
    return new Promise(function (resolve) {
      (function wait() {
        if (typeof Chart !== 'undefined') { resolve(coxaChart(target, config)); return; }
        setTimeout(wait, 80);
      })();
    });
  }
  const el = typeof target === 'string' ? document.getElementById(target) : target;
  if (!el) return null;

  const th = _chartTheme();
  Chart.defaults.font.family = getComputedStyle(document.body).fontFamily;
  Chart.defaults.color = th.text;
  Chart.defaults.borderColor = th.grid;

  ((config.data && config.data.datasets) || []).forEach(function (ds, i) {
    const cor = COXA_CHART_COLORS[i % COXA_CHART_COLORS.length];
    const tipo = ds.type || config.type;   /* suporta gráficos mistos */
    const circular = ['pie', 'doughnut', 'polarArea'].indexOf(tipo) !== -1;
    if (ds.backgroundColor === undefined)
      ds.backgroundColor = circular ? COXA_CHART_COLORS
        : (tipo === 'line' || tipo === 'radar') ? cor + '2e'
        : tipo === 'bubble' ? cor + '99'
        : cor;
    if (ds.borderColor === undefined)
      ds.borderColor = circular ? th.ring : cor;
  });

  const chart = new Chart(el, config);
  _coxaCharts.push(chart);
  return chart;
}

/* Reaplica o tema (texto/grade) aos gráficos existentes — chamado ao alternar o dark mode */
function syncChartsTheme() {
  if (typeof Chart === 'undefined' || !_coxaCharts.length) return;
  const th = _chartTheme();
  Chart.defaults.color = th.text;
  Chart.defaults.borderColor = th.grid;
  _coxaCharts.forEach(function (ch) { ch.update(); });
}

/* ── SweetAlert2 helpers ── */
function swalOpts(extra) {
  const dark = document.documentElement.classList.contains('dark');
  const base = dark
    ? { background: '#1f2937', color: '#f9fafb' }
    : { background: '#ffffff', color: '#1a1a1a' };
  return Object.assign(base, extra || {});
}
function coxaToast(icon, title) {
  if (typeof Swal === 'undefined') return;
  Swal.fire(swalOpts({
    toast: true, position: 'top', showConfirmButton: false,
    timer: 3500, timerProgressBar: true, icon: icon, title: title
  }));
}
function coxaConfirm(form, title, text, icon, confirmText, color) {
  if (typeof Swal === 'undefined') { return confirm(title); }
  Swal.fire(swalOpts({
    title: title, text: text, icon: icon, showCancelButton: true,
    confirmButtonText: confirmText || 'Confirmar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: color,
    reverseButtons: true
  })).then(function(r) {
    if (r.isConfirmed) { form.submit(); }
  });
  return false;
}

/* ── Live clock ── */
function updateClock() {
  const el = document.getElementById('live-clock');
  if (!el) return;
  const n = new Date();
  const h = String(n.getHours()).padStart(2, '0');
  const m = String(n.getMinutes()).padStart(2, '0');
  const s = String(n.getSeconds()).padStart(2, '0');
  el.textContent = h + ':' + m + ':' + s;
}

/* ── Elapsed time ── */
function updateElapsed() {
  document.querySelectorAll('[data-entrada]').forEach(function(el) {
    const dh = el.getAttribute('data-entrada');
    if (!dh) return;
    const p  = dh.replace('T', ' ').split(' ');
    const dp = p[0].split('-');
    const tp = (p[1] || '00:00:00').split(':');
    const start = new Date(dp[0], dp[1] - 1, dp[2], tp[0], tp[1], tp[2]);
    let diff = Math.floor((Date.now() - start) / 60000);
    if (diff < 0) diff = 0;
    const h = Math.floor(diff / 60), m = diff % 60;
    el.textContent = h > 0 ? h + 'h' + String(m).padStart(2, '0') + 'min' : m + 'min';
    el.classList.toggle('long', diff >= 240);
  });
}

/* ── Action dropdown ── */
function initDropdowns() {
  document.addEventListener('click', function(e) {
    const btn = e.target.closest('.act-dd-btn');
    if (btn) {
      const menu   = btn.nextElementSibling;
      const wasOpen = menu.classList.contains('open');
      document.querySelectorAll('.act-dd-menu.open').forEach(function(m) { m.classList.remove('open'); });
      const wrap = document.querySelector('.tbl-wrap');
      if (!wasOpen) {
        menu.classList.add('open');
        if (wrap) wrap.style.overflow = 'visible';
      } else {
        if (wrap) wrap.style.overflow = '';
      }
      return;
    }
    if (!e.target.closest('.act-dd-menu')) {
      document.querySelectorAll('.act-dd-menu.open').forEach(function(m) { m.classList.remove('open'); });
      const wrap = document.querySelector('.tbl-wrap');
      if (wrap) wrap.style.overflow = '';
    }
  });
}

/* ── Table search ── */
function initTableSearch(inputId, tbodySelector) {
  const inp = document.getElementById(inputId);
  if (!inp) return;
  inp.addEventListener('input', function() {
    const q  = this.value.toLowerCase();
    const tgt = tbodySelector || 'tbody tr';
    document.querySelectorAll(tgt).forEach(function(tr) {
      tr.style.display = tr.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  });
}

/* ── Modal helpers ── */
function openModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.add('open');
}
function closeModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.remove('open');
}
function initModalOverlayClose(id) {
  const m = document.getElementById(id);
  if (m) m.addEventListener('click', function(e) {
    if (e.target === m) closeModal(id);
  });
}

/* ── Tabs ── */
function switchLinksTab(btn, panelId) {
  const wrap = btn.closest('.links-tabs-wrap');
  if (!wrap) return;
  wrap.querySelectorAll('.links-tab').forEach(function(t) { t.classList.remove('active'); });
  wrap.querySelectorAll('.links-panel').forEach(function(p) { p.classList.add('hidden'); });
  btn.classList.add('active');
  const panel = document.getElementById(panelId);
  if (panel) panel.classList.remove('hidden');
}
function switchTab(btn, panelId) {
  const container = btn.closest('.tabs');
  if (container) container.querySelectorAll('.tab').forEach(function(t) { t.classList.remove('active'); });
  btn.classList.add('active');
  const allPanels = document.querySelectorAll('.tab-panel');
  allPanels.forEach(function(p) { p.classList.add('hidden'); });
  const panel = document.getElementById(panelId);
  if (panel) panel.classList.remove('hidden');
}

/* ── Accordion ── */
function initAccordion() {
  document.querySelectorAll('.accordion-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      const item = this.closest('.accordion-item');
      item.classList.toggle('open');
    });
  });
}

/* ── Page spinner ── */
function initPageSpinner(spinnerId) {
  const sp = document.getElementById(spinnerId || 'page-spinner');
  if (!sp) return;
  let t;
  function show() {
    clearTimeout(t);
    sp.classList.add('show');
    t = setTimeout(function() { sp.classList.remove('show'); }, 8000);
  }
  document.addEventListener('click', function(e) {
    const a = e.target.closest('a[href]');
    if (!a || a.target === '_blank' || a.hasAttribute('download') || e.ctrlKey || e.metaKey || e.shiftKey) return;
    const hr = a.getAttribute('href') || '';
    if (!hr || hr.charAt(0) === '#' || hr.startsWith('javascript')) return;
    if (/\.(pdf|png|jpg|jpeg|gif|webp|svg|ico|zip|doc|docx|xls|xlsx|bpmn)$/i.test(hr)) return;
    show();
  });
  document.addEventListener('submit', function(e) {
    if (!e.defaultPrevented) show();
  });
  window.addEventListener('pageshow', function() { sp.classList.remove('show'); });
}

/* ── Bulk selection ── */
const selRows = {};
function toggleSelRow(chk) {
  const id = chk.dataset.reg;
  if (chk.checked) {
    selRows[id] = { nome: chk.dataset.nome };
  } else { delete selRows[id]; }
  updateSelBar();
}
function toggleSelAll(chk) {
  document.querySelectorAll('.sel-chk').forEach(function(c) {
    c.checked = chk.checked;
    if (chk.checked) {
      selRows[c.dataset.reg] = { nome: c.dataset.nome };
    } else { delete selRows[c.dataset.reg]; }
  });
  updateSelBar();
}
function updateSelBar() {
  const n   = Object.keys(selRows).length;
  const bar = document.getElementById('sel-bar');
  if (!bar) return;
  bar.style.display = n > 0 ? 'flex' : 'none';
  const lbl = bar.querySelector('.sel-bar-lbl');
  if (lbl) lbl.textContent = n + (n === 1 ? ' item selecionado' : ' itens selecionados');
}
function clearSel() {
  Object.keys(selRows).forEach(function(k) { delete selRows[k]; });
  document.querySelectorAll('.sel-chk').forEach(function(c) { c.checked = false; });
  const sa = document.getElementById('sel-all');
  if (sa) sa.checked = false;
  updateSelBar();
}

/* ── Slug generator ── */
function mkSlug(text) {
  return text.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim().replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/* ── Copy to clipboard ── */
function copyToClipboard(text, feedbackEl) {
  navigator.clipboard.writeText(text).then(function() {
    if (feedbackEl) {
      const orig = feedbackEl.textContent;
      feedbackEl.textContent = 'Copiado!';
      setTimeout(function() { feedbackEl.textContent = orig; }, 1800);
    }
  });
}

/* ── DOM ready init ── */
document.addEventListener('DOMContentLoaded', function() {
  /* Injeta versão nos elementos marcados */
  document.querySelectorAll('[data-coxaui-ver]').forEach(function(el) {
    el.textContent = 'v' + COXAUI_VERSION;
  });

  initDark();
  initDropdowns();
  initAccordion();
  initPageSpinner();
  initSidebarTooltips();
  initCombos();

  /* Sidebar recolhida por padrão — fallback caso o script tenha
     carregado no <head> sem defer (o #sidebar ainda não existia) */
  const sbInit = document.getElementById('sidebar');
  if (sbInit && window.innerWidth > 768 && localStorage.getItem(SB_KEY) !== 'open')
    sbInit.classList.add('collapsed');

  /* Auto-open active sidebar sections */
  const act = document.querySelector('.sb-list a.active');
  if (act) act.closest('.sb-sec').classList.add('open');

  /* Clock & elapsed timer */
  updateClock();
  updateElapsed();
  setInterval(updateClock, 1000);
  setInterval(updateElapsed, 15000);

  /* Flash messages via SweetAlert2 — aguarda Swal carregar (injeção assíncrona) */
  const flashes = document.getElementById('flash-data');
  if (flashes) {
    try {
      const msgs = JSON.parse(flashes.textContent);
      if (msgs.length) {
        (function showFlashes() {
          if (typeof Swal === 'undefined') { setTimeout(showFlashes, 80); return; }
          msgs.forEach(function(m) { coxaToast(m.cat === 'error' ? 'error' : 'success', m.msg); });
        })();
      }
    } catch(e) {}
  }
});