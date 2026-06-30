---
title: "Slitherlink Shiny"
date: 2026-03-31
weight: 3
description: "Package R pour jouer et résoudre des puzzles Slitherlink, avec une interface interactive Shiny et un solveur par propagation de contraintes."
summary: "Package R complet pour modéliser, valider, générer et résoudre des grilles de Slitherlink, accompagné d'une application Shiny interactive."
tags: ["R", "Shiny", "Contraintes", "Backtracking"]
math: true
---

![Démonstration Slitherlink Shiny](feature.gif)

## Vue d'ensemble

Ce projet est un **package R jouable et testable** autour du puzzle Slitherlink. Il fournit trois couches :

- un modèle de grille (`slitherlink_grid`) basé sur deux matrices de segments horizontaux et verticaux ;
- un moteur de validation qui vérifie à la fois les contraintes locales des cellules et la topologie de la boucle ;
- une application Shiny permettant de jouer, demander un indice, annuler un coup, générer une grille aléatoire ou afficher la solution.

L'objectif n'était pas seulement de produire une interface de jeu, mais de transformer un puzzle logique en petit système algorithmique propre : représentation explicite, invariants vérifiables, solveur réutilisable et documentation pkgdown.

## Le puzzle

**Slitherlink** est un puzzle logique japonais : sur une grille de points $(n+1) \times (m+1)$, il faut relier des points adjacents pour former une **boucle fermée unique** — sans branchement, sans croisement, sans impasse. Les chiffres inscrits dans les cellules contraignent le nombre de leurs côtés appartenant à la boucle.

Ce qui semble simple en surface cache une structure combinatoire riche. Une grille $n \times m$ compte $n(m+1) + m(n+1) = 2nm + n + m$ segments, chacun pouvant être tracé ou non — l'espace de recherche brut est donc de taille $2^{2nm+n+m}$. Les indices réduisent cet espace, parfois jusqu'à une solution unique.

## Modélisation

Dans le package, une grille contient :

| Champ | Dimension | Rôle |
|---|---:|---|
| `clues` | $n \times m$ | chiffres des cellules, avec `NA` pour les cellules non contraintes |
| `seg_h` | $(n+1) \times m$ | états des segments horizontaux |
| `seg_v` | $n \times (m+1)$ | états des segments verticaux |

Chaque segment prend la valeur `0` (vide), `1` (tracé) ou `-1` (barré). Pour l'analyse mathématique, on associe à chaque segment résolu une variable $x_s \in \{0, 1\}$. Les contraintes de cellule s'écrivent :

$$
\forall (i,j),\quad \sum_{s \in \partial(i,j)} x_s = c_{i,j}
$$

où $\partial(i,j)$ désigne les quatre segments bordant la cellule $(i,j)$. Ces contraintes locales sont nécessaires mais pas suffisantes : la solution doit aussi former une **boucle simple**. Formellement, en notant $G = (V, E)$ le graphe dont les sommets sont les nœuds de la grille et les arêtes les segments tracés ($x_s = 1$), on exige :

$$
\forall v \in V,\quad \deg_G(v) \in \{0, 2\} \quad \text{et} \quad G \text{ est connexe sur } \{v : \deg_G(v) > 0\}
$$

La condition de degré $\{0,2\}$ garantit l'absence de branchement et d'impasse ; la connexité assure l'unicité de la boucle.

## Moteur de résolution

Le solveur combine **propagation de contraintes**, règles de degré sur les nœuds, détection de contradictions et backtracking.

Pour chaque cellule $(i,j)$, notons $k$ le nombre de segments déjà tracés ($x_s = 1$) et $u$ le nombre de segments encore indéterminés parmi ses quatre bords. La contrainte $\sum_{s \in \partial(i,j)} x_s = c_{i,j}$ permet de déduire :

- si $k = c_{i,j}$ : les $u$ segments indéterminés sont tous forcés à $0$,
- si $k + u = c_{i,j}$ : les $u$ segments indéterminés sont tous forcés à $1$.

Ces déductions sont complétées par des règles sur les nœuds : un nœud qui a déjà deux segments tracés force les autres segments incidents à être barrés ; un nœud avec un segment tracé et une seule possibilité restante force cette dernière arête. Le solveur répète ces règles jusqu'à atteindre un point fixe.

Si la propagation ne suffit pas, le backtracking choisit un segment indéterminé proche d'une cellule fortement contrainte, essaie `1`, propage, puis essaie `-1` en cas d'échec. Les contradictions sont coupées tôt :

- une cellule dépasse déjà son indice ;
- une cellule ne peut plus atteindre son indice avec les segments restants ;
- un nœud atteint un degré supérieur à 2 ;
- une boucle fermée prématurée apparaît alors que d'autres segments sont déjà tracés ailleurs.

Cette séparation entre propagation, contradiction et recherche rend le solveur utilisable aussi bien dans l'interface que depuis une session R :

```r
g <- get_puzzle("medium_4x4")
sol <- solve_grid(g)
is_solved(sol)
```

## Validation et génération

La validation topologique repose sur un parcours du graphe des segments tracés. Le package vérifie simultanément :

1. que chaque nœud actif a un degré exactement égal à 2 ;
2. que tous les nœuds actifs appartiennent à une seule composante connexe ;
3. que les indices sont exactement respectés en mode strict.

Le générateur aléatoire construit d'abord une région connexe de cellules, transforme sa frontière en boucle candidate, en déduit les indices, puis rejette les grilles qui n'ont pas une solution unique. C'est ce qui permet au bouton **Generate Random** de produire des instances jouables plutôt que de simples grilles arbitraires.

## Interface Shiny

Le package inclut une interface interactive permettant de jouer, d'explorer et de résoudre les puzzles en temps réel. L'état de chaque segment bascule au clic (vide → tracé → barré), la validité des contraintes est vérifiée à chaque coup, et un chronomètre mesure le temps de résolution. Un système d'indices révèle un segment correct à la demande ; le solveur peut intervenir à tout moment pour afficher la solution complète.

Les contrôles principaux couvrent le cycle de jeu complet :

| Action | Effet |
|---|---|
| `New Game` | charge une grille depuis la bibliothèque intégrée |
| `Reset` | remet à zéro la grille courante |
| `Solve` | affiche la solution complète |
| `Hint` | révèle un segment correct |
| `Undo` | annule la dernière action |
| `Generate Random` | crée une grille aléatoire résoluble |

## Qualité logicielle

Le dépôt suit une structure de package R standard : code dans `R/`, application dans `inst/shiny/`, documentation dans `man/` et `vignettes/`, tests dans `tests/testthat/`. La suite de tests couvre les primitives de grille, la validation, le solveur et la génération de puzzles.

---

**Documentation :** [marouanedaoudi.github.io/slitherlink-shiny](https://marouanedaoudi.github.io/slitherlink-shiny/) · **Code source :** [GitHub](https://github.com/marouanedaoudi/slitherlink-shiny)
