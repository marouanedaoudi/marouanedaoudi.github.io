---
title: "Convergence of Gaussian variables"
date: 2025-02-14
tags: ["Gaussian", "Convergence in Law"]
math: true
summary: "Variance limits via characteristic functions, then convergence in finite Lp spaces under convergence in probability."
description: "Convergence of centered Gaussian variables: variance limits via characteristic functions, then finite Lp convergence under convergence in probability."
lastmod: "2026-10-15"
subject: "Weak convergence"
figures: ["math-notes"]
mathFigure: "gaussian"
---

{{< statement kind="proposition" id="statement" >}}
Let $X_n\sim\mathcal N(0,\sigma_n^2)$ and suppose that $X_n$ converges in law to $X$.

1. Prove that $\sigma_n^2$ converges to a finite limit $\sigma^2$ and that $X\sim\mathcal N(0,\sigma^2)$, allowing the degenerate case $\sigma=0$.
2. If $X_n\to X$ in probability, prove convergence in $L^p$ for every finite $p\geq1$.
{{< /statement >}}

## Illustration

{{< explorable "math-notes" >}}

{{< proof-start >}}

## Convergence of the variances

The characteristic function of a centered Gaussian is

$$
\varphi_{X_n}(t)=\exp\!\left(-\frac{\sigma_n^2t^2}{2}\right).
$$


Convergence in law implies $\varphi_{X_n}(t)\to\varphi_X(t)$ for every $t\in\mathbb R$. In particular, $\varphi_X$ is real and nonnegative. Since $\varphi_X(0)=1$ and $\varphi_X$ is continuous at zero, we can choose $t_0\neq0$ sufficiently small that $\varphi_X(t_0)>0$.

{{< sidenote id="gaussian-1" n="1" >}}
A single $t_0\ne0$ with $\varphi_X(t_0)>0$ identifies the variance limit. Taking logarithms where the limit is zero would not establish a finite variance.
{{< /sidenote >}}

We can therefore take logarithms at this fixed $t_0$:

$$
\sigma_n^2=-\frac{2}{t_0^2}\log\varphi_{X_n}(t_0)
\longrightarrow
-\frac{2}{t_0^2}\log\varphi_X(t_0)=:\sigma^2<\infty.
$$


The limit is nonnegative. For every $t$, it follows that

$$
\varphi_X(t)=\lim_n\exp\!\left(-\frac{\sigma_n^2t^2}{2}\right)
=\exp\!\left(-\frac{\sigma^2t^2}{2}\right).
$$


Uniqueness of characteristic functions gives $X\sim\mathcal N(0,\sigma^2)$. If $\sigma=0$, then $X=0$ almost surely.

## From convergence in probability to Lᵖ

Fix $1\leq p<\infty$ and choose $q>p$. If $Z\sim\mathcal N(0,1)$, then $c_q:=\mathbb E|Z|^q<\infty$. The convergence of $\sigma_n^2$ implies $M:=\sup_n\sigma_n<\infty$, and hence

$$
\sup_n\mathbb E|X_n|^q=c_q\sup_n\sigma_n^q\leq c_qM^q<\infty.
$$


The limit $X$ is Gaussian as well, so $\mathbb E|X|^q<\infty$. Using
$|x-y|^q\leq2^{q-1}(|x|^q+|y|^q)$ gives

$$
\sup_n\mathbb E|X_n-X|^q<\infty.
$$


Thus the sequence $|X_n-X|^p$ is uniformly integrable. Since $X_n-X\to0$ in probability, the uniform-integrability criterion yields

{{< sidenote id="gaussian-2" n="2" >}}
The moment bound at order $q>p$ gives, for $K>0$, $\mathbb E[|X_n-X|^p\mathbf1_{|X_n-X|^p>K}]\le C K^{1-q/p}$. This upper bound vanishes uniformly in $n$.
{{< /sidenote >}}

$$
\mathbb E|X_n-X|^p\longrightarrow0.
$$


This proves $L^p$ convergence for every finite $p\geq1$. No independence assumption between the variables is needed.

{{< proof-end >}}
