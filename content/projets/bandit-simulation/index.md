---
title: "Algorithmes de Bandits et Analyse du Regret"
date: 2025-02-14
description: "Étude comparative des stratégies d'exploration (UCB, Thompson Sampling) et analyse de la convergence du regret cumulé."
summary: "Simulation d'environnements stochastiques pour comparer l'efficacité des politiques d'allocation de ressources sous incertitude."
tags: ["Stochastique", "Python", "Reinforcement Learning"]
math: true
---

{{< alert icon="hammer" >}}
**Projet en cours.** L'implémentation vise à vérifier empiriquement les bornes de regret logarithmiques théoriques.
{{< /alert >}}

## 1. Contexte Théorique
Le problème du **Bandit Manchot (Multi-Armed Bandit)** modélise un agent devant choisir séquentiellement parmi $K$ bras pour maximiser ses gains cumulés. Chaque bras $k$ suit une distribution de probabilité inconnue de moyenne $\mu_k$.

On cherche à minimiser le **regret cumulé** $R_T$ après $T$ tirages :

$$
R_T = T \mu^* - \sum_{t=1}^T \mathbb{E}[r_t]
$$

Où $\mu^* = \max_k \mu_k$ est la moyenne du bras optimal.

## 2. Algorithmes Implémentés

### Upper Confidence Bound (UCB1)
Cette approche déterministe repose sur le principe d'**optimisme face à l'incertitude**. À l'instant $t$, on choisit le bras $j$ qui maximise la borne supérieure de l'intervalle de confiance :

$$
A_t = \underset{j}{\operatorname{argmax}} \left( \hat{\mu}_j(t) + \sqrt{\frac{2 \ln t}{N_j(t)}} \right)
$$

Le terme de droite force l'exploration des bras peu visités ($N_j(t)$ faible), garantissant une borne de regret en $O(\ln T)$.

### Thompson Sampling
Approche bayésienne probabiliste. On modélise la connaissance sur chaque bras par une distribution Beta (pour des récompenses de Bernoulli). À chaque étape :
1.  On tire un échantillon $\theta_k \sim \text{Beta}(\alpha_k, \beta_k)$ pour chaque bras.
2.  On choisit le bras maximisant $\theta_k$.
3.  On met à jour la distribution a posteriori selon la récompense observée (Bayes Update).

## 3. Résultats de Simulation
Les simulations Monte-Carlo (1000 itérations) montrent que le Thompson Sampling converge généralement plus vite que l'UCB dans des environnements stationnaires, bien que les deux respectent la borne logarithmique asymptotique.

[Voir le code sur GitHub](https://github.com/marouanedaoudi)