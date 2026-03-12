/* settings.js — shared settings panel logic for LivingTorah */
(function () {
  /* ── Per-background theme definitions ── */
  var THEMES = {
    /* Dark blue (default) */
    '#0d0a1a': {
      bg2:         '#13102a',
      text:        '#e8e0cc',
      textDim:     'rgba(232,224,204,0.55)',
      textFaint:   'rgba(232,224,204,0.25)',
      card:        'rgba(255,255,255,0.035)',
      border:      'rgba(212,168,67,0.2)',
      borderFaint: 'rgba(212,168,67,0.08)',
      panelBg:     '#1a1630'
    },
    /* Black */
    '#111111': {
      bg2:         '#1e1e1e',
      text:        '#e8e0cc',
      textDim:     'rgba(232,224,204,0.55)',
      textFaint:   'rgba(232,224,204,0.25)',
      card:        'rgba(255,255,255,0.04)',
      border:      'rgba(212,168,67,0.2)',
      borderFaint: 'rgba(212,168,67,0.08)',
      panelBg:     '#1e1e1e'
    },
    /* Dark sepia */
    '#2d2416': {
      bg2:         '#3d3020',
      text:        '#f0e8d0',
      textDim:     'rgba(240,232,208,0.6)',
      textFaint:   'rgba(240,232,208,0.3)',
      card:        'rgba(255,255,255,0.04)',
      border:      'rgba(212,168,67,0.25)',
      borderFaint: 'rgba(212,168,67,0.1)',
      panelBg:     '#3d3020'
    },
    /* Light sepia */
    '#f5f0e8': {
      bg2:         '#ebe4d8',
      text:        '#2a2010',
      textDim:     'rgba(42,32,16,0.65)',
      textFaint:   'rgba(42,32,16,0.4)',
      card:        'rgba(0,0,0,0.04)',
      border:      'rgba(160,120,40,0.3)',
      borderFaint: 'rgba(160,120,40,0.12)',
      panelBg:     '#ebe4d8'
    },
    /* White */
    '#ffffff': {
      bg2:         '#f5f5f5',
      text:        '#1a1a1a',
      textDim:     'rgba(26,26,26,0.65)',
      textFaint:   'rgba(26,26,26,0.4)',
      card:        'rgba(0,0,0,0.035)',
      border:      'rgba(160,120,40,0.25)',
      borderFaint: 'rgba(160,120,40,0.1)',
      panelBg:     '#f0f0f0'
    }
  };

  var LS = {
    get: function (k, def) {
      try { var v = localStorage.getItem(k); return v !== null ? v : def; } catch (e) { return def; }
    },
    set: function (k, v) {
      try { localStorage.setItem(k, v); } catch (e) {}
    }
  };

  function applyFontSize(v) {
    document.documentElement.style.setProperty('--base-font-size', v + 'px');
    document.body.style.fontSize = v + 'px';
  }

  function applyBg(bg) {
    var t = THEMES[bg] || THEMES['#0d0a1a'];
    var root = document.documentElement;
    root.style.setProperty('--bg',           bg);
    root.style.setProperty('--bg2',          t.bg2);
    root.style.setProperty('--text',         t.text);
    root.style.setProperty('--text-dim',     t.textDim);
    root.style.setProperty('--text-faint',   t.textFaint);
    root.style.setProperty('--card',         t.card);
    root.style.setProperty('--border',       t.border);
    root.style.setProperty('--border-faint', t.borderFaint);
    root.style.setProperty('--panel-bg',     t.panelBg);
    document.body.style.background = bg;
    document.body.style.color      = t.text;
  }

  function applyFont(f) {
    document.body.style.fontFamily = f;
  }

  /* ── Initialise after DOM is ready ── */
  function init() {
    var btn        = document.getElementById('settingsBtn');
    var panel      = document.getElementById('settingsPanel');
    var fontRange  = document.getElementById('fontSizeRange');
    var bgSwatches = document.querySelectorAll('#bgSwatches .color-swatch');
    var fontOptions= document.querySelectorAll('#fontOptions .font-option');

    if (!btn || !panel) return;

    var savedSize = parseInt(LS.get('lt-font-size', '16'), 10);
    var savedBg   = LS.get('lt-bg', '#0d0a1a');
    var savedFont = LS.get('lt-font', "'Rubik', sans-serif");

    if (fontRange) fontRange.value = savedSize;
    applyFontSize(savedSize);
    applyBg(savedBg);
    applyFont(savedFont);

    bgSwatches.forEach(function (sw) {
      sw.classList.toggle('selected', sw.dataset.bg === savedBg);
    });
    fontOptions.forEach(function (fo) {
      fo.classList.toggle('selected', fo.dataset.font === savedFont);
    });

    /* Toggle panel open/close */
    btn.addEventListener('click', function () {
      var open = panel.classList.toggle('open');
      btn.classList.toggle('active', open);
    });
    document.addEventListener('click', function (e) {
      if (!panel.contains(e.target) && !btn.contains(e.target)) {
        panel.classList.remove('open');
        btn.classList.remove('active');
      }
    });

    /* Font size slider */
    if (fontRange) {
      fontRange.addEventListener('input', function () {
        applyFontSize(this.value);
        LS.set('lt-font-size', this.value);
      });
    }

    /* Background swatches */
    bgSwatches.forEach(function (sw) {
      sw.addEventListener('click', function () {
        bgSwatches.forEach(function (s) { s.classList.remove('selected'); });
        sw.classList.add('selected');
        applyBg(sw.dataset.bg);
        LS.set('lt-bg', sw.dataset.bg);
      });
    });

    /* Font buttons */
    fontOptions.forEach(function (fo) {
      fo.addEventListener('click', function () {
        fontOptions.forEach(function (f) { f.classList.remove('selected'); });
        fo.classList.add('selected');
        applyFont(fo.dataset.font);
        LS.set('lt-font', fo.dataset.font);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
