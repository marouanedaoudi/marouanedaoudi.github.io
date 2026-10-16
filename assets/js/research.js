(function () {
  'use strict';
  var article = document.querySelector('.research-article');
  var wide = matchMedia('(min-width: 1200px)');
  var mobile = matchMedia('(max-width: 899px)');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)');
  if (article) {
    var body = article.querySelector('.article-body');
    var notes = Array.from(body.querySelectorAll('.margin-note'));
    var toc = document.querySelector('.reading-rail details');
    var links = Array.from(document.querySelectorAll('.reading-rail nav a'));
    var sections = links.map(function (a) { return document.getElementById(decodeURIComponent(a.hash.slice(1))); });
    var progress = document.querySelector('.reading-progress');
    notes.forEach(function (note) {
      var ref = document.getElementById(note.dataset.anchor);
      if (ref && ref.previousElementSibling && ref.previousElementSibling.tagName === 'P') ref.previousElementSibling.appendChild(ref);
      if (ref) ref.querySelector('a').addEventListener('click', function () { note.querySelector('details').open = true; });
      note.querySelector('summary').addEventListener('click', function (e) { if (wide.matches) e.preventDefault(); });
    });
    function arrange() {
      body.querySelectorAll('.katex').forEach(function (math) {
        if (math.closest('.katex-display')) return;
        math.classList.remove('katex-overflow');
        if (math.getBoundingClientRect().width > math.parentElement.getBoundingClientRect().width) math.classList.add('katex-overflow');
      });
      body.classList.toggle('sidenotes-ready', wide.matches);
      if (!wide.matches) body.style.removeProperty('padding-bottom');
      var bottom = 0;
      notes.forEach(function (note) {
        if (!wide.matches) { note.style.removeProperty('top'); return; }
        var ref = document.getElementById(note.dataset.anchor);
        var anchor = ref && (ref.closest('p') || ref);
        var top = anchor ? anchor.getBoundingClientRect().top - body.getBoundingClientRect().top : bottom;
        top = Math.max(0, top, bottom);
        note.style.top = Math.round(top) + 'px';
        bottom = top + note.getBoundingClientRect().height + 24;
      });
      if (wide.matches) {
        var naturalHeight = body.getBoundingClientRect().height - (parseFloat(getComputedStyle(body).paddingBottom) || 0);
        var extra = Math.max(0, Math.ceil(bottom - 24 - naturalHeight));
        body.style.paddingBottom = extra + 'px';
      }
    }
    function responsive() {
      if (toc) toc.open = !mobile.matches;
      notes.forEach(function (note) { note.querySelector('details').open = !mobile.matches; });
      arrange();
    }
    var pending = false;
    function schedule() { if (!pending) { pending = true; requestAnimationFrame(function () { pending = false; arrange(); reading(); }); } }
    function reading() {
      var r = article.getBoundingClientRect();
      var ratio = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - innerHeight)));
      var percent = Math.round(ratio * 100);
      if (progress) { progress.setAttribute('aria-valuenow', percent); progress.firstElementChild.style.transform = 'scaleX(' + ratio + ')'; document.querySelector('.reading-position').textContent = percent + ' %'; }
      var active = -1;
      sections.forEach(function (s, i) { if (s && s.getBoundingClientRect().top < Math.min(180, innerHeight / 3)) active = i; });
      links.forEach(function (a, i) { if (i === active) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current'); });
    }
    var scrolling = false;
    addEventListener('scroll', function () { if (!scrolling) { scrolling = true; requestAnimationFrame(function () { scrolling = false; reading(); }); } }, { passive: true });
    addEventListener('resize', schedule);
    mobile.addEventListener('change', responsive); wide.addEventListener('change', responsive);
    if (typeof ResizeObserver !== 'undefined') new ResizeObserver(schedule).observe(body);
    if (document.fonts) document.fonts.ready.then(schedule);
    var printState;
    addEventListener('beforeprint', function () { printState = notes.map(function (n) { var d = n.querySelector('details'), open = d.open; d.open = true; return open; }); });
    addEventListener('afterprint', function () { if (printState) notes.forEach(function (n, i) { n.querySelector('details').open = printState[i]; }); schedule(); });
    responsive(); reading();
  }
  var index = document.getElementById('research-previews');
  var entries = new Map();
  if (index) { try { JSON.parse(index.textContent).forEach(function (p) { entries.set(new URL(p.url, location.href).pathname, p); }); } catch (_) {} }
  var hover = matchMedia('(hover: hover) and (pointer: fine) and (min-width: 900px)');
  var preview = document.createElement('aside');
  preview.className = 'link-preview'; preview.id = 'link-preview'; preview.hidden = true;
  preview.setAttribute('role', 'tooltip');
  var title = document.createElement('strong'), text = document.createElement('p');
  preview.append(title, text); document.body.appendChild(preview);
  var current = null, closeTimer;
  function hide() { clearTimeout(closeTimer); preview.classList.remove('is-visible'); preview.hidden = true; if (current) current.removeAttribute('aria-describedby'); current = null; }
  function deferHide() { clearTimeout(closeTimer); closeTimer = setTimeout(hide, 140); }
  function position(a) {
    var r = a.getBoundingClientRect(); var p = preview.getBoundingClientRect();
    preview.style.left = Math.max(16, Math.min(r.left, innerWidth - p.width - 16)) + 'px';
    preview.style.top = Math.max(16, r.bottom + p.height + 12 < innerHeight ? r.bottom + 8 : r.top - p.height - 8) + 'px';
  }
  function show(a, keyboard) {
    if (!hover.matches) return;
    var u; try { u = new URL(a.href, location.href); } catch (_) { return; }
    if (u.origin !== location.origin) return;
    var p = entries.get(u.pathname);
    if (u.pathname === location.pathname && u.hash) {
      var target = document.getElementById(decodeURIComponent(u.hash.slice(1)));
      var statement = target && (target.closest('.math-environment') || target.querySelector('.math-environment'));
      if (statement) {
        var content = statement.querySelector('.environment-body').cloneNode(true);
        content.querySelectorAll('.katex').forEach(function (math) { var tex = math.querySelector('annotation[encoding="application/x-tex"]'); math.replaceWith(document.createTextNode(tex ? '$' + tex.textContent + '$' : math.textContent)); });
        p = { title: statement.querySelector('.environment-label').textContent, description: content.textContent };
      }
      else return;
    }
    if (!p || !p.description) return;
    clearTimeout(closeTimer);
    if (current && current !== a) current.removeAttribute('aria-describedby');
    current = a; title.textContent = p.title; text.textContent = p.description.length > 600 && !p.description.includes('$') ? p.description.slice(0, 600) + '…' : p.description;
    if (typeof window.renderMathInElement === 'function') window.renderMathInElement(text, { delimiters: [{left:'$',right:'$',display:false}], throwOnError:false, trust:false });
    preview.classList.toggle('is-instant', keyboard || reduce.matches);
    preview.hidden = false; preview.classList.remove('is-visible'); position(a);
    a.setAttribute('aria-describedby', preview.id);
    requestAnimationFrame(function () { if (current === a) preview.classList.add('is-visible'); });
  }
  document.querySelectorAll('a[href]').forEach(function (a) {
    if (a.closest('.home .work-row')) return;
    a.addEventListener('pointerenter', function (e) { if (e.pointerType !== 'touch') show(a, false); });
    a.addEventListener('pointerleave', deferHide);
    a.addEventListener('focus', function () { show(a, true); });
    a.addEventListener('blur', deferHide);
  });
  preview.addEventListener('pointerenter', function () { clearTimeout(closeTimer); });
  preview.addEventListener('pointerleave', deferHide);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') hide(); });
  addEventListener('scroll', function () {
    if (current && document.activeElement === current) {
      var rect = current.getBoundingClientRect();
      if (rect.bottom >= 0 && rect.top <= innerHeight) position(current); else hide();
    } else hide();
  }, { passive: true });
  addEventListener('resize', hide);
  window.ResearchViz = {
    svg: function (name, attributes, text) { var el = document.createElementNS('http://www.w3.org/2000/svg', name); Object.entries(attributes || {}).forEach(function (p) { el.setAttribute(p[0], p[1]); }); if (text !== undefined) el.textContent = text; return el; },
    draw: function (path) { if (reduce.matches || !path.getTotalLength) return; var length = path.getTotalLength(); path.style.setProperty('--path-length', length); path.style.strokeDasharray = length; path.classList.add('curve-draw'); path.addEventListener('animationend', function () { path.classList.remove('curve-draw'); path.style.removeProperty('stroke-dasharray'); }, { once: true }); }
  };
})();
