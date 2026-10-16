---
title: "Adaptive bandits and multiple testing"
date: "2026-04-01"
lastmod: "2026-10-15"
weight: 1
description: "Adaptive and uniform allocation for sequential multiple testing: four variants, decision rules and an exploration of actual archived discoveries."
summary: "Four bandit variants for multiple testing: methods, archived discovery traces and analysis of statistical limitations."
tags: ["Bandits", "Python", "Sequential inference"]
projectType: "Team research project"
code: "https://github.com/Chams22/bandit_approach_simulation"
report: "/uploads/bandit.pdf"
contribution: "Team study and implementation, simulations and comparative analysis."
outcome: "Earlier discoveries in several experiments, with gains depending on the regime and inference rule."
imageAlt: "Exact archived discovery curves under adaptive and uniform allocation."
math: true
figures: ["bandit"]
---

With Ines Bahraoui and Chams-Eddine Bouaziz. Supervision: Adrien Nguyen-Huu and Luka Boisgibault, University of Montpellier, 2025–2026.

## Research question

How should an observation budget be allocated across many treatments to quickly identify those exceeding a reference? This project concerns **discovery**, rather than cumulative reward maximization. Adaptive allocation uses observations collected so far to select the next arm; uniform allocation provides a comparison.

For a reference $\mu_0$, write $H_0=\{i:\mu_i\leq\mu_0\}$ and $H_1=\{i:\mu_i>\mu_0\}$. If $S_t$ is the discovery set at time $t$, the false discovery rate and average power are

$$
\operatorname{FDR}(t)=\mathbb E\!\left[\frac{|S_t\cap H_0|}{|S_t|\vee1}\right],
\qquad
\operatorname{TPR}(t)=\mathbb E\!\left[\frac{|S_t\cap H_1|}{|H_1|}\right].
$$


TPR requires $H_1\neq\varnothing$. Both quantities can be estimated in simulations with known means. In real megastudy datasets, the true positives are unknown: **counting discoveries does not measure TPR**.

## Four variants, two components

Allocation and inference have distinct roles. Allocation determines where to observe; inference determines when to declare a discovery. The inspected code compares these variants:

| Variant | Allocation | Implemented inference |
|---|---|---|
| JJ | UCB using a LIL-style boundary | Numerical inversion of a LIL boundary multiplied by an empirical standard deviation; BH decision |
| V2 | UCB using a Normal Mixture radius | Closed-form p-value for a fixed reference; BH decision |
| V3 | UCB using a Normal Mixture radius | Sequential betting wealth, with binary and continuous modules; BH decision |
| SR | Cyclic sampling of active arms and phase-based elimination | The same Normal Mixture formula and BH decision as V2 |

SR therefore does not declare every surviving arm positive: in this implementation, elimination organizes sampling while BH produces discoveries. The uniform baseline is **cyclic**, rather than random arm selection. These distinctions can be checked in the [repository’s modules](https://github.com/Chams22/bandit_approach_simulation/tree/bdff6ab960ac0bbab47daa2f1aa5389400b7994f/backend).

## Reading the V2 decision rule

For an arm observed $s$ times, the code maintains its mean $\widehat\mu_s$ and the accumulator

$$
V_s=V_{s-1}+(X_s-\widehat\mu_{s-1})^2,
\qquad \widehat\mu_0=0.
$$


This is a sum of prediction errors, **not Welford’s centered M2**. With $\rho>0$ and $\alpha\in(0,1)$, V2 uses the radius

$$
\phi(s,\alpha,V_s,\rho)=\frac{1}{s}
\sqrt{2(V_s+\rho)\log\!\left(\frac{\sqrt{(V_s+\rho)/\rho}}{\alpha}\right)}.
$$


For a fixed reference and $d_s=\widehat\mu_s-\mu_0>0$, inversion gives the implemented formula

$$
p_s=\min\!\left\{1,
\sqrt{\frac{V_s+\rho}{\rho}}
\exp\!\left(-\frac{d_s^2s^2}{2(V_s+\rho)}\right)\right\}.
$$


The code returns $p_s=1$ when $s=0$ or $d_s\leq0$, and numerically clips it below at $10^{-300}$. It then sorts all $m$ values and searches for

$$
k^*=\max\{k:p_{(k)}\leq\delta k/m\}.
$$


The whole prefix of length $k^*$ is retained and added to $S_t$. BH is a **step-up** procedure, rather than a separate identical-threshold test on every row.{{< sidenote id="bandit-validity" n="1" >}}An API name such as “anytime p-value” is not a proof. Validity requires a confidence-sequence construction appropriate to the observation model, followed by correct treatment of dependence and the multiple-testing level.{{< /sidenote >}}

{{< algorithm n="1" title="Implemented V2 with a known reference" input="Initial observations per arm, fixed reference $\mu_0$, level $\delta\in(0,1)$ and $\rho>0$." output="An increasing set $S_t$ of arms declared positive." >}}
1. Initialize counts, means and accumulators from the available observations.
2. In the adaptive class, calibrate ρ using the median of Vᵢ/(nᵢ−1) for arms with nᵢ ≥ 2.
3. Among undiscovered arms, select the largest mean plus Normal Mixture radius evaluated at level δ/n.
4. Observe that arm; update its mean, accumulator and count.
5. Compute and sort p-values; find the largest rank satisfying the BH threshold δk/n.
6. Add the retained prefix to Sₜ and repeat until the budget is reached or no candidate remains.
{{< /algorithm >}}

When the reference is estimated online, V2 uses a different decision. An arm must satisfy

$$
\widehat\mu_i-\widehat\mu_c-
\phi(n_i,\alpha/2,V_i,\rho)-
\phi(n_c,\alpha/2,V_c,\rho)\geq0,
\qquad \alpha=\delta k/n.
$$


This combines uncertainty from **both** treatment and control. The helper checks ranks $k$ in descending order and requires at least $k$ arms to pass this lower bound. In this version, its denominator $n$ includes the control, while the control itself is excluded from discoveries. The calculations below reproduce these conventions without turning the teaching example into a statistical proof.

## Explore the traces and calculation

{{< explorable "bandit" >}}

The first figure comes from the **text files of first-discovery steps**, rather than digitizing the report’s images. Each dataset has one archived run here. `ADAPT` and `UNIF` use a frozen reference; `ADAPT VAR` and `UNIF VAR` resample the control. Steps group arms discovered at the same recorded time.

In the EFFORT archive with a frozen reference, both allocations finish with the same set of 59 arms. The last member of this set is recorded at step **1,950** under adaptive allocation and **22,301** under uniform allocation. This compares one particular trace, rather than establishes a universal budget-reduction factor. The engine’s counter restarts after initialization, so these steps do not represent a total cost including initial observations.

## What the simulation study measures

The [report, §5.1](/uploads/bandit.pdf#page=18) separately describes a **synthetic** scenario with 12 arms: eight strictly positive means, four null means, reference 0, standard deviation 0.5, nominal level 0.05, horizon 800, 330 simulations and 10 initial observations per arm. The following values are from its Table 13; they do not describe the real-data archives in the figure.

| Variant | Final adaptive TPR | Final empirical adaptive FDR |
|---|---:|---:|
| JJ | 0.770 | 0.002 |
| V2 | 0.831 | 0.005 |
| V3 | 0.857 | 0.022 |
| SR | 0.706 | 0.002 |

This scenario illustrates a tradeoff between detection and false discoveries. It cannot establish uniform FDR control in every regime. The report also investigates noise, signal, nominal level, initialization and the positive-arm proportion. If 90% TPR is not reached, the corresponding time is **censored**, rather than a 0% gain.

## Limitations and provenance

The Jamieson–Jain theorem assumes a known reference and p-values satisfying its hypotheses. Estimating and freezing a reference does not automatically make it the true control mean. Replacing a theoretical variance proxy with an empirical variance also needs justification, particularly for JJ and continuous V3 betting. A shared control additionally induces dependence across tests.

Another comparison limitation is visible in V2: initialization calibrates $\rho$ in the adaptive class, while `UniformAlgo.init_process` retains the supplied value. Isolating the effect of allocation would require consistent calibration. The figures above **preserve the archived results**; they do not retroactively correct or recompute the experiments.

The files used are `figure_real_data_simple/{effort,exercise,penn,walmart}/discovery_times.txt` and `resultats.txt`, at revision [`bdff6ab`](https://github.com/Chams22/bandit_approach_simulation/commit/bdff6ab960ac0bbab47daa2f1aa5389400b7994f). The [figure JSON](/data/bandit-discoveries.json) preserves recorded steps, arm identifiers, source paths and SHA-256 checksums with normalized line endings. The large CSV datasets were not reimported for this visualization.

## References

Kevin Jamieson and Lalit Jain, [*A Bandit Approach to Multiple Testing with False Discovery Control*](https://arxiv.org/abs/1809.02235), NeurIPS 2018, arXiv revision 2019. For the inspected implementation: [V2 radius and p-value](https://github.com/Chams22/bandit_approach_simulation/blob/bdff6ab960ac0bbab47daa2f1aa5389400b7994f/backend/adaptative_algorithm_v2.py#L106-L159), [BH decision](https://github.com/Chams22/bandit_approach_simulation/blob/bdff6ab960ac0bbab47daa2f1aa5389400b7994f/backend/adaptative_algorithm_v2.py#L302-L333) and [comparison with an uncertain control](https://github.com/Chams22/bandit_approach_simulation/blob/bdff6ab960ac0bbab47daa2f1aa5389400b7994f/backend/adaptative_algorithm_v2.py#L35-L58). The project report provides the bibliography and full experimental protocols.
