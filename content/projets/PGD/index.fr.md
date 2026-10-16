---
title: "L1-Ball Projected Gradient Descent"
date: 2025-05-20
weight: 2
description: "Implémentations NumPy de PGD et FISTA pour les moindres carrés sous contrainte L1, avec projection en O(p log p) et comparaison numérique avec scikit-learn."
summary: "PGD et FISTA pour le Lasso contraint, avec projection exacte sur la boule L1 et comparaison avec scikit-learn."
tags: ["Optimisation", "Python", "NumPy", "FISTA"]
math: true
lastmod: "2026-10-15"
code: "https://github.com/marouanedaoudi/L1BallPGD"
projectType: "Optimisation numérique"
contribution: "Implémentation Python de PGD, FISTA et de la projection exacte sur la boule L1."
outcome: "Comparaison numérique avec scikit-learn et étude de convergence sur un exemple synthétique."
imageAlt: "Comparaison des trajectoires de convergence de PGD et FISTA."
figures: ["pgd"]
---

## Moindres carrés sous contrainte

Pour une matrice $X\in\mathbb R^{n\times p}$ et une réponse $y\in\mathbb R^n$, le projet résout

$$
\min_{\beta\in\mathbb R^p} f(\beta)
=\frac12\|X\beta-y\|_2^2
\quad\text{sous la contrainte}\quad\|\beta\|_1\leq\tau.
$$


Le gradient est $\nabla f(\beta)=X^\top(X\beta-y)$ et sa constante de Lipschitz vaut $L=\|X\|_2^2$. Les deux solveurs partent de zéro et utilisent le pas fixe $\eta=1/L$. La contrainte L1 peut annuler certaines coordonnées ; elle ne garantit pas à elle seule que les variables sélectionnées correspondent aux variables génératrices.

## Gradient projeté et accélération

PGD effectue un pas de gradient, puis projette le résultat sur $\mathcal C_\tau=\{\beta:\|\beta\|_1\leq\tau\}$ :

$$
\beta_{k+1}=P_\tau\!\left(\beta_k-\eta\nabla f(\beta_k)\right).
$$


FISTA évalue le gradient en un point extrapolé $z_k$ :

$$
\begin{aligned}
\beta_{k+1}&=P_\tau\!\left(z_k-\eta\nabla f(z_k)\right),\\
\theta_{k+1}&=\frac{1+\sqrt{1+4\theta_k^2}}2,\\
z_{k+1}&=\beta_{k+1}+\frac{\theta_k-1}{\theta_{k+1}}(\beta_{k+1}-\beta_k),
\end{aligned}
\qquad z_0=\beta_0=0,\quad\theta_0=1.
$$


Les itérés projetés restent admissibles, contrairement aux points extrapolés qui peuvent sortir de la boule. Pour une fonction convexe à gradient lipschitzien, les bornes de pire cas sur l’écart à l’optimum sont en $\mathcal O(1/k)$ pour PGD et en $\mathcal O(1/k^2)$ pour FISTA. En particulier,

$$
f(\beta_k)-f(\beta^*)\leq\frac{L\|\beta_0-\beta^*\|_2^2}{2k}
\quad\text{pour PGD,}
$$


et FISTA admet une borne $2L\|\beta_0-\beta^*\|_2^2/(k+1)^2$. Ces garanties ne sont pas des vitesses ajustées sur les courbes ci-dessous. FISTA peut faire augmenter la perte entre deux itérations successives. Les bornes du gradient proximal sont données par [Beck et Teboulle (2009)](https://doi.org/10.1137/080716542), la projection étant l’opérateur proximal de l’indicatrice de la contrainte.{{< sidenote id="pgd-rates" n="1" >}}La forte convexité peut donner des vitesses linéaires sous des hypothèses supplémentaires. Le benchmark vérifie $p=200>n=100$ : sa hessienne de moindres carrés est singulière, donc un argument de forte convexité globale ne s’applique pas.{{< /sidenote >}}

## Projection exacte sur la boule L1

La projection euclidienne s’écrit

$$
P_\tau(v)=\underset{\|w\|_1\leq\tau}{\arg\min}\;\frac12\|w-v\|_2^2.
$$


Si $\tau=0$, la solution est nulle. Si $\|v\|_1\leq\tau$, le vecteur reste inchangé. Sinon, pour $\tau>0$, les conditions KKT donnent un seuil commun :

$$
P_\tau(v)_j=\operatorname{sign}(v_j)\max(|v_j|-\lambda,0),
\qquad\sum_j\max(|v_j|-\lambda,0)=\tau.
$$


On peut ainsi projeter les valeurs absolues sur le simplexe positif de masse $\tau$, puis rétablir les signes. En notant $u_1\geq\cdots\geq u_p$ les valeurs absolues triées, on calcule

$$
\rho=\max\left\{j:u_j>\frac{\sum_{i=1}^ju_i-\tau}{j}\right\},
\qquad
\lambda=\frac{\sum_{i=1}^\rho u_i-\tau}{\rho}.
$$


{{< algorithm n="1" title="Projection euclidienne sur la boule L1" input="Vecteur $v∈ℝ^p$ et rayon $τ≥0$." output="$P_τ(v)$." >}}
1. Si le rayon est nul, renvoyer le vecteur nul.
2. Si $\|v\|_1\leq\tau$, renvoyer une copie de $v$.
3. Trier les $|v_j|$ par ordre décroissant et calculer les sommes cumulées.
4. Trouver le plus grand indice satisfaisant l’inégalité stricte définissant $\rho$ ci-dessus, puis calculer $\lambda$.
5. Renvoyer $\operatorname{sign}(v_j)\max(|v_j|-\lambda,0)$ pour chaque coordonnée.
{{< /algorithm >}}

Le tri coûte $\mathcal O(p\log p)$. Une itération complète évalue aussi un gradient dense, en $\mathcal O(np)$ : son coût est donc $\mathcal O(np+p\log p)$ après calcul du pas. Le code utilise la construction par tri décrite par Duchi et al., sans implémenter leur variante en temps linéaire espéré.

La projection n’est pas une simple homothétie. Par exemple, $(3,1)$ se projette sur $(1,0)$ lorsque $\tau=1$, et non sur $(3/4,1/4)$. Le seuillage peut annuler des coordonnées, ce qui explique comment cette géométrie permet des solutions parcimonieuses.

## Explorer la géométrie et la convergence

La première figure est une instance pédagogique distincte en deux dimensions. Les contrôles de rayon et d’itération montrent les trajectoires projetées et le point avant projection. La seconde reprend la configuration originale du benchmark en dimension 200, avec des suites de pertes recalculées.

{{< explorable "pgd" >}}

## Benchmark reproduit et critère d’arrêt

Le dépôt génère $n=100$ observations et $p=200$ variables, avec dix coefficients générateurs non nuls, un bruit gaussien d’écart-type $0{,}5$ et la graine NumPy $42$. Les colonnes de la matrice sont centrées et standardisées. Le benchmark ajuste un Lasso scikit-learn avec `alpha=0.05`, sans constante et avec une tolérance $10^{-10}$, puis utilise la norme L1 de ses coefficients comme rayon : $\tau\approx12{,}73065565$.{{< sidenote id="pgd-scaling" n="2" >}}scikit-learn divise la perte quadratique par le nombre d’observations. Son `alpha=0.05` correspond à une pénalité $n\alpha=5$ avec la perte non normalisée employée ici. La comparaison sous contrainte utilise le rayon fourni par cette solution ajustée.{{< /sidenote >}}

Les deux solveurs disposent au maximum de 5 000 itérations. Ils s’arrêtent lorsque

$$
\frac{\|\beta_{k+1}-\beta_k\|_2}{\|\beta_k\|_2+10^{-10}}<10^{-10}.
$$


Ce critère porte sur le déplacement des itérés, sans certifier l’optimalité. La première perte stockée est mesurée après la première mise à jour ; la figure interactive numérote donc les mises à jour à partir de un.

Dans ce recalcul, PGD effectue 1 250 mises à jour et FISTA 1 137. Les distances de leurs coefficients à l’ajustement scikit-learn valent environ $3{,}20\times10^{-8}$ et $3{,}12\times10^{-7}$. Ces observations concernent cette configuration. La référence $f_{\rm ref}$ de la courbe est la plus petite perte observée parmi les deux trajectoires et l’ajustement scikit-learn, sans certification de la valeur de $f^*$.

## Sélection de variables et limites

Au seuil de non-nullité $10^{-8}$ du dépôt, les deux estimations finales comportent 54 coefficients non nuls. Par rapport aux dix variables réellement actives, cela donne 45 faux positifs et un faux négatif. Les méthodes s’accordent sur la solution ajustée sous contrainte ; elles ne récupèrent **pas exactement** le support générateur dans cette expérience bruitée.{{< sidenote id="pgd-support" n="3" >}}L’accord avec un solveur de référence et la récupération des variables génératrices répondent à deux questions différentes. Le premier contrôle l’optimisation numérique ; la seconde dépend aussi des données, du bruit et du choix de régularisation.{{< /sidenote >}}

Le dépôt contient des tests de faisabilité, de diminution de la perte et d’accord entre les solveurs. Le projecteur du navigateur et les trajectoires en deux dimensions sont vérifiés contre les fonctions Python originales. Les données numériques et la révision du code sont accessibles depuis la figure ; le PNG archivé conserve la présentation originale, y compris son titre informel « Recovered support ».

## Sources

- [Code et benchmark L1BallPGD](https://github.com/marouanedaoudi/L1BallPGD/blob/3001c0510716078ee3d1117bbef456f54ec5b2fc/scripts/benchmark.py#L27), révision `3001c05`.
- John Duchi, Shai Shalev-Shwartz, Yoram Singer et Tushar Chandra (2008), [*Efficient Projections onto the L1-Ball for Learning in High Dimensions*](https://doi.org/10.1145/1390156.1390191), ICML, p. 272–279.
- Amir Beck et Marc Teboulle (2009), [*A Fast Iterative Shrinkage-Thresholding Algorithm for Linear Inverse Problems*](https://doi.org/10.1137/080716542), SIAM Journal on Imaging Sciences, 2(1), p. 183–202.
