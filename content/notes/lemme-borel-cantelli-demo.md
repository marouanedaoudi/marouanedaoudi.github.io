---
title: "Démonstration : Lemmes de Borel-Cantelli"
date: 2025-02-14
tags: ["Fondamental", "Borel-Cantelli", "Indépendance"]
math: true
summary: "Preuve complète des deux lemmes."
---

{{< alert icon="circle-info" >}}
***Énoncé :*** Soient $(E,\mathcal{T},P)$ un espace probabilisé et $(A\_n)\_{n \in \mathbb{N}}$ une suite d'éléments de $\mathcal{T}$.
On rappelle que $A=\limsup\_{n \rightarrow \infty}A\_n$.
1. Montrer que si $\sum\_{n \in \mathbb{N}}P(A\_n)< +\infty$ alors $P(A)=0$.
2. On suppose que, pour tout $n \in \mathbb{N}$, les événements $A\_0,...,A\_n$ sont indépendants. On suppose aussi que $\sum\_{n \in \mathbb{N}}P(A\_n)=+\infty$. Montrer que $P(A)=1$.
{{< /alert >}}

**1.** (On aura besoin de deux inégalités auxquelles il faut penser)
Soient $n \in \mathbb{N}$ et $k \geq n$.
On a
$$ \bigcap\_{p \geq n}A\_p \subset A\_k $$
Donc $P(\bigcap\_{p \geq n}A\_p) \leq P(A\_k)$
Ainsi, $P(\bigcap\_{k \geq n}A\_k) \leq \inf\_{k \geq n} P(A\_k)$

Or, $(\bigcap\_{p \geq n}A\_p)\_{n \in \mathbb{N}}$ est une suite croissante.
Donc, par passage à la limite,
$$ \lim\limits\_{n \rightarrow +\infty}P(\bigcap\_{k \geq n}A\_k)=P(\bigcup\_{n \in \mathbb{N}}\bigcap\_{k \geq n}A\_k)\leq \lim\_{n \rightarrow \infty}\inf\_{k \geq n} P(A\_k) $$

Donc
$$ \boxed{P(\liminf\_{n \rightarrow \infty}A\_n) \leq \liminf\_{n \rightarrow \infty}P(A\_n)} $$

De la même manière, on obtient
$$ \boxed{P(\limsup\_{n \rightarrow \infty}A\_n) \geq \limsup\_{n \rightarrow \infty}P(A\_n)} $$

Utilisons maintenant la $\sigma$-additivité de la probabilité,
$$ P(\bigcup\_{k \geq n}A\_k) \leq \sum\_{k \geq n}P(A\_k) $$
La suite $(\bigcup\_{k \geq n}A\_k)\_{n \in \mathbb{N}}$ est décroissante donc par passage à la limite, on a
$$ \lim\_{n \rightarrow +\infty}P(\bigcup\_{k \geq n}A\_k)=P(\bigcap\_{n \in \mathbb{N}}\bigcup\_{k \geq n}A\_k)=P(\limsup\_{n \rightarrow +\infty}A\_n)\leq \lim\_{n \rightarrow +\infty}\sum\_{k \geq n}P(A\_k)=0 $$
Donc $\boxed{P(A)=0}$

**2.** On sait que $P(A)=\lim\_{n \rightarrow +\infty}P(\bigcup\_{k \geq n}A\_k)$. Donc il suffit de montrer que $P(\bigcup\_{k \geq n}A\_k)=1$.
Soit $n \in \mathbb{N}$.
Supposons qu'il existe $k \geq n$ tel que $P(A\_k)=1$. Donc $P(\bigcup\_{k \geq n}A\_k) \geq P(A\_k)$. Donc $P(\bigcup\_{k \geq n}A\_k)=1$.
Maintenant supposons que pour tout $k \geq n$, $P(A\_k) < 1$. On a alors
$$ (\bigcup\_{k \geq n}A\_k)^c=\bigcap\_{k \geq n}A\_k^c $$

Donc
$$ P((\bigcup\_{k \geq n}A\_k)^c)=P(\bigcap\_{k \geq n}A\_k^c)=\prod\_{k \geq n}P(A\_k^c)=\prod\_{k \geq n}(1-P(A\_k)) $$

Soit $m \geq n$. En utilisant $\forall x>0$, $ln(1+x)<x$ et la continuité de $P$, on a
$$ \lim\_{m \rightarrow +\infty}ln(P((\bigcup\_{k=n}^mA\_k)^c))=\lim\_{m \rightarrow +\infty}\sum\_{k=n}^m ln(1-P(A\_k)) < -\lim\_{m \rightarrow +\infty} \sum\_{k=n}^m P(A\_k)=-\infty $$

Donc $\lim\_{m \rightarrow +\infty}ln(P((\bigcup\_{k=n}^mA\_k)^c))=-\infty$
Donc $P((\bigcup\_{k \geq n}A\_k)^c)=0$ et $P(\bigcup\_{k \geq n}A\_k)=1$.
D'où $\boxed{P(A)=1}$
