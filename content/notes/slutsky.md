---
title: "Convergence en Loi et en Probabilité"
date: 2025-02-14
tags: ["Slutsky", "Convergence"]
math: true
summary: "Rappels de définitions et démonstration de Xn + Yn."
---

On va d'abord rappeler les définitions avant d'aborder des exercices pour une meilleure compréhension.

***Définition :*** On dit que $(X\_n)$ converge vers $X$ en loi si pour toute fonction $f$ à valeurs réelles, continue et bornée
$$ \lim\_{n \rightarrow +\infty}\mathbb{E}[f(X\_n)]=\mathbb{E}[f(X)] $$

***Définition :*** On dit que $(X\_n)$ converge vers $X$ en probabilité si
$$ \forall \epsilon > 0,\lim\_{n \rightarrow +\infty}P(|X\_n-X| \geq \epsilon)=0 $$

{{< alert icon="circle-info" >}}
***Énoncé :*** Soit $(\Omega,\mathcal A,P)$ un espace probabilisé, $X$ une variable aléatoire réelle et $(X\_n)\_{n \in \mathbb{N}}$, $(Y\_n)\_{n \in \mathbb{N}}$ deux suites de variables aléatoires réelles telles que $X\_n \rightarrow X$ en loi, $Y\_n \rightarrow 0$ en probabilité, quand $n \rightarrow +\infty$.
Montrer que $X\_n+Y\_n \rightarrow X$ en loi, quand $n \rightarrow +\infty$.
{{< /alert >}}

***Corrigé :***
D'après le cours, il suffit de montrer que $\forall \phi \in C\_{c}(\mathbb{R},\mathbb{R})$,
$$ \lim\_{n \rightarrow +\infty} \int\_{\Omega} \phi(X\_n+Y\_n)dP=\int\_{\Omega} \phi(X)dP $$

Soit $\phi \in C\_{c}(\mathbb{R},\mathbb{R})$.
On a :
$$ \int\_{\Omega} \phi(X\_n+Y\_n)dP-\int\_{\Omega} \phi(X)dP=A\_n+B\_n $$

où
$$ A\_n=\int\_{\Omega} \phi(X\_n+Y\_n)dP-\int\_{\Omega}\phi(X\_n)dP \quad , \quad B\_n=\int\_{\Omega}\phi(X\_n)dP-\int\_{\Omega} \phi(X)dP $$

On sait déjà que $\lim\_{n \rightarrow +\infty}B\_n=0$ car $X\_n \rightarrow X$ en loi.
Il reste à montrer que $\lim\_{n \rightarrow +\infty}A\_n=0$.
La fonction $\phi$ est continue sur un compact de $\mathbb{R}$ qu'on note $\mathcal{K}$ donc, par le théorème de Heine, la fonction $\phi$ est uniformément continue sur $\mathcal{K}$.
Autrement dit, pour $\epsilon>0$, il existe $\eta>0$, $\forall (x,y) \in \mathcal{K}, |x-y|<\eta \Longrightarrow |\phi(x)-\phi(y)|<\epsilon$.

Donc :
$$ |A\_n|=\Bigg|\int\_{\Omega} \phi(X\_n+Y\_n)dP-\int\_{\Omega}\phi(X\_n)dP\Bigg|\leq\int\_{\Omega} \Bigg|\phi(X\_n+Y\_n)-\phi(X\_n)\Bigg|dP $$

$$ =\int\_{\\{|Y\_n|\leq\eta\\}} \Bigg|\phi(X\_n+Y\_n)-\phi(X\_n)\Bigg|dP+\int\_{\\{|Y\_n|>\eta\\}} \Bigg|\phi(X\_n+Y\_n)-\phi(X\_n)\Bigg|dP $$

$$ \leq \epsilon + 2\max\_{x \in \mathbb{R}}\phi(x)P(|Y\_n|>\eta) $$

Or, $Y\_n \rightarrow 0$ en probabilité, donc il existe $n\_0$ tel que
$$ n \geq n\_0 \Longrightarrow 2\max\_{x \in \mathbb{R}}\phi(x)P(|Y\_n|>\eta) \leq \epsilon $$

Donc $n \geq n\_0 \Longrightarrow |A\_n| \leq 2\epsilon$
Ce qui prouve que $\lim\_{n \rightarrow +\infty}A\_n=0$.

Donc :
$$ \boxed{X\_n+Y\_n \rightarrow X \text{ en loi, quand }n \rightarrow +\infty} $$
$\blacksquare$
