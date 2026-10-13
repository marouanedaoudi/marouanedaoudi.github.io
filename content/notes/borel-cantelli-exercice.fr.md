---
title: "Exercice : Convergence presque sûre et Borel-Cantelli"
date: 2025-02-14
lastmod: 2026-10-14
tags: ["Borel-Cantelli", "Convergence presque sûre"]
math: true
summary: "Convergence presque sûre d’une série de variables aléatoires par le premier lemme de Borel-Cantelli."
description: "Exercice corrigé : déduire la convergence presque sûre d’une série lorsque les écarts à une série déterministe convergente sont sommables en probabilité."
---

{{< alert icon="circle-info" >}}
**Énoncé :**
Soit $(X_n)_{n \in \mathbb{N}}$ une suite de variables aléatoires réelles sur un espace probabilisé $(\Omega, \mathcal{A}, P)$. On suppose qu'il existe une suite de réels $(a_n)_{n \in \mathbb{N}}$ telle que les séries
$$\sum_{n \in \mathbb{N}}a_n \quad \text{et} \quad \sum_{n \in \mathbb{N}}P(X_n \neq a_n)$$
soient convergentes. Démontrer que la série $\sum_{n \in \mathbb{N}}X_n$ est p.s. convergente.
{{< /alert >}}

## Ma solution :

La convergence de $\sum P(X_n \neq a_n)$ oriente naturellement vers le lemme de Borel-Cantelli.
Comme $\sum_{n \in \mathbb{N}}P(X_n \neq a_n)<+\infty$, alors $P(\limsup_{n \rightarrow +\infty}\{X_n \neq a_n\})=0$.

Cela signifie que l'ensemble des $\omega \in \Omega$ tel que $X_n(\omega) \neq a_n$ pour une infinité de $n$ est de mesure nulle. Par conséquent, pour presque tout $\omega \in \Omega$, il existe un rang $N(\omega) \in \mathbb{N}$ tel que pour tout $n \geq N(\omega)$, on a $X_n=a_n$.

Donc, pour presque tout $\omega$, en décomposant la série au rang $N(\omega)$ :
$$\sum_{n \in \mathbb{N}}X_n(\omega)=\sum_{n < N(\omega)}X_n(\omega)+\sum_{n \geq N(\omega)}a_n$$

Le premier terme est une somme finie de réels, donc fini. Le second converge car $\sum_{n \in \mathbb{N}}a_n$ est convergente par hypothèse, donc son reste $\sum_{n \geq N}a_n$ tend vers $0$ et est en particulier bien défini. La série $\sum_{n \in \mathbb{N}}X_n$ est donc p.s. convergente. $\blacksquare$