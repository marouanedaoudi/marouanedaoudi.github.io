(function () {
  'use strict';
  var tools = window.ResearchViz;
  if (!tools) return;
  var fr = document.body.dataset.lang === 'fr';
  var S = tools.svg;
  // Abramowitz–Stegun 7.1.26: absolute CDF error below 7.5e-8.
  function normal(x) {
    if (x === 0) return .5;
    var z = Math.abs(x) / Math.SQRT2, t = 1 / (1 + .3275911 * z);
    var erf = 1 - (((((1.061405429*t-1.453152027)*t)+1.421413741)*t-.284496736)*t+.254829592)*t*Math.exp(-z*z);
    return .5 * (1 + (x < 0 ? -erf : erf));
  }
  function twoSidedNormalTail(x) {
    if (x < 4) return 2 * normal(-x);
    // Mills' ratio continued fraction avoids subtracting a CDF rounded to one.
    var denominator = x;
    for (var j = 100; j >= 1; j--) denominator = x + j / denominator;
    return 2 * Math.exp(-x*x/2) / (Math.sqrt(2*Math.PI) * denominator);
  }
  function chart(host, options) {
    var w=Math.max(280,host.clientWidth),h=Math.round(Math.max(230,Math.min(290,w*.58))),l=42,r=20,t=30,b=42;
    var svg=S('svg',{viewBox:'0 0 '+w+' '+h,role:'img','aria-label':options.title});
    svg.append(S('title',{},options.title));
    var x=v=>l+(v-options.x[0])/(options.x[1]-options.x[0])*(w-l-r);
    var y=v=>h-b-(v-options.y[0])/(options.y[1]-options.y[0])*(h-t-b);
    svg.append(S('path',{d:'M'+l+','+t+'V'+(h-b)+'H'+(w-r),class:'axis'}));
    (options.xt || []).forEach(v=>{svg.append(S('path',{d:'M'+x(v)+','+(h-b)+'v4',class:'axis'}));svg.append(S('text',{x:x(v),y:h-b+20,'text-anchor':'middle',class:'tick-label'},String(v)));});
    (options.yt || []).forEach(v=>{svg.append(S('text',{x:l-8,y:y(v)+4,'text-anchor':'end',class:'tick-label'},String(v)));});
    svg.append(S('text',{x:l,y:17,class:'direct-label'},options.title));
    svg.append(S('text',{x:w-r,y:h-4,'text-anchor':'end',class:'tick-label'},options.xlabel || 'x'));
    function path(points, cls, draw) {var p=S('path',{d:points.map((a,i)=>(i?'L':'M')+x(a[0]).toFixed(2)+','+y(a[1]).toFixed(2)).join(''),class:cls});svg.append(p);if(draw)tools.draw(p);return p;}
    function dot(a, open) {svg.append(S('circle',{cx:x(a[0]),cy:y(a[1]),r:3.5,fill:open?'var(--paper)':'var(--accent)',stroke:'var(--accent)','stroke-width':1.5}));}
    function label(a, text, cls) {svg.append(S('text',{x:x(a[0]),y:y(a[1]),class:cls || 'tick-label'},text));}
    host.append(svg);return {path,dot,label};
  }
  function samples(a,b,f,n=200) {return Array.from({length:n+1},(_,i)=>{var x=a+(b-a)*i/n;return[x,f(x)];});}
  document.querySelectorAll('[data-math-figure]').forEach(function (figure) {
    var kind=figure.dataset.mathFigure, host=figure.querySelector('[data-math-chart]'), readout=figure.querySelector('[data-math-readout]');
    var control=figure.querySelector('[data-step]'), value=figure.querySelector('[data-step-value]');
    figure.querySelector('.figure-controls').hidden=false;
    function render(animate) {
      host.replaceChildren();var n=control?+control.value:0;if(value)value.textContent=n;
      if(kind==='gaussian') {
        var sigma=+figure.querySelector('[data-limit]').value,sn=sigma+1/Math.sqrt(n);
        var c=chart(host,{title:fr?'Fonctions de répartition':'Cumulative distribution functions',x:[-4,4],y:[0,1],xt:[-4,-2,0,2,4],yt:[0,.5,1]});
        if(sigma===0) {c.path([[-4,0],[0,0]],'reference');c.path([[0,1],[4,1]],'reference');c.dot([0,0],true);c.dot([0,1],false);}
        else c.path(samples(-4,4,x=>normal(x/sigma)),'reference');
        c.path(samples(-4,4,x=>normal(x/sn)),'series-accent',animate);c.label([-3.8,.9],fr?'bleu : Fₙ · pointillé : limite':'blue: Fₙ · dashed: limit');
        var p=chart(host,{title:fr?'Fonctions caractéristiques':'Characteristic functions',x:[-4,4],y:[0,1.1],xt:[-4,-2,0,2,4],yt:[0,.5,1],xlabel:'t'});
        p.path(samples(-4,4,x=>Math.exp(-sigma*sigma*x*x/2)),'reference');p.path(samples(-4,4,x=>Math.exp(-sn*sn*x*x/2)),'series-accent',animate);
        readout.textContent='σₙ = σ + n⁻¹ᐟ² = '+sn.toFixed(3)+'. '+(sigma===0?(fr?'La limite est δ₀ ; Fₙ(0)=½ reste différent de F(0)=1. La convergence étroite ne teste F qu’en ses points de continuité.':'The limit is δ₀; Fₙ(0)=½ remains different from F(0)=1. Weak convergence tests F only at its continuity points.'):(fr?'La limite a pour écart-type σ = ':'The limit has standard deviation σ = ')+sigma+'.');
      } else if(kind==='cdf') {
        var mass=+figure.querySelector('[data-mass]').value;figure.querySelector('[data-mass-value]').textContent=mass.toFixed(2);
        var f=x=>(1-mass)*Math.min(1,Math.max(0,(x+2)/4))+(x>=0?mass:0);
        var c=chart(host,{title:'F(x) = (1−w) Fᵤ(x) + w 1{x≥0}',x:[-3,3],y:[0,1],xt:[-2,-1,0,1,2],yt:[0,.5,1]});
        c.path([[-3,0],[-2,0],[0,(1-mass)/2]],'series-accent',animate);c.path([[0,(1+mass)/2],[2,1],[3,1]],'series-accent',animate);
        if(mass>0) {c.path([[0,(1-mass)/2],[0,(1+mass)/2]],'reference');c.dot([0,(1-mass)/2],true);}c.dot([0,f(0)],false);
        readout.textContent=(fr?'Mélange de la loi uniforme sur [−2,2] et de δ₀. ':'Mixture of the uniform distribution on [−2,2] and δ₀. ')+'F(0−) = '+((1-mass)/2).toFixed(3)+' ; F(0) = '+f(0).toFixed(3)+' ; F(0)−F(0−) = '+mass.toFixed(2)+'.';
      } else if(kind==='slutsky') {
        var c=chart(host,{title:fr?'Xₙ = Z, Yₙ = Z/n, Z ∼ N(0,1)':'Xₙ = Z, Yₙ = Z/n, Z ∼ N(0,1)',x:[-4,4],y:[0,1],xt:[-4,-2,0,2,4],yt:[0,.5,1]});
        c.path(samples(-4,4,normal),'reference');c.path(samples(-4,4,x=>normal(x/(1+1/n))),'series-accent',animate);c.label([-3.8,.9],fr?'bleu : Xₙ+Yₙ · pointillé : Z':'blue: Xₙ+Yₙ · dashed: Z');
        readout.textContent='Xₙ + Yₙ ∼ N(0, (1+1/n)²). P(|Yₙ| > ¼) ≈ '+twoSidedNormalTail(n/4).toExponential(2)+'. '+(fr?'Exemple dépendant construit pour la figure ; la preuve ne suppose aucune indépendance.':'A dependent example constructed for the figure; the proof assumes no independence.');
      } else if(kind==='series') {
        var total=0, changed=0, base=[],perturbed=[];
        for(var i=1;i<=60;i++) {total+=(i%2?1:-1)/i; if(i===2)changed+=.6;if(i===n)changed-=.2;base.push([i,total]);perturbed.push([i,total+changed]);}
        var c=chart(host,{title:fr?'Sommes partielles':'Partial sums',x:[1,60],y:[0,1.5],xt:[1,20,40,60],yt:[0,.5,1,1.5],xlabel:'n'});
        c.path(base,'series');c.path(perturbed,'series-accent',animate);
        var offset=.4;
        c.path([[1,Math.log(2)+offset],[60,Math.log(2)+offset]],'reference');
        readout.textContent=(fr?'aₙ = (−1)ⁿ⁺¹/n ; ajout de 0,6 au rang 2 et de −0,2 au rang ':'aₙ = (−1)ⁿ⁺¹/n; add 0.6 at index 2 and −0.2 at index ')+n+'. '+(fr?'La limite passe de log 2 à log 2 + 0,4. Illustration déterministe de la décomposition trajectorielle.':'The limit changes from log 2 to log 2 + 0.4. Deterministic illustration of the pathwise decomposition.');
      } else {
        var q=+figure.querySelector('[data-power]').value;
        function probability(m) {return 1-(q===1?(n-1)/m:(n-1)*(m+1)/(n*m));}
        var c=chart(host,{title:'P(⋃ₖ₌Nᴹ Aₖ), P(Aₖ) = 1/k'+(q===2?'²':''),x:[n,200],y:[0,1],xt:[n,100,200],yt:[0,.5,1],xlabel:'M'});
        c.path(samples(n,200,probability,198),'series-accent',animate);c.path([[n,q===1?1:1/n],[200,q===1?1:1/n]],'reference');
        readout.textContent=(fr?'Événements indépendants pour ce calcul : P(aucun Aₖ, N≤k≤M) = ':'Independent events in this calculation: P(no Aₖ, N≤k≤M) = ')+(q===1?'(N−1)/M. ':'(N−1)(M+1)/(NM). ')+(fr?'À N fixé, la probabilité de l’union tend vers ':'At fixed N, the union probability tends to ')+(q===1?'1.':'1/N = '+(1/n).toFixed(3)+'.')+(q===2?(fr?' Cette limite tend ensuite vers 0 lorsque N→∞.':' This limit then tends to 0 as N→∞.'):'');
      }
    }
    figure.querySelectorAll('input,select').forEach(function(el){el.addEventListener('input',()=>render(false));el.addEventListener('change',()=>render(true));});render(false);
  });
})();
