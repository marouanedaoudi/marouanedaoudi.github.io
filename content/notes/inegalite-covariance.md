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
$f'$ s'annule en $x=\frac{1}{2}$, qui est bien un maximum car $f''(x)=-2<0$. On a $f\!\left(\frac{1}{2}\right)=\frac{1}{4}$.
Ainsi, $\big|P(X)\big|\big|1-P(X)\big| \leq \frac{1}{4}$.

Revenons à notre inégalité et réécrivons l'inégalité sous forme d'espérance.
On a
$$ \big|P(X \cap Y)-P(X)P(Y)\big|=\big|\mathbb{E}(\mathbb{1}\_{X}\mathbb{1}\_{Y})-E(\mathbb{1}\_{X})E(\mathbb{1}\_{Y})\big|=\big|\mathbb{E}((\mathbb{1}\_{X}-\mathbb{E}(\mathbb{1}\_{X}))(\mathbb{1}\_{Y}-\mathbb{E}(\mathbb{1}\_{Y}))\big| $$

Maintenant, on applique l'inégalité de Cauchy-Schwarz. Sur l'espace $L^2(\Omega, \mathcal{A}, P)$, le produit scalaire $\langle U, V \rangle = \mathbb{E}[UV]$ est bien défini et vérifie les axiomes d'un produit scalaire (bilinéarité, symétrie, positivité). L'inégalité de Cauchy-Schwarz donne alors $|\langle U, V \rangle| \leq \|U\|\_2 \|V\|\_2$. En posant $U = \mathbb{1}\_X - \mathbb{E}(\mathbb{1}\_X)$ et $V = \mathbb{1}\_Y - \mathbb{E}(\mathbb{1}\_Y)$, on obtient :

$$ \big|\mathbb{E}((\mathbb{1}\_{X}-\mathbb{E}(\mathbb{1}\_{X}))(\mathbb{1}\_{Y}-\mathbb{E}(\mathbb{1}\_{Y}))\big|\leq\mathbb{E}((\mathbb{1}\_{X}-\mathbb{E}(\mathbb{1}\_{X}))^2)^\frac{1}{2}\mathbb{E}((\mathbb{1}\_{Y}-\mathbb{E}(\mathbb{1}\_{Y}))^2)^\frac{1}{2}=\mathbb{V}(\mathbb{1}\_{X})^\frac{1}{2}\mathbb{V}(\mathbb{1}\_{Y})^\frac{1}{2} $$

Par la formule de König-Huygens, $\mathbb{V}(\mathbb{1}\_X) = P(X) - P(X)^2$, donc :

$$ \big|P(X \cap Y)-P(X)P(Y)\big|\leq \sqrt{P(X)(1-P(X))}\sqrt{P(Y)(1-P(Y))} $$

D'après le cas $X=Y$ traité au début, chaque facteur est $\leq \frac{1}{4}^{1/2} = \frac{1}{2}$. Par l'inégalité arithmético-géométrique, $\sqrt{ab} \leq \frac{a+b}{2}$ avec $a = \sqrt{P(X)(1-P(X))} \leq \frac{1}{2}$ et $b = \sqrt{P(Y)(1-P(Y))} \leq \frac{1}{2}$, d'où :

$$ \big|P(X \cap Y)-P(X)P(Y)\big| \leq \frac{1}{2} \cdot \frac{1}{2} = \frac{1}{4} $$
$\blacksquare$
