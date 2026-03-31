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

## Lemme préliminaire

Avant de prouver les deux lemmes, établissons deux inégalités générales qui seront utiles et qui constituent en elles-mêmes un analogue mesuré du lemme de Fatou.

Soient $n \in \mathbb{N}$ et $k \geq n$. On a $\bigcap\_{p \geq n}A\_p \subset A\_k$, donc $P(\bigcap\_{p \geq n}A\_p) \leq P(A\_k)$, et en passant à l'infimum sur $k \geq n$ :
$$P\!\left(\bigcap\_{k \geq n}A\_k\right) \leq \inf\_{k \geq n} P(A\_k)$$

La suite $\left(\bigcap\_{p \geq n}A\_p\right)\_{n \in \mathbb{N}}$ est croissante, donc par continuité croissante de $P$ :
$$ \lim\_{n \rightarrow +\infty}P\!\left(\bigcap\_{k \geq n}A\_k\right)=P\!\left(\bigcup\_{n \in \mathbb{N}}\bigcap\_{k \geq n}A\_k\right)\leq \liminf\_{n \rightarrow \infty} P(A\_n) $$

On obtient ainsi :
$$ \boxed{P(\liminf\_{n \rightarrow \infty}A\_n) \leq \liminf\_{n \rightarrow \infty}P(A\_n)} $$

Un raisonnement analogue sur les unions donne :
$$ \boxed{P(\limsup\_{n \rightarrow \infty}A\_n) \geq \limsup\_{n \rightarrow \infty}P(A\_n)} $$

## Preuve du lemme 1

Pour majorer $P(A) = P(\limsup A\_n)$, on utilise la $\sigma$-sous-additivité de $P$ plutôt que les inégalités ci-dessus, ce qui donne une borne explicite en fonction de la série.

Par $\sigma$-sous-additivité :
$$ P\!\left(\bigcup\_{k \geq n}A\_k\right) \leq \sum\_{k \geq n}P(A\_k) $$

La suite $\left(\bigcup\_{k \geq n}A\_k\right)\_{n \in \mathbb{N}}$ est décroissante, donc par continuité décroissante de $P$ :
$$ P(A) = P\!\left(\limsup\_{n \rightarrow +\infty}A\_n\right) = \lim\_{n \rightarrow +\infty}P\!\left(\bigcup\_{k \geq n}A\_k\right) \leq \lim\_{n \rightarrow +\infty}\sum\_{k \geq n}P(A\_k) = 0 $$

La dernière limite vaut $0$ car $\sum\_{n}P(A\_n) < +\infty$ par hypothèse, donc son reste tend vers $0$. Ainsi $\boxed{P(A)=0}$.

## Preuve du lemme 2

On sait que $P(A)=\lim\_{n \rightarrow +\infty}P(\bigcup\_{k \geq n}A\_k)$. Il suffit donc de montrer que $P(\bigcup\_{k \geq n}A\_k)=1$ pour tout $n \in \mathbb{N}$.

Soit $n \in \mathbb{N}$. Si $P(A\_k)=1$ pour un certain $k \geq n$, alors $P(\bigcup\_{k \geq n}A\_k) \geq P(A\_k) = 1$ et on conclut immédiatement.

Supposons maintenant que $P(A\_k) < 1$ pour tout $k \geq n$. On travaille sur le complémentaire :
$$ \left(\bigcup\_{k \geq n}A\_k\right)^c=\bigcap\_{k \geq n}A\_k^c $$

Par continuité décroissante de $P$ et indépendance des $(A\_k^c)\_{k\geq n}$ :
$$ P\!\left(\left(\bigcup\_{k \geq n}A\_k\right)^c\right) = \lim\_{m \rightarrow +\infty}P\!\left(\bigcap\_{k=n}^m A\_k^c\right) = \lim\_{m \rightarrow +\infty}\prod\_{k=n}^m P(A\_k^c) = \prod\_{k \geq n}(1-P(A\_k)) $$

Pour évaluer ce produit infini, on passe au logarithme. En utilisant $\ln(1+x) \leq x$ pour tout $x \in (-1, 0]$ (ce qui s'applique ici car $-P(A\_k) \in (-1, 0]$) :

$$ \ln\!\left(P\!\left(\left(\bigcup\_{k=n}^m A\_k\right)^c\right)\right) = \sum\_{k=n}^m \ln(1-P(A\_k)) \leq -\sum\_{k=n}^m P(A\_k) \xrightarrow[m \to +\infty]{} -\infty $$

car $\sum\_{n}P(A\_n)=+\infty$ par hypothèse. Donc $P\!\left(\left(\bigcup\_{k \geq n}A\_k\right)^c\right) = 0$ et $P(\bigcup\_{k \geq n}A\_k) = 1$.
D'où $\boxed{P(A)=1}$. $\blacksquare$
