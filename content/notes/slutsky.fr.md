---
title: "Convergence en Loi et en Probabilité"
date: 2025-02-14
tags: ["Slutsky", "Convergence"]
math: true
summary: "Rappels de définitions et démonstration de Xn + Yn."
description: "Démonstration du théorème d’addition de Slutsky : ajouter une suite convergeant en probabilité vers zéro préserve la convergence en loi."
lastmod: 2026-10-14
---

On rappelle d'abord les deux notions de convergence avant d'aborder l'exercice.

***Définition :*** On dit que $(X_n)$ converge vers $X$ en loi si pour toute fonction $f$ à valeurs réelles, continue et bornée,
$$ \lim_{n \rightarrow +\infty}\mathbb{E}[f(X_n)]=\mathbb{E}[f(X)] $$

***Définition :*** On dit que $(X_n)$ converge vers $X$ en probabilité si
$$ \forall \epsilon > 0,\quad \lim_{n \rightarrow +\infty}P(|X_n-X| \geq \epsilon)=0 $$

## Exercice

{{< alert icon="circle-info" >}}
***Énoncé :*** Soit $(\Omega,\mathcal A,P)$ un espace probabilisé, $X$ une variable aléatoire réelle et $(X_n)_{n \in \mathbb{N}}$, $(Y_n)_{n \in \mathbb{N}}$ deux suites de variables aléatoires réelles telles que $X_n \rightarrow X$ en loi et $Y_n \rightarrow 0$ en probabilité quand $n \rightarrow +\infty$. Montrer que $X_n+Y_n \rightarrow X$ en loi quand $n \rightarrow +\infty$.
{{< /alert >}}

***Corrigé :***
Par la caractérisation de la convergence faible des probabilités par les fonctions continues à support compact, il suffit de montrer que pour toute $\phi \in C_c(\mathbb{R},\mathbb{R})$,
$$ \lim_{n \rightarrow +\infty} \mathbb{E}[\phi(X_n+Y_n)]=\mathbb{E}[\phi(X)] $$

Soit $\phi \in C_c(\mathbb{R},\mathbb{R})$. On décompose l'écart en deux termes :
$$ \mathbb{E}[\phi(X_n+Y_n)]-\mathbb{E}[\phi(X)]=A_n+B_n $$

où
$$ A_n=\mathbb{E}[\phi(X_n+Y_n)]-\mathbb{E}[\phi(X_n)] \quad , \quad B_n=\mathbb{E}[\phi(X_n)]-\mathbb{E}[\phi(X)] $$

On sait déjà que $\lim_{n \rightarrow +\infty}B_n=0$ car $X_n \rightarrow X$ en loi. Il reste à montrer que $\lim_{n \rightarrow +\infty}A_n=0$.

Une fonction continue à support compact est bornée et uniformément continue sur tout $\mathbb R$. Soit $\epsilon>0$ ; choisissons $\eta>0$ tel que, pour tous $x,y\in\mathbb R$, $|x-y|\leq\eta$ implique $|\phi(x)-\phi(y)|<\epsilon$.

On majore $|A_n|$ en séparant l'événement $\{|Y_n| \leq \eta\}$ de son complémentaire :
$$ |A_n| \leq \mathbb{E}[|\phi(X_n+Y_n)-\phi(X_n)|] = \mathbb{E}[|\phi(X_n+Y_n)-\phi(X_n)|\,\mathbf{1}_{\{|Y_n|\leq\eta\}}] + \mathbb{E}[|\phi(X_n+Y_n)-\phi(X_n)|\,\mathbf{1}_{\{|Y_n|>\eta\}}] $$

Sur $\{|Y_n| \leq \eta\}$, l'argument de $\phi$ varie de moins de $\eta$, donc le premier terme est $\leq \epsilon$. Sur $\{|Y_n| > \eta\}$, on majore grossièrement par $2\|\phi\|_\infty$ :
$$ |A_n| \leq \epsilon + 2\|\phi\|_\infty \cdot P(|Y_n|>\eta) $$

Or $Y_n \rightarrow 0$ en probabilité, donc $P(|Y_n|>\eta) \rightarrow 0$. Il existe $n_0$ tel que pour tout $n \geq n_0$, $2\|\phi\|_\infty \cdot P(|Y_n|>\eta) \leq \epsilon$. Ainsi $|A_n| \leq 2\epsilon$ pour $n \geq n_0$, ce qui prouve $A_n \rightarrow 0$.

On conclut : pour tout $n \geq n_0$, $|\mathbb{E}[\phi(X_n+Y_n)]-\mathbb{E}[\phi(X)]| = |A_n+B_n| \leq |A_n|+|B_n| \to 0$, donc
$$ \boxed{X_n+Y_n \rightarrow X \text{ en loi quand }n \rightarrow +\infty} $$
$\blacksquare$
