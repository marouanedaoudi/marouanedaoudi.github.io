---
title: "Continuity of the Cumulative Distribution Function"
date: 2025-02-14
tags: ["CDF", "Measure Theory"]
math: true
summary: "Relationship between the continuity of F and the probability of points."
description: "Continuity of a cumulative distribution function: its jump at a point equals the probability mass assigned to that point."
lastmod: 2026-10-14
---

{{< alert icon="circle-info" >}}
***Statement:*** Let $p$ be a probability measure on $\mathcal{B}(\mathbb{R})$, let $F$ be the cumulative distribution function of $p$, and let $a \in \mathbb{R}$. Show that $F$ is continuous at $a$ if and only if $p(\{a\})=0$. Deduce that $F$ is continuous on $\mathbb{R}$ if $p$ assigns no mass to individual points.
{{< /alert >}}

***Proof:*** By theorem, the CDF $F$ is right-continuous. We show it is also left-continuous.
Choose $a_n=a-1/(n+1)$, so that $a_n<a$ for every $n$ and $a_n\uparrow a$.
Then
$$ \bigcup_{n \in \mathbb{N}} ]-\infty,a_n]=]-\infty,a[ $$

Hence, by the upward continuity of measure,
$$ \lim\limits_{n \rightarrow +\infty} F(a_n)=\lim\limits_{n \rightarrow +\infty}p(]-\infty,a_n])=p(]-\infty,a[) $$

Since $F(a)=p(]-\infty,a])=p(]-\infty,a[)+p(\{a\})$, we have $F(a) = \lim_{n}F(a_n)$ if and only if $p(\{a\})=0$. This shows that $F$ is left-continuous at $a$ if and only if $p(\{a\})=0$. Combined with right-continuity, $F$ is continuous at $a$ if and only if $p(\{a\})=0$. If $p$ assigns no mass to any single point, then $p(\{a\})=0$ for all $a \in \mathbb{R}$, so $F$ is continuous on all of $\mathbb{R}$. $\blacksquare$
