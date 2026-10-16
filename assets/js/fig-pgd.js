(function (global) {
  "use strict";
  const norm = (v) => Math.sqrt(v.reduce((sum, value) => sum + value * value, 0));
  const dot = (a, b) => a.reduce((sum, value, index) => sum + value * b[index], 0);

  function projectL1(v, radius) {
    if (!Number.isFinite(radius) || radius < 0 || !v.every(Number.isFinite)) throw new RangeError("Finite vector and nonnegative radius required.");
    if (radius === 0) return v.map(() => 0);
    const magnitudes = v.map(Math.abs);
    if (magnitudes.reduce((sum, value) => sum + value, 0) <= radius) return v.slice();
    const sorted = magnitudes.slice().sort((a, b) => b - a);
    let cumulative = 0, threshold = 0;
    sorted.forEach((value, index) => {
      cumulative += value;
      const candidate = (cumulative - radius) / (index + 1);
      if (value > candidate) threshold = candidate;
    });
    return v.map((value, index) => Math.sign(value) * Math.max(magnitudes[index] - threshold, 0));
  }

  function loss(X, y, beta) {
    return 0.5 * X.reduce((sum, row, index) => sum + (dot(row, beta) - y[index]) ** 2, 0);
  }

  function solveTrace({ X, y, radius, method = "pgd", maxIter = 160, tol = 0, L = 9 }) {
    if (!Number.isFinite(L) || L <= 0 || !["pgd", "fista"].includes(method)) throw new RangeError("Positive L and a supported method required.");
    let beta = X[0].map(() => 0), z = beta.slice(), theta = 1;
    const trace = [{ iteration: 0, beta: beta.slice(), z: z.slice(), trial: null, evaluationPoint: null, theta, loss: loss(X, y, beta), nonzeros: 0, relChange: null }];
    for (let k = 0; k < maxIter; k += 1) {
      const evaluationPoint = (method === "fista" ? z : beta).slice();
      const residual = X.map((row, index) => dot(row, evaluationPoint) - y[index]);
      const gradient = beta.map((_, j) => X.reduce((sum, row, i) => sum + row[j] * residual[i], 0));
      const trial = evaluationPoint.map((value, j) => value - gradient[j] / L);
      const next = projectL1(trial, radius);
      const relChange = norm(next.map((value, j) => value - beta[j])) / (norm(beta) + 1e-10);
      if (method === "fista") {
        const nextTheta = 0.5 * (1 + Math.sqrt(1 + 4 * theta ** 2));
        z = next.map((value, j) => value + ((theta - 1) / nextTheta) * (value - beta[j]));
        theta = nextTheta;
      } else z = next.slice();
      beta = next;
      trace.push({ iteration: k + 1, beta: beta.slice(), z: z.slice(), trial, evaluationPoint, theta, loss: loss(X, y, beta), nonzeros: beta.filter((value) => Math.abs(value) > 1e-8).length, relChange });
      if (relChange < tol) break;
    }
    return trace;
  }

  const api = { projectL1, loss, solveTrace };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  global.PGDResearch = api;
  if (typeof document === "undefined") return;

  const NS = "http://www.w3.org/2000/svg";
  const number = (value, digits = 3) => Number(value).toLocaleString(undefined, { maximumSignificantDigits: digits });
  function element(tag, attrs = {}, text) {
    const node = document.createElementNS(NS, tag);
    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function mount(container, data, index) {
    const fr = container.dataset.language === "fr";
    const t = (en, french) => fr ? french : en;
    const pick = (name) => container.querySelector(`[data-pgd-${name}]`);
    const radiusControl = pick("radius"), iterationControl = pick("iteration");
    const methodControl = pick("method"), stepControl = pick("step");
    const benchmarkControl = pick("benchmark-iteration");
    const geometrySvg = pick("geometry"), convergenceSvg = pick("convergence");
    const pedagogical = data.pedagogical, benchmark = data.benchmark;
    let cachedRadius = null, traces;
    const maxBenchmark = Math.max(benchmark.solvers.pgd.iterations, benchmark.solvers.fista.iterations);
    benchmarkControl.max = String(maxBenchmark);
    radiusControl.value = String(pedagogical.radiusDefault);
    iterationControl.max = String(pedagogical.maxIter);

    function prepare(svg, name, description, height) {
      const width = Math.max(240, Math.round(svg.getBoundingClientRect().width || container.clientWidth || 600));
      svg.replaceChildren();
      svg.setAttribute("viewBox", `0 0 ${width} ${height(width)}`);
      const titleId = `pgd-${index}-${name}-title`, descId = `pgd-${index}-${name}-desc`;
      svg.setAttribute("aria-labelledby", `${titleId} ${descId}`);
      svg.append(element("title", { id: titleId }, name === "geometry" ? t("Projected iterates remain in the L1 ball", "Les itérés projetés restent dans la boule L1") : t("FISTA reaches small observed loss differences earlier", "FISTA atteint plus tôt de faibles écarts de perte observés")));
      svg.append(element("desc", { id: descId }, description));
      return { width, height: height(width) };
    }
    function path(points, x, y) { return points.map((point, i) => `${i ? "L" : "M"}${x(point[0]).toFixed(3)},${y(point[1]).toFixed(3)}`).join(" "); }
    function label(svg, x, y, text, attrs = {}) { svg.append(element("text", { x, y, ...attrs }, text)); }
    function point(svg, coordinates, x, y, attrs = {}) { svg.append(element("circle", { cx: x(coordinates[0]), cy: y(coordinates[1]), r: 3, ...attrs })); }

    function drawGeometry() {
      const radius = Number(radiusControl.value), k = Number(iterationControl.value);
      if (radius !== cachedRadius) {
        traces = Object.fromEntries(["pgd", "fista"].map((method) => [method, solveTrace({ ...pedagogical, radius, method })]));
        cachedRadius = radius;
      }
      pick("radius-value").textContent = number(radius);
      pick("iteration-value").textContent = String(k);
      const size = prepare(geometrySvg, "geometry", t("Illustrative two-dimensional least-squares problem. Gray solid PGD and navy dashed FISTA are projected onto a diamond-shaped L1 ball. Radius and iteration can be changed with the labeled controls.", "Problème illustratif de moindres carrés en deux dimensions. PGD en gris continu et FISTA en marine discontinu sont projetés sur une boule L1 en losange. Les contrôles règlent le rayon et l’itération."), (width) => Math.max(260, Math.min(420, Math.round(width * 0.72))));
      const extent = Math.max(2.6, radius * 1.14), side = Math.min(size.width - 70, size.height - 62);
      const left = (size.width - side) / 2, top = 16;
      const x = (value) => left + side * (value + extent) / (2 * extent);
      const y = (value) => top + side * (extent - value) / (2 * extent);
      const clipId = `pgd-${index}-geometry-clip`;
      const defs = element("defs"), clip = element("clipPath", { id: clipId });
      clip.append(element("rect", { x: left, y: top, width: side, height: side })); defs.append(clip); geometrySvg.append(defs);
      const marks = element("g", { "clip-path": `url(#${clipId})` }); geometrySvg.append(marks);
      [0.5, 2, 5].forEach((level) => {
        const points = Array.from({ length: 97 }, (_, i) => { const angle = i * Math.PI / 48; return [2 + Math.sqrt(2 * level) * Math.cos(angle), 1 + Math.sqrt(2 * level) * Math.sin(angle) / 3]; });
        marks.append(element("path", { d: path(points, x, y), class: "reference", "stroke-width": 0.7 }));
      });
      marks.append(element("path", { d: path([[radius, 0], [0, radius], [-radius, 0], [0, -radius], [radius, 0]], x, y), class: "geometry", "stroke-width": 1.3 }));
      geometrySvg.append(element("line", { x1: left, x2: left + side, y1: y(0), y2: y(0), class: "axis" }));
      geometrySvg.append(element("line", { x1: x(0), x2: x(0), y1: top, y2: top + side, class: "axis" }));
      [-2, 0, 2].filter((value) => Math.abs(value) < extent).forEach((value) => {
        label(geometrySvg, x(value), top + side + 18, String(value), { class: "tick-label", "text-anchor": "middle" });
        if (value) label(geometrySvg, left - 8, y(value) + 4, String(value), { class: "tick-label", "text-anchor": "end" });
      });
      label(geometrySvg, left + side, top + side + 36, "β₁", { class: "direct-label", "text-anchor": "end" });
      label(geometrySvg, left - 4, top + 8, "β₂", { class: "direct-label", "text-anchor": "end" });
      point(marks, [2, 1], x, y, { r: 3.5, fill: "none", stroke: "var(--ink)" });
      label(geometrySvg, x(2) - 4, y(1) - 9, t("βfree", "βlibre"), { class: "tick-label", "text-anchor": "end" });
      ["pgd", "fista"].forEach((method) => {
        const trace = traces[method].slice(0, k + 1), last = trace[trace.length - 1];
        marks.append(element("path", { d: path(trace.map((state) => state.beta), x, y), class: method === "pgd" ? "series" : "series-accent", ...(method === "fista" ? { "stroke-dasharray": "5 3" } : {}) }));
        point(marks, last.beta, x, y, { fill: method === "fista" ? "var(--accent)" : "var(--muted)", r: 3.5 });
        label(geometrySvg, x(last.beta[0]) + (method === "pgd" ? -9 : 9), y(last.beta[1]) + (method === "pgd" ? -10 : 17), method.toUpperCase(), { class: "direct-label", "text-anchor": method === "pgd" ? "end" : "start" });
      });
      const state = traces[methodControl.value][k];
      if (stepControl.checked && state.trial) {
        marks.append(element("path", { d: path([state.evaluationPoint, state.trial, state.beta], x, y), class: "reference" }));
        point(marks, state.trial, x, y, { fill: "var(--paper)", stroke: "var(--ink)", r: 4 });
        label(geometrySvg, x(state.trial[0]) + 7, y(state.trial[1]) - 9, "qₖ", { class: "tick-label" });
      }
      const pgd = traces.pgd[k], fista = traces.fista[k];
      pick("geometry-readout").textContent = `${t("Illustrative instance", "Instance illustrative")} · k = ${k} · PGD f = ${number(pgd.loss, 5)}, ‖β‖₁ = ${number(pgd.beta.reduce((sum, value) => sum + Math.abs(value), 0), 4)} · FISTA f = ${number(fista.loss, 5)}, ‖β‖₁ = ${number(fista.beta.reduce((sum, value) => sum + Math.abs(value), 0), 4)}.`;
      pick("geometry-values").replaceChildren(...["pgd", "fista"].map((method) => {
        const current = traces[method][k], row = document.createElement("tr");
        [method.toUpperCase(), k, ...current.beta.map((value) => number(value, 6)), number(current.loss, 6)].forEach((value) => { const cell = document.createElement("td"); cell.textContent = String(value); row.append(cell); });
        return row;
      }));
    }

    function drawConvergence() {
      const selected = Number(benchmarkControl.value);
      pick("benchmark-value").textContent = String(selected);
      const size = prepare(convergenceSvg, "convergence", t("Recomputed 200-dimensional benchmark, seed 42. Loss differences are measured from the best observed numerical value, not a certified optimum. Values below 10 to the minus 12 are drawn at that display floor.", "Benchmark recalculé en dimension 200, graine 42. Les écarts de perte sont mesurés à la meilleure valeur numérique observée, sans certification de l’optimum. Les valeurs inférieures à 10 puissance moins 12 sont tracées à ce plancher d’affichage."), (width) => Math.max(260, Math.min(390, Math.round(width * 0.62))));
      const margins = { left: size.width < 400 ? 50 : 58, right: 62, top: 30, bottom: 42 };
      const plotWidth = size.width - margins.left - margins.right, plotHeight = size.height - margins.top - margins.bottom;
      const floor = 1e-12, ref = benchmark.reference.value;
      const upper = Math.ceil(Math.log10(Math.max(...benchmark.solvers.pgd.losses, ...benchmark.solvers.fista.losses) - ref));
      const x = (value) => margins.left + (value - 1) / (maxBenchmark - 1) * plotWidth;
      const y = (value) => margins.top + (upper - Math.log10(Math.max(floor, value))) / (upper + 12) * plotHeight;
      const bottom = margins.top + plotHeight;
      convergenceSvg.append(element("path", { d: `M${margins.left},${margins.top}V${bottom}H${margins.left + plotWidth}`, class: "axis" }));
      const xTicks = size.width < 400 ? [1, 600, maxBenchmark] : [1, 400, 800, maxBenchmark];
      xTicks.forEach((value) => label(convergenceSvg, x(value), bottom + 18, String(value), { class: "tick-label", "text-anchor": "middle" }));
      [2, -2, -6, -10, -12].filter((power) => power <= upper).forEach((power) => label(convergenceSvg, margins.left - 7, y(10 ** power) + 4, power === -12 ? "≤1e−12" : `1e${power < 0 ? "−" + Math.abs(power) : power}`, { class: "tick-label", "text-anchor": "end" }));
      label(convergenceSvg, margins.left, 17, "f(βₖ) − fref", { class: "tick-label" });
      label(convergenceSvg, margins.left + plotWidth, bottom + 36, t("iteration k", "itération k"), { class: "tick-label", "text-anchor": "end" });
      ["pgd", "fista"].forEach((method) => {
        const result = benchmark.solvers[method];
        const points = result.losses.map((value, i) => [i + 1, Math.max(0, value - ref)]);
        convergenceSvg.append(element("path", { d: path(points, x, y), class: method === "pgd" ? "series" : "series-accent", ...(method === "fista" ? { "stroke-dasharray": "5 3" } : {}) }));
        const k = Math.min(selected, result.iterations), gap = Math.max(0, result.losses[k - 1] - ref);
        point(convergenceSvg, [k, gap], x, y, { fill: method === "fista" ? "var(--accent)" : "var(--muted)", r: 3 });
        const last = points[points.length - 1], labelY = bottom - (method === "pgd" ? 26 : 7);
        convergenceSvg.append(element("line", { x1: x(last[0]), y1: y(last[1]), x2: margins.left + plotWidth + 5, y2: labelY - 4, class: "axis" }));
        label(convergenceSvg, margins.left + plotWidth + 8, labelY, method.toUpperCase(), { class: "direct-label" });
      });
      const rows = ["pgd", "fista"].map((method) => {
        const result = benchmark.solvers[method], k = Math.min(selected, result.iterations);
        return { method: method.toUpperCase(), k, loss: result.losses[k - 1], nnz: result.nonzeros[k - 1], gap: Math.max(0, result.losses[k - 1] - ref) };
      });
      pick("benchmark-readout").textContent = rows.map((row) => `${row.method}, k = ${row.k} : f = ${number(row.loss, 7)}, ${t("nonzero coefficients", "coefficients non nuls")} = ${row.nnz}`).join(" · ") + ".";
      pick("benchmark-values").replaceChildren(...rows.map((row) => { const tr = document.createElement("tr"); [row.method, row.k, number(row.loss, 9), row.gap.toExponential(3), row.nnz].forEach((value) => { const td = document.createElement("td"); td.textContent = String(value); tr.append(td); }); return tr; }));
      convergenceSvg.onclick = (event) => {
        const bounds = convergenceSvg.getBoundingClientRect();
        const coordinate = (event.clientX - bounds.left) * size.width / bounds.width;
        benchmarkControl.value = String(Math.max(1, Math.min(maxBenchmark, Math.round(1 + (coordinate - margins.left) / plotWidth * (maxBenchmark - 1)))));
        drawConvergence();
      };
    }

    pick("benchmark-parameters").textContent = `n = ${benchmark.n}, p = ${benchmark.p}, s = ${benchmark.trueSparsity}, σ = ${benchmark.noiseStd}, seed = ${benchmark.seed}, α = ${benchmark.alpha}, τ = ${number(benchmark.radius, 9)}, η = 1/L, tol = ${benchmark.tol}.`;
    pick("benchmark-reference").textContent = `${t("Numerical reference", "Référence numérique")} fref = ${number(benchmark.reference.value, 11)}. ${t("Display floor: 1e−12; raw differences remain available in the table.", "Plancher d’affichage : 1e−12 ; les écarts bruts restent disponibles dans le tableau.")}`;
    pick("status").hidden = true;
    [radiusControl, iterationControl, methodControl, stepControl].forEach((control) => control.addEventListener("input", drawGeometry));
    benchmarkControl.addEventListener("input", drawConvergence);
    drawGeometry(); drawConvergence();
    if (typeof ResizeObserver !== "undefined") new ResizeObserver(() => { drawGeometry(); drawConvergence(); }).observe(container);
  }

  function start() {
    document.querySelectorAll("[data-pgd-figure]").forEach((container, index) => {
      fetch(container.dataset.source).then((response) => { if (!response.ok) throw new Error("Data unavailable"); return response.json(); }).then((data) => mount(container, data, index)).catch(() => {
        const status = container.querySelector("[data-pgd-status]");
        status.textContent = container.dataset.language === "fr" ? "Les données interactives n’ont pas pu être chargées. Le code et les paramètres restent disponibles ci-dessous." : "The interactive data could not be loaded. Source code and parameters remain available below.";
        container.querySelectorAll("input,select").forEach((control) => { control.disabled = true; });
      });
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true }); else start();
})(typeof globalThis !== "undefined" ? globalThis : this);
