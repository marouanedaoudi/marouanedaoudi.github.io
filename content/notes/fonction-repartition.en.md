---
title: "Continuity of the Cumulative Distribution Function"
date: 2025-02-14
tags: ["CDF", "Measure Theory"]
math: true
summary: "Relationship between the continuity of F and the probability of points."
---

{{< alert icon="circle-info" >}}
***Statement:*** Let $p$ be a probability measure on $\mathcal{B}(\mathbb{R})$, let $F$ be the cumulative distribution function of $p$, and let $a \in \mathbb{R}$. Show that $F$ is continuous at $a$ if and only if $p(\{a\})=0$. Deduce that $F$ is continuous on $\mathbb{R}$ if $p$ assigns no mass to individual points.
{{< /alert >}}

***Proof:*** By theorem, the CDF $F$ is right-continuous. We show it is also left-continuous.
Let $(a\_n)\_{n \in \mathbb{N}}$ be an increasing real sequence such that $\lim\limits\_{n \rightarrow +\infty} a\_n = a$.
Then
$$ \bigcup\_{n \in \mathbb{N}} ]-\infty,a\_n]=]-\infty,a[ $$

Hence, by the upward continuity of measure,
$$ \lim\limits\_{n \rightarrow +\infty} F(a\_n)=\lim\limits\_{n \rightarrow +\infty}p(]-\infty,a\_n])=p(]-\infty,a[) $$

Since $F(a)=p(]-\infty,a])=p(]-\infty,a[)+p(\{a\})$, we have $F(a) = \lim\_{n}F(a\_n)$ if and only if $p(\{a\})=0$. This shows that $F$ is left-continuous at $a$ if and only if $p(\{a\})=0$. Combined with right-continuity, $F$ is continuous at $a$ if and only if $p(\{a\})=0$. If $p$ assigns no mass to any single point, then $p(\{a\})=0$ for all $a \in \mathbb{R}$, so $F$ is continuous on all of $\mathbb{R}$. $\blacksquare$
