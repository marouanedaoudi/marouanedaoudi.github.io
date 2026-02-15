---
title: "Démonstration : Lemmes de Borel-Cantelli"
date: 2025-02-14
tags: ["Fondamental", "Borel-Cantelli", "Indépendance"]
math: true
summary: "Preuve complète des deux lemmes (Convergence et Divergence)."
---

Soit $(A\_n)$ une suite d'événements. On note $A = \limsup A\_n = \\{ \omega : \omega \in A\_n \text{ pour une infinité de } n \\}$.

## 1. Premier Lemme (Convergence)

**Théorème :** Si $\sum \mathbb{P}(A\_n) < +\infty$, alors $\mathbb{P}(A) = 0$.

**Preuve :**
On sait que $A \subset \bigcup_{k \ge n} A\_k$ pour tout $n$.
Par sous-additivité de la mesure :
$$\mathbb{P}(A) \leq \mathbb{P}\left(\bigcup_{k \ge n} A\_k\right) \leq \sum_{k=n}^{+\infty} \mathbb{P}(A\_k)$$

Comme la série converge, le reste de la série tend vers 0 quand $n \to \infty$.
$$\lim_{n \to \infty} \sum_{k=n}^{+\infty} \mathbb{P}(A\_k) = 0$$
Donc $\mathbb{P}(A) = 0$. $\blacksquare$

## 2. Second Lemme (Divergence / Indépendance)

**Théorème :** Si les $(A\_n)$ sont **indépendants** et $\sum \mathbb{P}(A\_n) = +\infty$, alors $\mathbb{P}(A) = 1$.

**Preuve :**
Il suffit de montrer que $\mathbb{P}(A^c) = 0$.
$A^c = \\{ \text{les } A\_n \text{ ne se réalisent qu'un nombre fini de fois} \\} = \liminf A\_n^c$.
$$A^c = \bigcup_{n \ge 1} \bigcap_{k \ge n} A\_k^c$$
Calculons la probabilité de l'intersection finie :
$$\mathbb{P}\left( \bigcap_{k=n}^m A\_k^c \right) = \prod_{k=n}^m (1 - \mathbb{P}(A\_k))$$
En utilisant l'inégalité $1-x \le e^{-x}$ :
$$\prod_{k=n}^m (1 - \mathbb{P}(A\_k)) \le \prod_{k=n}^m e^{-\mathbb{P}(A\_k)} = \exp\left( - \sum_{k=n}^m \mathbb{P}(A\_k) \right)$$
Quand $m \to \infty$, comme la série diverge, la somme tend vers $+\infty$, donc l'exponentielle tend vers 0.
Ainsi $\mathbb{P}(\bigcap_{k \ge n} A\_k^c) = 0$.
L'union dénombrable d'ensembles de mesure nulle étant de mesure nulle :
$$\mathbb{P}(A^c) = 0 \implies \boxed{\mathbb{P}(A) = 1}$$