---
title: "Slitherlink Shiny"
date: 2026-03-31
weight: 3
description: "R package to play and solve Slitherlink puzzles, with an interactive Shiny interface and a constraint propagation solver."
summary: "Complete R package for modeling, validating, generating and solving Slitherlink grids, paired with an interactive Shiny app."
tags: ["R", "Shiny", "Constraints", "Backtracking"]
math: true
---

![Slitherlink Shiny demo](feature.gif)

## Overview

This project is a **playable and testable R package** built around the Slitherlink puzzle. It provides three layers:

- a grid model (`slitherlink_grid`) based on two matrices of horizontal and vertical segments;
- a validation engine that checks both local cell constraints and loop topology;
- a Shiny application for playing, requesting a hint, undoing a move, generating a random grid or revealing the solution.

The goal was not only to build a game interface, but to turn a logic puzzle into a small, clean algorithmic system: explicit representation, verifiable invariants, reusable solver and pkgdown documentation.

## The Puzzle

**Slitherlink** is a Japanese logic puzzle: on an $(n+1) \times (m+1)$ grid of dots, you must connect adjacent dots to form a **single closed loop** — no branching, no crossing, no dead ends. The numbers inside the cells constrain how many of their sides belong to the loop.

What appears simple on the surface hides a rich combinatorial structure. An $n \times m$ grid has $n(m+1) + m(n+1) = 2nm + n + m$ segments, each of which can be drawn or not — the raw search space is therefore of size $2^{2nm+n+m}$. The clues reduce this space, sometimes down to a unique solution.

## Modeling

In the package, a grid contains:

| Field | Dimension | Role |
|---|---:|---|
| `clues` | $n \times m$ | cell clues, with `NA` for unconstrained cells |
| `seg_h` | $(n+1) \times m$ | horizontal segment states |
| `seg_v` | $n \times (m+1)$ | vertical segment states |

Each segment has value `0` (empty), `1` (drawn) or `-1` (crossed). For the mathematical analysis, each resolved segment is assigned a variable $x_s \in \{0, 1\}$. The cell constraints are written:

$$
\forall (i,j),\quad \sum_{s \in \partial(i,j)} x_s = c_{i,j}
$$

where $\partial(i,j)$ denotes the four segments bordering cell $(i,j)$. These local constraints are necessary but not sufficient: the solution must also form a **simple loop**. Formally, letting $G = (V, E)$ be the graph whose vertices are the grid nodes and whose edges are the drawn segments ($x_s = 1$), we require:

$$
\forall v \in V,\quad \deg_G(v) \in \{0, 2\} \quad \text{and} \quad G \text{ is connected on } \{v : \deg_G(v) > 0\}
$$

The degree condition $\{0,2\}$ rules out branching and dead ends; connectivity ensures the uniqueness of the loop.

## Solver Engine

The solver combines **constraint propagation**, node-degree rules, contradiction detection and backtracking.

For each cell $(i,j)$, let $k$ be the number of segments already drawn ($x_s = 1$) and $u$ the number of still-undetermined segments among its four borders. The constraint $\sum_{s \in \partial(i,j)} x_s = c_{i,j}$ allows us to deduce:

- if $k = c_{i,j}$: the $u$ undetermined segments are all forced to $0$,
- if $k + u = c_{i,j}$: the $u$ undetermined segments are all forced to $1$.

These deductions are complemented by node rules: a node that already has two drawn segments forces all other incident segments to be crossed; a node with one drawn segment and a single remaining possibility forces that last edge. The solver repeats these rules until it reaches a fixed point.

If propagation is not enough, backtracking selects an undetermined segment near a highly constrained cell, tries `1`, propagates, then tries `-1` on failure. Contradictions are pruned early:

- a cell already exceeds its clue;
- a cell can no longer reach its clue with the remaining free segments;
- a node reaches degree greater than 2;
- a premature closed loop appears while other drawn segments exist elsewhere.

This separation between propagation, contradiction handling and search makes the solver usable both in the app and from an R session:

```r
g <- get_puzzle("medium_4x4")
sol <- solve_grid(g)
is_solved(sol)
```

## Validation and Generation

Topology validation traverses the graph of drawn segments. The package checks:

1. every active node has degree exactly 2;
2. all active nodes belong to a single connected component;
3. clues are exactly satisfied in strict mode.

The random generator first builds a connected region of cells, turns its boundary into a candidate loop, derives the clues, then rejects grids that do not have a unique solution. This is what lets the **Generate Random** button create playable instances instead of arbitrary grids.

## Shiny App

The package includes an interactive interface for playing, exploring and solving puzzles in real time. Each segment state toggles on click (empty → drawn → crossed), constraint validity is checked after every move, and a timer tracks solving time. A hint system reveals a correct segment on demand; the solver can step in at any moment to display the full solution.

The main controls cover the full play cycle:

| Action | Effect |
|---|---|
| `New Game` | loads a grid from the built-in library |
| `Reset` | resets the current grid |
| `Solve` | displays the complete solution |
| `Hint` | reveals one correct segment |
| `Undo` | reverts the previous action |
| `Generate Random` | creates a solvable random grid |

## Software Quality

The repository follows a standard R package structure: code in `R/`, app in `inst/shiny/`, documentation in `man/` and `vignettes/`, tests in `tests/testthat/`. The test suite covers grid primitives, validation, the solver and puzzle generation.

---

**Documentation:** [marouanedaoudi.github.io/slitherlink-shiny](https://marouanedaoudi.github.io/slitherlink-shiny/) · **Source code:** [GitHub](https://github.com/marouanedaoudi/slitherlink-shiny)
