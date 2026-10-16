---
title: "L1-Ball Projected Gradient Descent"
date: 2025-05-20
weight: 2
description: "NumPy implementations of PGD and FISTA for L1-constrained least squares, with O(p log p) projection and numerical comparison with scikit-learn."
summary: "PGD and FISTA for the constrained Lasso, with exact L1-ball projection and comparison with scikit-learn."
tags: ["Optimization", "Python", "NumPy", "FISTA"]
math: true
lastmod: "2026-10-15"
code: "https://github.com/marouanedaoudi/L1BallPGD"
projectType: "Numerical optimization"
contribution: "Python implementation of PGD, FISTA and exact L1-ball projection."
outcome: "Numerical comparison with scikit-learn and a convergence study on a synthetic example."
imageAlt: "Comparison of PGD and FISTA convergence trajectories."
figures: ["pgd"]
---

## Constrained least squares

For a design matrix $X\in\mathbb R^{n\times p}$ and response $y\in\mathbb R^n$, the project solves

$$
\min_{\beta\in\mathbb R^p} f(\beta)
=\frac12\|X\beta-y\|_2^2
\quad\text{subject to}\quad\|\beta\|_1\leq\tau.
$$


The gradient is $\nabla f(\beta)=X^\top(X\beta-y)$ and has Lipschitz constant $L=\|X\|_2^2$. Both implemented solvers start from zero and use the fixed step $\eta=1/L$. The L1 constraint can set coordinates exactly to zero; it does not by itself ensure that the selected variables match the ground truth.

## Projected gradient and acceleration

PGD takes a gradient step and projects it onto $\mathcal C_\tau=\{\beta:\|\beta\|_1\leq\tau\}$:

$$
\beta_{k+1}=P_\tau\!\left(\beta_k-\eta\nabla f(\beta_k)\right).
$$


FISTA evaluates the gradient at an extrapolated point $z_k$:

$$
\begin{aligned}
\beta_{k+1}&=P_\tau\!\left(z_k-\eta\nabla f(z_k)\right),\\
\theta_{k+1}&=\frac{1+\sqrt{1+4\theta_k^2}}2,\\
z_{k+1}&=\beta_{k+1}+\frac{\theta_k-1}{\theta_{k+1}}(\beta_{k+1}-\beta_k),
\end{aligned}
\qquad z_0=\beta_0=0,\quad\theta_0=1.
$$


The projected iterates remain feasible, while the extrapolated points need not. For a smooth convex objective, the worst-case objective-gap bounds are $\mathcal O(1/k)$ for PGD and $\mathcal O(1/k^2)$ for FISTA. In particular,

$$
f(\beta_k)-f(\beta^*)\leq\frac{L\|\beta_0-\beta^*\|_2^2}{2k}
\quad\text{for PGD,}
$$


and FISTA has a bound of $2L\|\beta_0-\beta^*\|_2^2/(k+1)^2$. These bounds describe worst-case guarantees, not a rate fitted to the curves below. FISTA can increase the objective between consecutive iterations. The proximal-gradient bounds are given by [Beck and Teboulle (2009)](https://doi.org/10.1137/080716542), with projection as the proximal map of the constraint indicator.{{< sidenote id="pgd-rates" n="1" >}}Strong convexity can yield linear rates under additional assumptions. The benchmark has $p=200>n=100$, so its full least-squares Hessian is singular: a global strong-convexity argument does not apply.{{< /sidenote >}}

## Exact projection onto the L1 ball

The Euclidean projection is

$$
P_\tau(v)=\underset{\|w\|_1\leq\tau}{\arg\min}\;\frac12\|w-v\|_2^2.
$$


If $\tau=0$, the answer is zero. If $\|v\|_1\leq\tau$, the answer is $v$ itself. Otherwise, for $\tau>0$, the KKT conditions give a common soft-threshold:

$$
P_\tau(v)_j=\operatorname{sign}(v_j)\max(|v_j|-\lambda,0),
\qquad\sum_j\max(|v_j|-\lambda,0)=\tau.
$$


Equivalently, project the magnitudes onto the nonnegative simplex of mass $\tau$, then restore the signs. With $u_1\geq\cdots\geq u_p$ the sorted magnitudes, compute

$$
\rho=\max\left\{j:u_j>\frac{\sum_{i=1}^ju_i-\tau}{j}\right\},
\qquad
\lambda=\frac{\sum_{i=1}^\rho u_i-\tau}{\rho}.
$$


{{< algorithm n="1" title="Euclidean projection onto the L1 ball" input="Vector $v∈ℝ^p$ and radius $τ≥0$." output="$P_τ(v)$." >}}
1. If the radius is zero, return the zero vector.
2. If $\|v\|_1\leq\tau$, return a copy of $v$.
3. Sort $|v_j|$ in descending order and form cumulative sums.
4. Find the largest index satisfying the strict inequality defining $\rho$ above, then compute $\lambda$.
5. Return $\operatorname{sign}(v_j)\max(|v_j|-\lambda,0)$ for every coordinate.
{{< /algorithm >}}

Sorting costs $\mathcal O(p\log p)$. A full dense solver iteration also evaluates a gradient, costing $\mathcal O(np)$, so its cost is $\mathcal O(np+p\log p)$ after the step size has been computed. This implementation uses the sorting-based construction discussed by Duchi et al.; it does not implement their expected-linear-time alternative.

Projection is not radial rescaling. For example, $(3,1)$ projects to $(1,0)$ when $\tau=1$, rather than $(3/4,1/4)$. The threshold can annihilate coordinates, which explains how the geometry permits sparse solutions.

## Explore geometry and convergence

The first figure is a separate two-dimensional teaching instance. Its radius and iteration controls expose the projected trajectories and the point before projection. The second figure uses the original 200-dimensional benchmark configuration and recomputed loss sequences.

{{< explorable "pgd" >}}

## Reproduced benchmark and stopping rule

The repository generates $n=100$ observations and $p=200$ features with ten nonzero true coefficients, Gaussian noise of standard deviation $0.5$, and NumPy seed $42$. Columns of the design matrix are centered and standardized. The benchmark fits scikit-learn Lasso with `alpha=0.05`, no intercept and tolerance $10^{-10}$, then uses its coefficient L1 norm as the constrained radius: $\tau\approx12.73065565$.{{< sidenote id="pgd-scaling" n="2" >}}scikit-learn normalizes the squared loss by the sample size. Its `alpha=0.05` corresponds to a penalty $n\alpha=5$ with the unnormalized loss used here. The constrained comparison is made at the radius obtained from that fitted solution.{{< /sidenote >}}

Both solvers use at most 5,000 iterations. They stop when

$$
\frac{\|\beta_{k+1}-\beta_k\|_2}{\|\beta_k\|_2+10^{-10}}<10^{-10}.
$$


This is an iterate-change criterion, not an optimality certificate. The stored loss at index zero is recorded after the first update; the interactive chart therefore numbers the updates starting at one.

In this recomputation, PGD takes 1,250 updates and FISTA 1,137. Their coefficient distances from the scikit-learn fit are approximately $3.20\times10^{-8}$ and $3.12\times10^{-7}$. These are observations for this configuration. The curve reference $f_{\rm ref}$ is the smallest loss observed across both trajectories and the scikit-learn fit, not a certified value of $f^*$.

## Variable selection and limits

At the repository’s nonzero threshold $10^{-8}$, both final estimates have 54 nonzero coefficients. Compared with the ten true active variables, this gives 45 false positives and one false negative. The methods agree on the fitted constrained solution; they do **not** exactly recover the true support in this noisy experiment.{{< sidenote id="pgd-support" n="3" >}}Coefficient agreement with a reference solver and recovery of the generating variables are different questions. The former checks numerical optimization; the latter also depends on the data, noise and regularization choice.{{< /sidenote >}}

The repository includes tests for feasibility, loss reduction and agreement between the solvers. The browser projection and two-dimensional traces are checked against the original Python functions. Numerical data and source revision are linked with the figure; the archived PNG remains a record of the original presentation, including its informal “Recovered support” title.

## Sources

- [L1BallPGD source and benchmark](https://github.com/marouanedaoudi/L1BallPGD/blob/3001c0510716078ee3d1117bbef456f54ec5b2fc/scripts/benchmark.py#L27), revision `3001c05`.
- John Duchi, Shai Shalev-Shwartz, Yoram Singer and Tushar Chandra (2008), [*Efficient Projections onto the L1-Ball for Learning in High Dimensions*](https://doi.org/10.1145/1390156.1390191), ICML, pp. 272–279.
- Amir Beck and Marc Teboulle (2009), [*A Fast Iterative Shrinkage-Thresholding Algorithm for Linear Inverse Problems*](https://doi.org/10.1137/080716542), SIAM Journal on Imaging Sciences, 2(1), pp. 183–202.
