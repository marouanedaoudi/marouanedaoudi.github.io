---
title: "Slitherlink Shiny"
date: 2026-03-31
description: "Package R pour jouer et résoudre des puzzles Slitherlink, avec une interface interactive Shiny et un solveur par propagation de contraintes."
summary: "Package R implémentant un solveur de Slitherlink (propagation de contraintes + backtracking) et une application Shiny interactive avec système d'indices, d'annulation et de validation en temps réel."
tags: ["R", "Shiny", "Optimisation", "Contraintes"]
math: true
---

## Le puzzle

**Slitherlink** est un puzzle logique japonais : sur une grille de points $(n+1) \times (m+1)$, il faut relier des points adjacents pour former une **boucle fermée unique** — sans branchement, sans croisement, sans impasse. Les chiffres inscrits dans les cellules contraignent le nombre de leurs côtés appartenant à la boucle.

Ce qui semble simple en surface cache une structure combinatoire riche. Une grille $n \times m$ compte $n(m+1) + m(n+1) = 2nm + n + m$ segments, chacun pouvant être tracé ou non — l'espace de recherche brut est donc de taille $2^{2nm+n+m}$. Les indices réduisent cet espace, parfois jusqu'à une solution unique.

## Modélisation

On associe à chaque segment un état $x_s \in \{0, 1\}$. Les contraintes de cellule s'écrivent :

$$
\forall (i,j),\quad \sum_{s \in \partial(i,j)} x_s = c_{i,j}
$$

où $\partial(i,j)$ désigne les quatre segments bordant la cellule $(i,j)$. Ces contraintes locales sont nécessaires mais pas suffisantes : la solution doit aussi former une **boucle simple**. Formellement, en notant $G = (V, E)$ le graphe dont les sommets sont les nœuds de la grille et les arêtes les segments tracés ($x_s = 1$), on exige :

$$
\forall v \in V,\quad \deg_G(v) \in \{0, 2\} \quad \text{et} \quad G \text{ est connexe sur } \{v : \deg_G(v) > 0\}
$$

La condition de degré $\{0,2\}$ garantit l'absence de branchement et d'impasse ; la connexité assure l'unicité de la boucle.

## Résolution : propagation de contraintes + backtracking

### Propagation de contraintes

Pour chaque cellule $(i,j)$, notons $k$ le nombre de segments déjà tracés ($x_s = 1$) et $u$ le nombre de segments encore indéterminés parmi ses quatre bords. La contrainte $\sum_{s \in \partial(i,j)} x_s = c_{i,j}$ permet de déduire :

- si $k = c_{i,j}$ : les $u$ segments indéterminés sont tous forcés à $0$,
- si $k + u = c_{i,j}$ : les $u$ segments indéterminés sont tous forcés à $1$.

On propage ces déductions cellule par cellule, et on recommence tant qu'au moins un segment est fixé à chaque passe — c'est un point fixe du système de contraintes. Sur les puzzles bien construits, cette phase résout souvent la grille en totalité, ou ramène le nombre de segments indéterminés à une poignée.

### Backtracking

Lorsque la propagation atteint son point fixe sans avoir tout résolu, on se retrouve avec un sous-ensemble $\mathcal{U}$ de segments indéterminés. Le solveur choisit un $s^* \in \mathcal{U}$ et explore les deux branches $x_{s^*} = 1$ puis $x_{s^*} = 0$ en relançant la propagation à chaque fois. En cas de contradiction — une cellule dont les segments fixés excèdent déjà son chiffre, ou au contraire ne peuvent plus l'atteindre — on remonte.

L'arbre de recherche a une profondeur au plus $|\mathcal{U}|$, mais grâce à la propagation, chaque branchement fixe en cascade de nombreux autres segments : en pratique, le backtracking n'atteint jamais qu'une faible profondeur.

### Vérification de la topologie

La validation de boucle repose sur un **parcours en profondeur** du graphe $G$ des segments tracés. On vérifie simultanément que chaque nœud actif est de degré exactement $2$ et que le parcours depuis n'importe quel nœud actif visite exactement tous les nœuds actifs — ce qui est équivalent à dire que $G$ est un cycle hamiltonien sur ses propres sommets.

## Application Shiny

Le package inclut une interface interactive permettant de jouer, d'explorer et de résoudre les puzzles en temps réel. L'état de chaque segment bascule au clic (vide → tracé → barré), la validité des contraintes est vérifiée à chaque coup, et un chronomètre mesure le temps de résolution. Un système d'indices révèle un segment correct à la demande ; le solveur peut intervenir à tout moment pour afficher la solution complète.

---

**Documentation :** [marouanedaoudi.github.io/slitherlink-shiny](https://marouanedaoudi.github.io/slitherlink-shiny/) · **Code source :** [GitHub](https://github.com/marouanedaoudi/slitherlink-shiny)
