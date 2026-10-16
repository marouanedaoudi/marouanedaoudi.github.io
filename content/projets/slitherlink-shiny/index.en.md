---
title: "Slitherlink Shiny"
date: 2026-03-31
lastmod: 2026-10-15
weight: 3
description: "An R package for Slitherlink: local constraint propagation, backtracking and loop validation, with a source-based interactive trace."
summary: "Follow the actual R solver from local deductions to a valid loop."
tags: ["R", "Shiny", "Constraints", "Backtracking"]
math: true
figures: ["slitherlink"]
code: "https://github.com/marouanedaoudi/slitherlink-shiny"
docs: "https://marouanedaoudi.github.io/slitherlink-shiny/"
projectType: "R package and algorithms"
preview: "slitherlink"
---

Slitherlink asks for a single closed loop on a rectangular grid. Each numbered cell specifies how many of its four sides belong to that loop. The package implements the grid model, validation, a constraint solver and a Shiny interface.

## What the solver sees

The R object stores horizontal edges in an $(n+1)\times m$ matrix and vertical edges in an $n\times(m+1)$ matrix. An edge is undecided (`0`), drawn (`1`) or crossed (`-1`). A blank clue imposes no cell constraint.

For every numbered cell, the number of drawn sides must equal its clue. At the end, every active node must have degree two, and the graph of drawn edges must be connected. **The local clue equations alone do not establish one loop.**

{{< sidenote id="slitherlink-topology" n="1" >}}
The final validator rejects the empty graph, checks degrees, then traverses the active graph by breadth-first search. See [`validation.R`, lines 56–130](https://github.com/marouanedaoudi/slitherlink-shiny/blob/a64660ef4eecb22d16721c3a4b8065c041c140ea/R/validation.R#L56).
{{< /sidenote >}}

## Four deductions, in source order

The walkthrough uses `easy_3x3` and `medium_4x4` from the package’s puzzle library. It ports the R implementation to browser JavaScript and records each changed segment. Coordinates in the explanation are one-based, as in R. Lines mean drawn edges; crosses mean excluded edges.

{{< explorable "slitherlink" >}}

For a cell, write $d$ for drawn sides, $u$ for undecided sides and $c$ for the clue. The implementation makes exactly these deductions:

1. If $d=c$, cross every undecided side.
2. If $d+u=c$, draw every undecided side.
3. At a node of degree two, cross all remaining incident edges.
4. At a node with one drawn edge and exactly one undecided edge, draw that edge.

Each pass visits cells row by row, with sides ordered top, bottom, left, right. It then visits nodes row by row, with incident edges ordered left, right, up, down when present. The original code checks contradictions after a complete cell-and-node pass and repeats until the state stops changing.

## When deductions stop

{{< algorithm title="Propagation and backtracking" n="1" input="Clues $c_{ij}$ and partial assignment $e_{uv}\in\{-1,0,1\}$." output="First assignment $e$ satisfying clues and the single-loop test, or failure." >}}
1. Apply the cell rules, then the node rules, until a contradiction or a fixed point.
2. Reject a contradictory state. If all clues and the connected-loop test pass, return it.
3. Among numbered cells with free sides, minimize $u-(c-d)$; choose its first free side in source order.
4. Try that side drawn (`1`) and recurse.
5. On failure, restore the parent state, try crossed (`-1`) and recurse.
6. If both branches fail, return failure to the parent.
{{< /algorithm >}}

When no numbered cell has a free side, selection falls back to the first undecided horizontal edge, then the first undecided vertical edge. The 4×4 example includes an actual rejected hypothesis and a return to its parent state.

## Validation and limits

The contradiction checks prune cells that exceed or cannot reach their clues, nodes of degree greater than two, and a closed component containing fewer than all drawn edges. For that last check, the code inspects the component reached from the **first active node**. It does not implement every possible Slitherlink deduction; final validation still checks the whole active graph.

`solve_grid()` returns the first solution found. It does **not** prove that a puzzle has only one solution. The random generator separately calls `count_solutions(..., max = 2)` and rejects a candidate unless the returned count is one. The visual trace demonstrates the solver, rather than reproducing the entire Shiny application or its generator.

## Source

This explanation follows commit [`a64660ef`](https://github.com/marouanedaoudi/slitherlink-shiny/tree/a64660ef4eecb22d16721c3a4b8065c041c140ea): [`grid.R`](https://github.com/marouanedaoudi/slitherlink-shiny/blob/a64660ef4eecb22d16721c3a4b8065c041c140ea/R/grid.R#L8), [`solver.R`, rules and search](https://github.com/marouanedaoudi/slitherlink-shiny/blob/a64660ef4eecb22d16721c3a4b8065c041c140ea/R/solver.R#L149), and [`puzzles.R`, source grids](https://github.com/marouanedaoudi/slitherlink-shiny/blob/a64660ef4eecb22d16721c3a4b8065c041c140ea/R/puzzles.R#L15).
