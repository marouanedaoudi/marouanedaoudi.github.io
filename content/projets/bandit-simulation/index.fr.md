---
title: "Bandits adaptatifs et tests multiples"
date: "2026-04-01"
lastmod: "2026-10-14"
weight: 1
description: "Étude en équipe de l’échantillonnage adaptatif pour les tests multiples : implémentation, simulations et limites du contrôle séquentiel des fausses découvertes."
summary: "Bandits, inférence séquentielle et contrôle du FDR : comparaison empirique des allocations adaptative et uniforme."
tags: ["Bandits", "Python", "Sequential inference"]
projectType: "Projet de recherche en équipe"
code: "https://github.com/Chams22/bandit_approach_simulation"
report: "/uploads/bandit.pdf"
contribution: "Étude et implémentation en équipe, simulations et analyse comparative."
outcome: "Détection généralement plus précoce dans les expériences du rapport, avec un gain dépendant du régime expérimental."
imageAlt: "Trajectoires du taux de vrais positifs : allocation adaptative et uniforme."
math: true
---

Comment identifier des interventions utiles tout en consacrant moins d’observations aux bras peu informatifs ? Ce projet en équipe étudie **l’échantillonnage adaptatif pour les tests multiples séquentiels**, à l’intersection des bandits multi-bras et du contrôle des fausses découvertes.

**Avec :** Ines Bahraoui et Chams-Eddine Bouaziz. **Encadrement :** Adrien Nguyen-Huu et Luka Boisgibault, Université de Montpellier, 2025–2026.

## Question et démarche

Nous étudions le cadre de Jamieson et Jain : tirer successivement l’un des $n$ bras, comparer sa moyenne inconnue $\mu_i$ à une référence $\mu_0$ et maintenir un ensemble de découvertes $S_t$. L’objectif est d’identifier les bras supérieurs à la référence, plutôt que de maximiser le gain cumulé.

En notant $H_0 = \{i : \mu_i \leq \mu_0\}$ et $H_1 = \{i : \mu_i > \mu_0\}$, deux quantités complémentaires sont :

$$
\operatorname{FDR}(t) = \mathbb{E}\!\left[\frac{|S_t \cap H_0|}{|S_t|\vee 1}\right],
\qquad
\operatorname{TPR}(t) = \mathbb{E}\!\left[\frac{|S_t \cap H_1|}{|H_1|}\right].
$$

Le TPR est considéré lorsque $H_1$ est non vide. L’enjeu consiste à découvrir rapidement les bras positifs tout en maîtrisant les fausses découvertes. Réutiliser des tests classiques à horizon fixe ne suffit pas lorsque les décisions d’échantillonnage et d’arrêt dépendent des observations passées.

## Inférence séquentielle et allocation

L’étude articule trois composantes :

1. **Échantillonnage :** une règle adaptative de type UCB, ou une allocation uniforme comme référence.
2. **Inférence :** des séquences de confiance et des p-valeurs anytime adaptées aux observations répétées.
3. **Tests multiples :** une procédure de découverte de type Benjamini–Hochberg.

Une séquence de confiance vise une couverture simultanée de la forme

$$
\mathbb{P}\!\left(\forall s\geq 1,\; |\widehat\mu_{i,s}-\mu_i|\leq \phi_i(s,\alpha)\right)\geq 1-\alpha.
$$

Cette propriété exige des hypothèses adaptées aux observations et à la borne choisie. Une simulation ne suffit pas à la démontrer.

L’implémentation compare plusieurs constructions :

| Variante | Composante principale |
|---|---|
| JJ | Borne de confiance de type LIL et inversion numérique |
| V2 | Construction Normal Mixture et calcul de p-valeur en forme fermée |
| V3 | Construction par pari séquentiel, avec variantes binaire et continue |
| SR | Allocation par rejets successifs servant de comparaison |

Le dépôt comprend aussi une interface Streamlit pour explorer les simulations et comparer les configurations.

## Étude empirique

Le rapport examine l’influence du niveau de confiance, du bruit, de l’écart à la référence, du budget d’initialisation et de la proportion de bras positifs. Il compare les trajectoires de détection, les fausses découvertes et les ordres de découverte sur des données synthétiques et sur des jeux de données de méga-études rééchantillonnés.

![Simulation existante comparant les trajectoires du taux de vrais positifs pour les allocations adaptative et uniforme](feature.png)

*Illustration issue des simulations du projet. Les protocoles et résultats complets figurent dans le rapport.*

Dans les expériences rapportées, l’allocation adaptative atteint généralement des ensembles de découvertes comparables plus tôt que l’allocation uniforme. L’avantage dépend de l’intensité du signal, du bruit, de l’initialisation et du nombre de bras positifs ; il ne constitue pas une réduction universelle et fixe de la taille d’échantillon.

## Interprétation et limites

Le rapport distingue **performance empirique** et **garanties statistiques formelles**. En particulier, estimer la référence à partir d’un bras contrôle évolutif modifie le cadre original à référence fixe. Remplacer une variance théorique par une variance empirique dans une borne de confiance demande également une justification.

Sur les données réelles, les bras réellement positifs sont inconnus. Le rééchantillonnage permet de comparer les algorithmes sur les données disponibles, sans établir une vérité causale. Ces limites font partie de l’étude et motivent des prolongements sur les constructions d’inférence séquentielle adaptées.

## Référence

Kevin Jamieson et Lalit Jain (2018 ; révision arXiv 2019), [*A Bandit Approach to Multiple Testing with False Discovery Control*](https://arxiv.org/abs/1809.02235). Le rapport du projet fournit la bibliographie et les détails expérimentaux complets.
