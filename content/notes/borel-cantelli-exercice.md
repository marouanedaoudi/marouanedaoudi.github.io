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
soient convergentes. Démontrer que la série $\sum\_{n \in \mathbb{N}}X\_n$ est $p.s$ convergente.
{{< /alert >}}

## Ma solution :

Il est évident d'utiliser le lemme de Borel-Cantelli ici.
Comme $\sum\_{n \in \mathbb{N}}P(X\_n \neq a\_n)<+\infty$, alors $P(\limsup\_{n \rightarrow +\infty}\\{X\_n \neq a\_n\\})=0$.

Cela signifie que l'ensemble des $\omega \in \Omega$ tel que $X\_n(\omega) \neq a\_n$ pour une infinité de $n$ est de mesure nulle. Par conséquent, pour presque tout $\omega \in \Omega$, il existe un rang $N(\omega) \in \mathbb{N}$ tel que pour tout $n \geq N(\omega)$, on a $X\_n=a\_n$.

Donc :
$$\sum\_{n \in \mathbb{N}}X\_n=\sum\_{n <N}X\_n+\sum\_{n \geq N}a\_n<+\infty$$

Car $\sum\_{n <N}X\_n$ est une somme finie de réels et donc elle est finie presque sûrement.
Ce qui conclut. $\blacksquare$