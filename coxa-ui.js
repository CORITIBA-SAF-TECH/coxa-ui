/* ══════════════════════════════════════════════════════════════════
   CoxaUI — JavaScript Utilities
   Coritiba Foot Ball Club Internal Design System
   ══════════════════════════════════════════════════════════════════ */

const COXAUI_VERSION = '0.0.5';

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

  /* SweetAlert2 */
  if (!window.Swal) {
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
    document.head.appendChild(s);
  }
})();

/* ── Sidebar ── */
function toggleSidebar() {
  const sb = document.getElementById('sidebar');
  const ov = document.getElementById('overlay');
  if (!sb) return;
  if (window.innerWidth <= 768) {
    sb.classList.toggle('open');
    if (ov) ov.classList.toggle('open');
  } else {
    sb.classList.toggle('collapsed');
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
}
function initDark(storageKey) {
  const key = storageKey || DARK_KEY;
  if (localStorage.getItem(key) === '1') {
    document.documentElement.classList.add('dark');
  }
  syncDarkIcon();
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