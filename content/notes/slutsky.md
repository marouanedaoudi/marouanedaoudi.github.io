---
title: "Convergence en Loi et en Probabilité"
date: 2025-02-14
tags: ["Slutsky", "Convergence"]
math: true
summary: "Démonstration : Si Xn -> X en loi et Yn -> 0 en proba, alors Xn + Yn -> X en loi."
---

{{< alert icon="circle-info" >}}
**Énoncé :**
Soit $X$ une variable aléatoire et $(X\_n)$, $(Y\_n)$ deux suites telles que :
* $X\_n \xrightarrow{\mathcal{L}} X$ (en loi)
* $Y\_n \xrightarrow{\mathbb{P}} 0$ (en probabilité)

Montrer que $X\_n + Y\_n \xrightarrow{\mathcal{L}} X$.
{{< /alert >}}

## Démonstration

Pour montrer la convergence en loi, il suffit de montrer que pour toute fonction $\phi$ continue bornée ($\phi \in C_b(\mathbb{R})$), on a convergence des espérances.
Soit $\phi \in C_b(\mathbb{R})$ uniformément continue.

Décomposons la différence :

$$\left| \mathbb{E}[\phi(X\_n+Y\_n)] - \mathbb{E}[\phi(X)] \right| \leq \underbrace{\left| \mathbb{E}[\phi(X\_n+Y\_n)] - \mathbb{E}[\phi(X\_n)] \right|}_{A\_n} + \underbrace{\left| \mathbb{E}[\phi(X\_n)] - \mathbb{E}[\phi(X)] \right|}_{B\_n}$$

* **Terme $B\_n$ :** Comme $X\_n \xrightarrow{\mathcal{L}} X$, par définition $\lim_{n \to \infty} B\_n = 0$.
* **Terme $A\_n$ :**
  Soit $\epsilon > 0$. Il existe $\eta > 0$ tel que $|x-y| < \eta \implies |\phi(x)-\phi(y)| < \epsilon$.

  $$A\_n \leq \mathbb{E}\left[ \left| \phi(X\_n+Y\_n) - \phi(X\_n) \right| \mathbb{1}_{|Y\_n| \le \eta} \right] + \mathbb{E}\left[ \left| \phi(X\_n+Y\_n) - \phi(X\_n) \right| \mathbb{1}_{|Y\_n| > \eta} \right]$$

  * Si $|Y\_n| \le \eta$, alors $|\phi(X\_n+Y\_n) - \phi(X\_n)| < \epsilon$.
  * Si $|Y\_n| > \eta$, on majore par $2 \|\phi\|_\infty$.

  Donc :
  $$A\_n \leq \epsilon + 2 \|\phi\|_\infty \mathbb{P}(|Y\_n| > \eta)$$

  Comme $Y\_n \xrightarrow{\mathbb{P}} 0$, pour $n$ assez grand, $\mathbb{P}(|Y\_n| > \eta)$ tend vers 0.
  Ainsi $A\_n \to 0$.

Conclusion :
$$\boxed{X\_n + Y\_n \xrightarrow{\mathcal{L}} X}$$