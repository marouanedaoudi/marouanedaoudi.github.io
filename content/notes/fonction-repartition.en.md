---
title: "Continuity of the cumulative distribution function"
date: 2025-02-14
tags: ["CDF", "Measure Theory"]
math: true
summary: "The jump of a cumulative distribution function at a point equals the probability mass assigned to that point."
description: "Continuity of a cumulative distribution function: its jump at a point equals the probability mass assigned to that point."
lastmod: "2026-10-15"
subject: "Measure theory"
figures: ["math-notes"]
mathFigure: "cdf"
---

{{< statement kind="proposition" id="statement" >}}
Let $p$ be a probability measure on $\mathcal{B}(\mathbb{R})$, let $F$ be the cumulative distribution function of $p$, and let $a \in \mathbb{R}$. Show that $F$ is continuous at $a$ if and only if $p(\{a\})=0$. Deduce that $F$ is continuous on $\mathbb{R}$ if $p$ assigns no mass to individual points.
{{< /statement >}}

## Illustration

{{< explorable "math-notes" >}}

## Proof

{{< proof-start >}}

 By theorem, the CDF $F$ is right-continuous. We examine its left limit.
Choose $a_n=a-1/(n+1)$, so that $a_n<a$ for every $n$ and $a_n\uparrow a$.
Then

$$ \bigcup_{n \in \mathbb{N}} ]-\infty,a_n]=]-\infty,a[ $$


{{< sidenote id="cdf-1" n="1" >}}
The union excludes $a$: every $a_n$ is strictly below $a$. This is exactly the difference between $F(a-)$ and $F(a)$.
{{< /sidenote >}}

Hence, by the upward continuity of measure,

$$ \lim\limits_{n \rightarrow +\infty} F(a_n)=\lim\limits_{n \rightarrow +\infty}p(]-\infty,a_n])=p(]-\infty,a[) $$


{{< sidenote id="cdf-2" n="2" >}}
Right continuity is proved separately: if $b_n\downarrow a$, the sets $(-\infty,b_n]$ decrease to $(-\infty,a]$. The total measure is finite.
{{< /sidenote >}}

The disjoint-union decomposition gives

$$
F(a)=p((-\infty,a])=p((-\infty,a))+p(\{a\}),
$$


so $F(a)-F(a-)=p(\{a\})$. Thus $F$ is left-continuous at $a$ if and only if $p(\{a\})=0$. Together with right continuity, this is equivalent to continuity at $a$. If $p$ has no atoms, $F$ is continuous on all of $\mathbb R$.

{{< proof-end >}}
