---
title: "Inégalité de Covariance"
date: 2025-02-14
tags: ["Inégalité", "Covariance"]
math: true
summary: "Majoration de la covariance entre deux événements."
---

{{< alert icon="circle-info" >}}
**Énoncé :** Soient $X$ et $Y$ deux événements.
Montrer que
$$ \big|P(X \cap Y)-P(X)P(Y)\big| \leq \frac{1}{4} $$
{{< /alert >}}

Que se passe-t-il si $X=Y$ ?
On a $\big|P(X)-P(X)^2\big|=\big|P(X)\big|\big|1-P(X)\big|$.
Soit $f:[0,1] \rightarrow [0,1]$ une fonction telle que $f(x)=x(1-x)$
La fonction $f$ est dérivable, par composition de fonctions dérivables, ainsi $f'(x)=1-2x$.
Donc $f$ atteint son maximum en $\frac{1}{4}$.
Ainsi, $\big|P(X)\big|\big|1-P(X)\big| \leq \frac{1}{2}$.

Revenons à notre inégalité et réécrivons l'inégalité sous forme d'espérance.
On a
$$ \big|P(X \cap Y)-P(X)P(Y)\big|=\big|\mathbb{E}(\mathbb{1}\_{X}\mathbb{1}\_{Y})-E(\mathbb{1}\_{X})E(\mathbb{1}\_{Y})\big|=\big|\mathbb{E}((\mathbb{1}\_{X}-\mathbb{E}(\mathbb{1}\_{X}))(\mathbb{1}\_{Y}-\mathbb{E}(\mathbb{1}\_{Y}))\big| $$

Maintenant, on applique l'inégalité de Cauchy-Schwartz.
Il faudrait éventuellement montrer que c'est une forme quadratique auquel on peut associer un produit scalaire et la norme associée pour pouvoir appliquer l'inégalité.
Donc, on obtient
$$ \big|\mathbb{E}((\mathbb{1}\_{X}-\mathbb{E}(\mathbb{1}\_{X}))(\mathbb{1}\_{Y}-\mathbb{E}(\mathbb{1}\_{Y}))\big|\leq\mathbb{E}((\mathbb{1}\_{X}-\mathbb{E}(\mathbb{1}\_{X}))^2)^\frac{1}{2}\mathbb{E}((\mathbb{1}\_{Y}-\mathbb{E}(\mathbb{1}\_{Y}))^2)^\frac{1}{2}\leq\mathbb{V}(\mathbb{1}\_{X})^\frac{1}{2}\mathbb{V}(\mathbb{1}\_{Y})^\frac{1}{2} $$

Par la formule de Koenig-Huygens,
$$ \big|P(X \cap Y)-P(X)P(Y)\big|\leq \sqrt{P(X)-P(X)^2}\sqrt{P(Y)-P(Y)^2}\leq\frac{1}{4} $$
$\blacksquare$
