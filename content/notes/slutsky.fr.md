---
title: "Convergence en Loi et en Probabilité"
date: 2025-02-14
tags: ["Slutsky", "Convergence"]
math: true
summary: "Rappels de définitions et démonstration de Xn + Yn."
---

On rappelle d'abord les deux notions de convergence avant d'aborder l'exercice.

***Définition :*** On dit que $(X\_n)$ converge vers $X$ en loi si pour toute fonction $f$ à valeurs réelles, continue et bornée,
$$ \lim\_{n \rightarrow +\infty}\mathbb{E}[f(X\_n)]=\mathbb{E}[f(X)] $$

***Définition :*** On dit que $(X\_n)$ converge vers $X$ en probabilité si
$$ \forall \epsilon > 0,\quad \lim\_{n \rightarrow +\infty}P(|X\_n-X| \geq \epsilon)=0 $$

## Exercice

{{< alert icon="circle-info" >}}
***Énoncé :*** Soit $(\Omega,\mathcal A,P)$ un espace probabilisé, $X$ une variable aléatoire réelle et $(X\_n)\_{n \in \mathbb{N}}$, $(Y\_n)\_{n \in \mathbb{N}}$ deux suites de variables aléatoires réelles telles que $X\_n \rightarrow X$ en loi et $Y\_n \rightarrow 0$ en probabilité quand $n \rightarrow +\infty$. Montrer que $X\_n+Y\_n \rightarrow X$ en loi quand $n \rightarrow +\infty$.
{{< /alert >}}

***Corrigé :***
D'après la définition, il suffit de montrer que pour toute $\phi \in C\_c(\mathbb{R},\mathbb{R})$,
$$ \lim\_{n \rightarrow +\infty} \mathbb{E}[\phi(X\_n+Y\_n)]=\mathbb{E}[\phi(X)] $$

Soit $\phi \in C\_c(\mathbb{R},\mathbb{R})$. On décompose l'écart en deux termes :
$$ \mathbb{E}[\phi(X\_n+Y\_n)]-\mathbb{E}[\phi(X)]=A\_n+B\_n $$

où
$$ A\_n=\mathbb{E}[\phi(X\_n+Y\_n)]-\mathbb{E}[\phi(X\_n)] \quad , \quad B\_n=\mathbb{E}[\phi(X\_n)]-\mathbb{E}[\phi(X)] $$

On sait déjà que $\lim\_{n \rightarrow +\infty}B\_n=0$ car $X\_n \rightarrow X$ en loi. Il reste à montrer que $\lim\_{n \rightarrow +\infty}A\_n=0$.

La fonction $\phi$ est continue sur un compact $\mathcal{K}$ de $\mathbb{R}$ (son support), donc uniformément continue sur $\mathcal{K}$ par le théorème de Heine. Soit $\epsilon>0$ ; il existe $\eta>0$ tel que pour tous $(x,y) \in \mathcal{K}^2$, $|x-y|<\eta \Rightarrow |\phi(x)-\phi(y)|<\epsilon$.

On majore $|A\_n|$ en séparant l'événement $\{|Y\_n| \leq \eta\}$ de son complémentaire :
$$ |A\_n| \leq \mathbb{E}[|\phi(X\_n+Y\_n)-\phi(X\_n)|] = \mathbb{E}[|\phi(X\_n+Y\_n)-\phi(X\_n)|\,\mathbf{1}\_{\{|Y\_n|\leq\eta\}}] + \mathbb{E}[|\phi(X\_n+Y\_n)-\phi(X\_n)|\,\mathbf{1}\_{\{|Y\_n|>\eta\}}] $$

Sur $\{|Y\_n| \leq \eta\}$, l'argument de $\phi$ varie de moins de $\eta$, donc le premier terme est $\leq \epsilon$. Sur $\{|Y\_n| > \eta\}$, on majore grossièrement par $2\|\phi\|\_\infty$ :
$$ |A\_n| \leq \epsilon + 2\|\phi\|\_\infty \cdot P(|Y\_n|>\eta) $$

Or $Y\_n \rightarrow 0$ en probabilité, donc $P(|Y\_n|>\eta) \rightarrow 0$. Il existe $n\_0$ tel que pour tout $n \geq n\_0$, $2\|\phi\|\_\infty \cdot P(|Y\_n|>\eta) \leq \epsilon$. Ainsi $|A\_n| \leq 2\epsilon$ pour $n \geq n\_0$, ce qui prouve $A\_n \rightarrow 0$.

On conclut : pour tout $n \geq n\_0$, $|\mathbb{E}[\phi(X\_n+Y\_n)]-\mathbb{E}[\phi(X)]| = |A\_n+B\_n| \leq |A\_n|+|B\_n| \to 0$, donc
$$ \boxed{X\_n+Y\_n \rightarrow X \text{ en loi quand }n \rightarrow +\infty} $$
$\blacksquare$
