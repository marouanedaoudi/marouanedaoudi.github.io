---
title: "Bandits adaptatifs et tests multiples"
date: "2026-04-01"
lastmod: "2026-10-15"
weight: 1
description: "Allocations adaptative et uniforme pour les tests multiples séquentiels : quatre variantes, règles de décision et exploration de découvertes réellement archivées."
summary: "Quatre variantes de bandits pour les tests multiples : méthodes, traces de découvertes archivées et analyse des limites statistiques."
tags: ["Bandits", "Python", "Sequential inference"]
projectType: "Projet de recherche en équipe"
code: "https://github.com/Chams22/bandit_approach_simulation"
report: "/uploads/bandit.pdf"
contribution: "Étude et implémentation en équipe, simulations et analyse comparative."
outcome: "Découvertes plus précoces dans plusieurs expériences, avec un gain dépendant du régime et de la règle d’inférence."
imageAlt: "Courbes exactes des découvertes archivées : allocation adaptative et uniforme."
math: true
figures: ["bandit"]
---

Avec Ines Bahraoui et Chams-Eddine Bouaziz. Encadrement : Adrien Nguyen-Huu et Luka Boisgibault, Université de Montpellier, 2025–2026.

## Question de recherche

Comment répartir un budget d’observations entre de nombreux traitements pour identifier rapidement ceux qui dépassent une référence ? L’objectif de ce projet est la **découverte**, plutôt que la maximisation d’une récompense cumulée. L’allocation adaptative utilise les observations déjà recueillies pour choisir le prochain bras à échantillonner ; l’allocation uniforme sert de comparaison.

Pour une référence $\mu_0$, on distingue $H_0=\{i:\mu_i\leq\mu_0\}$ et $H_1=\{i:\mu_i>\mu_0\}$. Si $S_t$ est l’ensemble des découvertes au temps $t$, le taux de fausses découvertes et la puissance moyenne s’écrivent :

$$
\operatorname{FDR}(t)=\mathbb E\!\left[\frac{|S_t\cap H_0|}{|S_t|\vee1}\right],
\qquad
\operatorname{TPR}(t)=\mathbb E\!\left[\frac{|S_t\cap H_1|}{|H_1|}\right].
$$


Le TPR suppose $H_1\neq\varnothing$. Sur une simulation dont les moyennes sont connues, ces deux quantités peuvent être estimées. Sur les méga-études réelles, les vrais positifs sont inconnus : **compter les découvertes n’est pas mesurer le TPR**.

## Quatre variantes, deux composantes

La règle d’allocation et la règle d’inférence jouent des rôles distincts. La première décide où observer ; la seconde décide quand déclarer une découverte. Le code étudié compare les variantes suivantes :

| Variante | Allocation | Inférence implémentée |
|---|---|---|
| JJ | UCB fondé sur une borne de type LIL | Inversion numérique de la borne LIL, avec écart-type empirique ; décision BH |
| V2 | UCB avec rayon Normal Mixture | p-valeur en forme fermée à référence fixe ; décision BH |
| V3 | UCB avec rayon Normal Mixture | Richesse de pari séquentiel, avec modules binaire et continu ; décision BH |
| SR | Tirages cycliques des bras actifs et éliminations par phases | Même formule Normal Mixture et décision BH que V2 |

SR ne déclare donc pas tous les bras non éliminés comme positifs : dans cette implémentation, l’élimination organise les tirages et BH produit les découvertes. La référence uniforme utilise une allocation **cyclique**, et non un tirage aléatoire de bras. Ces distinctions sont vérifiables dans les [modules du dépôt](https://github.com/Chams22/bandit_approach_simulation/tree/bdff6ab960ac0bbab47daa2f1aa5389400b7994f/backend).

## Lire la règle de décision V2

Pour un bras observé $s$ fois, le code maintient sa moyenne $\widehat\mu_s$ et l’accumulateur

$$
V_s=V_{s-1}+(X_s-\widehat\mu_{s-1})^2,
\qquad \widehat\mu_0=0.
$$


Cet accumulateur est une somme d’erreurs de prédiction ; **ce n’est pas le M2 centré de Welford**. Le rayon utilisé par V2, pour $\rho>0$ et $\alpha\in(0,1)$, est

$$
\phi(s,\alpha,V_s,\rho)=\frac{1}{s}
\sqrt{2(V_s+\rho)\log\!\left(\frac{\sqrt{(V_s+\rho)/\rho}}{\alpha}\right)}.
$$


À référence fixe, si $d_s=\widehat\mu_s-\mu_0>0$, l’inversion donne la formule implémentée

$$
p_s=\min\!\left\{1,
\sqrt{\frac{V_s+\rho}{\rho}}
\exp\!\left(-\frac{d_s^2s^2}{2(V_s+\rho)}\right)\right\}.
$$


Le code renvoie $p_s=1$ si $s=0$ ou $d_s\leq0$, et borne numériquement la valeur par $10^{-300}$. Il trie ensuite les $m$ valeurs et cherche

$$
k^*=\max\{k:p_{(k)}\leq\delta k/m\}.
$$


Tous les bras du préfixe de longueur $k^*$ sont retenus, puis ajoutés à $S_t$. Le test BH est une procédure **step-up** : on ne teste pas séparément chaque ligne à un seuil identique.{{< sidenote id="bandit-validity" n="1" >}}Le nom « p-valeur anytime » dans une API ne constitue pas une preuve. La validité exige notamment une construction de séquence de confiance adaptée au modèle d’observation, puis un traitement correct de la dépendance et du niveau de la procédure multiple.{{< /sidenote >}}

{{< algorithm n="1" title="V2 à référence connue, tel qu’implémenté" input="Observations initiales par bras, référence fixe $\mu_0$, niveau $\delta\in(0,1)$ et $\rho>0$." output="Ensemble croissant $S_t$ de bras déclarés positifs." >}}
1. Initialiser les comptes, moyennes et accumulateurs à partir des observations disponibles.
2. Dans la classe adaptative, calibrer ρ par la médiane des ratios Vᵢ/(nᵢ−1) lorsque nᵢ ≥ 2.
3. Parmi les bras non découverts, choisir celui qui maximise la moyenne plus le rayon Normal Mixture évalué au niveau δ/n.
4. Observer ce bras ; actualiser sa moyenne, son accumulateur et son compte.
5. Calculer les p-valeurs, les trier et trouver le plus grand rang satisfaisant le seuil BH δk/n.
6. Ajouter le préfixe retenu à Sₜ et recommencer jusqu’au budget fixé ou à l’absence de candidat.
{{< /algorithm >}}

Lorsque la référence est estimée en ligne, V2 utilise une autre décision : un bras doit satisfaire

$$
\widehat\mu_i-\widehat\mu_c-
\phi(n_i,\alpha/2,V_i,\rho)-
\phi(n_c,\alpha/2,V_c,\rho)\geq0,
\qquad \alpha=\delta k/n.
$$


Les incertitudes du traitement **et** du contrôle sont ainsi combinées. Le helper parcourt les rangs $k$ décroissants et vérifie qu’au moins $k$ bras passent cette borne. Dans cette version, son dénominateur $n$ comprend le bras contrôle ; celui-ci est exclu des découvertes. Les deux calculs ci-dessous reproduisent ces conventions, sans transformer l’exemple pédagogique en preuve statistique.

## Explorer les traces et le calcul

{{< explorable "bandit" >}}

Les courbes de la première figure viennent des **fichiers texte de première découverte**, et non d’une extraction des images du rapport. Chaque jeu contient ici un seul run archivé. Les modes `ADAPT` et `UNIF` utilisent une référence figée ; `ADAPT VAR` et `UNIF VAR` rééchantillonnent le contrôle. Les marches regroupent les bras découverts au même pas.

Dans l’archive EFFORT à référence figée, les deux allocations finissent avec le même ensemble de 59 bras. Le dernier de ces bras est enregistré au pas **1 950** en adaptatif et **22 301** en uniforme. C’est une comparaison de cette trace particulière, pas un facteur universel de réduction de budget. Le compteur du moteur recommence après l’initialisation : ces pas ne représentent pas un coût total incluant les observations initiales.

## Ce que mesure l’étude de simulation

Le [rapport, §5.1](/uploads/bandit.pdf#page=18) décrit séparément un scénario **synthétique** à 12 bras : huit moyennes strictement positives, quatre moyennes nulles, référence 0, écart-type 0,5, niveau nominal 0,05, horizon 800, 330 simulations et 10 observations initiales par bras. Les valeurs suivantes sont celles de sa table 13, et ne concernent pas les archives réelles de la figure.

| Variante | TPR final adaptatif | FDR empirique final adaptatif |
|---|---:|---:|
| JJ | 0,770 | 0,002 |
| V2 | 0,831 | 0,005 |
| V3 | 0,857 | 0,022 |
| SR | 0,706 | 0,002 |

Ce scénario illustre un compromis entre détection et fausses découvertes. Il ne suffit pas à établir un contrôle uniforme du FDR dans tous les régimes. Le rapport examine aussi le bruit, le signal, le niveau nominal, l’initialisation et la proportion de positifs ; quand 90 % de TPR ne sont pas atteints, le temps correspondant est **censuré**, et ne doit pas être remplacé par un gain de 0 %.

## Limites et provenance

Le théorème de Jamieson et Jain suppose une référence connue et des p-valeurs satisfaisant ses hypothèses. Estimer une référence puis la figer n’en fait pas automatiquement la vraie moyenne du contrôle. Une variance empirique substituée à une variance proxy théorique nécessite aussi une justification : c’est particulièrement important pour JJ et le pari continu de V3. Enfin, un contrôle partagé crée une dépendance entre tests.

Une autre limite de comparaison est visible dans le code V2 : l’initialisation auto-calibre $\rho$ dans la classe adaptative, alors que `UniformAlgo.init_process` conserve la valeur fournie. Pour isoler l’effet de l’allocation, il faudrait harmoniser cette calibration. Les figures ci-dessus **conservent les résultats archivés** ; elles ne corrigent ni ne recalculent rétroactivement les expériences.

Les fichiers utilisés sont `figure_real_data_simple/{effort,exercise,penn,walmart}/discovery_times.txt` et `resultats.txt`, à la révision [`bdff6ab`](https://github.com/Chams22/bandit_approach_simulation/commit/bdff6ab960ac0bbab47daa2f1aa5389400b7994f). Le [JSON de la figure](/data/bandit-discoveries.json) conserve les pas, les identifiants de bras, les chemins sources et leurs empreintes SHA-256 avec fins de ligne normalisées. Les fichiers CSV volumineux n’ont pas été réimportés pour cette visualisation.

## Références

Kevin Jamieson et Lalit Jain, [*A Bandit Approach to Multiple Testing with False Discovery Control*](https://arxiv.org/abs/1809.02235), NeurIPS 2018, révision arXiv 2019. Pour l’implémentation examinée : [rayon et p-valeur V2](https://github.com/Chams22/bandit_approach_simulation/blob/bdff6ab960ac0bbab47daa2f1aa5389400b7994f/backend/adaptative_algorithm_v2.py#L106-L159), [décision BH](https://github.com/Chams22/bandit_approach_simulation/blob/bdff6ab960ac0bbab47daa2f1aa5389400b7994f/backend/adaptative_algorithm_v2.py#L302-L333) et [comparaison à un contrôle incertain](https://github.com/Chams22/bandit_approach_simulation/blob/bdff6ab960ac0bbab47daa2f1aa5389400b7994f/backend/adaptative_algorithm_v2.py#L35-L58). Le rapport du projet fournit la bibliographie et les protocoles complets.
