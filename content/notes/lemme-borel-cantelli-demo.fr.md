---
title: "Démonstration : Lemmes de Borel-Cantelli"
date: 2025-02-14
tags: ["Fondamental", "Borel-Cantelli", "Indépendance"]
math: true
summary: "Preuve complète des deux lemmes."
description: "Démonstrations des deux lemmes de Borel-Cantelli par continuité de la mesure, sommabilité des probabilités et indépendance."
lastmod: 2026-10-14
---

{{< alert icon="circle-info" >}}
***Énoncé :*** Soient $(E,\mathcal{T},P)$ un espace probabilisé et $(A_n)_{n \in \mathbb{N}}$ une suite d'éléments de $\mathcal{T}$.
On rappelle que $A=\limsup_{n \rightarrow \infty}A_n$.
1. Montrer que si $\sum_{n \in \mathbb{N}}P(A_n)< +\infty$ alors $P(A)=0$.
2. On suppose que, pour tout $n \in \mathbb{N}$, les événements $A_0,...,A_n$ sont indépendants. On suppose aussi que $\sum_{n \in \mathbb{N}}P(A_n)=+\infty$. Montrer que $P(A)=1$.
{{< /alert >}}

## Lemme préliminaire

Avant de prouver les deux lemmes, établissons deux inégalités générales qui seront utiles et qui constituent en elles-mêmes un analogue mesuré du lemme de Fatou.

Soient $n \in \mathbb{N}$ et $k \geq n$. On a $\bigcap_{p \geq n}A_p \subset A_k$, donc $P(\bigcap_{p \geq n}A_p) \leq P(A_k)$, et en passant à l'infimum sur $k \geq n$ :
$$P\!\left(\bigcap_{k \geq n}A_k\right) \leq \inf_{k \geq n} P(A_k)$$

La suite $\left(\bigcap_{p \geq n}A_p\right)_{n \in \mathbb{N}}$ est croissante, donc par continuité croissante de $P$ :
$$ \lim_{n \rightarrow +\infty}P\!\left(\bigcap_{k \geq n}A_k\right)=P\!\left(\bigcup_{n \in \mathbb{N}}\bigcap_{k \geq n}A_k\right)\leq \liminf_{n \rightarrow \infty} P(A_n) $$

On obtient ainsi :
$$ \boxed{P(\liminf_{n \rightarrow \infty}A_n) \leq \liminf_{n \rightarrow \infty}P(A_n)} $$

Un raisonnement analogue sur les unions donne :
$$ \boxed{P(\limsup_{n \rightarrow \infty}A_n) \geq \limsup_{n \rightarrow \infty}P(A_n)} $$

## Preuve du lemme 1

Pour majorer $P(A) = P(\limsup A_n)$, on utilise la $\sigma$-sous-additivité de $P$ plutôt que les inégalités ci-dessus, ce qui donne une borne explicite en fonction de la série.

Par $\sigma$-sous-additivité :
$$ P\!\left(\bigcup_{k \geq n}A_k\right) \leq \sum_{k \geq n}P(A_k) $$

La suite $\left(\bigcup_{k \geq n}A_k\right)_{n \in \mathbb{N}}$ est décroissante, donc par continuité décroissante de $P$ :
$$ P(A) = P\!\left(\limsup_{n \rightarrow +\infty}A_n\right) = \lim_{n \rightarrow +\infty}P\!\left(\bigcup_{k \geq n}A_k\right) \leq \lim_{n \rightarrow +\infty}\sum_{k \geq n}P(A_k) = 0 $$

La dernière limite vaut $0$ car $\sum_{n}P(A_n) < +\infty$ par hypothèse, donc son reste tend vers $0$. Ainsi $\boxed{P(A)=0}$.

## Preuve du lemme 2

On sait que $P(A)=\lim_{n \rightarrow +\infty}P(\bigcup_{k \geq n}A_k)$. Il suffit donc de montrer que $P(\bigcup_{k \geq n}A_k)=1$ pour tout $n \in \mathbb{N}$.

Soit $n \in \mathbb{N}$. Si $P(A_k)=1$ pour un certain $k \geq n$, alors $P(\bigcup_{k \geq n}A_k) \geq P(A_k) = 1$ et on conclut immédiatement.

Supposons maintenant que $P(A_k) < 1$ pour tout $k \geq n$. On travaille sur le complémentaire :
$$ \left(\bigcup_{k \geq n}A_k\right)^c=\bigcap_{k \geq n}A_k^c $$

Par continuité décroissante de $P$ et indépendance des $(A_k^c)_{k\geq n}$ :
$$ P\!\left(\left(\bigcup_{k \geq n}A_k\right)^c\right) = \lim_{m \rightarrow +\infty}P\!\left(\bigcap_{k=n}^m A_k^c\right) = \lim_{m \rightarrow +\infty}\prod_{k=n}^m P(A_k^c) = \prod_{k \geq n}(1-P(A_k)) $$

Pour évaluer ce produit infini, on passe au logarithme. En utilisant $\ln(1+x) \leq x$ pour tout $x \in (-1, 0]$ (ce qui s'applique ici car $-P(A_k) \in (-1, 0]$) :

$$ \ln\!\left(P\!\left(\left(\bigcup_{k=n}^m A_k\right)^c\right)\right) = \sum_{k=n}^m \ln(1-P(A_k)) \leq -\sum_{k=n}^m P(A_k) \xrightarrow[m \to +\infty]{} -\infty $$

car $\sum_{n}P(A_n)=+\infty$ par hypothèse. Donc $P\!\left(\left(\bigcup_{k \geq n}A_k\right)^c\right) = 0$ et $P(\bigcup_{k \geq n}A_k) = 1$.
D'où $\boxed{P(A)=1}$. $\blacksquare$
