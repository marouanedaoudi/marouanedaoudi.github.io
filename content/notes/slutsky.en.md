---
title: "Convergence in Law and in Probability"
date: 2025-02-14
tags: ["Slutsky", "Convergence"]
math: true
summary: "Definitions and proof of convergence for Xn + Yn."
---

We first recall the two notions of convergence before stating the exercise.

***Definition:*** We say $(X\_n)$ converges to $X$ in law if for every bounded continuous function $f$,
$$ \lim\_{n \rightarrow +\infty}\mathbb{E}[f(X\_n)]=\mathbb{E}[f(X)] $$

***Definition:*** We say $(X\_n)$ converges to $X$ in probability if
$$ \forall \epsilon > 0,\quad \lim\_{n \rightarrow +\infty}P(|X\_n-X| \geq \epsilon)=0 $$

## Exercise

{{< alert icon="circle-info" >}}
***Statement:*** Let $(\Omega,\mathcal A,P)$ be a probability space, $X$ a real random variable, and $(X\_n)\_{n \in \mathbb{N}}$, $(Y\_n)\_{n \in \mathbb{N}}$ two sequences of real random variables such that $X\_n \rightarrow X$ in law and $Y\_n \rightarrow 0$ in probability as $n \rightarrow +\infty$. Show that $X\_n+Y\_n \rightarrow X$ in law as $n \rightarrow +\infty$.
{{< /alert >}}

***Proof:***
By definition, it suffices to show that for every $\phi \in C\_c(\mathbb{R},\mathbb{R})$,
$$ \lim\_{n \rightarrow +\infty} \mathbb{E}[\phi(X\_n+Y\_n)]=\mathbb{E}[\phi(X)] $$

Let $\phi \in C\_c(\mathbb{R},\mathbb{R})$. We split the gap into two terms:
$$ \mathbb{E}[\phi(X\_n+Y\_n)]-\mathbb{E}[\phi(X)]=A\_n+B\_n $$

where
$$ A\_n=\mathbb{E}[\phi(X\_n+Y\_n)]-\mathbb{E}[\phi(X\_n)] \quad , \quad B\_n=\mathbb{E}[\phi(X\_n)]-\mathbb{E}[\phi(X)] $$

We already know $\lim\_{n \rightarrow +\infty}B\_n=0$ since $X\_n \rightarrow X$ in law. It remains to show $\lim\_{n \rightarrow +\infty}A\_n=0$.

The function $\phi$ is continuous on a compact $\mathcal{K}$ of $\mathbb{R}$ (its support), hence uniformly continuous on $\mathcal{K}$ by Heine's theorem. Let $\epsilon>0$; there exists $\eta>0$ such that for all $(x,y) \in \mathcal{K}^2$, $|x-y|<\eta \Rightarrow |\phi(x)-\phi(y)|<\epsilon$.

We bound $|A\_n|$ by separating the event $\{|Y\_n| \leq \eta\}$ from its complement:
$$ |A\_n| \leq \mathbb{E}[|\phi(X\_n+Y\_n)-\phi(X\_n)|] = \mathbb{E}[|\phi(X\_n+Y\_n)-\phi(X\_n)|\,\mathbf{1}\_{\{|Y\_n|\leq\eta\}}] + \mathbb{E}[|\phi(X\_n+Y\_n)-\phi(X\_n)|\,\mathbf{1}\_{\{|Y\_n|>\eta\}}] $$

On $\{|Y\_n| \leq \eta\}$, the argument of $\phi$ varies by less than $\eta$, so the first term is $\leq \epsilon$. On $\{|Y\_n| > \eta\}$, we bound crudely by $2\|\phi\|\_\infty$:
$$ |A\_n| \leq \epsilon + 2\|\phi\|\_\infty \cdot P(|Y\_n|>\eta) $$

Since $Y\_n \rightarrow 0$ in probability, $P(|Y\_n|>\eta) \rightarrow 0$. There exists $n\_0$ such that for all $n \geq n\_0$, $2\|\phi\|\_\infty \cdot P(|Y\_n|>\eta) \leq \epsilon$. Thus $|A\_n| \leq 2\epsilon$ for $n \geq n\_0$, proving $A\_n \rightarrow 0$.

We conclude: for all $n \geq n\_0$, $|\mathbb{E}[\phi(X\_n+Y\_n)]-\mathbb{E}[\phi(X)]| = |A\_n+B\_n| \leq |A\_n|+|B\_n| \to 0$, so
$$ \boxed{X\_n+Y\_n \rightarrow X \text{ in law as }n \rightarrow +\infty} $$
$\blacksquare$
