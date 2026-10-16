---
title: "Recip Score"
date: 2024-02-10
lastmod: 2026-10-15
weight: 4
description: "Projet Python en équipe reliant recettes et données nutritionnelles. Une figure interactive suit de vraies lignes ingrédients dans le calcul historique du dépôt."
summary: "Des ingrédients appariés aux nutriments pondérés, puis au score historique."
tags: ["Python", "Analyse de données", "Projet en équipe"]
math: true
figures: ["recip"]
code: "https://github.com/akram3409/recip_score"
projectType: "Projet de données en équipe"
preview: "recip"
---

Avec Akram El Mahzoum, Chams-Eddine Bouaziz et Moussa Diagne. Le projet associe les ingrédients des recettes à des références nutritionnelles, calcule un score par recette et présente les résultats dans une application Flask.

Cette page décrit **le code effectivement présent dans le dépôt**. Son calcul historique ne représente pas les règles officielles actuelles du Nutri-Score et ne valide pas la qualité nutritionnelle d’une recette.

## Des noms aux entrées numériques

Le pipeline part des données [USDA FoodData Central](https://fdc.nal.usda.gov/download-datasets) et d’un [jeu de recettes](https://github.com/josephrmartinez/recipe-dataset). Les noms d’ingrédients sont normalisés, puis appariés aux descriptions nutritionnelles par mots communs. Le choix favorise les premières positions des mots partagés, leur position moyenne, puis leur nombre. C’est une heuristique textuelle, pas une garantie d’équivalence entre les aliments.

{{< sidenote id="recip-matching" n="1" >}}
La clé de sélection est `(min(indices), mean(indices), -nombre_de_mots_communs)`. Voir [`database_joint.py`, lignes 238–255](https://github.com/akram3409/recip_score/blob/555fd16f85f032bfe999311d2bb26f5a57f88f35/backend/database_joint.py#L238). La figure conserve la référence associée à chaque ingrédient pour rendre cette incertitude visible.
{{< /sidenote >}}

## Suivre trois recettes réelles

Choisir une recette, puis parcourir les masses, les contributions absolues, la normalisation pour 100 g et la branche de calcul du score. Les valeurs viennent du CSV des ingrédients du dépôt. Le résultat enregistré et celui recalculé sont affichés séparément.

{{< explorable "recip" >}}

Pour l’ingrédient $i$, la masse utilisée par le code est $w_i=q_i u_i$, avec $q_i=$ `quantity_num` et $u_i=$ `grams_per_unit`. Une teneur $v_i$ pour 100 g contribue à hauteur de $w_i v_i/100$ dans la recette. La teneur finale pour 100 g vaut donc

$$
v_{100}=\frac{\sum_i w_i v_i}{\sum_i w_i}.
$$


Le sodium en milligrammes est converti en sel en grammes par le facteur $2.5/1000$. Les entrées non numériques sont remplacées par zéro. Une masse totale inférieure ou égale à $0.1$ g donne la lettre inconnue `?`. Le calcul n’applique pas de correction de rendement ou de perte d’eau à la cuisson.

## La règle de score implémentée

{{< algorithm title="Score historique par recette" n="1" input="Teneurs $v_{100}$ pour 100 g et masse totale $W$." output="Score $S=A-C$ et lettre A–E ; ? si la masse est insuffisante." >}}
1. Si $W\leq0{,}1$ g, renvoyer la lettre inconnue ?.
2. Compter les seuils atteints ou dépassés (`>=`) pour l’énergie, les sucres, les lipides totaux et le sel ; additionner ces points dans $A$.
3. Compter les points de fibres et de protéines. Fixer les points fruits/légumes à zéro.
4. Si $A\geq11$, poser $C$ égal aux points de fibres ; sinon, ajouter les points de protéines. Calculer $S=A-C$.
5. Affecter A si $S\leq-1$, B si $S\leq2$, C si $S\leq10$, D si $S\leq18$, puis E au-delà.
6. Calculer la lettre avant l’arrondi à deux décimales des valeurs exportées.
{{< /algorithm >}}

Les seuils de points négatifs du code sont :

| Colonne utilisée | Seuils comptés avec `>=` |
|---|---|
| Énergie, **kcal** pour 100 g | 335, 670, 1005, 1340, 1675, 2010, 2345, 2680, 3015, 3350 |
| Sucres, g pour 100 g | 4.5, 9, 13.5, 18, 22.5, 27, 31.5, 36, 40.5, 45 |
| **Lipides totaux**, g pour 100 g | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 |
| Sel, g pour 100 g | 0.09, 0.18, 0.27, 0.36, 0.45, 0.54, 0.63, 0.72, 0.81, 0.90 |

Les seuils des fibres sont 0.9, 1.9, 2.8, 3.7 et 4.7 g ; ceux des protéines, 1.6, 3.2, 4.8, 6.4 et 8 g. **Le code applique directement les seuils d’énergie à une colonne kcal et utilise les lipides totaux dans la composante nommée AGS.** La figure reproduit ces choix sans les corriger silencieusement.

## Portée et limites du résultat

La lettre dépend de l’appariement des aliments, de la conversion des quantités, des valeurs manquantes et du code de score. Près d’un seuil, repartir d’un CSV arrondi peut donner un autre résultat que le calcul avant arrondi. La figure distingue donc recalcul en pleine précision, lettre enregistrée et recalcul depuis les valeurs arrondies.

L’API de recherche intersecte les ensembles de recettes contenant chaque ingrédient sélectionné. Elle trouve les recettes contenant **tous les ingrédients demandés** ; cela ne signifie pas qu’elles ne nécessitent aucun autre ingrédient. Cet endpoint ne classe pas ses résultats selon le score.

## Source

Code fixé au commit [`555fd16f`](https://github.com/akram3409/recip_score/tree/555fd16f85f032bfe999311d2bb26f5a57f88f35). Calcul : [`nutriscore_calculation.py`](https://github.com/akram3409/recip_score/blob/555fd16f85f032bfe999311d2bb26f5a57f88f35/backend/nutriscore_calculation.py#L80). Exemples : [`recipe_ingredient_nutrition_clean.csv`](https://github.com/akram3409/recip_score/blob/555fd16f85f032bfe999311d2bb26f5a57f88f35/datasets/donnees_propres/recipe_ingredient_nutrition_clean.csv) et [`recipe_nutriscore.csv`](https://github.com/akram3409/recip_score/blob/555fd16f85f032bfe999311d2bb26f5a57f88f35/datasets/donnees_propres/recipe_nutriscore.csv). Intersection d’ingrédients : [`app.py`, lignes 226–272](https://github.com/akram3409/recip_score/blob/555fd16f85f032bfe999311d2bb26f5a57f88f35/app.py#L226).
