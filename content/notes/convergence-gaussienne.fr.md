---
title: "Convergence d'une suite de Gaussiennes"
date: 2025-02-14
tags: ["Gaussienne", "Convergence en loi"]
math: true
summary: "Convergence des variances et convergence Lp de variables gaussiennes centrées."
description: "Convergence de variables gaussiennes centrées : limite des variances par les fonctions caractéristiques, puis convergence Lp sous convergence en probabilité."
lastmod: 2026-10-14
---

{{< alert icon="circle-info" >}}
**Énoncé.** Soit $X_n\sim\mathcal N(0,\sigma_n^2)$ et supposons que $X_n$ converge en loi vers $X$.

1. Montrer que $\sigma_n^2$ converge vers une limite finie $\sigma^2$ et que $X\sim\mathcal N(0,\sigma^2)$, en autorisant le cas dégénéré $\sigma=0$.
2. Si $X_n\to X$ en probabilité, montrer la convergence dans $L^p$ pour tout $p\geq1$ fini.
{{< /alert >}}

## Convergence des variances

La fonction caractéristique d’une gaussienne centrée s’écrit

$$
\varphi_{X_n}(t)=\exp\!\left(-\frac{\sigma_n^2t^2}{2}\right).
$$

La convergence en loi implique $\varphi_{X_n}(t)\to\varphi_X(t)$ pour tout $t\in\mathbb R$. En particulier, $\varphi_X$ est réelle et positive ou nulle. Comme $\varphi_X(0)=1$ et que $\varphi_X$ est continue en zéro, on peut choisir $t_0\neq0$ suffisamment petit pour que $\varphi_X(t_0)>0$.

On peut donc prendre le logarithme en ce point fixé $t_0$ :

$$
\sigma_n^2=-\frac{2}{t_0^2}\log\varphi_{X_n}(t_0)
\longrightarrow
-\frac{2}{t_0^2}\log\varphi_X(t_0)=:\sigma^2<\infty.
$$

La limite est positive ou nulle. Pour tout $t$, on obtient alors

$$
\varphi_X(t)=\lim_n\exp\!\left(-\frac{\sigma_n^2t^2}{2}\right)
=\exp\!\left(-\frac{\sigma^2t^2}{2}\right).
$$

L’unicité de la fonction caractéristique donne $X\sim\mathcal N(0,\sigma^2)$. Lorsque $\sigma=0$, on a $X=0$ presque sûrement.

## De la convergence en probabilité à la convergence dans $L^p$

Fixons $1\leq p<\infty$ et choisissons $q>p$. Si $Z\sim\mathcal N(0,1)$, alors $c_q:=\mathbb E|Z|^q<\infty$. La convergence de $\sigma_n^2$ implique $M:=\sup_n\sigma_n<\infty$, donc

$$
\sup_n\mathbb E|X_n|^q=c_q\sup_n\sigma_n^q\leq c_qM^q<\infty.
$$

La limite $X$ étant également gaussienne, $\mathbb E|X|^q<\infty$. L’inégalité
$|x-y|^q\leq2^{q-1}(|x|^q+|y|^q)$ entraîne

$$
\sup_n\mathbb E|X_n-X|^q<\infty.
$$

La suite $|X_n-X|^p$ est donc uniformément intégrable. Comme $X_n-X\to0$ en probabilité, le critère d’intégrabilité uniforme donne

$$
\mathbb E|X_n-X|^p\longrightarrow0.
$$

On obtient la convergence dans $L^p$ pour tout $p\geq1$ fini. Aucune hypothèse d’indépendance entre les variables n’est nécessaire. $\blacksquare$
