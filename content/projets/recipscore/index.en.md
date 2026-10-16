---
title: "Recip Score"
date: 2024-02-10
lastmod: 2026-10-15
weight: 4
description: "A Python team project joining recipe and nutritional data. An interactive example traces actual ingredient rows through the historical scoring implementation."
summary: "From matched ingredients to weighted nutrient values and a historical score."
tags: ["Python", "Data analysis", "Team project"]
math: true
figures: ["recip"]
code: "https://github.com/akram3409/recip_score"
projectType: "Team data project"
preview: "recip"
---

With Akram El Mahzoum, Chams-Eddine Bouaziz and Moussa Diagne. The project combines recipe ingredients with nutritional reference data, computes a recipe-level score and exposes the results through a Flask application.

This page explains **the code actually present in the repository**. Its historical scoring implementation is not a statement of the current official Nutri-Score rules and does not validate the nutritional quality of a recipe.

## From names to numerical inputs

The pipeline starts from [USDA FoodData Central](https://fdc.nal.usda.gov/download-datasets) and a [recipe dataset](https://github.com/josephrmartinez/recipe-dataset). Ingredient names are normalized and matched to nutritional descriptions by overlapping words. The selection favors earlier shared-word positions, then their mean position, then the number of shared words. This is a text-matching heuristic, not a semantic guarantee that the two foods are equivalent.

{{< sidenote id="recip-matching" n="1" >}}
The exact selection key is `(min(indices), mean(indices), -number_of_shared_words)`. See [`database_joint.py`, lines 238–255](https://github.com/akram3409/recip_score/blob/555fd16f85f032bfe999311d2bb26f5a57f88f35/backend/database_joint.py#L238). The figure keeps the matched reference visible so this uncertainty is not hidden by the final letter.
{{< /sidenote >}}

## Follow three actual recipes

Choose a recipe and advance from ingredient masses to absolute contributions, values per 100 g and the final scoring branch. The examples use the repository’s ingredient CSV, rather than invented nutrient values. The stored result and the recomputed result are shown separately.

{{< explorable "recip" >}}

For ingredient $i$, the implemented mass is $w_i=q_i u_i$, where $q_i$ is `quantity_num` and $u_i$ is `grams_per_unit`. A nutrient value $v_i$ per 100 g contributes $w_i v_i/100$ to the recipe. Thus the recipe value per 100 g is

$$
v_{100}=\frac{\sum_i w_i v_i}{\sum_i w_i}.
$$


The code converts sodium in milligrams to salt in grams using the factor $2.5/1000$. Non-numeric inputs are coerced to zero. A total mass at most $0.1$ g produces the unknown grade `?`. No cooking yield or water-loss correction is applied here.

## The implemented scoring rule

{{< algorithm title="Historical recipe score" n="1" input="Nutrient values $v_{100}$ per 100 g and total mass $W$." output="Score $S=A-C$ and grade A–E; ? if the mass is insufficient." >}}
1. If $W\leq0.1$ g, return the unknown grade ?.
2. Count the thresholds reached or exceeded (`>=`) for energy, sugars, total fat and salt; sum these points into $A$.
3. Count fibre points and protein points. Set fruit/vegetable points to zero.
4. If $A\geq11$, let $C$ be the fibre points; otherwise add the protein points. Compute $S=A-C$.
5. Assign A for $S\leq-1$, B for $S\leq2$, C for $S\leq10$, D for $S\leq18$, and E otherwise.
6. Compute the letter before rounding the exported nutrient values to two decimals.
{{< /algorithm >}}

The negative-point thresholds in the source are:

| Input column | Thresholds counted with `>=` |
|---|---|
| Energy, **kcal** per 100 g | 335, 670, 1005, 1340, 1675, 2010, 2345, 2680, 3015, 3350 |
| Sugars, g per 100 g | 4.5, 9, 13.5, 18, 22.5, 27, 31.5, 36, 40.5, 45 |
| **Total fat**, g per 100 g | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 |
| Salt, g per 100 g | 0.09, 0.18, 0.27, 0.36, 0.45, 0.54, 0.63, 0.72, 0.81, 0.90 |

Fibre thresholds are 0.9, 1.9, 2.8, 3.7 and 4.7 g; protein thresholds are 1.6, 3.2, 4.8, 6.4 and 8 g. **Energy thresholds are applied directly to a kcal column, and the column used for saturated-fat points actually contains total fat.** These implementation choices are reproduced in the figure, not silently corrected.

## What the result does and does not mean

The letter depends on ingredient matching, quantity conversion, missing values and the scoring code. Near a threshold, recomputing from a rounded exported CSV can differ from the pre-rounding calculation. The figure therefore separates full-precision recomputation, stored CSV grade and recomputation from rounded CSV values.

The ingredient-search API intersects the sets of recipes containing each selected ingredient. That finds recipes containing **all requested ingredients**; it does not prove they require no other ingredients, and the endpoint does not rank its results by the score.

## Source

Pinned code: commit [`555fd16f`](https://github.com/akram3409/recip_score/tree/555fd16f85f032bfe999311d2bb26f5a57f88f35). Calculation: [`nutriscore_calculation.py`](https://github.com/akram3409/recip_score/blob/555fd16f85f032bfe999311d2bb26f5a57f88f35/backend/nutriscore_calculation.py#L80). Examples: [`recipe_ingredient_nutrition_clean.csv`](https://github.com/akram3409/recip_score/blob/555fd16f85f032bfe999311d2bb26f5a57f88f35/datasets/donnees_propres/recipe_ingredient_nutrition_clean.csv) and [`recipe_nutriscore.csv`](https://github.com/akram3409/recip_score/blob/555fd16f85f032bfe999311d2bb26f5a57f88f35/datasets/donnees_propres/recipe_nutriscore.csv). Ingredient intersection: [`app.py`, lines 226–272](https://github.com/akram3409/recip_score/blob/555fd16f85f032bfe999311d2bb26f5a57f88f35/app.py#L226).
