---
title: "Proof: Borel-Cantelli Lemmas"
date: 2025-02-14
tags: ["Fundamental", "Borel-Cantelli", "Independence"]
math: true
summary: "Complete proof of both lemmas."
---

{{< alert icon="circle-info" >}}
***Statement:*** Let $(E,\mathcal{T},P)$ be a probability space and $(A\_n)\_{n \in \mathbb{N}}$ a sequence of events in $\mathcal{T}$.
Recall that $A=\limsup\_{n \rightarrow \infty}A\_n$.
1. Show that if $\sum\_{n \in \mathbb{N}}P(A\_n)< +\infty$ then $P(A)=0$.
2. Assume that for every $n \in \mathbb{N}$, the events $A\_0,...,A\_n$ are independent. Assume also that $\sum\_{n \in \mathbb{N}}P(A\_n)=+\infty$. Show that $P(A)=1$.
{{< /alert >}}

## Preliminary Lemma

Before proving both lemmas, we establish two general inequalities that will be useful — they constitute in their own right a measure-theoretic analogue of Fatou's lemma.

Let $n \in \mathbb{N}$ and $k \geq n$. We have $\bigcap\_{p \geq n}A\_p \subset A\_k$, so $P(\bigcap\_{p \geq n}A\_p) \leq P(A\_k)$, and taking the infimum over $k \geq n$:
$$P\!\left(\bigcap\_{k \geq n}A\_k\right) \leq \inf\_{k \geq n} P(A\_k)$$

The sequence $\left(\bigcap\_{p \geq n}A\_p\right)\_{n \in \mathbb{N}}$ is increasing, so by the upward continuity of $P$:
$$ \lim\_{n \rightarrow +\infty}P\!\left(\bigcap\_{k \geq n}A\_k\right)=P\!\left(\bigcup\_{n \in \mathbb{N}}\bigcap\_{k \geq n}A\_k\right)\leq \liminf\_{n \rightarrow \infty} P(A\_n) $$

This gives:
$$ \boxed{P(\liminf\_{n \rightarrow \infty}A\_n) \leq \liminf\_{n \rightarrow \infty}P(A\_n)} $$

An analogous argument on unions gives:
$$ \boxed{P(\limsup\_{n \rightarrow \infty}A\_n) \geq \limsup\_{n \rightarrow \infty}P(A\_n)} $$

## Proof of Lemma 1

To bound $P(A) = P(\limsup A\_n)$ from above, we use the $\sigma$-subadditivity of $P$ rather than the inequalities above, which yields an explicit bound in terms of the series.

By $\sigma$-subadditivity:
$$ P\!\left(\bigcup\_{k \geq n}A\_k\right) \leq \sum\_{k \geq n}P(A\_k) $$

The sequence $\left(\bigcup\_{k \geq n}A\_k\right)\_{n \in \mathbb{N}}$ is decreasing, so by the downward continuity of $P$:
$$ P(A) = P\!\left(\limsup\_{n \rightarrow +\infty}A\_n\right) = \lim\_{n \rightarrow +\infty}P\!\left(\bigcup\_{k \geq n}A\_k\right) \leq \lim\_{n \rightarrow +\infty}\sum\_{k \geq n}P(A\_k) = 0 $$

The last limit is $0$ because $\sum\_{n}P(A\_n) < +\infty$ by hypothesis, so its tail tends to $0$. Thus $\boxed{P(A)=0}$.

## Proof of Lemma 2

We know $P(A)=\lim\_{n \rightarrow +\infty}P(\bigcup\_{k \geq n}A\_k)$. It suffices to show that $P(\bigcup\_{k \geq n}A\_k)=1$ for every $n \in \mathbb{N}$.

Let $n \in \mathbb{N}$. If $P(A\_k)=1$ for some $k \geq n$, then $P(\bigcup\_{k \geq n}A\_k) \geq P(A\_k) = 1$ and we conclude immediately.

Suppose now that $P(A\_k) < 1$ for all $k \geq n$. We work with the complement:
$$ \left(\bigcup\_{k \geq n}A\_k\right)^c=\bigcap\_{k \geq n}A\_k^c $$

By the downward continuity of $P$ and independence of the $(A\_k^c)\_{k\geq n}$:
$$ P\!\left(\left(\bigcup\_{k \geq n}A\_k\right)^c\right) = \lim\_{m \rightarrow +\infty}P\!\left(\bigcap\_{k=n}^m A\_k^c\right) = \lim\_{m \rightarrow +\infty}\prod\_{k=n}^m P(A\_k^c) = \prod\_{k \geq n}(1-P(A\_k)) $$

To evaluate this infinite product, we take logarithms. Using $\ln(1+x) \leq x$ for all $x \in (-1, 0]$ (which applies here since $-P(A\_k) \in (-1, 0]$):

$$ \ln\!\left(P\!\left(\left(\bigcup\_{k=n}^m A\_k\right)^c\right)\right) = \sum\_{k=n}^m \ln(1-P(A\_k)) \leq -\sum\_{k=n}^m P(A\_k) \xrightarrow[m \to +\infty]{} -\infty $$

since $\sum\_{n}P(A\_n)=+\infty$ by hypothesis. Therefore $P\!\left(\left(\bigcup\_{k \geq n}A\_k\right)^c\right) = 0$ and $P(\bigcup\_{k \geq n}A\_k) = 1$.
Hence $\boxed{P(A)=1}$. $\blacksquare$
