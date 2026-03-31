---
title: "Slitherlink Shiny"
date: 2026-03-31
description: "Package R pour jouer et résoudre des puzzles Slitherlink, avec une interface interactive Shiny et un solveur par propagation de contraintes."
summary: "Package R implémentant un solveur de Slitherlink (propagation de contraintes + backtracking) et une application Shiny interactive avec système d'indices, d'annulation et de validation en temps réel."
tags: ["R", "Shiny", "Optimisation", "Contraintes"]
---

## Le puzzle

**Slitherlink** est un puzzle logique japonais joué sur une grille de points. L'objectif est de relier des points adjacents pour former une **boucle fermée unique** — sans branchement, sans croisement, sans impasse. Les chiffres dans les cellules indiquent exactement combien de leurs quatre côtés appartiennent à la boucle.


## Package R

Le package `slitherlinkshiny` s'installe depuis GitHub :

```r
devtools::install_github("marouanedaoudi/slitherlink-shiny")
```

### API principale

**Gestion des grilles**
```r
init_grid(clues)                         # construire une grille depuis une matrice de chiffres
get_puzzle("medium_4x4")                 # charger un puzzle intégré
random_puzzle(n = 5, m = 5, seed = 42)  # générer un puzzle aléatoire résolvable
list_puzzles()                           # lister la bibliothèque intégrée
```

**Manipulation & validation**
```r
toggle_segment(g, type = "h", i = 1, j = 1)  # basculer un segment
check_clues(g)                                 # vérifier qu'aucune contrainte n'est dépassée
check_clues(g, strict = TRUE)                  # vérifier que toutes les contraintes sont satisfaites
check_loop(g)                                  # vérifier que les segments forment une boucle unique
is_solved(g)                                   # solution complète ?
```

**Résolution**
```r
solve_grid(g)  # solveur automatique (NULL si aucune solution)
```

### Représentation interne

Chaque objet grille contient trois matrices :

| Matrice | Dimensions | Contenu |
|---------|-----------|---------|
| `clues` | $n \times m$ | chiffres des cellules (`NA` = sans contrainte) |
| `seg_h` | $(n+1) \times m$ | segments horizontaux |
| `seg_v` | $n \times (m+1)$ | segments verticaux |

Les segments prennent la valeur `0` (vide), `1` (tracé) ou `-1` (barré).

## Solveur

Le solveur combine deux stratégies :

1. **Propagation de contraintes** — pour chaque cellule, on déduit l'état des segments à partir du chiffre et des segments déjà fixés (ex. cellule `0` : tous ses segments sont forcés à vide ; cellule `3` avec un segment absent : les trois autres sont forcés à tracé). On répète jusqu'à stabilisation.

2. **Backtracking** — si la propagation seule bloque, on fixe un segment indéterminé, on relance la propagation, et on revient en arrière en cas de contradiction.

```r
solve_grid <- function(g) {
  repeat {
    changed <- propagate_constraints(g)
    if (!changed) break
  }
  if (is_solved(g)) return(g)
  seg <- find_undecided(g)
  for (val in c(1L, 0L)) {
    result <- solve_grid(set_segment(g, seg, val))
    if (!is.null(result)) return(result)
  }
  NULL
}
```

## Application Shiny

Lancée via `run_app()`, l'interface propose :

- **Bibliothèque de puzzles** — niveaux facile (3×3), moyen (4×4) et difficile (5×5)
- **Génération aléatoire** — puzzles résolvables à la volée
- **Interaction directe** — clic sur un segment pour basculer entre vide → tracé → barré
- **Validation en temps réel** — statut affiché : *En cours*, *Contrainte violée* ou *Puzzle résolu !*
- **Chronomètre** — démarre au premier clic, se fige à la résolution
- **Indices progressifs** — révèle un segment correct à la demande
- **Annulation** — retour arrière coup par coup
- **Résolution automatique** — affiche la solution complète

## Tests

Le package inclut **72 tests unitaires** couvrant la logique de grille, la propagation de contraintes, la validation de boucle et la génération de puzzles.

---

**Documentation complète :** [marouanedaoudi.github.io/slitherlink-shiny](https://marouanedaoudi.github.io/slitherlink-shiny/) · **Code source :** [GitHub](https://github.com/marouanedaoudi/slitherlink-shiny)
