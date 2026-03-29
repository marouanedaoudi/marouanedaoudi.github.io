---
title: "Algorithmes de Bandits Adaptatifs pour les Méga-études"
date: 2025-02-14
description: "Application des bandits multi-bras au contrôle du FDR dans les méga-études : implémentation, simulation et analyse de la complexité échantillonnale."
summary: "Algorithme bandit adaptatif inspiré de Jamieson & Jain (2019) pour identifier les traitements efficaces tout en contrôlant le taux de fausses découvertes à tout instant."
tags: ["Stochastique", "Python", "Tests Multiples", "Bandits"]
math: true
---

{{< alert icon="flask" >}}
**Projet de recherche M1 SSD** — Université de Montpellier, 2025–2026.
Réalisé avec Ines Bahraoui et Chams-Eddine Bouaziz, sous la supervision d'Adrien Nguyen-Huu et Luka Boisgibault.
{{< /alert >}}

## 1. Motivation : des machines à sous aux méga-études

Imaginez un casino proposant 5 machines à sous et un budget de 100 pièces. L'approche classique alloue 20 pièces par machine, calcule la moyenne empirique et teste les hypothèses. Problème : une fois la meilleure machine identifiée, le budget est épuisé — on n'a pas pu exploiter l'information découverte.

L'algorithme du **bandit multi-bras** résout ce dilemme en adaptant l'allocation des tirages en temps réel selon les résultats observés. Cette logique dépasse largement le casino : dans les **méga-études** (expériences comportementales testant des dizaines ou centaines d'interventions simultanément), il est crucial d'identifier rapidement les traitements efficaces tout en minimisant le nombre de sujets exposés à des interventions sous-optimales.

## 2. Cadre Théorique

### Formalisation du problème

On dispose de $n$ bras (traitements) indexés par $i \in [n]$. À chaque instant $t$, l'agent choisit un bras $i_t$ et observe une récompense $X_{i_t,t} \sim \mathcal{N}(\mu_i, \sigma^2)$. Pour un seuil de référence $\mu_0$, on partitionne les bras en :

$$
H_1 = \{i : \mu_i > \mu_0\}, \qquad H_0 = [n] \setminus H_1
$$

L'algorithme produit à chaque temps $t$ un ensemble de découvertes $S_t \subseteq [n]$. On note $k = |H_1|$ le nombre de traitements réellement efficaces et $\Delta = \min_{i \in H_1}(\mu_i - \mu_0)$ l'écart minimal au seuil.

### Contrôle des erreurs et puissance

Contrairement à un test classique sur données fixes, l'algorithme doit garantir ses propriétés statistiques **à tout instant** $t$ (contrôle *anytime*). On définit quatre critères :

| Critère | Définition | Interprétation |
|---|---|---|
| **FDR-$\delta$** | $\mathbb{E}\!\left[\frac{\lvert S_t \cap H_0 \rvert}{\lvert S_t \rvert \vee 1}\right] \leq \delta$ | Proportion espérée de fausses découvertes |
| **FWER-$\delta$** | $\mathbb{P}\!\left(\exists\, t,\; S_t \cap H_0 \neq \emptyset\right) \leq \delta$ | Probabilité d'au moins une fausse découverte |
| **TPR-$\delta,\tau$** | $\mathbb{E}\!\left[\frac{\lvert S_t \cap H_1 \rvert}{\lvert H_1 \rvert}\right] \geq 1-\delta \;\forall t \geq \tau$ | Proportion espérée de vrais positifs détectés |
| **FWPD-$\delta,\tau$** | $\mathbb{P}(H_1 \subseteq S_t) \geq 1-\delta \;\forall t \geq \tau$ | Probabilité de détecter tous les vrais positifs |

Les implications $\text{FWER} \Rightarrow \text{FDR}$ et $\text{FWPD} \Rightarrow \text{TPR}$ montrent que les critères FWER et FWPD sont plus exigeants.

### Borne LIL et intervalles de confiance anytime

Pour garantir le contrôle du FDR à tout instant, les découvertes reposent sur des intervalles de confiance valides **uniformément en $t$**, construits via la **Loi du Logarithme Itéré** (LIL) :

$$
\phi_{\mathrm{LIL}}(s, \delta) = \sqrt{\frac{2\sigma^2 \log\!\left(\log(2s)/\delta\right)}{s}}
$$

Ce qui garantit que :

$$
\mathbb{P}\!\left(\forall s \geq 1,\; |\hat{\mu}_i^s - \mu_i| \leq \phi_{\mathrm{LIL}}(s,\delta)\right) \geq 1-\delta
$$

Le bras $i$ est ajouté à $S_t$ dès que sa borne inférieure de confiance dépasse le seuil :

$$
\hat{\mu}_i^{n_i} - \phi_{\mathrm{LIL}}(n_i,\, \delta/n) > \mu_0
$$

### Complexité échantillonnale : le gain adaptatif

L'avantage central de l'approche adaptative réside dans sa **complexité échantillonnale** — le nombre d'observations nécessaires pour détecter une proportion $1-\delta$ des traitements efficaces tout en contrôlant le FDR :

$$
\tau_{\text{uniforme}} = \mathcal{O}\!\left(\sum_{i=1}^n \frac{1}{\Delta_i^2} \log\!\left(\frac{n}{k\delta}\right)\right)
$$

$$
\tau_{\text{adaptatif}} = \mathcal{O}\!\left(\sum_{i=1}^n \frac{1}{\Delta_i^2} \log\!\left(\frac{1}{\delta}\right)\right)
$$

Le gain est d'un facteur $\log(n/k)$ — multiplicatif. Dans les méga-études où $n$ est grand et $k$ petit, ce facteur peut être considérable : si $n=500$ traitements et $k=10$ efficaces, le gain est d'un facteur $\log(50) \approx 3.9$.

## 3. Algorithme

### Règle d'échantillonnage adaptatif

À chaque étape, l'algorithme maintient un ensemble de bras **actifs** (ni validés dans $S_t$, ni éliminés). Il concentre ses tirages sur les bras dont la moyenne empirique est la plus **proche du seuil** $\mu_0$ relativement à leur intervalle de confiance — ceux sur lesquels il y a le plus d'incertitude à lever.

Le seuil de confiance est ajusté dynamiquement en fonction du nombre de découvertes déjà validées :

$$
\delta_t = \frac{\delta}{n - |S_t|}
$$

Cet ajustement évite la correction de Bonferroni trop conservative et maximise la puissance statistique au fur et à mesure que des traitements sont identifiés.

### Pseudo-code

```
Entrée : n bras, seuil μ₀, niveau de confiance δ
Initialisation : tirer chaque bras init_pulls fois
S ← ∅

Tant que le budget n'est pas atteint :
    Identifier les bras actifs (non classés)
    Sélectionner le bras i_t le plus proche de μ₀
    Observer X_{i_t,t}, mettre à jour μ̂_{i_t}, n_{i_t}

    δ_t ← δ / (n - |S|)
    Pour chaque bras j ∉ S :
        Si μ̂_j - φ_LIL(n_j, δ_t) ≥ μ₀ :
            S ← S ∪ {j}

Sortie : S (ensemble des découvertes)
```

### Implémentation de la borne LIL

```python
import numpy as np

def phi_function(t, delta):
    """
    Intervalle de confiance anytime basé sur la LIL.
    Valide uniformément en t : P(∀s≥1, |μ̂ - μ| ≤ φ(s,δ)) ≥ 1-δ
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

Le terme `1e-10` à l'intérieur des logarithmes itérés prévient les instabilités numériques aux premières étapes, sans altérer la validité asymptotique de la borne.

## 4. Résultats

Les simulations comparent l'algorithme adaptatif à une allocation uniforme (type Bonferroni) sur des environnements gaussiens avec $n \in \{50, 200, 500\}$ bras. Les métriques suivies à chaque instant $t$ sont le FDR, le TPR, et le nombre total de tirages jusqu'à détection complète.

Les résultats empiriques confirment le gain théorique en $\log(n/k)$ : l'algorithme adaptatif atteint un TPR de $1-\delta$ avec significativement moins d'observations que l'allocation uniforme, particulièrement lorsque $k \ll n$.

---

**Références principales :**
- Jamieson & Jain (2019). *A Bandit Approach to Multiple Testing with False Discovery Control*. NeurIPS 2018.
- Benjamini & Hochberg (1995). *Controlling the false discovery rate*. JRSS-B.
- Milkman et al. (2021). *Megastudies improve the impact of applied behavioural science*. Nature.
