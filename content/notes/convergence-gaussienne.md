---
title: "Convergence d'une suite de Gaussiennes"
date: 2025-02-14
tags: ["Gaussienne", "Convergence en loi"]
math: true
summary: "Démonstration de la convergence en loi d'une suite de variables gaussiennes via les fonctions caractéristiques."
---

{{< alert icon="circle-info" >}}
**Énoncé :**
Soit $(X\_n)\_{n \in \mathbb{N}}$ une famille de variables aléatoires gaussiennes, centrées, de variance $(\sigma\_n^2)\_{n \in \mathbb{N}}$ convergeant en loi vers une variable aléatoire $X$.
a) Montrer que la suite $(\sigma\_n^2)\_{n \in \mathbb{N}}$ est convergente et en déduire que $X$ suit une loi gaussienne.
b) On suppose que $X\_n \rightarrow X$ en probabilité. Démontrer que $X\_n$ converge vers $X$ dans tous les espaces $L^p$.
{{< /alert >}}

## Ma solution :

**a)** Calculons la fonction caractéristique de $X\_n$ pour pouvoir utiliser la convergence en loi sur celle-ci.
La fonction caractéristique de $X\_n$ est, $\forall t \in \mathbb{R}$,

$$
\varphi\_{X\_n}(t)=\frac{1}{\sigma\_n\sqrt{2\pi}}\int\_{\mathbb{R}}e^{-\frac{x^2}{2(\sigma\_n)^2}}e^{itx}dx=\frac{1}{\sigma\_n\sqrt{2\pi}}\int\_{\mathbb{R}}e^{-\frac{x^2}{2(\sigma\_n)^2}+itx}dx
$$

$$
=\frac{1}{\sigma\_n\sqrt{2\pi}}\int\_{\mathbb{R}}e^{-(\frac{x}{\sqrt{2}\sigma\_n}-\frac{it\sigma\_n}{\sqrt{2}})^2-\frac{t^2\sigma\_n^2}{2}}dx=\frac{e^{-\frac{t^2\sigma\_n^2}{2}}}{\sigma\_n\sqrt{2\pi}}\int\_{\mathbb{R}}e^{-(\frac{x}{\sqrt{2}\sigma\_n}-\frac{it\sigma\_n}{\sqrt{2}})^2}dx
$$

Maintenant, on procède à un changement de variable pour faire apparaître l'intégrale de Gauss.
La fonction $x \longmapsto \frac{x}{\sqrt{2}\sigma\_n}-\frac{it\sigma\_n}{\sqrt{2}}$ est de classe $\mathcal{C}^1$ sur $\mathbb{R}$ et la fonction $x \longmapsto -x^2$ est continue sur $\mathbb{R}$. Donc le théorème de changement de variable est ici applicable.
On a $u(x)=\frac{x}{\sqrt{2}\sigma\_n}-\frac{it\sigma\_n}{\sqrt{2}}$ donc $u'(x)=\frac{1}{\sqrt{2}\sigma\_n}$. Les bornes restent inchangées car $u$ parcourt tout $\mathbb{R}$.

Donc :
$$ \forall t \in \mathbb{R}, \; \; \; \varphi\_{X\_n}(t)=\frac{1}{\sqrt{\pi}e^{\frac{t^2\sigma\_n^2}{2}}}\int\_{\mathbb{R}}e^{-u^2}du=e^{-\frac{t^2\sigma\_n^2}{2}} $$

On sait que la suite $(X\_n)\_{n \in \mathbb{R}}$ converge en loi vers $X$.
Donc $\lim\_{n \rightarrow +\infty}\varphi\_{X\_n}(t)=\varphi\_X(t)$. Par continuité de $\ln$ sur tout $\mathbb{R\_+^*}$ et par caractérisation séquentielle de la limite, $\lim\_{n \rightarrow +\infty}\ln(\varphi\_{X\_n}(t))=\ln(\varphi\_{X}(t))$.

Donc, pour $t \not = 0$, $(\sigma\_n^2)\_{n \in \mathbb{N}}=\Bigg(-\frac{2}{t^2}\ln\big(\varphi\_{X\_n}(t)\big)\Bigg)\_{n \in \mathbb{N}}$ converge et on note $\sigma := \lim\_{n \rightarrow +\infty}\sigma\_n$.
De plus, la fonction caractéristique détermine de façon unique la loi de la variable aléatoire. Donc $X$ est une gaussienne de variance $\sigma^2$. $\blacksquare$

**b)** On suppose maintenant que $X\_n \rightarrow X$ en probabilité. Autrement dit, pour tout $\epsilon > 0$, $\lim\_{n \rightarrow +\infty}P(\rvert X\_n-X \rvert > \epsilon)=0$.
