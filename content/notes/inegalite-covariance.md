---
title: "Inégalité de Covariance"
date: 2025-02-14
tags: ["Inégalité", "Covariance"]
math: true
summary: "Majoration de la covariance entre deux événements indicateurs."
---

{{< alert icon="circle-info" >}}
**Énoncé :**
Montrer que pour deux événements \\(X\\) et \\(Y\\) :
$$\big|P(X \cap Y)-P(X)P(Y)\big| \leq \frac{1}{4}$$
{{< /alert >}}

## Démonstration

Réécrivons cette expression en termes de variables aléatoires indicatrices \\(\mathbb{1}_X\\) et \\(\mathbb{1}_Y\\).
$$\text{Cov}(\mathbb{1}_X, \mathbb{1}_Y) = \mathbb{E}[\mathbb{1}_X \mathbb{1}_Y] - \mathbb{E}[\mathbb{1}_X]\mathbb{E}[\mathbb{1}_Y] = P(X \cap Y) - P(X)P(Y)$$

On cherche donc à majorer \\(|\text{Cov}(\mathbb{1}_X, \mathbb{1}_Y)|\\).
Par l'inégalité de Cauchy-Schwarz appliquée à la covariance :
$$|\text{Cov}(\mathbb{1}_X, \mathbb{1}_Y)| \leq \sqrt{\text{Var}(\mathbb{1}_X)} \sqrt{\text{Var}(\mathbb{1}_Y)}$$

La variance d'une variable de Bernoulli de paramètre \\(p = P(X)\\) est \\(p(1-p)\\).
Étudions la fonction \\(f(p) = p(1-p)\\) sur \\([0, 1]\\).
Sa dérivée est \\(1-2p\\), qui s'annule en \\(p=1/2\\). Le maximum est donc \\(f(1/2) = 1/4\\).

Ainsi :
$$\text{Var}(\mathbb{1}_X) \leq \frac{1}{4} \quad \text{et} \quad \text{Var}(\mathbb{1}_Y) \leq \frac{1}{4}$$

En reportant dans l'inégalité :
$$\big|P(X \cap Y)-P(X)P(Y)\big| \leq \sqrt{\frac{1}{4}} \sqrt{\frac{1}{4}} = \frac{1}{2} \cdot \frac{1}{2} = \frac{1}{4}$$

$$\boxed{\big|P(X \cap Y)-P(X)P(Y)\big| \leq \frac{1}{4}}$$