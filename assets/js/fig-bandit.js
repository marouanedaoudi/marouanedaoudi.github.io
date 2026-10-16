/* V2 numerical rules and archived JJ discoveries. No random simulation is run. */
const BanditNumerics = (() => {
  const stats = (values, n) => {
    let mean = 0, variance = 0;
    for (let i = 0; i < n; i += 1) {
      const x = values[i % values.length];
      variance += (x - mean) ** 2;
      mean = (mean * i + x) / (i + 1);
    }
    return { n, mean, variance };
  };
  const phi = (s, alpha, rho) => s.n === 0 ? Infinity :
    Math.sqrt(2 * (s.variance + rho) * Math.max(0, Math.log(Math.sqrt((s.variance + rho) / rho) / alpha))) / s.n;
  const pvalue = (s, baseline, rho) => {
    const gap = s.mean - baseline;
    if (s.n === 0 || gap <= 0) return 1;
    const logP = .5 * Math.log((s.variance + rho) / rho) - gap ** 2 * s.n ** 2 / (2 * (s.variance + rho));
    return Math.max(1e-300, Math.min(1, Math.exp(logP)));
  };
  const bh = (arms, baseline, delta, rho) => {
    const sorted = arms.map((s, id) => ({ id, p: pvalue(s, baseline, rho) })).sort((a, b) => a.p - b.p || a.id - b.id);
    let k = 0;
    for (let rank = sorted.length; rank > 0; rank -= 1) {
      if (sorted[rank - 1].p <= delta * rank / sorted.length) { k = rank; break; }
    }
    return { k, retained: sorted.slice(0, k).map(row => row.id), sorted, denominator: arms.length };
  };
  const twoSample = (arms, control, delta, rho) => {
    // Exact V2 helper convention: the denominator includes the control arm.
    const denominator = arms.length + 1;
    for (let k = denominator; k > 0; k -= 1) {
      const alpha = delta * k / denominator / 2;
      const retained = arms.map((s, id) => ({ id, lower: s.mean - control.mean - phi(s, alpha, rho) - phi(control, alpha, rho) }))
        .filter(row => row.lower >= 0).map(row => row.id);
      if (retained.length >= k) return { k, retained, denominator };
    }
    return { k: 0, retained: [], denominator };
  };
  const count = (events, budget) => events.reduce((n, event) => n + Number(event.step <= budget), 0);
  return Object.freeze({ stats, phi, pvalue, bh, twoSample, count });
})();

(() => {
  'use strict';
  const namespace = 'http://www.w3.org/2000/svg';
  const labels = {
    fr: {
      adaptive: 'Adaptatif', uniform: 'Uniforme', step: 'Pas archivé', discoveries: 'Découvertes enregistrées',
      fixed: 'Référence figée', online: 'Contrôle rééchantillonné (VAR)', rank: 'Rang · bras', p: 'p calculée', threshold: 'δk/m',
      retained: 'Retenu', no: 'Non', yes: 'Oui', arm: 'Bras', lower: 'Borne inférieure de l’écart', none: 'aucun',
      prefix: 'observations par bras', decision: 'test sur cet état', source: 'Archive source',
      archiveReadout: (step, a, u) => `Pas ${step} : ${a} découvertes enregistrées en adaptatif, ${u} en uniforme.`,
      mechanicsReadout: (n, k, names) => `n = ${n} par bras ; k* = ${k} ; bras retenus sur cet état : ${names}.`,
      onlineNote: 'Deux échantillons : les deux rayons sont additionnés au niveau α/2. Aucune p-valeur qui ignorerait l’incertitude du contrôle n’est affichée.',
      fixedNote: 'Référence connue μ₀ = 0,20. Les p-valeurs sont triées ; le plus grand rang k vérifiant p(k) ≤ δk/m retient tout le préfixe.',
      archiveDescription: (name, mode) => `${name}, ${mode}. Nombre cumulé des découvertes du premier run archivé.`,
      mechanicsDescription: 'Écarts des moyennes à la référence et rayons calculés avec la formule V2 sur des séquences pédagogiques déterministes.',
      failure: 'Les données interactives n’ont pas pu être chargées. La figure et les valeurs statiques restent lisibles.',
    },
    en: {
      adaptive: 'Adaptive', uniform: 'Uniform', step: 'Archived step', discoveries: 'Recorded discoveries',
      fixed: 'Frozen reference', online: 'Resampled control (VAR)', rank: 'Rank · arm', p: 'Computed p', threshold: 'δk/m',
      retained: 'Retained', no: 'No', yes: 'Yes', arm: 'Arm', lower: 'Lower bound on the gap', none: 'none',
      prefix: 'observations per arm', decision: 'test at this snapshot', source: 'Source archive',
      archiveReadout: (step, a, u) => `Step ${step}: ${a} recorded discoveries with adaptive allocation, ${u} with uniform allocation.`,
      mechanicsReadout: (n, k, names) => `n = ${n} per arm; k* = ${k}; arms retained at this snapshot: ${names}.`,
      onlineNote: 'Two samples: both radii are added at level α/2. A p-value that ignores control uncertainty is not displayed.',
      fixedNote: 'Known reference μ₀ = 0.20. Sorted p-values are compared with δk/m; the largest passing rank k retains the whole prefix.',
      archiveDescription: (name, mode) => `${name}, ${mode}. Cumulative discoveries from the first archived run.`,
      mechanicsDescription: 'Mean gaps and radii computed from the V2 formula on deterministic teaching sequences.',
      failure: 'Interactive data could not be loaded. The static figure and values remain available.',
    },
  };
  const element = (name, attributes = {}, text = '') => {
    const node = document.createElementNS(namespace, name);
    Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, String(value)));
    if (text) node.textContent = text;
    return node;
  };
  const tick = (svg, x, y, text, anchor = 'middle') => svg.append(element('text', { x, y, 'text-anchor': anchor, class: 'tick-label', style: 'font-size:12px' }, text));
  // One SVG unit per CSS pixel keeps labels readable at every viewport width.
  const measuredWidth = svg => Math.max(280, svg.getBoundingClientRect().width || 600);
  const numeric = value => Math.abs(value) < .001 && value !== 0 ? value.toExponential(2) : Number(value.toFixed(4)).toString();

  async function mount(figure) {
    const language = figure.dataset.lang === 'fr' ? 'fr' : 'en';
    const words = labels[language];
    const integer = new Intl.NumberFormat(language);
    let data;
    try {
      const response = await fetch(figure.dataset.source, { credentials: 'same-origin' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      data = await response.json();
      if (data.version !== 1 || !data.datasets?.length) throw new Error('Unsupported archive');
    } catch {
      figure.querySelector('[data-archive-readout]').textContent = words.failure;
      figure.querySelectorAll('input,select,button').forEach(control => { control.disabled = true; });
      return;
    }
    const find = selector => figure.querySelector(selector);
    const datasetControl = find('[data-dataset]');
    const modeControl = find('[data-reference]');
    const range = find('[data-budget]');
    const number = find('[data-budget-number]');
    const previous = find('[data-previous]');
    const next = find('[data-next]');
    const svg = find('[data-archive-chart]');
    const caption = find('[data-archive-caption]');
    let dataset = data.datasets[0], mode = 'fixed', budget = dataset.defaultBudget;
    let archive;
    let eventSteps = [];
    const readout = find('[data-archive-readout]');
    const maxCount = () => dataset.maxCount;
    let chart;
    const point = (step, count) => [chart.left + chart.plotWidth * step / archive.maxStep, chart.bottom - chart.plotHeight * count / maxCount()];
    const path = curve => {
      let d = `M${point(curve[0][0], curve[0][1]).join(',')}`;
      for (let i = 1; i < curve.length; i += 1) {
        d += `H${point(curve[i][0], curve[i - 1][1])[0]}V${point(curve[i][0], curve[i][1])[1]}`;
      }
      return `${d}H${chart.right}`;
    };
    function updateBudget(value) {
      budget = Math.max(0, Math.min(archive.maxStep, Math.round(Number(value) || 0)));
      range.value = budget;
      number.value = budget;
      const a = BanditNumerics.count(archive.adaptive.events, budget);
      const u = BanditNumerics.count(archive.uniform.events, budget);
      readout.textContent = words.archiveReadout(integer.format(budget), a, u);
      find('[data-count-adaptive]').textContent = a;
      find('[data-count-uniform]').textContent = u;
      previous.disabled = !eventSteps.some(step => step < budget);
      next.disabled = !eventSteps.some(step => step > budget);
      let cursor = svg.querySelector('[data-cursor]');
      if (!cursor) { cursor = element('line', { 'data-cursor': '', class: 'reference', y1: chart.top, y2: chart.bottom }); svg.append(cursor); }
      cursor.setAttribute('x1', point(budget, 0)[0]);
      cursor.setAttribute('x2', point(budget, 0)[0]);
      svg.querySelector('desc').textContent = `${words.archiveDescription(dataset.label, words[mode])} ${readout.textContent}`;
    }
    function drawArchive(reset = true) {
      dataset = data.datasets.find(item => item.id === datasetControl.value) || data.datasets[0];
      mode = modeControl.value;
      archive = dataset.modes[mode];
      eventSteps = [...new Set([0, ...archive.adaptive.events.map(event => event.step), ...archive.uniform.events.map(event => event.step)])].sort((a, b) => a - b);
      range.max = number.max = archive.maxStep;
      // All recorded integer steps, including maxStep, must be reachable with End.
      range.step = number.step = 1;
      svg.style.minWidth = '280px';
      const width = measuredWidth(svg), mobile = width < 480;
      chart = { width, left: mobile ? 42 : 56, right: width - 18, top: 38, bottom: mobile ? 218 : 238 };
      chart.plotWidth = chart.right - chart.left;
      chart.plotHeight = chart.bottom - chart.top;
      svg.setAttribute('viewBox', `0 0 ${width} ${chart.bottom + 88}`);
      svg.replaceChildren(element('title', {}, `${dataset.label} · ${words[mode]}`), element('desc', {}));
      svg.append(element('path', { d: `M${chart.left} ${chart.top}V${chart.bottom}H${chart.right}`, class: 'axis' }));
      const xDivisions = mobile ? 2 : 4;
      for (let i = 0; i <= xDivisions; i += 1) {
        tick(svg, chart.left + chart.plotWidth * i / xDivisions, chart.bottom + 21,
          integer.format(Math.round(archive.maxStep * i / xDivisions)), i === 0 ? 'start' : i === xDivisions ? 'end' : 'middle');
      }
      for (let i = 0; i <= 4; i += 1) {
        tick(svg, chart.left - 10, chart.bottom + 4 - chart.plotHeight * i / 4, String(Math.round(maxCount() * i / 4)), 'end');
      }
      tick(svg, chart.left, 22, words.discoveries, 'start');
      svg.append(element('path', { d: path(archive.uniform.curve), class: 'series', 'stroke-dasharray': '5 3' }));
      svg.append(element('path', { d: path(archive.adaptive.curve), class: 'series-accent' }));
      const legendY = chart.bottom + 46, uniformX = chart.left + Math.min(160, chart.plotWidth / 2);
      svg.append(element('line', { x1: chart.left, x2: chart.left + 24, y1: legendY, y2: legendY, class: 'series-accent' }));
      tick(svg, chart.left + 30, legendY + 4, words.adaptive, 'start');
      svg.append(element('line', { x1: uniformX, x2: uniformX + 24, y1: legendY, y2: legendY, class: 'series', 'stroke-dasharray': '5 3' }));
      tick(svg, uniformX + 30, legendY + 4, words.uniform, 'start');
      tick(svg, chart.right, chart.bottom + 76, words.step, 'end');
      caption.textContent = `${dataset.label} · JJ · ${words[mode]}`;
      const source = find('[data-archive-source]');
      source.href = dataset.sources.discovery.url;
      source.textContent = `${words.source} · ${dataset.sources.discovery.path}`;
      updateBudget(reset ? Math.min(archive.maxStep, mode === 'fixed' ? dataset.defaultBudget : Math.round(archive.maxStep / 4)) : budget);
    }
    datasetControl.addEventListener('change', () => drawArchive());
    modeControl.addEventListener('change', () => drawArchive());
    range.addEventListener('input', () => updateBudget(range.value));
    number.addEventListener('input', () => updateBudget(number.value));
    previous.addEventListener('click', () => updateBudget([...eventSteps].reverse().find(step => step < budget) ?? 0));
    next.addEventListener('click', () => updateBudget(eventSteps.find(step => step > budget) ?? archive.maxStep));
    svg.addEventListener('click', event => {
      const box = svg.getBoundingClientRect();
      updateBudget(((event.clientX - box.left) / box.width * chart.width - chart.left) / chart.plotWidth * archive.maxStep);
    });

    const example = data.workedExample;
    const countInput = find('[data-example-count]');
    const deltaInput = find('[data-example-delta]');
    const controlInput = find('[data-example-control]');
    const intervalSVG = find('[data-example-chart]');
    const table = find('[data-example-table]');
    function drawExample() {
      const n = Number(countInput.value), delta = Number(deltaInput.value);
      find('[data-example-n]').textContent = n;
      find('[data-example-alpha]').textContent = delta.toFixed(2);
      const arms = example.arms.map(arm => BanditNumerics.stats(arm.cycle, n));
      const control = BanditNumerics.stats(example.controlCycle, n);
      const online = controlInput.checked;
      const result = online ? BanditNumerics.twoSample(arms, control, delta, example.rho) : BanditNumerics.bh(arms, example.baseline, delta, example.rho);
      const alpha = delta * Math.max(1, result.k) / result.denominator;
      const reference = online ? control.mean : example.baseline;
      const intervals = arms.map(s => {
        const radius = BanditNumerics.phi(s, online ? alpha / 2 : alpha, example.rho) + (online ? BanditNumerics.phi(control, alpha / 2, example.rho) : 0);
        return { gap: s.mean - reference, radius, lower: s.mean - reference - radius };
      });
      const span = Math.ceil(Math.max(.5, ...intervals.map(interval => Math.abs(interval.gap) + interval.radius)) * 4) / 4;
      intervalSVG.style.minWidth = '280px';
      const width = measuredWidth(intervalSVG), left = width < 480 ? 42 : 78, right = width - 18;
      const x = value => left + (value + span) / (2 * span) * (right - left);
      intervalSVG.setAttribute('viewBox', `0 0 ${width} 230`);
      intervalSVG.replaceChildren(element('title', {}, words.mechanicsDescription), element('desc', {}, `${words.mechanicsReadout(n, result.k, result.retained.map(id => example.arms[id].label).join(', ') || words.none)} α = ${numeric(alpha)}.`));
      intervalSVG.append(element('line', { x1: x(0), x2: x(0), y1: 24, y2: 186, class: 'reference' }));
      tick(intervalSVG, x(0), 18, '0');
      tick(intervalSVG, x(-span), 208, numeric(-span), 'start');
      tick(intervalSVG, x(span), 208, numeric(span), 'end');
      intervals.forEach((interval, id) => {
        const y = 54 + id * 50;
        const style = result.retained.includes(id) ? 'series-accent' : 'series';
        tick(intervalSVG, 12, y + 4, example.arms[id].label, 'start');
        intervalSVG.append(element('line', { x1: x(interval.lower), x2: x(interval.gap + interval.radius), y1: y, y2: y, class: style }));
        [interval.lower, interval.gap + interval.radius].forEach(value => intervalSVG.append(element('line', { x1: x(value), x2: x(value), y1: y - 5, y2: y + 5, class: style })));
        intervalSVG.append(element('circle', { cx: x(interval.gap), cy: y, r: 3, fill: result.retained.includes(id) ? 'var(--accent)' : 'var(--muted)' }));
      });
      table.replaceChildren();
      const head = document.createElement('thead'), heading = document.createElement('tr');
      (online ? [words.arm, words.lower, words.retained] : [words.rank, words.p, words.threshold, words.retained]).forEach(label => {
        const cell = document.createElement('th'); cell.scope = 'col'; cell.textContent = label; heading.append(cell);
      });
      head.append(heading); table.append(head);
      const body = document.createElement('tbody');
      const rows = online ? arms.map((_, id) => ({ id })) : result.sorted;
      rows.forEach((row, rank) => {
        const tr = document.createElement('tr');
        const cells = online ? [example.arms[row.id].label, numeric(intervals[row.id].lower), result.retained.includes(row.id) ? words.yes : words.no] :
          [`${rank + 1} · ${example.arms[row.id].label}`, numeric(row.p), numeric(delta * (rank + 1) / arms.length), result.retained.includes(row.id) ? words.yes : words.no];
        cells.forEach(value => { const td = document.createElement('td'); td.textContent = value; tr.append(td); });
        body.append(tr);
      });
      table.append(body);
      find('[data-example-readout]').textContent = `${words.mechanicsReadout(n, result.k, result.retained.map(id => example.arms[id].label).join(', ') || words.none)} α = ${numeric(alpha)}.`;
      find('[data-example-note]').textContent = online ? words.onlineNote : words.fixedNote;
    }
    [countInput, deltaInput, controlInput].forEach(control => control.addEventListener('input', drawExample));
    drawArchive();
    drawExample();
    let lastArchiveWidth = measuredWidth(svg), lastExampleWidth = measuredWidth(intervalSVG), resizeFrame = 0;
    const redrawOnResize = () => {
      if (resizeFrame) return;
      resizeFrame = requestAnimationFrame(() => {
        resizeFrame = 0;
        const archiveWidth = measuredWidth(svg), exampleWidth = measuredWidth(intervalSVG);
        if (Math.abs(archiveWidth - lastArchiveWidth) < .5 && Math.abs(exampleWidth - lastExampleWidth) < .5) return;
        lastArchiveWidth = archiveWidth;
        lastExampleWidth = exampleWidth;
        drawArchive(false);
        drawExample();
      });
    };
    if (typeof ResizeObserver === 'function') {
      const observer = new ResizeObserver(redrawOnResize);
      observer.observe(svg);
      observer.observe(intervalSVG);
    } else {
      window.addEventListener('resize', redrawOnResize, { passive: true });
    }
  }
  document.querySelectorAll('[data-bandit-figure]').forEach(figure => { mount(figure); });
})();
