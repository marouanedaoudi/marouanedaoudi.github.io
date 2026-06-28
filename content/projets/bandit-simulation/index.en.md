---
title: "Adaptive Bandit Algorithms for Mega-Studies"
date: 2026-04-01
description: "Application of multi-armed bandits to FDR control in mega-studies: implementation, simulation and sample complexity analysis."
summary: "Adaptive bandit algorithm inspired by Jamieson & Jain (2019) to identify effective treatments while controlling the false discovery rate at all times."
tags: ["Stochastic", "Python", "Multiple Testing", "Bandits"]
math: true
---

## 1. Motivation: From Slot Machines to Mega-Studies

Imagine a casino offering 5 slot machines and a budget of 100 coins. The classical approach allocates 20 coins per machine, computes the empirical mean and tests hypotheses. The problem: once the best machine is identified, the budget is exhausted — the discovered information was never exploited.

The **multi-armed bandit** algorithm resolves this dilemma by adapting the allocation of pulls in real time based on observed outcomes. This logic extends far beyond the casino: in **mega-studies** (behavioral experiments testing dozens or hundreds of interventions simultaneously), it is crucial to quickly identify effective treatments while minimizing the number of subjects exposed to suboptimal interventions.

## 2. Theoretical Framework

### Problem Formalization

We have $n$ arms (treatments) indexed by $i \in [n]$. At each time $t$, the agent selects an arm $i_t$ and observes a reward $X_{i_t,t} \sim \mathcal{N}(\mu_i, \sigma^2)$. For a reference threshold $\mu_0$, we partition the arms into:

$$
H_1 = \{i : \mu_i > \mu_0\}, \qquad H_0 = [n] \setminus H_1
$$

The algorithm produces at each time $t$ a discovery set $S_t \subseteq [n]$. We denote $k = |H_1|$ the number of truly effective treatments and $\Delta = \min_{i \in H_1}(\mu_i - \mu_0)$ the minimum gap to the threshold.

### Error Control and Power

Unlike a classical test on fixed data, the algorithm must guarantee its statistical properties **at all times** $t$ (anytime control). Four criteria are defined:

| Criterion | Definition | Interpretation |
|---|---|---|
| **FDR-$\delta$** | $\mathbb{E}\!\left[\frac{\lvert S_t \cap H_0 \rvert}{\lvert S_t \rvert \vee 1}\right] \leq \delta$ | Expected proportion of false discoveries |
| **FWER-$\delta$** | $\mathbb{P}\!\left(\exists\, t,\; S_t \cap H_0 \neq \emptyset\right) \leq \delta$ | Probability of at least one false discovery |
| **TPR-$\delta,\tau$** | $\mathbb{E}\!\left[\frac{\lvert S_t \cap H_1 \rvert}{\lvert H_1 \rvert}\right] \geq 1-\delta \;\forall t \geq \tau$ | Expected proportion of true positives detected |
| **FWPD-$\delta,\tau$** | $\mathbb{P}(H_1 \subseteq S_t) \geq 1-\delta \;\forall t \geq \tau$ | Probability of detecting all true positives |

The implications $\text{FWER} \Rightarrow \text{FDR}$ and $\text{FWPD} \Rightarrow \text{TPR}$ show that FWER and FWPD are more demanding criteria.

### LIL Bound and Anytime Confidence Intervals

To guarantee FDR control at all times, discoveries rely on confidence intervals valid **uniformly over $t$**, built via the **Law of the Iterated Logarithm** (LIL):

$$
\phi_{\mathrm{LIL}}(s, \delta) = \sqrt{\frac{2\sigma^2 \log\!\left(\log(2s)/\delta\right)}{s}}
$$

This guarantees:

$$
\mathbb{P}\!\left(\forall s \geq 1,\; |\hat{\mu}_i^s - \mu_i| \leq \phi_{\mathrm{LIL}}(s,\delta)\right) \geq 1-\delta
$$

Arm $i$ is added to $S_t$ as soon as its lower confidence bound exceeds the threshold:

$$
\hat{\mu}_i^{n_i} - \phi_{\mathrm{LIL}}(n_i,\, \delta/n) > \mu_0
$$

### Sample Complexity: the Adaptive Gain

The central advantage of the adaptive approach lies in its **sample complexity** — the number of observations needed to detect a proportion $1-\delta$ of effective treatments while controlling FDR:

$$
\tau_{\text{uniform}} = \mathcal{O}\!\left(\sum_{i=1}^n \frac{1}{\Delta_i^2} \log\!\left(\frac{n}{k\delta}\right)\right)
$$

$$
\tau_{\text{adaptive}} = \mathcal{O}\!\left(\sum_{i=1}^n \frac{1}{\Delta_i^2} \log\!\left(\frac{1}{\delta}\right)\right)
$$

The gain is a factor of $\log(n/k)$ — multiplicative. In mega-studies where $n$ is large and $k$ small, this factor can be substantial: with $n=500$ treatments and $k=10$ effective ones, the gain is a factor of $\log(50) \approx 3.9$.

## 3. Algorithm

### Adaptive Sampling Rule

At each step, the algorithm maintains a set of **active** arms (neither validated in $S_t$ nor eliminated). It concentrates its pulls on the arms whose empirical mean is **closest to the threshold** $\mu_0$ relative to their confidence interval — those for which the most uncertainty remains to be resolved.

The confidence threshold is dynamically adjusted based on the number of already-validated discoveries:

$$
\delta_t = \frac{\delta}{n - |S_t|}
$$

This adjustment avoids the overly conservative Bonferroni correction and maximizes statistical power as treatments are progressively identified.

### Pseudocode

```
Input: n arms, threshold μ₀, confidence level δ
Initialization: pull each arm init_pulls times
S ← ∅

While budget not exhausted:
    Identify active arms (unclassified)
    Select arm i_t closest to μ₀
    Observe X_{i_t,t}, update μ̂_{i_t}, n_{i_t}

    δ_t ← δ / (n - |S|)
    For each arm j ∉ S:
        If μ̂_j - φ_LIL(n_j, δ_t) ≥ μ₀:
            S ← S ∪ {j}

Output: S (discovery set)
```

### LIL Bound Implementation

```python
import numpy as np

def phi_function(t, delta):
    """
    Anytime confidence interval based on the LIL.
    Valid uniformly in t: P(∀s≥1, |μ̂ - μ| ≤ φ(s,δ)) ≥ 1-δ
    """
    if t == 0:
        return float('inf')

    delta = min(delta, 1.0)
    log_delta    = np.log(1 / delta)
    log_log_delta = np.log(log_delta + 1e-10)
    log_log_t    = np.log(np.log(np.e * t / 2) + 1e-10)

    numerator = 2 * log_delta + 6 * log_log_delta + 3 * log_log_t
    return np.sqrt(numerator / t)
```

The `1e-10` inside the iterated logarithms prevents numerical instabilities in the early steps, without affecting the asymptotic validity of the bound.

## 4. Results

Simulations compare the adaptive algorithm against uniform allocation (Bonferroni-type) on Gaussian environments with $n \in \{50, 200, 500\}$ arms. The metrics tracked at each time $t$ are FDR, TPR, and total pulls until full detection.

Empirical results confirm the theoretical gain of $\log(n/k)$: the adaptive algorithm reaches a TPR of $1-\delta$ with significantly fewer observations than uniform allocation, particularly when $k \ll n$.

---

**Key references:**
- Jamieson & Jain (2019). *A Bandit Approach to Multiple Testing with False Discovery Control*. NeurIPS 2018.
- Benjamini & Hochberg (1995). *Controlling the false discovery rate*. JRSS-B.
- Milkman et al. (2021). *Megastudies improve the impact of applied behavioural science*. Nature.
