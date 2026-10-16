/* Derived from slitherlink-shiny, copyright (c) 2026 Marouane Daoudi.
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to
 * do so, subject to the following conditions: the above copyright notice and
 * this permission notice shall be included in all copies or substantial portions
 * of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY
 * KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
 * USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
(function () {
  "use strict";
  // Faithful port of solver.R at a64660ef; row and column indices are zero-based here.
  var puzzles = {
    easy_3x3: [[2, 1, 2], [1, 0, 1], [2, 1, 2]],
    medium_4x4: [[2, 2, 2, 1], [1, 1, 2, 3], [2, 2, 1, 1], [3, 1, 0, 0]]
  };
  function initial(clues) {
    return { clues: clues, n: clues.length, m: clues[0].length,
      h: Array.from({ length: clues.length + 1 }, function () { return Array(clues[0].length).fill(0); }),
      v: Array.from({ length: clues.length }, function () { return Array(clues[0].length + 1).fill(0); }) };
  }
  function copy(g) { return { clues: g.clues, n: g.n, m: g.m, h: g.h.map(function (r) { return r.slice(); }), v: g.v.map(function (r) { return r.slice(); }) }; }
  function cell(i, j) { return [["h", i, j], ["h", i + 1, j], ["v", i, j], ["v", i, j + 1]]; }
  function node(i, j, g) {
    var edges = [];
    if (j > 0) edges.push(["h", i, j - 1]);
    if (j < g.m) edges.push(["h", i, j]);
    if (i > 0) edges.push(["v", i - 1, j]);
    if (i < g.n) edges.push(["v", i, j]);
    return edges;
  }
  function get(g, e) { return g[e[0]][e[1]][e[2]]; }
  function counts(g, edges) {
    return { drawn: edges.filter(function (e) { return get(g, e) === 1; }).length,
      free: edges.filter(function (e) { return get(g, e) === 0; }).length };
  }
  function topology(g) {
    var size = (g.n + 1) * (g.m + 1), adj = Array.from({ length: size }, function () { return []; });
    function id(i, j) { return i * (g.m + 1) + j; }
    function add(a, b) { adj[a].push(b); adj[b].push(a); }
    g.h.forEach(function (row, i) { row.forEach(function (v, j) { if (v === 1) add(id(i, j), id(i, j + 1)); }); });
    g.v.forEach(function (row, i) { row.forEach(function (v, j) { if (v === 1) add(id(i, j), id(i + 1, j)); }); });
    var active = adj.map(function (a, i) { return a.length ? i : -1; }).filter(function (i) { return i >= 0; });
    var visited = new Set(), queue = active.length ? [active[0]] : [];
    while (queue.length) { var cur = queue.shift(); if (visited.has(cur)) continue; visited.add(cur); adj[cur].forEach(function (v) { if (!visited.has(v)) queue.push(v); }); }
    return { adj: adj, active: active, component: Array.from(visited), edges: adj.reduce(function (s, a) { return s + a.length; }, 0) / 2 };
  }
  function contradiction(g) {
    for (var i = 0; i < g.n; i++) for (var j = 0; j < g.m; j++) {
      var clue = g.clues[i][j]; if (clue === null) continue;
      var c = counts(g, cell(i, j));
      if (c.drawn > clue) return "cell-overflow";
      if (c.drawn + c.free < clue) return "cell-shortage";
    }
    var t = topology(g);
    if (t.adj.some(function (a) { return a.length > 2; })) return "node-degree";
    // R checks the component reached from the FIRST active node, not every component.
    if (t.component.length && t.component.every(function (v) { return t.adj[v].length === 2; }) &&
        t.component.reduce(function (s, v) { return s + t.adj[v].length; }, 0) / 2 < t.edges) return "premature-loop";
    return null;
  }
  function solved(g) {
    for (var i = 0; i < g.n; i++) for (var j = 0; j < g.m; j++) {
      if (g.clues[i][j] !== null && counts(g, cell(i, j)).drawn !== g.clues[i][j]) return false;
    }
    var t = topology(g);
    return t.active.length > 0 && t.active.every(function (v) { return t.adj[v].length === 2; }) && t.component.length === t.active.length;
  }
  function pick(g) {
    var chosen = null, best = Infinity;
    for (var i = 0; i < g.n; i++) for (var j = 0; j < g.m; j++) {
      if (g.clues[i][j] === null) continue;
      var edges = cell(i, j), c = counts(g, edges), slack = c.free - (g.clues[i][j] - c.drawn);
      if (c.free && slack < best) { best = slack; chosen = edges.find(function (e) { return get(g, e) === 0; }); }
    }
    if (chosen) return chosen;
    for (var r = 0; r < g.h.length; r++) for (var s = 0; s < g.m; s++) if (g.h[r][s] === 0) return ["h", r, s];
    for (var u = 0; u < g.n; u++) for (var v = 0; v < g.m + 1; v++) if (g.v[u][v] === 0) return ["v", u, v];
    return null;
  }
  function buildTrace(clues) {
    var trace = [], calls = 0;
    function record(g, reason, at, depth) { trace.push({ grid: copy(g), reason: reason, at: at || null, depth: depth }); }
    function assign(g, e, value, reason, at, depth) { g[e[0]][e[1]][e[2]] = value; record(g, reason, at || e, depth); }
    function propagate(g, depth) {
      while (true) {
        var before = JSON.stringify([g.h, g.v]);
        for (var i = 0; i < g.n; i++) for (var j = 0; j < g.m; j++) {
          var clue = g.clues[i][j]; if (clue === null) continue;
          var edges = cell(i, j), c = counts(g, edges); if (!c.free) continue;
          if (c.drawn === clue) edges.forEach(function (e) { if (get(g, e) === 0) assign(g, e, -1, "cell-full", [i, j], depth); });
          if (c.drawn + c.free === clue) edges.forEach(function (e) { if (get(g, e) === 0) assign(g, e, 1, "cell-needed", [i, j], depth); });
        }
        for (var ni = 0; ni < g.n + 1; ni++) for (var nj = 0; nj < g.m + 1; nj++) {
          var ne = node(ni, nj, g), nc = counts(g, ne); if (!nc.free) continue;
          if (nc.drawn === 2) ne.forEach(function (e) { if (get(g, e) === 0) assign(g, e, -1, "node-full", [ni, nj], depth); });
          if (nc.drawn === 1 && nc.free === 1) ne.forEach(function (e) { if (get(g, e) === 0) assign(g, e, 1, "node-needed", [ni, nj], depth); });
        }
        var error = contradiction(g);
        if (error) { record(g, error, null, depth); return false; }
        if (before === JSON.stringify([g.h, g.v])) { record(g, "fixed-point", null, depth); return true; }
      }
    }
    function search(g, depth) {
      if (++calls > 10000) throw new Error("Trace limit reached");
      if (!propagate(g, depth)) return null;
      if (solved(g)) { record(g, "solved", null, depth); return g; }
      var edge = pick(g); if (!edge) return null;
      var candidate = copy(g); assign(candidate, edge, 1, "branch-draw", edge, depth + 1);
      var result = search(candidate, depth + 1); if (result) return result;
      record(g, "backtrack", edge, depth);
      candidate = copy(g); assign(candidate, edge, -1, "branch-cross", edge, depth + 1);
      result = search(candidate, depth + 1); if (result) return result;
      record(g, "backtrack", edge, depth); return null;
    }
    var start = initial(clues); record(start, "start", null, 0); var solution = search(start, 0);
    return { trace: trace, solution: solution, calls: calls };
  }
  if (typeof module !== "undefined" && module.exports) module.exports = { puzzles: puzzles, buildTrace: buildTrace, solved: solved, contradiction: contradiction };
  if (typeof document === "undefined") return;
  document.querySelectorAll('[data-figure="slitherlink"]').forEach(function (figure) {
    var fr = document.documentElement.lang === "fr", svg = figure.querySelector("svg"), controls = figure.querySelector(".figure-controls");
    var select = figure.querySelector("select"), previous = figure.querySelector("[data-previous]"), next = figure.querySelector("[data-next]"), reset = figure.querySelector("[data-reset]");
    var position = 0, run;
    var messages = fr ? {start:"État initial : aucun segment décidé.","cell-full":"Cellule satisfaite : exclure un côté encore libre.","cell-needed":"Les côtés libres sont tous nécessaires : tracer.","node-full":"Sommet de degré 2 : exclure les autres segments.","node-needed":"Un segment tracé et une seule possibilité : continuer la boucle.","fixed-point":"Point fixe : plus de déduction locale.","branch-draw":"Hypothèse : tracer le segment choisi par la règle du plus petit slack.","branch-cross":"Seconde hypothèse : exclure le segment choisi.",backtrack:"Retour à l’état parent : annuler cette branche.",solved:"Indices satisfaits et une seule boucle connectée. Première solution trouvée.","cell-overflow":"Contradiction : trop de côtés tracés.","cell-shortage":"Contradiction : l’indice ne peut plus être atteint.","node-degree":"Contradiction : degré supérieur à 2.","premature-loop":"Contradiction : boucle fermée et autres segments tracés."} : {start:"Initial state: no edge decided.","cell-full":"Satisfied cell: cross an undecided side.","cell-needed":"Every free side is needed: draw.","node-full":"Node of degree 2: cross the remaining edges.","node-needed":"One drawn edge and one possibility: continue the loop.","fixed-point":"Fixed point: no further local deduction.","branch-draw":"Hypothesis: draw the edge selected by minimum slack.","branch-cross":"Second hypothesis: cross the selected edge.",backtrack:"Return to the parent state: undo this branch.",solved:"Clues satisfied and one connected loop. First solution found.","cell-overflow":"Contradiction: too many drawn sides.","cell-shortage":"Contradiction: the clue is unreachable.","node-degree":"Contradiction: degree above 2.","premature-loop":"Contradiction: a closed loop and other drawn edges."};
    function element(tag, attrs, text) { var e = document.createElementNS("http://www.w3.org/2000/svg", tag); Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); }); if (text) e.textContent = text; return e; }
    function render(animateFrom) {
      var state = run.trace[position], g = state.grid, step = 64, offset = 25;
      svg.setAttribute("aria-label", (fr ? "Grille Slitherlink. " : "Slitherlink grid. ") + messages[state.reason]);
      svg.setAttribute("viewBox", "0 0 " + (g.m * step + 50) + " " + (g.n * step + 50));
      svg.replaceChildren(element("title", {}, fr ? "État de la grille Slitherlink" : "Slitherlink grid state"));
      function edge(e, x, y, xx, yy) {
        var value = get(g, e);
        if (value === 1) {
          var line = element("line", {x1:x,y1:y,x2:xx,y2:yy,stroke:"var(--accent)","stroke-width":3});
          svg.appendChild(line);
          if (animateFrom && get(animateFrom, e) !== 1 && window.ResearchViz && window.ResearchViz.draw) window.ResearchViz.draw(line);
        }
        if (value === -1) { var cx=(x+xx)/2,cy=(y+yy)/2; svg.appendChild(element("path", {d:"M"+(cx-4)+" "+(cy-4)+"l8 8m-8 0l8-8",stroke:"var(--muted)","stroke-width":1.2,fill:"none"})); }
      }
      for (var i=0;i<g.n+1;i++) for(var j=0;j<g.m;j++) edge(["h",i,j],offset+j*step,offset+i*step,offset+(j+1)*step,offset+i*step);
      for (var a=0;a<g.n;a++) for(var b=0;b<g.m+1;b++) edge(["v",a,b],offset+b*step,offset+a*step,offset+b*step,offset+(a+1)*step);
      for(var r=0;r<g.n+1;r++) for(var c=0;c<g.m+1;c++) svg.appendChild(element("circle", {cx:offset+c*step,cy:offset+r*step,r:2.3,fill:"currentColor"}));
      g.clues.forEach(function(row,r){row.forEach(function(v,c){if(v!==null)svg.appendChild(element("text",{x:offset+(c+.5)*step,y:offset+(r+.5)*step+6,"text-anchor":"middle","font-size":20},String(v)));});});
      var location = state.at && state.at.length===2 ? " ("+(state.at[0]+1)+", "+(state.at[1]+1)+")" : "";
      figure.querySelector("[data-step-status]").textContent = (fr?"Étape ":"Step ")+position+" / "+(run.trace.length-1)+" · "+messages[state.reason]+location+" · "+(fr?"Profondeur ":"Depth ")+state.depth;
      previous.disabled=position===0; next.disabled=position===run.trace.length-1;
    }
    function load(){run=buildTrace(puzzles[select.value]);position=0;render();}
    previous.addEventListener("click",function(){position=Math.max(0,position-1);render();});
    next.addEventListener("click",function(event){var old=run.trace[position].grid;position=Math.min(run.trace.length-1,position+1);render(event.detail>0?old:null);});
    reset.addEventListener("click",function(){position=0;render();}); select.addEventListener("change",load);
    controls.hidden=false; load();
  });
})();
