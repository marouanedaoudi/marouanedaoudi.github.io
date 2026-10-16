---
title: "Théorème d’addition de Slutsky"
date: 2025-02-14
tags: ["Slutsky", "Convergence"]
math: true
summary: "Ajouter une suite convergeant en probabilité vers zéro préserve la convergence en loi."
description: "Démonstration du théorème d’addition de Slutsky : ajouter une suite convergeant en probabilité vers zéro préserve la convergence en loi."
lastmod: "2026-10-15"
subject: "Convergence en loi"
figures: ["math-notes"]
mathFigure: "slutsky"
---

{{< statement kind="definition" title="Convergence en loi" >}}On dit que $(X_n)$ converge vers $X$ en loi si pour toute fonction $f$ à valeurs réelles, continue et bornée,

$$ \lim_{n \rightarrow +\infty}\mathbb{E}[f(X_n)]=\mathbb{E}[f(X)] $$

{{< /statement >}}

{{< statement kind="definition" title="Convergence en probabilité" >}}On dit que $(X_n)$ converge vers $X$ en probabilité si

$$ \forall \epsilon > 0,\quad \lim_{n \rightarrow +\infty}P(|X_n-X| \geq \epsilon)=0 $$

{{< /statement >}}

## Énoncé

{{< statement kind="theorem" id="statement" >}}
Soit $(\Omega,\mathcal A,P)$ un espace probabilisé, $X$ une variable aléatoire réelle et $(X_n)_{n \in \mathbb{N}}$, $(Y_n)_{n \in \mathbb{N}}$ deux suites de variables aléatoires réelles telles que $X_n \rightarrow X$ en loi et $Y_n \rightarrow 0$ en probabilité quand $n \rightarrow +\infty$. Montrer que $X_n+Y_n \rightarrow X$ en loi quand $n \rightarrow +\infty$.
{{< /statement >}}

## Illustration

{{< explorable "math-notes" >}}

## Démonstration

{{< proof-start >}}
Par la caractérisation de la convergence faible des probabilités par les fonctions continues à support compact, il suffit de montrer que pour toute $\phi \in C_c(\mathbb{R},\mathbb{R})$,

$$ \lim_{n \rightarrow +\infty} \mathbb{E}[\phi(X_n+Y_n)]=\mathbb{E}[\phi(X)] $$


Soit $\phi \in C_c(\mathbb{R},\mathbb{R})$. On décompose l'écart en deux termes :

$$ \mathbb{E}[\phi(X_n+Y_n)]-\mathbb{E}[\phi(X)]=A_n+B_n $$


où

$$ A_n=\mathbb{E}[\phi(X_n+Y_n)]-\mathbb{E}[\phi(X_n)] \quad , \quad B_n=\mathbb{E}[\phi(X_n)]-\mathbb{E}[\phi(X)] $$


On sait déjà que $\lim_{n \rightarrow +\infty}B_n=0$ car $X_n \rightarrow X$ en loi. Il reste à montrer que $\lim_{n \rightarrow +\infty}A_n=0$.

Une fonction continue à support compact est bornée et uniformément continue sur tout $\mathbb R$. Soit $\epsilon>0$ ; choisissons $\eta>0$ tel que, pour tous $x,y\in\mathbb R$, $|x-y|\leq\eta$ implique $|\phi(x)-\phi(y)|<\epsilon$.

{{< sidenote id="slutsky-1" n="1" >}}
La continuité uniforme est utilisée sur tout $\mathbb R$, car aucune borne sur $X_n$ n’est supposée. Elle découle ici de la continuité et du support compact de $\phi$.
{{< /sidenote >}}

On majore $|A_n|$ en séparant l'événement $\{|Y_n| \leq \eta\}$ de son complémentaire :

$$
\begin{aligned}
|A_n|&\leq \mathbb{E}[|\phi(X_n+Y_n)-\phi(X_n)|]\\
&=\mathbb{E}[|\phi(X_n+Y_n)-\phi(X_n)|\,\mathbf{1}_{\{|Y_n|\leq\eta\}}]\\
&\quad+\mathbb{E}[|\phi(X_n+Y_n)-\phi(X_n)|\,\mathbf{1}_{\{|Y_n|>\eta\}}].
\end{aligned}
$$


Sur $\{|Y_n| \leq \eta\}$, l'argument de $\phi$ varie de moins de $\eta$, donc le premier terme est $\leq \epsilon$. Sur $\{|Y_n| > \eta\}$, on majore grossièrement par $2\|\phi\|_\infty$ :

$$ |A_n| \leq \epsilon + 2\|\phi\|_\infty \cdot P(|Y_n|>\eta) $$


Or $Y_n \rightarrow 0$ en probabilité, donc $P(|Y_n|>\eta) \rightarrow 0$. Il existe $n_0$ tel que pour tout $n \geq n_0$, $2\|\phi\|_\infty \cdot P(|Y_n|>\eta) \leq \epsilon$. Ainsi $|A_n| \leq 2\epsilon$ pour $n \geq n_0$, ce qui prouve $A_n \rightarrow 0$.

{{< sidenote id="slutsky-2" n="2" >}}
La majoration utilise seulement la probabilité de $|Y_n|>\eta$. Elle reste valable lorsque $X_n$ et $Y_n$ sont dépendantes, comme dans la figure.
{{< /sidenote >}}

Comme $A_n\to0$ et $B_n\to0$, $|\mathbb{E}[\phi(X_n+Y_n)]-\mathbb{E}[\phi(X)]| = |A_n+B_n| \leq |A_n|+|B_n| \to 0$, donc

$$ \boxed{X_n+Y_n \rightarrow X \text{ en loi quand }n \rightarrow +\infty} $$


{{< proof-end >}}
