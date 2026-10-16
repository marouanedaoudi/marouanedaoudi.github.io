---
title: "Borel–Cantelli lemmas"
date: 2025-02-14
tags: ["Fundamental", "Borel-Cantelli", "Independence"]
math: true
summary: "Proofs using measure continuity and sums of event probabilities; independence is used in the second lemma."
description: "Proofs of both Borel-Cantelli lemmas using measure continuity, summable event probabilities and independence."
lastmod: "2026-10-15"
subject: "Probability"
figures: ["math-notes"]
mathFigure: "borel"
---

{{< statement kind="theorem" id="statement" >}}
Let $(E,\mathcal{T},P)$ be a probability space and $(A_n)_{n \in \mathbb{N}}$ a sequence of events in $\mathcal{T}$.
Recall that $A=\limsup_{n \rightarrow \infty}A_n$.
1. Show that if $\sum_{n \in \mathbb{N}}P(A_n)< +\infty$ then $P(A)=0$.
2. Assume that for every $n \in \mathbb{N}$, the events $A_0,...,A_n$ are independent. Assume also that $\sum_{n \in \mathbb{N}}P(A_n)=+\infty$. Show that $P(A)=1$.
{{< /statement >}}

## Illustration

{{< explorable "math-notes" >}}

{{< proof-start >}}

## Preliminary Lemma

Before proving both lemmas, we establish two general inequalities that will be useful — they constitute in their own right a measure-theoretic analogue of Fatou's lemma.

Let $n \in \mathbb{N}$ and $k \geq n$. We have $\bigcap_{p \geq n}A_p \subset A_k$, so $P(\bigcap_{p \geq n}A_p) \leq P(A_k)$, and taking the infimum over $k \geq n$:

$$P\!\left(\bigcap_{k \geq n}A_k\right) \leq \inf_{k \geq n} P(A_k)$$


The sequence $\left(\bigcap_{p \geq n}A_p\right)_{n \in \mathbb{N}}$ is increasing, so by the upward continuity of $P$:

$$ \lim_{n \rightarrow +\infty}P\!\left(\bigcap_{k \geq n}A_k\right)=P\!\left(\bigcup_{n \in \mathbb{N}}\bigcap_{k \geq n}A_k\right)\leq \liminf_{n \rightarrow \infty} P(A_n) $$


This gives:

$$ \boxed{P(\liminf_{n \rightarrow \infty}A_n) \leq \liminf_{n \rightarrow \infty}P(A_n)} $$


An analogous argument on unions gives:

$$ \boxed{P(\limsup_{n \rightarrow \infty}A_n) \geq \limsup_{n \rightarrow \infty}P(A_n)} $$


## Proof of Lemma 1

To bound $P(A) = P(\limsup A_n)$ from above, we use the $\sigma$-subadditivity of $P$ rather than the inequalities above, which yields an explicit bound in terms of the series.

By $\sigma$-subadditivity:

$$ P\!\left(\bigcup_{k \geq n}A_k\right) \leq \sum_{k \geq n}P(A_k) $$


{{< sidenote id="borel-1" n="1" >}}
The first lemma needs no independence. The decisive fact is that tails of a convergent series of nonnegative terms tend to zero.
{{< /sidenote >}}

The sequence $\left(\bigcup_{k \geq n}A_k\right)_{n \in \mathbb{N}}$ is decreasing, so by the downward continuity of $P$:

$$ P(A) = P\!\left(\limsup_{n \rightarrow +\infty}A_n\right) = \lim_{n \rightarrow +\infty}P\!\left(\bigcup_{k \geq n}A_k\right) \leq \lim_{n \rightarrow +\infty}\sum_{k \geq n}P(A_k) = 0 $$


The last limit is $0$ because $\sum_{n}P(A_n) < +\infty$ by hypothesis, so its tail tends to $0$. Thus $\boxed{P(A)=0}$.

## Proof of Lemma 2

We know $P(A)=\lim_{n \rightarrow +\infty}P(\bigcup_{k \geq n}A_k)$. It suffices to show that $P(\bigcup_{k \geq n}A_k)=1$ for every $n \in \mathbb{N}$.

Let $n \in \mathbb{N}$. If $P(A_k)=1$ for some $k \geq n$, then $P(\bigcup_{k \geq n}A_k) \geq P(A_k) = 1$ and we conclude immediately.

Suppose now that $P(A_k) < 1$ for all $k \geq n$. We work with the complement:

$$ \left(\bigcup_{k \geq n}A_k\right)^c=\bigcap_{k \geq n}A_k^c $$


By the downward continuity of $P$ and independence of the $(A_k^c)_{k\geq n}$:

$$ P\!\left(\left(\bigcup_{k \geq n}A_k\right)^c\right) = \lim_{m \rightarrow +\infty}P\!\left(\bigcap_{k=n}^m A_k^c\right) = \lim_{m \rightarrow +\infty}\prod_{k=n}^m P(A_k^c) = \prod_{k \geq n}(1-P(A_k)) $$


{{< sidenote id="borel-2" n="2" >}}
Independence turns each finite intersection into a product. Divergence of $\sum P(A_n)$ alone is insufficient: identical events can have a limsup probability strictly between 0 and 1.
{{< /sidenote >}}

To evaluate this infinite product, we take logarithms. Using $\ln(1+x) \leq x$ for all $x \in (-1, 0]$ (which applies here since $-P(A_k) \in (-1, 0]$):

$$ \ln\!\left(P\!\left(\left(\bigcup_{k=n}^m A_k\right)^c\right)\right) = \sum_{k=n}^m \ln(1-P(A_k)) \leq -\sum_{k=n}^m P(A_k) \xrightarrow[m \to +\infty]{} -\infty $$


since $\sum_{n}P(A_n)=+\infty$ by hypothesis. Therefore $P\!\left(\left(\bigcup_{k \geq n}A_k\right)^c\right) = 0$ and $P(\bigcup_{k \geq n}A_k) = 1$.
Hence $\boxed{P(A)=1}$.

{{< proof-end >}}
