---
title: "L1-Ball Projected Gradient Descent"
date: 2025-05-20
weight: 2
description: "Implementation of Projected Gradient Descent on the L1 ball for sparse convex optimization."
summary: "Solving the constrained Lasso problem via an efficient O(n log n) Euclidean projection algorithm."
tags: ["Optimization", "Python", "NumPy", "FISTA"]
math: true
---

## The Problem

In statistical learning, one often seeks to minimize a loss under a regularization constraint. The **$\ell_1$ constraint** is particularly interesting: it induces **sparsity** in solutions, pushing unnecessary coordinates exactly to zero, thereby performing automatic variable selection.

The problem considered is:

$$
\min_{x \in \mathbb{R}^n} f(x) \quad \text{s.t.} \quad \|x\|_1 \leq \tau
$$

where $f$ is convex and differentiable (typically the quadratic loss $f(x) = \frac{1}{2}\|Ax - b\|_2^2$) and $\tau > 0$ controls the sparsity budget. This problem is equivalent to the **constrained Lasso**.

## Projected Gradient Descent

**Projected Gradient Descent** (PGD) generalizes gradient descent to the constrained setting. At each iteration, one takes an unconstrained gradient step and then projects the result onto the feasible set $\mathcal{C} = \\\{x : \|x\|_1 \leq \tau\\\}$:

$$
x_{k+1} = \Pi_{\mathcal{C}}\!\left(x_k - \eta \nabla f(x_k)\right)
$$

where $\eta > 0$ is the step size and $\Pi_{\mathcal{C}}$ is the Euclidean projection onto $\mathcal{C}$:

$$
\Pi_{\mathcal{C}}(v) = \underset{x \,:\, \|x\|_1 \leq \tau}{\arg\min} \; \|x - v\|_2^2
$$

### Convergence

When $f$ is $L$-smooth (i.e. $\nabla f$ is $L$-Lipschitz), with a fixed step $\eta = 1/L$, PGD converges at rate $\mathcal{O}(1/k)$ on the function value:

$$
f(x_k) - f(x^*) \leq \frac{L\|x_0 - x^*\|_2^2}{2k}
$$

If additionally $f$ is $\mu$-strongly convex, convergence becomes **linear**:

$$
\|x_k - x^*\|_2^2 \leq \left(1 - \frac{\mu}{L}\right)^k \|x_0 - x^*\|_2^2
$$

The ratio $L/\mu$ is the **condition number** of the problem — the larger it is, the slower the convergence.

## Acceleration: FISTA

The $\mathcal{O}(1/k)$ rate of PGD can be improved at essentially no extra per-iteration cost. **FISTA** (*Fast Iterative Shrinkage-Thresholding Algorithm*) adds a Nesterov momentum term: the gradient is evaluated not at $x_k$, but at an extrapolated point $z_k$.

$$
x_{k+1} = \Pi_{\mathcal{C}}\!\left(z_k - \eta \nabla f(z_k)\right), \qquad
z_{k+1} = x_{k+1} + \frac{\theta_k - 1}{\theta_{k+1}}\left(x_{k+1} - x_k\right)
$$

with $\theta_{k+1} = \tfrac{1}{2}\big(1 + \sqrt{1 + 4\theta_k^2}\big)$. At the same cost per iteration, the convergence bound improves from $\mathcal{O}(1/k)$ to $\mathcal{O}(1/k^2)$. The repository ships both solvers (PGD and FISTA), sharing the same projection.

## Projection onto the $\ell_1$ Ball

This is the algorithmic core of the project. Unlike the $\ell_2$ ball (projection by simple normalization) or the $\ell_\infty$ box (coordinate-wise clipping), projection onto the $\ell_1$ ball has no immediate closed form.

### Characterization via KKT Conditions

The projection problem being convex, KKT conditions are necessary and sufficient. Introducing the Lagrange multiplier $\lambda \geq 0$ for the constraint $\|x\|_1 \leq \tau$, the optimal solution $x^*$ satisfies:

$$
x^* = \mathcal{S}_\lambda(v), \quad \text{where} \quad \mathcal{S}_\lambda(v)_i = \mathrm{sign}(v_i)\max(|v_i| - \lambda, 0)
$$

and $\mathcal{S}_\lambda$ is the **soft-thresholding** operator. The threshold $\lambda^*$ is the unique value such that $\|\mathcal{S}_{\lambda^*}(v)\|_1 = \tau$ (if $\|v\|_1 > \tau$, otherwise $x^* = v$).

### Computing the Optimal Threshold in $\mathcal{O}(n \log n)$

The algorithm of Duchi et al. (2008) computes $\lambda^*$ analytically after sorting. Let $u = \mathrm{sort}(|v|, \downarrow)$ and find $\rho$, the largest index such that:

$$
u_\rho - \frac{1}{\rho}\left(\sum_{j=1}^\rho u_j - \tau\right) > 0
$$

The optimal threshold is then:

$$
\lambda^* = \frac{1}{\rho}\left(\sum_{j=1}^\rho u_j - \tau\right)
$$

and the projection writes $x^*_i = \mathrm{sign}(v_i)\max(|v_i| - \lambda^*, 0)$. The dominant cost is sorting: $\mathcal{O}(n \log n)$.

### Geometric Intuition

The $\ell_1$ ball is a polytope (in 2D, a square rotated 45°) whose vertices lie on the coordinate axes. Projecting an exterior point amounts to "pulling" it toward the nearest vertex, which naturally zeroes out certain coordinates — hence the induced sparsity.

## Implementation and Validation

Both solvers are implemented in Python with NumPy (full vectorization), covered by a `pytest` test suite running in continuous integration (GitHub Actions).

Correctness is checked against `scikit-learn` by exploiting the equivalence between the penalized and constrained Lasso: if $\beta^\star$ solves the penalized problem, it also solves the constrained problem with radius $\tau = \|\beta^\star\|_1$. We fit `sklearn.linear_model.Lasso`, read off the radius $\tau$, then solve the constrained problem — the solutions agree to within $\sim 10^{-7}$.

![PGD vs FISTA convergence and recovered support](benchmark.png)

On synthetic data ($n = 100$, $p = 200$, sparsity $10$), both methods converge to the same optimum and recover the support; FISTA reaches a given accuracy in markedly fewer iterations.

---

**Source code:** [GitHub](https://github.com/marouanedaoudi/L1BallPGD)
