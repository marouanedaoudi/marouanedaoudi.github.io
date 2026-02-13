---
title: "L1-Ball Projected Gradient Descent"
date: 2024-05-20
description: "Implémentation de la Descente de Gradient Projetée sur la boule L1 pour l'optimisation convexe sparse."
summary: "Résolution du problème Lasso contraint via un algorithme de projection euclidienne efficace en O(n log n)."
tags: ["Optimisation", "Python", "NumPy"]
math: true
---

## 1. Formulation du Problème
Ce projet traite de la minimisation d'une fonction convexe $f$ (perte quadratique) sous une contrainte de norme $\ell_1$. Cette contrainte induit la **sparsité** des solutions, propriété fondamentale pour la sélection de variables en grande dimension.

Le problème d'optimisation s'écrit :

$$
\min_{x \in \mathbb{R}^n} f(x) \quad \text{s.c.} \quad \|x\|_1 \leq \tau
$$

## 2. Algorithme PGD (Projected Gradient Descent)
La méthode itérative combine une descente de gradient standard et une projection sur l'ensemble admissible $\mathcal{C} = \{x : \|x\|_1 \leq \tau\}$ :

$$
x_{k+1} = \Pi_{\mathcal{C}} \left( x_k - \eta \nabla f(x_k) \right)
$$

### La Projection sur la Boule L1
Contrairement à la boule $\ell_2$, la projection sur la boule $\ell_1$ n'a pas de solution analytique immédiate. J'ai implémenté l'algorithme efficace basé sur le tri des composantes (Duchi et al., 2008), qui opère en complexité $O(n \log n)$ :
1.  Prendre la valeur absolue $u = |v|$ et trier $u$ par ordre décroissant.
2.  Calculer le seuil $\rho$ optimal via une somme cumulée.
3.  Appliquer l'opérateur de seuillage doux (Soft-Thresholding).

## 3. Stack Technique
* **Langage :** Python.
* **Calcul Matriciel :** NumPy (vectorisation intégrale pour la performance).
* **Validation :** Comparaison de la convergence et de la sparsité obtenue face aux solveurs standards (`cvxpy`).

[Voir le dépôt sur GitHub](https://github.com/marouanedaoudi/L1BallPGD)