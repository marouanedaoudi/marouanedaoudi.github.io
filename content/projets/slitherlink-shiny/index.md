---
title: "Slitherlink Shiny"
date: 2026-03-31
description: "Package R pour jouer et résoudre des puzzles Slitherlink, avec une interface interactive Shiny et un solveur par propagation de contraintes."
summary: "Package R implémentant un solveur de Slitherlink (propagation de contraintes + backtracking) et une application Shiny interactive avec système d'indices, d'annulation et de validation en temps réel."
tags: ["R", "Shiny", "Optimisation", "Contraintes"]
---

## Présentation

**Slitherlink** est un puzzle logique de contraintes : il s'agit de relier des points sur une grille pour former une **boucle fermée unique**, en respectant les chiffres indiqués dans chaque cellule (chaque chiffre indique combien de ses quatre côtés font partie de la boucle).

Ce projet propose un package R complet pour jouer et résoudre ce puzzle, articulé autour de deux composantes : un **solveur algorithmique** et une **interface interactive Shiny**.

Le code source est disponible sur [GitHub](https://github.com/marouanedaoudi/slitherlink-shiny).

## Fonctionnement du solveur

### Modélisation

Une grille $n \times m$ définit :
- $(n+1) \times (m+1)$ **nœuds** (les points de la grille),
- $n \times (m+1)$ **segments horizontaux** et $(n+1) \times m$ **segments verticaux**,
- $n \times m$ **cellules**, chacune associée à une contrainte $c_{i,j} \in \{0, 1, 2, 3, \text{vide}\}$.

Chaque segment $s$ a un état $x_s \in \{0, 1\}$ (absent ou présent). La solution vérifie :

$$
\forall (i,j),\; \sum_{s \in \partial(i,j)} x_s = c_{i,j}
$$

et forme une boucle simple connexe (chaque nœud appartenant à la boucle a exactement degré 2).

### Algorithme : propagation de contraintes + backtracking

Le solveur procède en deux phases :

1. **Propagation de contraintes** — À chaque itération, pour chaque cellule, on déduit l'état de certains segments à partir de son chiffre et du nombre de segments déjà fixés. Par exemple, une cellule `0` force tous ses segments à être absents ; une cellule `3` avec un segment absent force les trois autres à être présents. On répète jusqu'à stabilisation.

2. **Backtracking** — Si la propagation seule ne suffit pas, on choisit un segment indéterminé, on lui assigne une valeur, et on relance la propagation. En cas de contradiction, on revient en arrière.

```r
solve_slitherlink <- function(grid) {
  repeat {
    changed <- propagate_constraints(grid)
    if (!changed) break
  }
  if (is_solved(grid)) return(grid)
  # Backtracking sur le premier segment indéterminé
  seg <- find_undecided(grid)
  for (val in c(1, 0)) {
    candidate <- set_segment(grid, seg, val)
    result <- solve_slitherlink(candidate)
    if (!is.null(result)) return(result)
  }
  return(NULL)
}
```

## Application Shiny

L'interface propose :

- **Sélection de puzzle** — bibliothèque intégrée avec niveaux facile (3×3), moyen (4×4) et difficile (5×5), ainsi qu'une génération aléatoire de grilles résolubles.
- **Interaction** — clic sur un segment pour basculer entre les états vide → tracé → barré.
- **Validation en temps réel** — vérification immédiate des contraintes de cellule et de la topologie de la boucle.
- **Système d'indices** — révèle progressivement un segment correct.
- **Annulation** — historique des coups avec retour arrière.
- **Résolution automatique** — lance le solveur et affiche la solution.

## Tests

Le package inclut **72 tests unitaires** couvrant la logique de grille, la propagation de contraintes, la validation de boucle et la génération de puzzles.
