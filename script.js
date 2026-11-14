const $=id=>document.getElementById(id);
const esc=s=>s.replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const FIL=[
["droit","Droit, lettres, sciences humaines",1,"Surtout du texte, du PDF et de la recherche en ligne : la batterie et le clavier comptent plus que la puissance.","a"],
["sante","Médecine, santé, paramédical",1,"Cours en PDF, fiches, applications de révision : un PC léger qui tient la journée suffit.","a"],
["gestion","Économie, gestion, commerce",2,"Excel avec de gros fichiers, tableaux croisés, parfois un logiciel de gestion : la mémoire fait la différence.","a"],
["sciences","Mathématiques, physique, chimie",2,"Calcul, Python, MATLAB ou simulation : un processeur solide et 16 Go évitent les ralentissements.","a"],
["info","Informatique, développement",2,"Éditeur de code, navigateur, serveur local, parfois Docker : 16 Go de RAM sont le vrai minimum.","l"],
["data","Data science, intelligence artificielle",3,"Entraînement de modèles et gros jeux de données : un GPU dédié et beaucoup de RAM font gagner des heures.","l"],
["ing","Ingénierie (mécanique, génie civil, électrique)",3,"CAO et simulation (SolidWorks, AutoCAD, MATLAB) : ces logiciels demandent un GPU dédié.","wx"],
["archi","Architecture",3,"Modélisation 3D, rendus, Revit ou AutoCAD : GPU dédié, 32 Go de RAM si possible et un écran fidèle.","wx"],
["design","Design, graphisme, audiovisuel",3,"Suite Adobe, retouche photo, montage : écran bien calibré, GPU dédié et RAM généreuse.","m"],
["jeux","Développement de jeux vidéo",4,"Moteurs 3D comme Unity ou Unreal : le profil le plus exigeant, tout compte.","w"]
];
const OS={a:"Windows ou macOS : vérifie que les logiciels de ta fac existent sur ton système.",l:"Windows, macOS ou Linux au choix : aucun n’est un frein.",m:"macOS ou Windows : les deux conviennent, choisis celui de tes logiciels.",wx:"Windows en pratique : SolidWorks, Revit et AutoCAD complet n’existent pas sur macOS.",w:"Windows 11 : la plupart des moteurs de jeu et outils 3D y sont les mieux pris en charge."};
const S={
1:{n:"Essentiel",cpu:"Intel Core i3 ou AMD Ryzen 3 (génération récente)",ram:"8 Go",ssd:"256 Go SSD",gpu:"Intégré, suffisant",scr:"14 à 15,6 pouces, Full HD"},
2:{n:"Polyvalent",cpu:"Intel Core i5 ou AMD Ryzen 5 (génération récente)",ram:"16 Go",ssd:"512 Go SSD",gpu:"Intégré récent, suffisant",scr:"14 à 15,6 pouces, Full HD, dalle IPS"},
3:{n:"Performant",cpu:"Intel Core i7 ou AMD Ryzen 7, de préférence série H",ram:"16 Go minimum, 32 Go idéal",ssd:"1 To SSD",gpu:"Dédiée de milieu de gamme, 6 à 8 Go de mémoire vidéo",scr:"15,6 pouces, IPS, bonne couverture sRGB"},
4:{n:"Station",cpu:"Intel Core i7 ou i9 série H, ou AMD Ryzen 9",ram:"32 Go",ssd:"1 To SSD NVMe ou plus",gpu:"Dédiée performante, 8 Go de mémoire vidéo ou plus",scr:"15,6 à 16 pouces, QHD, 100 % sRGB, 120 Hz ou plus"}
};
const TH={EUR:[350,550,850,1300],TND:[1200,1900,2900,4500]};
const fmt=(n,c)=>n.toLocaleString("fr-FR")+(c==="EUR"?" €":" DT");
FIL.forEach(f=>{const o=document.createElement("option");o.value=f[0];o.textContent=f[1];$("fil").appendChild(o)});
let view=0;
function calc(){
const f=FIL.find(x=>x[0]===$("fil").value);if(!f)return null;
const g=$("jeux").checked,v=$("video").checked,vm=$("vm").checked,mob=$("mob").checked;
let need=f[2];if(g||v)need=Math.max(need,3);if(g&&v)need=4;if(vm)need=Math.max(need,2);
const cur=$("cur").value,T=TH[cur],raw=$("bud").value,b=parseFloat(raw),has=raw!==""&&!isNaN(b);
const aff=has?T.filter(x=>b>=x).length:need,tier=Math.max(1,Math.min(need,aff)),s=S[tier];
let vc,vt;
if(!has){vc="info";vt="Indique ton budget pour vérifier qu’il couvre cette configuration. Prévois au minimum "+fmt(T[need-1],cur)+".";}
else if(aff===0){vc="warn";vt="Avec "+fmt(b,cur)+", un PC neuf sera très limité. Regarde le reconditionné professionnel : c’est souvent le seul moyen d’obtenir 8 Go de RAM et un SSD à ce prix.";}
else if(aff<need){vc="warn";vt="Pour ta filière, la configuration idéale démarre vers "+fmt(T[need-1],cur)+". Ton budget couvre le niveau "+aff+" : voici la version réaliste. Si tu dois rogner, sacrifie d’abord la carte graphique puis l’écran, jamais la RAM ni le SSD.";}
else{vc="ok";vt="Ton budget couvre cette configuration."+(aff>need?" Tu as de la marge : mets le surplus dans l’écran, la batterie et la garantie plutôt que dans plus de puissance.":"");}
const ram=vm?(tier>=3?"32 Go":"16 Go minimum, 32 Go si possible"):s.ram;
const bat=mob?(tier>=3?"6 h réelles minimum, moins de 2 kg : puissance et légèreté s’excluent en partie":"8 h réelles minimum, moins de 1,5 kg"):"5 h suffisent, le poids est secondaire";
return{f,tier,s,cur,T,vc,vt,ram,bat,nom:$("nom").value.trim()};
}
const rows=c=>[["Processeur",c.s.cpu,0],["Mémoire (RAM)",c.ram,1],["Stockage",c.s.ssd,1],["Carte graphique",c.s.gpu,0],["Écran",c.s.scr,0],["Autonomie et poids",c.bat,0],["Système",OS[c.f[4]],0]];
function render(){
const c=calc();let h;
if(!c)h='<h2>Ta fiche apparaît ici</h2><p class="meta">Choisis ta filière dans le panneau de gauche : la configuration, le budget et les conseils s’affichent dès que c’est fait.</p>';
else if(view===0)h='<h2>'+(c.nom?'La config de '+esc(c.nom):'Ta configuration')+'</h2><p class="meta">Niveau '+c.tier+' sur 4 : '+c.s.n+'</p><dl>'+rows(c).map(r=>'<div class="spec"><dt>'+r[0]+'</dt><dd>'+(r[2]?'<span class="hl">'+r[1]+'</span>':r[1])+'</dd></div>').join('')+'</dl><p class="foot">Surligné : à ne jamais sacrifier, même quand le budget est serré.</p>';
else if(view===1)h='<h2>Ton budget</h2><p class="big">à partir de '+fmt(c.T[c.tier-1],c.cur)+'</p><p class="meta">Prix indicatif d’un PC neuf de niveau '+c.tier+'.</p><p class="verdict '+c.vc+'">'+c.vt+'</p>';
else h='<h2>Avant de payer</h2><p class="meta">'+c.f[3]+'</p><ul><li>Demande à ta faculté la liste des logiciels et la version du système exigées.</li><li>Compare avec un reconditionné professionnel : à budget égal, tu gagnes souvent un niveau.</li><li>Teste le clavier et l’écran en magasin, tu les utiliseras des milliers d’heures.</li></ul><p class="foot">Prix neufs indicatifs, à vérifier sur ton marché local.</p>';
$("out").innerHTML=h;
$("cnt").textContent="0"+(view+1);
document.querySelectorAll("[data-v]").forEach(b=>{if(+b.dataset.v===view)b.setAttribute("aria-current","true");else b.removeAttribute("aria-current")});
}
["fil","jeux","video","vm","mob","bud","cur","nom"].forEach(id=>{$(id).addEventListener("input",render);$(id).addEventListener("change",render)});
document.querySelectorAll("[data-v]").forEach(b=>b.addEventListener("click",()=>{view=+b.dataset.v;render()}));
$("prev").onclick=()=>{view=(view+2)%3;render()};
$("next").onclick=()=>{view=(view+1)%3;render()};
$("reset").onclick=()=>{["nom","bud"].forEach(i=>$(i).value="");$("fil").value="";["jeux","video","vm","mob"].forEach(i=>$(i).checked=false);view=0;render()};
$("copy").onclick=async()=>{
const c=calc(),b=$("copy");if(!c)return;
const t=(c.nom?"Config de "+c.nom:"Ma configuration")+" (niveau "+c.tier+", "+c.s.n+")\n"+rows(c).map(r=>r[0]+" : "+r[1]).join("\n")+"\n"+c.vt;
const o=b.textContent;
try{await navigator.clipboard.writeText(t);b.textContent="Copié"}catch(e){b.textContent="Copie impossible"}
setTimeout(()=>{b.textContent=o},1600);
};
render();