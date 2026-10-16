(() => {
  const rows = [...document.querySelectorAll('.home .work-row')];
  if (!rows.length || !Element.prototype.animate) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const hover = window.matchMedia('(hover: hover) and (pointer: fine)');
  const svgNS = 'http://www.w3.org/2000/svg';
  const states = new Map();
  let nextMask = 0;

  const svgElement = (name, attributes = {}) => {
    const element = document.createElementNS(svgNS, name);
    for (const [name, value] of Object.entries(attributes)) {
      element.setAttribute(name, value);
    }
    return element;
  };

  function clearTrace(state) {
    if (!state.trace) return;
    const trace = state.trace;
    state.trace = null;
    for (const animation of trace.animations) animation.cancel();
    for (const element of trace.elements) element.remove();
  }

  function reveal(state) {
    const svg = state.row.querySelector('.work-preview svg');
    if (!svg || reduced.matches || document.hidden) return;

    const series = [...svg.querySelectorAll('path.series, path.series-accent')];
    const paths = series.length ? series : [...svg.querySelectorAll('path[stroke]')]
      .filter(path => path.getAttribute('stroke') !== 'none' && !path.classList.contains('reference'));
    if (!paths.length) return;

    const bounds = svg.viewBox.baseVal;
    const definitions = svgElement('defs');
    const overlay = svgElement('g', { 'aria-hidden': 'true', 'pointer-events': 'none' });
    const trace = { elements: [definitions, overlay], animations: [] };
    state.trace = trace;

    for (const [index, source] of paths.entries()) {
      let length;
      try { length = source.getTotalLength(); } catch { continue; }
      if (!Number.isFinite(length) || length <= 0) continue;

      const width = parseFloat(getComputedStyle(source).strokeWidth) || 1.5;
      const maskID = `home-trace-${++nextMask}`;
      const mask = svgElement('mask', {
        id: maskID, maskUnits: 'userSpaceOnUse',
        x: bounds.x - 8, y: bounds.y - 8,
        width: bounds.width + 16, height: bounds.height + 16
      });
      const sweep = svgElement('path', {
        d: source.getAttribute('d'), fill: 'none', stroke: 'white',
        'stroke-width': (width + 1.4) * 2,
        'stroke-linecap': 'round', 'stroke-linejoin': 'round',
        'stroke-dasharray': `${length} ${length}`, 'stroke-dashoffset': length
      });
      mask.append(sweep);
      definitions.append(mask);

      // The original path remains complete. Its dashed line, if any, is also
      // retained in this temporary overlay; only the revealing mask moves.
      const highlight = source.cloneNode(false);
      highlight.removeAttribute('id');
      highlight.removeAttribute('class');
      highlight.setAttribute('mask', `url(#${maskID})`);
      highlight.style.fill = 'none';
      highlight.style.stroke = source.classList.contains('series') ? 'var(--ink)' : 'var(--accent)';
      highlight.style.strokeWidth = `${width + 0.7}`;
      highlight.style.strokeLinecap = 'round';
      highlight.style.strokeLinejoin = 'round';
      highlight.style.opacity = '0';
      overlay.append(highlight);

      const delay = index * 24;
      trace.animations.push(sweep.animate(
        [{ strokeDashoffset: length }, { strokeDashoffset: 0 }],
        { duration: 360, delay, fill: 'both', easing: 'cubic-bezier(.22,1,.36,1)' }
      ));
      trace.animations.push(highlight.animate(
        [{ opacity: .85 }, { opacity: .85, offset: .8 }, { opacity: 0 }],
        { duration: 440, delay, fill: 'both', easing: 'linear' }
      ));
    }

    // The three-node recipe pipeline follows the same left-to-right reading
    // order as its labels. Puzzle lattice points do not receive this effect.
    const nodes = [...svg.querySelectorAll('circle')];
    if (!series.length && paths.length === 1 && nodes.length === 3) {
      const firstX = Number(nodes[0].getAttribute('cx'));
      const lastX = Number(nodes[2].getAttribute('cx'));
      for (const source of nodes) {
        const node = source.cloneNode(false);
        node.removeAttribute('id');
        node.style.fill = 'var(--paper)';
        node.style.stroke = 'var(--accent)';
        node.style.strokeWidth = '2';
        node.style.opacity = '0';
        overlay.append(node);
        const progress = (Number(source.getAttribute('cx')) - firstX) / (lastX - firstX || 1);
        trace.animations.push(node.animate(
          [{ opacity: 0 }, { opacity: .95, offset: .3 }, { opacity: 0 }],
          { duration: 100, delay: progress * 340, fill: 'both', easing: 'linear' }
        ));
      }
    }

    svg.append(definitions, overlay);
    if (!trace.animations.length) {
      clearTrace(state);
      return;
    }
    Promise.all(trace.animations.map(animation => animation.finished)).then(() => {
      if (state.trace === trace) clearTrace(state);
    }).catch(() => {});
  }

  function update(state) {
    const active = !reduced.matches && !document.hidden && (state.pointer || state.focus);
    if (active === state.active) return;
    state.active = active;
    state.row.classList.toggle('is-preview-active', active);
    if (active) reveal(state);
    else clearTrace(state);
  }

  for (const row of rows) {
    const state = { row, pointer: false, focus: false, active: false, trace: null };
    states.set(row, state);
    row.addEventListener('pointerenter', event => {
      if (!hover.matches || event.pointerType === 'touch') return;
      state.pointer = true;
      update(state);
    });
    row.addEventListener('pointerleave', () => {
      state.pointer = false;
      update(state);
    });
    row.addEventListener('focusin', event => {
      state.focus = event.target.matches(':focus-visible');
      update(state);
    });
    row.addEventListener('focusout', () => {
      // Focus can move among the title, source and PDF links of one entry.
      // Waiting for that move prevents the graph from replaying between them.
      queueMicrotask(() => {
        const focused = document.activeElement;
        state.focus = row.contains(focused) && focused.matches(':focus-visible');
        update(state);
      });
    });
  }

  function reset() {
    for (const state of states.values()) {
      state.pointer = false;
      state.focus = false;
      state.active = false;
      state.row.classList.remove('is-preview-active');
      clearTrace(state);
    }
  }

  reduced.addEventListener('change', reset);
  hover.addEventListener('change', reset);
  window.addEventListener('blur', reset);
  window.addEventListener('pagehide', reset);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) reset();
  });
})();
