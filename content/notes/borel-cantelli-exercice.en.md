---
title: "Exercise: A.S. Convergence and Borel-Cantelli"
date: 2025-02-14
tags: ["Borel-Cantelli", "A.S. Convergence"]
math: true
summary: "A direct application of the Borel-Cantelli lemma."
---

{{< alert icon="circle-info" >}}
**Statement:**
Let $(X\_n)\_{n \in \mathbb{N}}$ be a sequence of real random variables on a probability space $(\Omega, \mathcal{A}, P)$. Suppose there exists a sequence of real numbers $(a\_n)\_{n \in \mathbb{N}}$ such that both series
$$\sum\_{n \in \mathbb{N}}a\_n \quad \text{and} \quad \sum\_{n \in \mathbb{N}}P(X\_n \neq a\_n)$$
are convergent. Prove that the series $\sum\_{n \in \mathbb{N}}X\_n$ converges a.s.
{{< /alert >}}

## Solution:

The convergence of $\sum P(X\_n \neq a\_n)$ naturally points toward the Borel-Cantelli lemma.
Since $\sum\_{n \in \mathbb{N}}P(X\_n \neq a\_n)<+\infty$, we have $P(\limsup\_{n \rightarrow +\infty}\{X\_n \neq a\_n\})=0$.

This means the set of $\omega \in \Omega$ such that $X\_n(\omega) \neq a\_n$ for infinitely many $n$ has measure zero. Consequently, for almost every $\omega \in \Omega$, there exists a rank $N(\omega) \in \mathbb{N}$ such that for all $n \geq N(\omega)$, $X\_n(\omega) = a\_n$.

Therefore, for almost every $\omega$, splitting the series at rank $N(\omega)$:
$$\sum\_{n \in \mathbb{N}}X\_n(\omega)=\sum\_{n < N(\omega)}X\_n(\omega)+\sum\_{n \geq N(\omega)}a\_n$$

The first term is a finite sum of real numbers, hence finite. The second converges because $\sum\_{n \in \mathbb{N}}a\_n$ is convergent by hypothesis, so its tail $\sum\_{n \geq N}a\_n$ is well-defined. Thus $\sum\_{n \in \mathbb{N}}X\_n$ converges a.s. $\blacksquare$
