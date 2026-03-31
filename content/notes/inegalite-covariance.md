---
title: "Inégalité de Covariance"
date: 2025-02-14
tags: ["Inégalité", "Covariance"]
math: true
summary: "Majoration de la covariance entre deux événements."
---

{{< alert icon="circle-info" >}}
**Énoncé :** Soient $X$ et $Y$ deux événements. Montrer que
$$ \big|P(X \cap Y)-P(X)P(Y)\big| \leq \frac{1}{4} $$
{{< /alert >}}

**Cas particulier préliminaire.** Commençons par le cas $X=Y$ pour dégager la borne utile.
On a $\big|P(X)-P(X)^2\big|=P(X)(1-P(X))$.
Posons $f:[0,1] \rightarrow \mathbb{R}$, $f(x)=x(1-x)$. La fonction $f$ est dérivable et $f'(x)=1-2x$.
$f'$ s'annule en $x=\frac{1}{2}$, qui est un maximum car $f''(x)=-2<0$. On a $f\!\left(\frac{1}{2}\right)=\frac{1}{4}$.
Ainsi, pour tout événement $X$ :
$$P(X)(1-P(X)) \leq \frac{1}{4}$$

**Cas général.** On réécrit la quantité à majorer sous forme d'espérance. En utilisant $P(X \cap Y) = \mathbb{E}[\mathbb{1}\_{X}\mathbb{1}\_{Y}]$ et $P(X) = \mathbb{E}[\mathbb{1}\_{X}]$ :
$$ \big|P(X \cap Y)-P(X)P(Y)\big|=\big|\mathbb{E}[\mathbb{1}\_{X}\mathbb{1}\_{Y}]-\mathbb{E}[\mathbb{1}\_{X}]\mathbb{E}[\mathbb{1}\_{Y}]\big|=\big|\mathbb{E}[(\mathbb{1}\_{X}-\mathbb{E}[\mathbb{1}\_{X}])(\mathbb{1}\_{Y}-\mathbb{E}[\mathbb{1}\_{Y}])]\big| $$

On applique l'inégalité de Cauchy-Schwarz dans $L^2(\Omega, \mathcal{A}, P)$, muni du produit scalaire $\langle U, V \rangle = \mathbb{E}[UV]$. En posant $U = \mathbb{1}\_X - \mathbb{E}[\mathbb{1}\_X]$ et $V = \mathbb{1}\_Y - \mathbb{E}[\mathbb{1}\_Y]$ :
$$ \big|\mathbb{E}[UV]\big| \leq \mathbb{E}[U^2]^{1/2}\,\mathbb{E}[V^2]^{1/2} = \mathbb{V}(\mathbb{1}\_{X})^{1/2}\,\mathbb{V}(\mathbb{1}\_{Y})^{1/2} $$

Par la formule de König-Huygens, $\mathbb{V}(\mathbb{1}\_X) = \mathbb{E}[\mathbb{1}\_X^2] - \mathbb{E}[\mathbb{1}\_X]^2 = P(X) - P(X)^2 = P(X)(1-P(X))$, donc :
$$ \big|P(X \cap Y)-P(X)P(Y)\big| \leq \sqrt{P(X)(1-P(X))}\cdot\sqrt{P(Y)(1-P(Y))} $$

D'après le cas préliminaire, chaque facteur est au plus $\frac{1}{2}$. Le produit est donc au plus $\frac{1}{2} \times \frac{1}{2} = \frac{1}{4}$ :
$$ \boxed{\big|P(X \cap Y)-P(X)P(Y)\big| \leq \frac{1}{4}} $$
$\blacksquare$
