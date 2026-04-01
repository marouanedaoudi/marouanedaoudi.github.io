---
title: "Recip Score"
date: 2024-02-10
description: "Web application computing the Nutri-Score of recipes and suggesting optimal recipes from available ingredients."
summary: "Nutri-Score computation for full recipes via USDA nutritional data aggregation, with an ingredient-based recipe recommendation engine."
tags: ["Data Science", "R", "Statistics"]
math: true
---

## The Problem

The **Nutri-Score** is an official nutritional indicator (grades A to E) well-defined for processed food products. Applying it to **recipes** is harder: a recipe is an assembly of ingredients in variable proportions, whose nutritional data must be aggregated from raw databases, normalized per serving, and then fed to the scoring algorithm.

This project provides a web application that automates this computation and additionally lets users discover the best recipes they can make from the ingredients they have on hand.

## Data

- **Nutritional database:** USDA Food Data Central — several hundred thousand foods with detailed compositions (macronutrients, fiber, sodium, etc.) per 100g.
- **Recipes:** open-source dataset by Joseph R. Martinez (GitHub), containing ingredients and quantities for thousands of recipes.

The ETL pipeline joins these two sources by ingredient name matching (after text normalization), then aggregates nutritional values weighted by quantities to obtain the full recipe composition **per 100g of dish**.

## The Nutri-Score Algorithm

Nutri-Score relies on an **integer score** $S \in [-15, +40]$ combining negative points (nutrients to limit) and positive points (nutrients to favor):

$$
S = N - P
$$

### Negative Points $N$ (0 to 40)

Each of four nutrients contributes 0 to 10 points according to stepped thresholds:

| Nutrient | 0 pts | ... | 10 pts |
|----------|-------|-----|--------|
| Energy (kJ/100g) | $\leq 335$ | | $> 3350$ |
| Saturated fatty acids (g/100g) | $\leq 1$ | | $> 10$ |
| Sugars (g/100g) | $\leq 4{.}5$ | | $> 45$ |
| Sodium (mg/100g) | $\leq 90$ | | $> 900$ |

Formally, for nutrient $i$ with value $v_i$, let $n_i(v_i) \in \{0, \ldots, 10\}$ denote the number of thresholds crossed; then $N = \sum_{i} n_i(v_i)$.

### Positive Points $P$ (0 to 15)

| Component | 0 pts | ... | max |
|-----------|-------|-----|-----|
| Fiber (g/100g) | $< 0{.}7$ | | 5 pts ($\geq 3{.}5$) |
| Protein (g/100g) | $< 1{.}6$ | | 5 pts ($\geq 8$) |
| Fruits/vegetables (%) | $< 40\%$ | | 5 pts ($\geq 80\%$) |

### Grade Assignment

$$
\text{Grade} = \begin{cases} A & \text{if } S \leq -1 \\ B & \text{if } 0 \leq S \leq 2 \\ C & \text{if } 3 \leq S \leq 10 \\ D & \text{if } 11 \leq S \leq 18 \\ E & \text{if } S \geq 19 \end{cases}
$$

### Application to Recipes

For a recipe made of ingredients $1, \ldots, K$ in quantities $q_1, \ldots, q_K$ (in grams), the nutritional value per 100g of dish for a given nutrient is:

$$
v = \frac{\sum_{k=1}^K q_k \cdot v_k^{(100\text{g})}}{{\sum_{k=1}^K q_k}}
$$

where $v_k^{(100\text{g})}$ is the nutrient content of ingredient $k$ per 100g. The standard Nutri-Score algorithm is then applied to these aggregated values.

## Recommendation Engine

The application lets users enter their available ingredients. The engine filters feasible recipes (those whose ingredients are all present or substitutable) and ranks them by Nutri-Score, guiding the user toward the most nutritious options among what they can cook.

## Web Application

The project is deployed on PythonAnywhere. It was developed as a team project with Akram El Mahzoum, Chams-Eddine Bouaziz and Moussa Diagne.

---

**Source code:** [GitHub](https://github.com/akram3409/recip_score)
