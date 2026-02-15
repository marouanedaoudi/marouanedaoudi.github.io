---
title: "Exercice : Convergence p.s. et Borel-Cantelli"
date: 2025-02-14
tags: ["Borel-Cantelli", "Convergence p.s."]
math: true
summary: "Application du lemme de Borel-Cantelli."
---

{{< alert icon="circle-info" >}}
**Énoncé :**
Soit $(X\_n)\_{n \in \mathbb{N}}$ une suite de variables aléatoires réelles. On suppose qu'il existe une suite de réels $(a\_n)\_{n \in \mathbb{N}}$ telle que les séries suivantes soient convergentes :

1. $\sum\_{n \in \mathbb{N}} a\_n$
2. $\sum\_{n \in \mathbb{N}} P(X\_n \neq a\_n)$

Démontrer que la série $\sum\_{n \in \mathbb{N}} X\_n$ est convergente presque sûrement.
{{< /alert >}}

## Solution

Nous allons utiliser le **premier lemme de Borel-Cantelli**.

Posons l'événement $A\_n = \{X\_n \neq a\_n\}$.
L'hypothèse nous dit que $\sum\_{n \in \mathbb{N}} P(A\_n) < +\infty$.

D'après le lemme de Borel-Cantelli, cela implique que la probabilité que $A\_n$ se réalise une infinité de fois est nulle :
$$P(\limsup\_{n \rightarrow +\infty} A\_n) = 0$$

Cela signifie que pour presque tout $\omega \in \Omega$, l'événement $A\_n$ ne se réalise qu'un nombre fini de fois.
Autrement dit, pour presque tout $\omega$, il existe un rang $N(\omega) \in \mathbb{N}$ tel que :
$$\forall n \geq N(\omega), \quad X\_n(\omega) = a\_n$$

Regardons maintenant la série $\sum X\_n$. Pour un $\omega$ fixé (dans l'ensemble de mesure 1), on peut découper la somme :
$$\sum\_{n=0}^{+\infty} X\_n(\omega) = \sum\_{n=0}^{N(\omega)-1} X\_n(\omega) + \sum\_{n=N(\omega)}^{+\infty} a\_n$$

* Le premier terme est une somme finie.
* Le second terme est le reste d'une série numérique convergente.

La somme de deux termes finis étant finie, la série converge p.s.

$$\boxed{\sum\_{n \in \mathbb{N}}X\_n \quad \text{converge p.s.}}$$