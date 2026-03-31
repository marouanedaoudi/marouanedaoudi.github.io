---
title: "Exercice : Convergence p.s. et Borel-Cantelli"
date: 2025-02-14
tags: ["Borel-Cantelli", "Convergence p.s."]
math: true
summary: "Utilisation évidente du lemme de Borel-Cantelli."
---

{{< alert icon="circle-info" >}}
**Énoncé :**
Soit $(X\_n)\_{n \in \mathbb{N}}$ une suite de variables aléatoires réelles sur un espace probabilisé $(\Omega, \mathcal{A}, P)$. On suppose qu'il existe une suite de réels $(a\_n)\_{n \in \mathbb{N}}$ telle que les séries
$$\sum\_{n \in \mathbb{N}}a\_n \quad \text{et} \quad \sum\_{n \in \mathbb{N}}P(X\_n \neq a\_n)$$
soient convergentes. Démontrer que la série $\sum\_{n \in \mathbb{N}}X\_n$ est p.s. convergente.
{{< /alert >}}

## Ma solution :

La convergence de $\sum P(X\_n \neq a\_n)$ oriente naturellement vers le lemme de Borel-Cantelli.
Comme $\sum\_{n \in \mathbb{N}}P(X\_n \neq a\_n)<+\infty$, alors $P(\limsup\_{n \rightarrow +\infty}\{X\_n \neq a\_n\})=0$.

Cela signifie que l'ensemble des $\omega \in \Omega$ tel que $X\_n(\omega) \neq a\_n$ pour une infinité de $n$ est de mesure nulle. Par conséquent, pour presque tout $\omega \in \Omega$, il existe un rang $N(\omega) \in \mathbb{N}$ tel que pour tout $n \geq N(\omega)$, on a $X\_n=a\_n$.

Donc, pour presque tout $\omega$, en décomposant la série au rang $N(\omega)$ :
$$\sum\_{n \in \mathbb{N}}X\_n(\omega)=\sum\_{n < N(\omega)}X\_n(\omega)+\sum\_{n \geq N(\omega)}a\_n$$

Le premier terme est une somme finie de réels, donc fini. Le second converge car $\sum\_{n \in \mathbb{N}}a\_n$ est convergente par hypothèse, donc son reste $\sum\_{n \geq N}a\_n$ tend vers $0$ et est en particulier bien défini. La série $\sum\_{n \in \mathbb{N}}X\_n$ est donc p.s. convergente. $\blacksquare$