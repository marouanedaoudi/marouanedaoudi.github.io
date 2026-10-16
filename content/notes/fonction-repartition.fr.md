---
title: "Continuité de la fonction de répartition"
date: 2025-02-14
tags: ["Fonction de répartition", "Mesure"]
math: true
summary: "Le saut d’une fonction de répartition en un point est égal à la masse de probabilité portée par ce point."
description: "Continuité d’une fonction de répartition : le saut en un point est égal à la masse de probabilité portée par ce point."
lastmod: "2026-10-15"
subject: "Théorie de la mesure"
figures: ["math-notes"]
mathFigure: "cdf"
---

{{< statement kind="proposition" id="statement" >}}
Soient $p$ une probabilité sur $\mathcal{B}(\mathbb{R})$ et $F$ la fonction de répartition de $p$, et soit $a \in \mathbb{R}$. Montrer que $F$ est continue en $a$ si et seulement si $p(\{a\})=0$. En déduire que $F$ est continue sur $\mathbb{R}$ si $p$ ne charge pas les points.
{{< /statement >}}

## Illustration

{{< explorable "math-notes" >}}

## Démonstration

{{< proof-start >}}

 Par théorème, la fonction de répartition $F$ est continue à droite. Étudions sa limite à gauche.
Choisissons $a_n=a-1/(n+1)$ : on a $a_n<a$ pour tout $n$ et $a_n\uparrow a$.
Alors

$$ \bigcup_{n \in \mathbb{N}} ]-\infty,a_n]=]-\infty,a[ $$


{{< sidenote id="cdf-1" n="1" >}}
L’union exclut $a$ : tous les $a_n$ sont strictement inférieurs à $a$. C’est précisément la différence entre $F(a-)$ et $F(a)$.
{{< /sidenote >}}

Donc, par continuité croissante de la mesure,

$$ \lim\limits_{n \rightarrow +\infty} F(a_n)=\lim\limits_{n \rightarrow +\infty}p(]-\infty,a_n])=p(]-\infty,a[) $$


{{< sidenote id="cdf-2" n="2" >}}
La continuité à droite se prouve séparément : si $b_n\downarrow a$, les ensembles $(-\infty,b_n]$ décroissent vers $(-\infty,a]$. La mesure totale est finie.
{{< /sidenote >}}

La décomposition en union disjointe donne

$$
F(a)=p((-\infty,a])=p((-\infty,a))+p(\{a\}),
$$


donc $F(a)-F(a-)=p(\{a\})$. Ainsi $F$ est continue à gauche en $a$ si et seulement si $p(\{a\})=0$. Comme elle est continue à droite, cette condition équivaut à la continuité en $a$. Si $p$ ne charge aucun point, $F$ est continue sur tout $\mathbb R$.

{{< proof-end >}}
