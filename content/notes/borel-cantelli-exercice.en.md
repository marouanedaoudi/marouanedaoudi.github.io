---
title: "Random series and Borel–Cantelli"
date: 2025-02-14
lastmod: "2026-10-15"
tags: ["Borel-Cantelli", "Almost-sure convergence"]
math: true
summary: "Almost-sure convergence of a random series using a convergent deterministic series and summable deviation probabilities."
description: "Worked exercise: almost-sure convergence of a random series whose deviations from a convergent deterministic series have summable probabilities."
subject: "Almost-sure convergence"
figures: ["math-notes"]
mathFigure: "series"
---

{{< statement kind="proposition" id="statement" >}}
Let $(X_n)_{n \in \mathbb{N}}$ be a sequence of real random variables on a probability space $(\Omega, \mathcal{A}, P)$. Suppose there exists a sequence of real numbers $(a_n)_{n \in \mathbb{N}}$ such that both series

$$\sum_{n \in \mathbb{N}}a_n \quad \text{and} \quad \sum_{n \in \mathbb{N}}P(X_n \neq a_n)$$

are convergent. Prove that the series $\sum_{n \in \mathbb{N}}X_n$ converges a.s.
{{< /statement >}}

## Illustration

{{< explorable "math-notes" >}}

{{< proof-start >}}

## Solution

The convergence of $\sum P(X_n \neq a_n)$ naturally points toward the Borel-Cantelli lemma.
Since $\sum_{n \in \mathbb{N}}P(X_n \neq a_n)<+\infty$, we have $P(\limsup_{n \rightarrow +\infty}\{X_n \neq a_n\})=0$.

This means the set of $\omega \in \Omega$ such that $X_n(\omega) \neq a_n$ for infinitely many $n$ has measure zero. Consequently, for almost every $\omega \in \Omega$, there exists a rank $N(\omega) \in \mathbb{N}$ such that for all $n \geq N(\omega)$, $X_n(\omega) = a_n$.

{{< sidenote id="series-1" n="1" >}}
The index $N$ depends on the path $\omega$. Borel–Cantelli gives almost-sure eventual equality, not one deterministic index shared by all paths.
{{< /sidenote >}}

Therefore, for almost every $\omega$, splitting the series at rank $N(\omega)$:

$$\sum_{n \in \mathbb{N}}X_n(\omega)=\sum_{n < N(\omega)}X_n(\omega)+\sum_{n \geq N(\omega)}a_n$$


{{< sidenote id="series-2" n="2" >}}
Changing finitely many terms preserves convergence of a series. It need not preserve its sum, as the offset in the figure illustrates.
{{< /sidenote >}}

The first term is a finite sum of real numbers, hence finite. The second converges because $\sum_{n \in \mathbb{N}}a_n$ is convergent by hypothesis, so its tail $\sum_{n \geq N}a_n$ is well-defined. Thus $\sum_{n \in \mathbb{N}}X_n$ converges a.s.

{{< proof-end >}}

See also the [proofs of the two Borel–Cantelli lemmas](/notes/lemme-borel-cantelli-demo/).
