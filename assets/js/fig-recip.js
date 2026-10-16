/* Derived from recip_score, copyright (c) 2025 akram3409.
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to
 * do so, subject to the following conditions: the above copyright notice and
 * this permission notice shall be included in all copies or substantial portions
 * of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY
 * KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
 * USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
(function () {
  "use strict";
  var thresholds = {
    energy: [335,670,1005,1340,1675,2010,2345,2680,3015,3350],
    sugar: [4.5,9,13.5,18,22.5,27,31.5,36,40.5,45],
    fat: [1,2,3,4,5,6,7,8,9,10],
    salt: [.09,.18,.27,.36,.45,.54,.63,.72,.81,.90],
    fiber: [.9,1.9,2.8,3.7,4.7], protein: [1.6,3.2,4.8,6.4,8]
  };
  function points(value, limits) { return limits.filter(function (limit) { return value >= limit; }).length; }
  function score(values, weight) {
    var p = {}; Object.keys(thresholds).forEach(function (key) { p[key] = points(values[key], thresholds[key]); });
    var a = p.energy+p.sugar+p.fat+p.salt, proteinUsed = a < 11;
    var c = p.fiber + (proteinUsed ? p.protein : 0), total = a-c;
    return { points:p, a:a, c:c, proteinUsed:proteinUsed, total:total,
      grade:weight<=.1 ? "?" : total<=-1 ? "A" : total<=2 ? "B" : total<=10 ? "C" : total<=18 ? "D" : "E" };
  }
  function calculate(example) {
    var absolute = {weight:0,energy:0,sugar:0,fat:0,salt:0,fiber:0,protein:0};
    var rows = example.ingredients.map(function (ingredient) {
      var weight = ingredient.quantity*ingredient.gramsPerUnit;
      var row = {name:ingredient.name,reference:ingredient.reference,weight:weight,
        energy:ingredient.energy_kcal*weight/100,sugar:ingredient.sugar_g*weight/100,
        fat:ingredient.fat_g*weight/100,fiber:ingredient.fiber_g*weight/100,
        protein:ingredient.protein_g*weight/100,salt:ingredient.sodium_mg*2.5/1000*weight/100};
      Object.keys(absolute).forEach(function (key) { absolute[key] += row[key]; }); return row;
    });
    var values = {}; Object.keys(thresholds).forEach(function (key) { values[key] = absolute.weight>.1 ? absolute[key]/absolute.weight*100 : 0; });
    var storedKeys={energy:"Energy_kcal",sugar:"Sugar_g",fat:"Fat_g",fiber:"Fiber_g",protein:"Protein_g",salt:"Salt_g"};
    var rounded={}; Object.keys(storedKeys).forEach(function (key) { rounded[key]=example.stored[storedKeys[key]]; });
    return {rows:rows,absolute:absolute,values:values,result:score(values,absolute.weight),rounded:rounded,roundedResult:score(rounded,example.stored.Total_Weight_g)};
  }
  if (typeof module !== "undefined" && module.exports) module.exports = {thresholds:thresholds,points:points,score:score,calculate:calculate};
  if (typeof document === "undefined") return;
  document.querySelectorAll('[data-figure="recip"]').forEach(function (figure) {
    var fr=document.documentElement.lang==="fr", controls=figure.querySelector(".figure-controls"), select=figure.querySelector("select");
    var next=figure.querySelector("[data-next]"), previous=figure.querySelector("[data-previous]"), reset=figure.querySelector("[data-reset]");
    var status=figure.querySelector("[data-step-status]"), details=figure.querySelector("[data-recip-details]"), svg=figure.querySelector("svg"), examples, stage=0, compact=false;
    var labels=fr?{energy:"Énergie (kcal)",sugar:"Sucres (g)",fat:"Lipides totaux (g)",salt:"Sel (g)",fiber:"Fibres (g)",protein:"Protéines (g)"}:{energy:"Energy (kcal)",sugar:"Sugars (g)",fat:"Total fat (g)",salt:"Salt (g)",fiber:"Fibre (g)",protein:"Protein (g)"};
    var stages=fr?["Lignes ingrédients et références associées","Contributions absolues dans la recette","Normalisation pour 100 g","Seuils et lettre de l’implémentation"]:["Ingredient rows and matched references","Absolute contributions to the recipe","Normalization per 100 g","Implementation thresholds and grade"];
    function fmt(n){return n.toLocaleString(fr?"fr-FR":"en-GB",{maximumFractionDigits:3});}
    function el(tag,text){var e=document.createElement(tag);if(text!==undefined)e.textContent=text;return e;}
    function table(headings,rows){var t=el("table"),caption=el("caption",stages[stage]);t.appendChild(caption);var head=el("thead"),tr=el("tr");headings.forEach(function(h){var th=el("th",h);th.scope="col";tr.appendChild(th);});head.appendChild(tr);t.appendChild(head);var body=el("tbody");rows.forEach(function(row){var r=el("tr");row.forEach(function(v){r.appendChild(el("td",v));});body.appendChild(r);});t.appendChild(body);return t;}
    function svgEl(tag,attrs,text){var e=document.createElementNS("http://www.w3.org/2000/svg",tag);Object.keys(attrs).forEach(function(k){e.setAttribute(k,attrs[k]);});if(text!==undefined)e.textContent=text;return e;}
    function render(){
      var example=examples[Number(select.value)],calc=calculate(example),keys=Object.keys(thresholds);details.replaceChildren();svg.toggleAttribute("hidden",stage!==3);
      if(stage===0)details.appendChild(table(fr?["Ingrédient","Référence nutritionnelle","Masse (g)"]:["Ingredient","Nutritional reference","Mass (g)"],calc.rows.map(function(row){return[row.name,row.reference,fmt(row.weight)];})));
      if(stage===1){details.appendChild(table(fr?["Ingrédient","Masse (g)","Énergie (kcal)","Sel (g)"]:["Ingredient","Mass (g)","Energy (kcal)","Salt (g)"],calc.rows.map(function(row){return[row.name,fmt(row.weight),fmt(row.energy),fmt(row.salt)];})));details.appendChild(el("p",(fr?"Masse totale : ":"Total mass: ")+fmt(calc.absolute.weight)+" g. "+(fr?"Sel = sodium × 2,5 / 1 000, puis pondération par la masse.":"Salt = sodium × 2.5 / 1,000, then scaled by ingredient mass.")));}
      if(stage===2)details.appendChild(table(fr?["Nutriment","Somme absolue","Pour 100 g"]:["Nutrient","Absolute sum","Per 100 g"],keys.map(function(key){return[labels[key],fmt(calc.absolute[key]),fmt(calc.values[key])];})));
      if(stage===3){
        details.appendChild(table(fr?["Composante","Valeur pour 100 g","Seuils atteints (≥)","Points"]:["Component","Value per 100 g","Thresholds reached (≥)","Points"],keys.map(function(key){return[labels[key],fmt(calc.values[key]),thresholds[key].filter(function(t){return calc.values[key]>=t;}).map(fmt).join("; ")||"—",String(calc.result.points[key])+(key==="protein"&&!calc.result.proteinUsed?(fr?" (exclus)":" (excluded)"):"")];})));
        var result=calc.result;details.appendChild(el("p","A = "+result.a+", C = "+result.c+"; S = A − C = "+result.total+". "+(fr?"Lettre recalculée avant arrondi : ":"Recomputed grade before rounding: ")+result.grade+". "+(result.proteinUsed?(fr?"Protéines retenues (A < 11).":"Protein retained (A < 11)."):fr?"Protéines exclues (A ≥ 11, fruits/légumes = 0).":"Protein excluded (A ≥ 11, fruit/vegetable points = 0).")));
        details.appendChild(el("p",(fr?"Lettre enregistrée dans le CSV : ":"Grade stored in the CSV: ")+example.stored.grade+"; "+(fr?"recalcul depuis les valeurs CSV arrondies : ":"recomputed from rounded CSV values: ")+calc.roundedResult.grade+". "+(fr?"Les arrondis ou la provenance du fichier peuvent expliquer une différence ; la lettre stockée n’est pas remplacée.":"Rounding or the file’s provenance may explain a difference; the stored grade is kept distinct.")));
        compact=figure.getBoundingClientRect().width<430;
        svg.setAttribute("viewBox",compact?"0 0 360 310":"0 0 480 230");svg.replaceChildren(svgEl("title",{},fr?"Points par composante du score historique":"Historical score points by component"));svg.setAttribute("aria-label",(fr?"Points A ":"A points ")+result.a+", C "+result.c+", S "+result.total+", "+result.grade);
        keys.forEach(function(key,i){var y=compact?22+i*48:24+i*32,p=result.points[key],start=compact?0:180,unit=compact?28:23;svg.appendChild(svgEl("text",{x:0,y:compact?y-5:y+4,"font-size":compact?15:13},labels[key]));svg.appendChild(svgEl("line",{x1:start,x2:start+p*unit,y1:compact?y+10:y,y2:compact?y+10:y,stroke:key==="fiber"||key==="protein"?"var(--accent)":"var(--muted)","stroke-width":4,"stroke-dasharray":key==="protein"&&!result.proteinUsed?"3 3":"none"}));svg.appendChild(svgEl("text",{x:start+12+p*unit,y:compact?y+14:y+4,"font-size":compact?15:13},String(p)+(key==="protein"&&!result.proteinUsed?" *":"")));});
      }
      status.textContent=(fr?"Étape ":"Stage ")+(stage+1)+" / 4 · "+stages[stage]+" · "+example.title;previous.disabled=stage===0;next.disabled=stage===3;
    }
    next.addEventListener("click",function(){stage=Math.min(3,stage+1);render();});previous.addEventListener("click",function(){stage=Math.max(0,stage-1);render();});reset.addEventListener("click",function(){stage=0;render();});select.addEventListener("change",function(){stage=0;render();});
    window.addEventListener("resize",function(){if(examples&&stage===3&&compact!==(figure.getBoundingClientRect().width<430))render();});
    fetch(figure.dataset.source).then(function(response){if(!response.ok)throw new Error("Data unavailable");return response.json();}).then(function(data){examples=data.examples;select.replaceChildren();examples.forEach(function(item,i){var option=el("option",item.title);option.value=String(i);select.appendChild(option);});controls.hidden=false;render();}).catch(function(){status.textContent=fr?"Les données interactives sont indisponibles. La méthode et ses limites restent décrites dans l’article.":"Interactive data are unavailable. The article still describes the method and its limitations.";});
  });
})();
