---
title: "Continuité de la Fonction de Répartition"
date: 2025-02-14
tags: ["Fonction de répartition", "Mesure"]
math: true
summary: "Lien entre la continuité de F et la probabilité des singletons."
---

{{< alert icon="circle-info" >}}
**Propriété :**
Soit $F$ la fonction de répartition d'une mesure de probabilité $\mathbb{P}$.
Montrer que $F$ est continue en $a$ si et seulement si $\mathbb{P}(\\{a\\}) = 0$.
{{< /alert >}}

## Démonstration

Rappelons que la fonction de répartition est définie par $F(x) = \mathbb{P}(]-\infty, x])$.
Elle est toujours **continue à droite**. La question porte sur la continuité à gauche.

Soit $(a\_n)$ une suite strictement croissante convergeant vers $a$. On a :
$$\bigcup_{n \in \mathbb{N}} ]-\infty, a\_n] = ]-\infty, a[$$

Par continuité croissante de la mesure :
$$\lim_{n \to \infty} F(a\_n) = \lim_{n \to \infty} \mathbb{P}(]-\infty, a\_n]) = \mathbb{P}(]-\infty, a[)$$

Or, nous savons que :
$$F(a) = \mathbb{P}(]-\infty, a]) = \mathbb{P}(]-\infty, a[) + \mathbb{P}(\\{a\\})$$

Ainsi, la limite à gauche est égale à la valeur en $a$ ($F(a^-) = F(a)$) si et seulement si :
$$\mathbb{P}(]-\infty, a[) = \mathbb{P}(]-\infty, a[) + \mathbb{P}(\\{a\\})$$
$$\iff \mathbb{P}(\\{a\\}) = 0$$

$$\boxed{F \text{ continue en } a \iff \mathbb{P}(\\{a\\}) = 0}$$