---
title: "Convergence of a Gaussian Sequence"
date: 2025-02-14
tags: ["Gaussian", "Convergence in Law"]
math: true
summary: "Proof of weak convergence of a sequence of Gaussian variables via characteristic functions."
---

{{< alert icon="circle-info" >}}
**Statement:**
Let $(X\_n)\_{n \in \mathbb{N}}$ be a family of centered Gaussian random variables with variances $(\sigma\_n^2)\_{n \in \mathbb{N}}$, converging in law to a random variable $X$.

a) Show that the sequence $(\sigma\_n^2)\_{n \in \mathbb{N}}$ converges and deduce that $X$ follows a Gaussian distribution.

b) Assume that $X\_n \rightarrow X$ in probability. Prove that $X\_n$ converges to $X$ in every $L^p$ space.
{{< /alert >}}

## Solution:

**a)** We compute the characteristic function of $X\_n$ in order to use convergence in law on it.
The characteristic function of $X\_n$ is, for all $t \in \mathbb{R}$,

$$
\varphi\_{X\_n}(t)=\frac{1}{\sigma\_n\sqrt{2\pi}}\int\_{\mathbb{R}}e^{-\frac{x^2}{2(\sigma\_n)^2}}e^{itx}dx=\frac{1}{\sigma\_n\sqrt{2\pi}}\int\_{\mathbb{R}}e^{-\frac{x^2}{2(\sigma\_n)^2}+itx}dx
$$

$$
=\frac{1}{\sigma\_n\sqrt{2\pi}}\int\_{\mathbb{R}}e^{-(\frac{x}{\sqrt{2}\sigma\_n}-\frac{it\sigma\_n}{\sqrt{2}})^2-\frac{t^2\sigma\_n^2}{2}}dx=\frac{e^{-\frac{t^2\sigma\_n^2}{2}}}{\sigma\_n\sqrt{2\pi}}\int\_{\mathbb{R}}e^{-(\frac{x}{\sqrt{2}\sigma\_n}-\frac{it\sigma\_n}{\sqrt{2}})^2}dx
$$

We perform a change of variables to produce the Gaussian integral.
The function $x \longmapsto \frac{x}{\sqrt{2}\sigma\_n}-\frac{it\sigma\_n}{\sqrt{2}}$ is $\mathcal{C}^1$ on $\mathbb{R}$ and $x \longmapsto -x^2$ is continuous on $\mathbb{R}$, so the change-of-variables theorem applies.
We have $u(x)=\frac{x}{\sqrt{2}\sigma\_n}-\frac{it\sigma\_n}{\sqrt{2}}$, so $u'(x)=\frac{1}{\sqrt{2}\sigma\_n}$. The bounds remain unchanged since $u$ ranges over all of $\mathbb{R}$.

Therefore:
$$ \forall t \in \mathbb{R}, \; \; \; \varphi\_{X\_n}(t)=\frac{1}{\sqrt{\pi}e^{\frac{t^2\sigma\_n^2}{2}}}\int\_{\mathbb{R}}e^{-u^2}du=e^{-\frac{t^2\sigma\_n^2}{2}} $$

Since $(X\_n)\_{n \in \mathbb{N}}$ converges in law to $X$, we have $\lim\_{n \rightarrow +\infty}\varphi\_{X\_n}(t)=\varphi\_X(t)$. By continuity of $\ln$ on $\mathbb{R}\_+^*$ and the sequential characterization of limits, $\lim\_{n \rightarrow +\infty}\ln(\varphi\_{X\_n}(t))=\ln(\varphi\_{X}(t))$.

Hence, for $t \not = 0$, the sequence $(\sigma\_n^2)\_{n \in \mathbb{N}}=\Bigg(-\frac{2}{t^2}\ln\big(\varphi\_{X\_n}(t)\big)\Bigg)\_{n \in \mathbb{N}}$ converges; we denote $\sigma := \lim\_{n \rightarrow +\infty}\sigma\_n$.
Moreover, the characteristic function uniquely determines the distribution of a random variable, so $X$ is Gaussian with variance $\sigma^2$. $\blacksquare$

**b)** Assume now that $X\_n \rightarrow X$ in probability, i.e., for every $\epsilon > 0$, $\lim\_{n \rightarrow +\infty}P(\rvert X\_n-X \rvert > \epsilon)=0$.

Let $p \geq 1$. We use the following criterion: a sequence $(Z\_n)$ converges in $L^p$ to $Z$ if and only if it converges in probability to $Z$ and is uniformly integrable in $L^p$ (de La Vallée-Poussin criterion: it suffices to find $q > p$ such that $\sup\_n \mathbb{E}[|Z\_n|^q] < +\infty$).

Convergence in probability is given by hypothesis. We show uniform integrability. Since $X\_n \sim \mathcal{N}(0, \sigma\_n^2)$, for every $q \geq 1$:

$$\mathbb{E}[|X\_n|^q] = \sigma\_n^q \, \mathbb{E}[|Z|^q] = \sigma\_n^q \cdot c\_q$$

where $Z \sim \mathcal{N}(0,1)$ and $c\_q = \mathbb{E}[|Z|^q] < +\infty$ (moments of a standard Gaussian). The sequence $(\sigma\_n)$ converges to $\sigma$ by **a)**, hence is bounded: $M := \sup\_n \sigma\_n < +\infty$. Taking $q = p+1$:

$$\sup\_n \mathbb{E}[|X\_n|^{p+1}] = c\_{p+1} \cdot \sup\_n \sigma\_n^{p+1} \leq c\_{p+1} \cdot M^{p+1} < +\infty$$

The sequence $(|X\_n|^p)$ is therefore uniformly integrable. Combined with convergence in probability, we conclude $X\_n \rightarrow X$ in $L^p$. Since this holds for every $p \geq 1$, we have $X\_n \rightarrow X$ in all $L^p$ spaces. $\blacksquare$
