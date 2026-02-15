---
title: "Convergence d'une suite de Gaussiennes"
date: 2025-02-14
tags: ["Gaussienne", "Convergence en loi"]
math: true
summary: "Démonstration via les fonctions caractéristiques."
---

{{< alert icon="circle-info" >}}
**Énoncé :**
Soit $(X\_n)\_{n \in \mathbb{N}}$ une famille de variables aléatoires gaussiennes, centrées, de variance $(\sigma\_n^2)\_{n \in \mathbb{N}}$ convergeant en loi vers une variable aléatoire $X$.

1. Montrer que la suite $(\sigma\_n^2)\_{n \in \mathbb{N}}$ est convergente et en déduire que $X$ suit une loi gaussienne.
2. On suppose que $X\_n \to X$ en probabilité. Démontrer que $X\_n$ converge vers $X$ dans tous les espaces $L^p$.
{{< /alert >}}

## Solution

### 1. Convergence de la variance et loi de X

Calculons la fonction caractéristique de $X\_n$.
La fonction caractéristique de $X\_n \sim \mathcal{N}(0, \sigma\_n^2)$ est donnée par :

$$\forall t \in \mathbb{R}, \quad \varphi_{X\_n}(t) = e^{-\frac{t^2\sigma\_n^2}{2}}$$

On sait que la suite $(X\_n)$ converge en loi vers $X$. Par le théorème de Lévy, la suite des fonctions caractéristiques converge ponctuellement vers la fonction caractéristique de $X$ :
$$\lim_{n \rightarrow +\infty}\varphi_{X\_n}(t) = \varphi_X(t)$$

Fixons $t \neq 0$. Par continuité du logarithme :
$$\lim_{n \rightarrow +\infty} -\frac{t^2\sigma\_n^2}{2} = \ln(\varphi_{X}(t))$$

On en déduit que la suite $(\sigma\_n^2)$ converge vers une limite $\sigma^2$.
En repassant à la limite :
$$\varphi_X(t) = e^{-\frac{t^2\sigma^2}{2}}$$
Ceci est la fonction caractéristique d'une variable aléatoire gaussienne $\mathcal{N}(0, \sigma^2)$.

$$\boxed{X \sim \mathcal{N}(0, \sigma^2)}$$

### 2. Convergence dans $L^p$

On suppose maintenant que $X\_n \xrightarrow{\mathbb{P}} X$.
Pour montrer la convergence dans $L^p$, il suffit de montrer que la suite $(|X\_n|^p)_n$ est uniformément intégrable.
Pour des gaussiennes, la convergence des moments (due à la convergence des variances $\sigma\_n \to \sigma$) suffit à assurer l'uniforme intégrabilité.