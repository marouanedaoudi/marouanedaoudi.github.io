---
title: "Recip Score"
date: 2024-02-10
weight: 4
description: "Application Python développée en équipe pour croiser données nutritionnelles et recettes, calculer des scores et filtrer les recettes par ingrédients."
summary: "Du traitement de données à une application web de sélection de recettes."
tags: ["Python", "Data analysis", "Team project"]
math: true
lastmod: "2026-10-14"
code: "https://github.com/akram3409/recip_score"
projectType: "Projet de données en équipe"
contribution: "Contribution en équipe au traitement des données et au calcul des scores."
outcome: "Application web combinant deux sources de données et un filtre par ingrédients."
imageAlt: "Aperçu du projet Recip Score."
---

**Recip Score** est un projet en équipe avec Akram El Mahzoum, Chams-Eddine Bouaziz et Moussa Diagne. Il combine le traitement de données en **Python** et une application web pour explorer des recettes à partir de leur composition nutritionnelle et des ingrédients disponibles.

Les formules ci-dessous décrivent la version historique du score étudiée dans le projet. Elles ne constituent pas une présentation des règles officielles actuelles, ni une validation nutritionnelle des recettes.


## Le problème

Le **Nutri-Score** est un indicateur nutritionnel officiel (grades A à E) bien défini pour les produits alimentaires transformés. L'appliquer à des **recettes** est plus difficile : une recette est un assemblage d'ingrédients en proportions variables, dont les données nutritionnelles doivent être agrégées depuis des bases brutes, normalisées par 100g, puis soumises à l'algorithme de scoring.

Ce projet propose une application web qui automatise ce calcul et permet en plus à un utilisateur de découvrir les meilleures recettes réalisables à partir des ingrédients qu'il a sous la main.

## Données

- **Base nutritionnelle :** USDA Food Data Central — plusieurs centaines de milliers d'aliments avec leurs compositions détaillées (macronutriments, fibres, sodium, etc.) par 100g.
- **Recettes :** dataset open-source de Joseph R. Martinez (GitHub), contenant les ingrédients et quantités de milliers de recettes.

Le pipeline ETL joint ces deux sources par correspondance de noms d'ingrédients, après normalisation textuelle, puis agrège les valeurs nutritionnelles pondérées par les quantités pour obtenir la composition de la recette entière **par 100g de plat**.

## L'algorithme Nutri-Score

Le Nutri-Score repose sur un **score entier** $S \in [-15, +40]$ combinant des points négatifs (nutriments à limiter) et des points positifs (nutriments à favoriser) :

$$
S = N - P
$$

### Points négatifs $N$ (0 à 40)

Chacun des quatre nutriments contribue de 0 à 10 points selon des seuils par paliers :

| Nutriment | 0 pt | ... | 10 pts |
|-----------|------|-----|--------|
| Énergie (kJ/100g) | $\leq 335$ | | $> 3350$ |
| Acides gras saturés (g/100g) | $\leq 1$ | | $> 10$ |
| Sucres (g/100g) | $\leq 4{,}5$ | | $> 45$ |
| Sodium (mg/100g) | $\leq 90$ | | $> 900$ |

Formellement, pour un nutriment $i$ de valeur $v_i$, on note $n_i(v_i) \in \{0, \ldots, 10\}$ le nombre de seuils franchis, et $N = \sum_{i} n_i(v_i)$.

### Points positifs $P$ (0 à 15)

| Composante | 0 pt | ... | max |
|-----------|------|-----|-----|
| Fibres (g/100g) | $< 0{,}7$ | | 5 pts ($\geq 3{,}5$) |
| Protéines (g/100g) | $< 1{,}6$ | | 5 pts ($\geq 8$) |
| Fruits/légumes (%) | $< 40\%$ | | 5 pts ($\geq 80\%$) |

### Attribution du grade

$$
\text{Grade} = \begin{cases} A & \text{si } S \leq -1 \\ B & \text{si } 0 \leq S \leq 2 \\ C & \text{si } 3 \leq S \leq 10 \\ D & \text{si } 11 \leq S \leq 18 \\ E & \text{si } S \geq 19 \end{cases}
$$

### Application aux recettes

Pour une recette composée d'ingrédients $1, \ldots, K$ en quantités $q_1, \ldots, q_K$ (en grammes), la valeur nutritionnelle par 100g du plat pour un nutriment donné est :

$$
v = \frac{\sum_{k=1}^K q_k \cdot v_k^{(100\text{g})}}{{\sum_{k=1}^K q_k}}
$$

où $v_k^{(100\text{g})}$ est la teneur en ce nutriment dans l'ingrédient $k$ pour 100g. On applique ensuite la version du score utilisée dans le projet à ces valeurs agrégées.

## Moteur de recommandation

L'application permet à l'utilisateur de saisir ses ingrédients disponibles. Le moteur filtre les recettes réalisables (celles dont tous les ingrédients sont présents ou substituables) et les trie par Nutri-Score, orientant l'utilisateur vers les options les plus nutritives parmi ce qu'il peut cuisiner.

## Application web

Le dépôt documente un déploiement sur PythonAnywhere. Il a été développé en équipe avec Akram El Mahzoum, Chams-Eddine Bouaziz et Moussa Diagne.

---

**Code source :** [GitHub](https://github.com/akram3409/recip_score)
