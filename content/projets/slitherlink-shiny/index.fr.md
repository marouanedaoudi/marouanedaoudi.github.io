---
title: "Slitherlink Shiny"
date: 2026-03-31
lastmod: 2026-10-15
weight: 3
description: "Un package R pour Slitherlink : propagation de contraintes, retour arrière et validation de boucle, avec une trace interactive issue du code."
summary: "Suivre le solveur R, des déductions locales à une boucle valide."
tags: ["R", "Shiny", "Contraintes", "Backtracking"]
math: true
figures: ["slitherlink"]
code: "https://github.com/marouanedaoudi/slitherlink-shiny"
docs: "https://marouanedaoudi.github.io/slitherlink-shiny/"
projectType: "Package R et algorithmes"
preview: "slitherlink"
---

Slitherlink consiste à tracer une boucle fermée unique sur une grille rectangulaire. Chaque cellule numérotée indique combien de ses quatre côtés appartiennent à la boucle. Le package réunit un modèle de grille, une validation, un solveur de contraintes et une interface Shiny.

## Ce que voit le solveur

L’objet R conserve les segments horizontaux dans une matrice $(n+1)\times m$ et les verticaux dans une matrice $n\times(m+1)$. Un segment est indécis (`0`), tracé (`1`) ou exclu (`-1`). Une cellule sans indice n’impose pas de contrainte locale.

Autour de chaque cellule numérotée, le nombre de côtés tracés doit égaler l’indice. À la fin, chaque sommet actif doit avoir degré deux et le graphe des segments tracés doit être connexe. **Satisfaire les indices locaux ne suffit pas à former une boucle unique.**

{{< sidenote id="slitherlink-topology" n="1" >}}
La validation finale rejette le graphe vide, vérifie les degrés, puis parcourt le graphe actif en largeur. Voir [`validation.R`, lignes 56–130](https://github.com/marouanedaoudi/slitherlink-shiny/blob/a64660ef4eecb22d16721c3a4b8065c041c140ea/R/validation.R#L56).
{{< /sidenote >}}

## Quatre déductions, dans l’ordre du code

La figure utilise `easy_3x3` et `medium_4x4`, deux grilles de la bibliothèque du package. Elle porte l’implémentation R en JavaScript et enregistre chaque segment modifié. Les coordonnées affichées commencent à un, comme en R. Les traits sont des segments tracés ; les croix indiquent les segments exclus.

{{< explorable "slitherlink" >}}

Pour une cellule, notons $d$ le nombre de côtés tracés, $u$ le nombre de côtés indécis et $c$ l’indice. L’implémentation applique exactement ces déductions :

1. Si $d=c$, exclure tous les côtés indécis.
2. Si $d+u=c$, tracer tous les côtés indécis.
3. À un sommet de degré deux, exclure les autres segments incidents.
4. À un sommet avec un segment tracé et un seul segment encore indécis, tracer ce dernier.

Chaque passe parcourt les cellules ligne par ligne, avec l’ordre haut, bas, gauche, droite pour leurs côtés. Elle parcourt ensuite les sommets ligne par ligne, avec l’ordre gauche, droite, haut, bas pour les segments présents. Le code vérifie les contradictions après la passe complète, puis recommence jusqu’au point fixe.

## Quand les déductions s’arrêtent

{{< algorithm title="Propagation et retour arrière" n="1" input="Indices $c_{ij}$ et état partiel $e_{uv}\in\{-1,0,1\}$." output="Premier état $e$ validant les indices et la boucle unique, ou échec." >}}
1. Appliquer les règles des cellules puis des sommets jusqu’à une contradiction ou un point fixe.
2. Rejeter une contradiction. Si les indices et le test de boucle connexe sont satisfaits, renvoyer l’état.
3. Parmi les cellules numérotées ayant des côtés libres, minimiser $u-(c-d)$ ; choisir son premier côté libre dans l’ordre du code.
4. Essayer ce segment tracé (`1`) et poursuivre récursivement.
5. En cas d’échec, restaurer l’état parent, essayer le segment exclu (`-1`) et poursuivre.
6. Si les deux branches échouent, remonter cet échec.
{{< /algorithm >}}

Lorsqu’aucune cellule numérotée n’a de côté libre, le choix se reporte sur le premier segment horizontal indécis, puis sur le premier vertical indécis. La grille 4×4 montre une hypothèse effectivement rejetée et la restauration de son état parent.

## Validation et limites

Les contradictions éliminent les cellules qui dépassent leur indice ou ne peuvent plus l’atteindre, les sommets de degré supérieur à deux et une composante fermée qui ne contient pas tous les segments tracés. Pour ce dernier test, le code examine la composante du **premier sommet actif**. Il n’implémente pas toutes les déductions connues de Slitherlink ; la validation finale vérifie néanmoins tout le graphe actif.

`solve_grid()` renvoie la première solution trouvée. Il ne prouve **pas** l’unicité de la solution d’une grille. Le générateur aléatoire appelle séparément `count_solutions(..., max = 2)` et rejette une candidate si le compte renvoyé n’est pas un. La trace illustre le solveur ; elle ne reproduit pas toute l’application Shiny ni son générateur.

## Source

Cette présentation suit le commit [`a64660ef`](https://github.com/marouanedaoudi/slitherlink-shiny/tree/a64660ef4eecb22d16721c3a4b8065c041c140ea) : [`grid.R`](https://github.com/marouanedaoudi/slitherlink-shiny/blob/a64660ef4eecb22d16721c3a4b8065c041c140ea/R/grid.R#L8), [`solver.R`, règles et recherche](https://github.com/marouanedaoudi/slitherlink-shiny/blob/a64660ef4eecb22d16721c3a4b8065c041c140ea/R/solver.R#L149) et [`puzzles.R`, grilles utilisées](https://github.com/marouanedaoudi/slitherlink-shiny/blob/a64660ef4eecb22d16721c3a4b8065c041c140ea/R/puzzles.R#L15).
