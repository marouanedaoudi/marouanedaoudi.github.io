---
title: "Recip Score"
date: 2024-02-10
description: "Algorithme de scoring nutritionnel et analyse statistique de données alimentaires."
summary: "Développement d'un indicateur synthétique de qualité nutritionnelle et pipeline d'analyse de données (ETL & Stats)."
tags: ["Data Science", "R", "Statistiques"]
math: true
---

## 1. Objectif
Le projet **Recip Score** vise à développer un algorithme capable d'attribuer une note de qualité nutritionnelle (de A à E) à des recettes complexes, en se basant sur leur composition en macronutriments.

## 2. Méthodologie Statistique

### Nettoyage et Préparation (Data Cleaning)
Le jeu de données brut présentait de nombreuses incohérences (valeurs manquantes, unités hétérogènes).
* **Imputation :** Traitement des données manquantes par médiane conditionnelle.
* **Détection d'Outliers :** Identification des valeurs aberrantes via l'écart interquartile (IQR).

### Algorithme de Scoring
Le score final $S$ est une combinaison linéaire pondérée de composantes "négatives" $N$ et "positives" $P$ :

$$
S = \sum_{i \in \text{neg}} \omega_i N_i - \sum_{j \in \text{pos}} \lambda_j P_j
$$

* **Composantes Négatives ($N$) :** Densité énergétique, Acides gras saturés, Sucres simples, Sodium.
* **Composantes Positives ($P$) :** Fibres, Protéines, Pourcentage de Fruits/Légumes.

## 3. Analyse Exploratoire
L'analyse sous **R (ggplot2)** a permis de mettre en évidence les corrélations entre la densité calorique et le score obtenu, validant ainsi la pertinence du modèle par rapport aux standards nutritionnels (Nutri-Score).

[Voir le dépôt sur GitHub](https://github.com/akram3409/recip_score)