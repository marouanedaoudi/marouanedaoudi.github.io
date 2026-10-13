---
title: "Convergence in Law and in Probability"
date: 2025-02-14
tags: ["Slutsky", "Convergence"]
math: true
summary: "Definitions and proof of convergence for Xn + Yn."
description: "A proof of Slutsky’s addition theorem: convergence in law is preserved when adding a sequence converging to zero in probability."
lastmod: 2026-10-14
---

We first recall the two notions of convergence before stating the exercise.

***Definition:*** We say $(X_n)$ converges to $X$ in law if for every bounded continuous function $f$,
$$ \lim_{n \rightarrow +\infty}\mathbb{E}[f(X_n)]=\mathbb{E}[f(X)] $$

***Definition:*** We say $(X_n)$ converges to $X$ in probability if
$$ \forall \epsilon > 0,\quad \lim_{n \rightarrow +\infty}P(|X_n-X| \geq \epsilon)=0 $$

## Exercise

{{< alert icon="circle-info" >}}
***Statement:*** Let $(\Omega,\mathcal A,P)$ be a probability space, $X$ a real random variable, and $(X_n)_{n \in \mathbb{N}}$, $(Y_n)_{n \in \mathbb{N}}$ two sequences of real random variables such that $X_n \rightarrow X$ in law and $Y_n \rightarrow 0$ in probability as $n \rightarrow +\infty$. Show that $X_n+Y_n \rightarrow X$ in law as $n \rightarrow +\infty$.
{{< /alert >}}

***Proof:***
Using the characterization of weak convergence of probability measures by compactly supported continuous test functions, it suffices to show that for every $\phi \in C_c(\mathbb{R},\mathbb{R})$,
$$ \lim_{n \rightarrow +\infty} \mathbb{E}[\phi(X_n+Y_n)]=\mathbb{E}[\phi(X)] $$

Let $\phi \in C_c(\mathbb{R},\mathbb{R})$. We split the gap into two terms:
$$ \mathbb{E}[\phi(X_n+Y_n)]-\mathbb{E}[\phi(X)]=A_n+B_n $$

where
$$ A_n=\mathbb{E}[\phi(X_n+Y_n)]-\mathbb{E}[\phi(X_n)] \quad , \quad B_n=\mathbb{E}[\phi(X_n)]-\mathbb{E}[\phi(X)] $$

We already know $\lim_{n \rightarrow +\infty}B_n=0$ since $X_n \rightarrow X$ in law. It remains to show $\lim_{n \rightarrow +\infty}A_n=0$.

A continuous function with compact support is bounded and uniformly continuous on all of $\mathbb R$. Let $\epsilon>0$; choose $\eta>0$ such that for all $x,y\in\mathbb R$, $|x-y|\leq\eta$ implies $|\phi(x)-\phi(y)|<\epsilon$.

We bound $|A_n|$ by separating the event $\{|Y_n| \leq \eta\}$ from its complement:
$$ |A_n| \leq \mathbb{E}[|\phi(X_n+Y_n)-\phi(X_n)|] = \mathbb{E}[|\phi(X_n+Y_n)-\phi(X_n)|\,\mathbf{1}_{\{|Y_n|\leq\eta\}}] + \mathbb{E}[|\phi(X_n+Y_n)-\phi(X_n)|\,\mathbf{1}_{\{|Y_n|>\eta\}}] $$

On $\{|Y_n| \leq \eta\}$, the argument of $\phi$ varies by less than $\eta$, so the first term is $\leq \epsilon$. On $\{|Y_n| > \eta\}$, we bound crudely by $2\|\phi\|_\infty$:
$$ |A_n| \leq \epsilon + 2\|\phi\|_\infty \cdot P(|Y_n|>\eta) $$

Since $Y_n \rightarrow 0$ in probability, $P(|Y_n|>\eta) \rightarrow 0$. There exists $n_0$ such that for all $n \geq n_0$, $2\|\phi\|_\infty \cdot P(|Y_n|>\eta) \leq \epsilon$. Thus $|A_n| \leq 2\epsilon$ for $n \geq n_0$, proving $A_n \rightarrow 0$.

We conclude: for all $n \geq n_0$, $|\mathbb{E}[\phi(X_n+Y_n)]-\mathbb{E}[\phi(X)]| = |A_n+B_n| \leq |A_n|+|B_n| \to 0$, so
$$ \boxed{X_n+Y_n \rightarrow X \text{ in law as }n \rightarrow +\infty} $$
$\blacksquare$
