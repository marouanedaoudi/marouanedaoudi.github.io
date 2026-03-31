---
title: "Slitherlink Shiny"
date: 2026-03-31
description: "Package R pour jouer et résoudre des puzzles Slitherlink, avec une interface interactive Shiny et un solveur par propagation de contraintes."
summary: "Package R implémentant un solveur de Slitherlink (propagation de contraintes + backtracking) et une application Shiny interactive avec système d'indices, d'annulation et de validation en temps réel."
tags: ["R", "Shiny", "Optimisation", "Contraintes"]
math: true
---

## Le puzzle

**Slitherlink** est un puzzle logique japonais : sur une grille de points $( n+1) \times (m+1)$, il faut relier des points adjacents pour former une **boucle fermée unique** — sans branchement, sans croisement, sans impasse. Les chiffres inscrits dans les cellules contraignent le nombre de leurs côtés appartenant à la boucle.

Ce qui semble simple en surface cache une structure combinatoire riche. Une grille $5 \times 5$ sans aucun chiffre admet un nombre astronomique de boucles valides — les indices réduisent l'espace de recherche, parfois jusqu'à une solution unique.

## Modélisation

Une grille $n \times m$ définit :
- $n \times (m+1)$ **segments horizontaux** et $(n+1) \times m$ **segments verticaux**, chacun d'état $x_s \in \{0, 1\}$,
- $n \times m$ **cellules**, chacune portant une contrainte $c_{i,j} \in \{0,1,2,3\}$ ou nulle.

Le problème se formule comme un **système de contraintes entières** :

$$
\forall (i,j),\quad \sum_{s \in \partial(i,j)} x_s = c_{i,j}
$$

où $\partial(i,j)$ désigne les quatre segments bordant la cellule $(i,j)$. Ces contraintes locales sont nécessaires mais pas suffisantes : la solution doit aussi former une **boucle simple**, c'est-à-dire que chaque nœud appartenant à la boucle a exactement degré 2, et que l'ensemble des segments tracés est connexe.

## Résolution : propagation de contraintes + backtracking

Le solveur exploite la structure locale du puzzle avant de recourir à la recherche exhaustive.

### Propagation de contraintes

Pour chaque cellule, si le nombre de segments déjà tracés et le nombre de segments encore indéterminés permettent de conclure sur l'état des segments restants, on les fixe. Par exemple :

- une cellule $0$ force tous ses segments à $0$,
- une cellule $3$ avec un segment à $0$ force les trois autres à $1$,
- une cellule $c_{i,j}$ avec exactement $c_{i,j}$ segments à $1$ force le reste à $0$.

On itère jusqu'à stabilisation. Sur les puzzles bien conçus, cette phase seule suffit souvent à résoudre la grille — ou à réduire drastiquement l'espace de recherche.

### Backtracking

Quand la propagation bloque sur un segment indéterminé, on lui assigne une valeur, on relance la propagation, et on revient en arrière en cas de contradiction. La profondeur du backtracking est en pratique très faible grâce à l'efficacité de la propagation.

## Application Shiny

Le package inclut une interface interactive permettant de jouer, d'explorer et de résoudre les puzzles en temps réel. L'état de chaque segment bascule au clic (vide → tracé → barré), la validité des contraintes est vérifiée à chaque coup, et un chronomètre mesure le temps de résolution. Un système d'indices révèle un segment correct à la demande ; le solveur peut intervenir à tout moment pour afficher la solution complète.

---

**Documentation :** [marouanedaoudi.github.io/slitherlink-shiny](https://marouanedaoudi.github.io/slitherlink-shiny/) · **Code source :** [GitHub](https://github.com/marouanedaoudi/slitherlink-shiny)
