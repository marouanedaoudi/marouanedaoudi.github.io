---
title: "Continuité de la fonction de répartition"
date: 2025-02-14
tags: ["Fonction de répartition", "Mesure"]
math: true
summary: "Lien entre la continuité de F et la probabilité des points."
---

{{< alert icon="circle-info" >}}
***Énoncé :*** Soient $p$ une probabilité sur $\mathcal{B}(\mathbb{R})$ et $F$ la fonction de répartition de $p$, et soit $a \in \mathbb{R}$. Montrer que $F$ est continue en $a$ si et seulement si $p(\\{a\\})=0$. En déduire que $F$ est continue sur $\mathbb{R}$ si $p$ ne charge pas les points.
{{< /alert >}}

***Corrigé :*** Par théorème, la fonction de répartition $F$ est continue à droite. Montrons alors qu'elle est continue à gauche.
Soit $(a\_n)\_{n \in \mathbb{N}}$ une suite réelle croissante telle que $\lim\limits\_{n \rightarrow +\infty} a\_n = a$.
Alors
$$ \bigcup\_{n \in \mathbb{N}} ]-\infty,a\_n]=]-\infty,a[ $$

Donc, par continuité croissante de la mesure,
$$ \lim\limits\_{n \rightarrow +\infty} F(a\_n)=\lim\limits\_{n \rightarrow +\infty}p(]-\infty,a\_n])=p(]-\infty,a[) $$

Or, $F(a)=p(]-\infty,a])=p(]-\infty,a[)+p(\\{a\\})$. Donc $F(a) = \lim\_{n}F(a\_n)$ si et seulement si $p(\\{a\\})=0$, ce qui montre que $F$ est continue à gauche en $a$ si et seulement si $p(\\{a\\})=0$. Combiné avec la continuité à droite, $F$ est continue en $a$ si et seulement si $p(\\{a\\})=0$. Si $p$ ne charge aucun point, alors $p(\\{a\\})=0$ pour tout $a \in \mathbb{R}$, donc $F$ est continue sur $\mathbb{R}$. $\blacksquare$
