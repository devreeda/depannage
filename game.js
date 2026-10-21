(function(){
'use strict';

const $ = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>Array.from(r.querySelectorAll(s));
const LS_BEST='depannage.best.v1', LS_MODE='depannage.mode.v1', LS_SOUND='depannage.sound.v1';
const CATS=['Manifold','Sondes','Électro','Régulation','Visuel','Client'];

const state={
  mode:'apprenti', best:{}, sound:false, level:null,
  used:new Set(), minutes:0, startMin:0, tries:0
};
let gaugeBP=null, gaugeHP=null;
let audioCtx=null;
let resetArm=false, resetTimer=null;

/* ---------- utils ---------- */
function fmt(v,d){
  if(v===null||v===undefined||Number.isNaN(v)) return '—';
  const dec = d===undefined ? (Number.isInteger(v)?0:1) : d;
  return v.toFixed(dec).replace('.',',');
}
function eur(v){ return v.toFixed(2).replace('.',',')+' €'; }
function clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }
function starsFor(score){ return score>=88?3:score>=68?2:score>0?1:0; }
function starHtml(n){ return [0,1,2].map(i=>`<span class="${i<n?'on':''}">${i<n?'★':'☆'}</span>`).join(''); }
function clockStr(mins){
  let m=state.startMin+mins;
  const h=Math.floor(m/60)%24, mm=m%60;
  return String(h).padStart(2,'0')+':'+String(mm).padStart(2,'0');
}

/* ---------- son ---------- */
function beep(freq,dur,type,gain){
  if(!state.sound) return;
  try{
    audioCtx = audioCtx || new (window.AudioContext||window.webkitAudioContext)();
    const o=audioCtx.createOscillator(), g=audioCtx.createGain();
    o.type=type||'sine'; o.frequency.value=freq||520;
    const t=audioCtx.currentTime, G=gain||0.05;
    g.gain.setValueAtTime(G,t);
    g.gain.exponentialRampToValueAtTime(0.0001,t+(dur||0.06));
    o.connect(g); g.connect(audioCtx.destination);
    o.start(t); o.stop(t+(dur||0.06));
  }catch(e){}
}
function chord(notes){
  if(!state.sound) return;
  notes.forEach((n,i)=>setTimeout(()=>beep(n,0.12,'triangle',0.045),i*90));
}

/* ---------- navigation ---------- */
function show(id){
  $$('.screen').forEach(s=>s.classList.toggle('on',s.id===id));
  $('.topbar').scrollIntoView({block:'start'});
  window.scrollTo(0,0);
}

/* ---------- accueil ---------- */
function renderHome(){
  const grid=$('#levels'); grid.innerHTML='';
  LEVELS.forEach(l=>{
    const best=state.best[l.id]||0;
    const b=document.createElement('button');
    b.className='level'+(best>0?' done':'');
    b.type='button';
    b.innerHTML=`
      <span class="level-num">${l.num}</span>
      <span class="level-body">
        <span class="level-title">${l.title}</span>
        <span class="level-meta">${l.gearShort}</span>
      </span>
      <span class="level-stars">${starHtml(starsFor(best))}</span>
      <span class="level-go">→</span>`;
    b.addEventListener('click',()=>openBrief(l.id));
    grid.appendChild(b);
  });
  $$('#modeSeg button').forEach(b=>{
    const on=b.dataset.mode===state.mode;
    b.classList.toggle('on',on);
    b.setAttribute('aria-checked',on?'true':'false');
  });
  $('#modeHint').textContent = state.mode==='apprenti'
    ? `Les fourchettes normales s'affichent à côté des mesures.`
    : `Chiffres bruts. Les fourchettes et les interprétations disparaissent : démerde-toi.`;
  const done=Object.keys(state.best).filter(k=>state.best[k]>0).length;
  const pill=$('#donePill');
  pill.hidden = done===0;
  pill.textContent = done+'/6 pannes résolues';
}

/* ---------- briefing ---------- */
function openBrief(id){
  const l=LEVELS.find(x=>x.id===id);
  if(!l) return;
  state.level=l;
  $('#briefNum').textContent=l.num;
  $('#briefPlace').textContent=l.place;
  $('#briefTitle').textContent=l.title;
  $('#briefGear').textContent=l.gear;
  $('#briefCall').textContent=l.call;
  $('#briefClient').textContent='— '+l.client;
  const ul=$('#briefSymptoms'); ul.innerHTML='';
  l.symptoms.forEach(s=>{
    const li=document.createElement('li'); li.textContent=s; ul.appendChild(li);
  });
  show('s-brief');
}

/* ---------- jeu ---------- */
function begin(){
  const l=state.level;
  state.used=new Set();
  state.minutes=0;
  state.tries=0;
  const [h,m]=l.start.split(':').map(Number);
  state.startMin=h*60+m;
  $('#playNum').textContent=l.num;
  $('#playTitle').textContent=l.title;
  $('#playGear').textContent=l.gearShort;
  $('#clock').textContent=l.start;
  $('#elapsed').textContent='sur site · 0 min';
  $('#actCount').textContent='0 mesure';
  $('#logCount').textContent='0 relevé';
  renderInstrument();
  renderActions();
  renderRows();
  show('s-play');
}

function gaugeMarkup(max,ticks,cls){
  const cx=100, cy=100, r=78;
  const A=v=>-225+270*(v/max);
  const P=(deg,rad)=>[cx+rad*Math.cos(deg*Math.PI/180),cy+rad*Math.sin(deg*Math.PI/180)];
  const arc=(a1,a2,rad)=>{
    const p1=P(a1,rad), p2=P(a2,rad), large=(a2-a1)>180?1:0;
    return `M${p1[0].toFixed(2)} ${p1[1].toFixed(2)}A${rad} ${rad} 0 ${large} 1 ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`;
  };
  const full=arc(-225,45,r);
  let tk='';
  const every=Math.max(1,Math.round(ticks/4));
  for(let i=0;i<=ticks;i++){
    const v=max*i/ticks, a=A(v);
    const major=(i%every===0)||i===ticks||i===0;
    const p1=P(a,major?84:87), p2=P(a,93);
    tk+=`<line class="tick${major?' major':''}" x1="${p1[0].toFixed(2)}" y1="${p1[1].toFixed(2)}" x2="${p2[0].toFixed(2)}" y2="${p2[1].toFixed(2)}"/>`;
    if(major){
      const pl=P(a,69);
      tk+=`<text class="tlabel" x="${pl[0].toFixed(2)}" y="${(pl[1]+3).toFixed(2)}" text-anchor="middle">${Math.round(v)}</text>`;
    }
  }
  return `<svg viewBox="0 0 200 168" aria-hidden="true">
    <path class="track" d="${full}"/>
    <path class="fill" d="${full}" pathLength="100" style="stroke-dasharray:0 100"/>
    ${tk}
    <line class="needle" x1="100" y1="100" x2="100" y2="34" transform="rotate(-225 100 100)" style="transform:rotate(-225deg)"/>
    <circle class="hub" cx="100" cy="100" r="6"/>
    <circle class="hub2" cx="100" cy="100" r="2.4"/>
  </svg>
  <div class="gauge-val"><b>--</b><small>bar</small></div>
  <div class="gauge-label">${cls}</div>
  <div class="gauge-sub"></div>`;
}

function bindGauge(root,max){
  return {
    root,max,
    fill:root.querySelector('.fill'),
    needle:root.querySelector('.needle'),
    val:root.querySelector('.gauge-val b'),
    sub:root.querySelector('.gauge-sub')
  };
}

function setGauge(g,val,sub){
  if(!g) return;
  const f=clamp(val/g.max,0,1);
  g.fill.style.strokeDasharray=(f*100).toFixed(2)+' 100';
  g.needle.style.transform='rotate('+(-225+270*f).toFixed(2)+'deg)';
  g.val.textContent=fmt(val);
  g.sub.textContent=sub||'';
}

function tempLabel(side,val){
  const l=state.level;
  if(!l||!l.ref) return '';
  if(side==='HP'){
    const t=tSat(l.ref,val,'bubble');
    return t===null?'transcritique':'≈ '+fmt(t,0)+' °C cond.';
  }
  const t=tSat(l.ref,val,'dew');
  return t===null?'':'≈ '+fmt(t,0)+' °C évap.';
}

function renderInstrument(){
  const box=$('#instr'); box.innerHTML=''; gaugeBP=null; gaugeHP=null;
  const l=state.level;
  if(l.gauges){
    const wrap=document.createElement('div');
    wrap.className='gauges';
    wrap.innerHTML=`
      <div class="gauge bp" id="g-bp">${gaugeMarkup(l.gauges.bpMax,8,'BP')}</div>
      <div class="gauge hp" id="g-hp">${gaugeMarkup(l.gauges.hpMax,l.gauges.hpMax>=100?7:6,'HP')}</div>`;
    box.appendChild(wrap);
    gaugeBP=bindGauge($('#g-bp'),l.gauges.bpMax);
    gaugeHP=bindGauge($('#g-hp'),l.gauges.hpMax);
  } else if(l.amps){
    box.innerHTML=`<div class="amps">
      <div class="amp-row"><span>L1</span><div class="bar nom"><i style="width:0%"></i></div><b>—</b></div>
      <div class="amp-row"><span>L2</span><div class="bar nom"><i style="width:0%"></i></div><b>—</b></div>
      <div class="amp-row"><span>L3</span><div class="bar nom"><i style="width:0%"></i></div><b>—</b></div>
      <div class="amp-note">Plaque four : <b>97,3 A</b> · disjoncteur 125 A</div>
    </div>`;
  }
}

function updateAmp(key,val){
  const idx={'L1':0,'L2':1,'L3':2}[key];
  if(idx===undefined) return;
  const row=$$('#instr .amp-row')[idx];
  if(!row) return;
  row.querySelector('.bar i').style.width=clamp(val/120*100,0,100)+'%';
  row.querySelector('b').textContent=fmt(val)+' A';
}

function renderActions(){
  const box=$('#actionGroups'); box.innerHTML='';
  const l=state.level;
  CATS.forEach(cat=>{
    const acts=l.actions.filter(a=>a.cat===cat);
    if(!acts.length) return;
    const g=document.createElement('div'); g.className='act-group';
    g.innerHTML=`<h4>${cat}</h4>`;
    acts.forEach(a=>{
      const btn=document.createElement('button');
      btn.type='button'; btn.className='act'; btn.dataset.id=a.id;
      btn.innerHTML=`<span class="act-label">${a.label}</span><span class="cost">+${a.cost} min</span>`;
      btn.addEventListener('click',()=>takeAction(a));
      g.appendChild(btn);
    });
    box.appendChild(g);
  });
}

function renderRows(){
  const rows=$('#rows');
  rows.innerHTML='<div class="empty">Rien au carnet.<br>Le client te regarde, les bras croisés.</div>';
}

function takeAction(a){
  if(state.used.has(a.id)) return;
  state.used.add(a.id);
  state.minutes+=a.cost;
  const time=clockStr(state.minutes);
  updateClock();
  addRow(a,time);
  markUsed(a);
  $('#actCount').textContent=state.used.size+' mesure'+(state.used.size>1?'s':'');
  $('#logCount').textContent=state.used.size+' relevé'+(state.used.size>1?'s':'');
  beep(660,0.045,'sine',0.035);
}

function updateClock(){
  $('#clock').textContent=clockStr(state.minutes);
  $('#elapsed').textContent='sur site · '+state.minutes+' min';
}

function addRow(a,time){
  const rows=$('#rows');
  const empty=rows.querySelector('.empty');
  if(empty) empty.remove();
  const div=document.createElement('div');
  div.className='row';
  if(a.num){
    const label=a.num.label;
    const temp=(label==='HP'||label==='BP')?tempLabel(label,a.num.val):'';
    let note='';
    if(state.mode==='apprenti'){
      const bits=[];
      if(a.num.range && a.num.range!=='—') bits.push('Attendu : '+a.num.range+'.');
      if(a.num.note) bits.push(a.num.note);
      if(bits.length) note=`<div class="row-note">${bits.join(' ')}</div>`;
    }
    div.innerHTML=`
      <div class="row-top"><span class="row-label">${label}</span><span class="row-time">${time}</span></div>
      <div class="row-val">${fmt(a.num.val)}<small>${a.num.unit||''}</small>${temp?`<em>${temp}</em>`:''}</div>
      ${note}`;
    if(label==='HP'&&gaugeHP) setGauge(gaugeHP,a.num.val,temp);
    if(label==='BP'&&gaugeBP) setGauge(gaugeBP,a.num.val,temp);
    if(a.num.amp) updateAmp(a.num.amp,a.num.val);
  } else {
    let note='';
    if(state.mode==='apprenti' && a.note) note=`<div class="row-note">${a.note}</div>`;
    div.innerHTML=`
      <div class="row-top"><span class="row-label">${a.tag||a.cat}</span><span class="row-time">${time}</span></div>
      <div class="row-text">${a.txt}</div>
      ${note}`;
  }
  rows.prepend(div);
  rows.classList.toggle('fade', rows.scrollHeight > rows.clientHeight + 2);
}

function markUsed(a){
  const btn=$('#actionGroups .act[data-id="'+a.id+'"]');
  if(!btn) return;
  btn.disabled=true;
  const c=btn.querySelector('.cost');
  if(c) c.textContent = a.num ? fmt(a.num.val)+(a.num.unit?' '+a.num.unit:'') : 'relevé';
}

/* ---------- diagnostic ---------- */
function openDx(){
  if(state.used.size<3){
    toast('Trois mesures minimum. Le client ne te paye pas pour te regarder brancher.');
    return;
  }
  const l=state.level;
  $('#modalSub').textContent=`${state.used.size} mesures · ${state.minutes} min sur site. Une seule réponse, pas de retour arrière.`;
  const box=$('#choices'); box.innerHTML='';
  const opts=l.options.slice().sort(()=>Math.random()-0.5);
  opts.forEach((o,i)=>{
    const b=document.createElement('button');
    b.type='button'; b.className='choice';
    b.innerHTML=`<span class="k">${i+1}</span><span>${o.label}</span>`;
    b.addEventListener('click',()=>submitDx(o));
    box.appendChild(b);
  });
  $('#modal').hidden=false;
}

function closeModal(){ $('#modal').hidden=true; }

function submitDx(chosen){
  const l=state.level;
  const correct=chosen.id===l.correct;
  state.tries++;
  let score=0;
  if(correct){
    score=100;
    score-=Math.max(0,state.used.size-4)*3;
    score-=Math.max(0,state.minutes-25)*0.5;
    score=Math.round(clamp(score,40,100));
    state.best[l.id]=Math.max(state.best[l.id]||0,score);
    try{ localStorage.setItem(LS_BEST,JSON.stringify(state.best)); }catch(e){}
  }
  closeModal();
  renderResult(correct,chosen,score);
  show('s-result');
  if(correct) chord([523,659,784]); else beep(140,0.22,'sawtooth',0.05);
}

function patronLine(score,correct){
  if(!correct) return `T'as changé quoi, au juste ? Rends-moi la clé du camion.`;
  if(score>=90) return `Propre, rapide, pas une pièce changée pour rien. Tu me fais de l'ombre.`;
  if(score>=75) return `C'est bon. T'as juste pris ton temps. Le client a payé le café.`;
  if(score>=60) return `Diagnostic juste, mais t'as tâtonné. La prochaine, tu ouvres les yeux avant de brancher le manifold.`;
  return `C'est réparé, mais t'as intérêt à ce que ce soit la dernière fois que je t'envoie là-bas.`;
}

function renderResult(correct,chosen,score){
  const l=state.level;
  const good=l.options.find(o=>o.id===l.correct);
  const idx=LEVELS.findIndex(x=>x.id===l.id);
  const nextL=LEVELS[idx+1]||null;
  const n=state.tries;
  const attempt=(n===1?'1re':n+'e')+' tentative';

  let verdict;
  if(correct){
    verdict=`<div class="verdict ok">
      <span class="v-badge">Diagnostic correct</span>
      <h2>${good.label}</h2>
      <p class="v-sub">${l.title} — bouclée en ${state.minutes} min avec ${state.used.size} mesures.</p>
    </div>`;
  }else{
    verdict=`<div class="verdict ko">
      <span class="v-badge">À côté</span>
      <h2>La panne, c'était : ${good.label}</h2>
      <p class="v-sub">Tu as posé « ${chosen.label} ». Le client a payé deux déplacements.</p>
    </div>`;
  }

  const lesson=`<div class="panel lesson">
    <h3>Ce qu'il fallait voir</h3>
    <ul>${l.lesson.map(x=>`<li>${x}</li>`).join('')}</ul>
  </div>`;

  const scorecard=`<div class="panel scorecard">
    <h3>Note du patron</h3>
    <div class="score-num">${score}<span>/100</span></div>
    <div class="stars">${starHtml(starsFor(score))}</div>
    <div class="stats">
      <div><b>${state.minutes} min</b><span>sur site</span></div>
      <div><b>${state.used.size}</b><span>mesures</span></div>
      <div><b>${n===1?'1re':n+'e'}</b><span>tentative</span></div>
    </div>
    <p class="patron">« ${patronLine(score,correct)} »<em>— le patron</em></p>
  </div>`;

  let report='';
  if(correct){
    const mo=state.minutes*1.1;
    const part=l.part&&l.part.price?l.part.price:0;
    const ht=45+mo+part;
    const tva=Math.round(ht*0.2*100)/100;
    const ttc=Math.round((ht+tva)*100)/100;
    report=`<div class="report">
      <h4>Facture — intervention ${l.num}</h4>
      <div class="line"><span>Déplacement</span><span>${eur(45)}</span></div>
      <div class="line"><span>Main d'œuvre — ${state.minutes} min</span><span>${eur(mo)}</span></div>
      ${part?`<div class="line"><span>${l.part.label}</span><span>${eur(part)}</span></div>`:''}
      <div class="line"><span>Total HT</span><span>${eur(ht)}</span></div>
      <div class="line"><span>TVA 20 %</span><span>${eur(tva)}</span></div>
      <div class="line tot"><span>Total TTC</span><span>${eur(ttc)}</span></div>
    </div>`;
  }else{
    report=`<div class="report">
      <h4>Facture</h4>
      <div class="line zero"><span>Intervention à refaire</span><span>0,00 €</span></div>
    </div>`;
  }

  const actions = correct
    ? `<button class="cta" id="nextBtn">${nextL?'Panne suivante':'Retour au menu'} <span>→</span></button>
       <button class="cta ghost" id="replayBtn">Rejouer</button>`
    : `<button class="cta" id="replayBtn">Rejouer</button>
       <button class="cta ghost" id="nextBtn">Retour au menu</button>`;

  $('#resultBody').innerHTML=`
    <div class="result">
      ${verdict}
      <div class="res-grid">${lesson}${scorecard}</div>
      ${report}
      <div class="res-actions">${actions}</div>
    </div>`;

  $('#replayBtn').addEventListener('click',()=>{ begin(); });
  $('#nextBtn').addEventListener('click',()=>{
    if(correct&&nextL) openBrief(nextL.id);
    else { renderHome(); show('s-home'); }
  });
}

/* ---------- divers ---------- */
let toastTimer=null;
function toast(msg){
  const t=$('#toast');
  t.textContent=msg; t.hidden=false;
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>{ t.hidden=true; },3000);
}

function applySound(){
  const b=$('#soundBtn');
  b.classList.toggle('on',state.sound);
  b.setAttribute('aria-label',state.sound?'Couper le son':'Activer le son');
}

function init(){
  try{ state.best=JSON.parse(localStorage.getItem(LS_BEST)||'{}')||{}; }catch(e){ state.best={}; }
  const m=localStorage.getItem(LS_MODE); if(m==='apprenti'||m==='expert') state.mode=m;
  state.sound=localStorage.getItem(LS_SOUND)==='1';
  applySound();
  renderHome();

  $('#brandBtn').addEventListener('click',()=>{ if(state.level&&$('#s-play').classList.contains('on')){ /* retour accueil */ } renderHome(); show('s-home'); });
  $('#soundBtn').addEventListener('click',()=>{
    state.sound=!state.sound;
    try{ localStorage.setItem(LS_SOUND,state.sound?'1':'0'); }catch(e){}
    applySound();
    if(state.sound) beep(720,0.07,'sine',0.04);
  });
  $$('#modeSeg button').forEach(b=>b.addEventListener('click',()=>{
    state.mode=b.dataset.mode;
    try{ localStorage.setItem(LS_MODE,state.mode); }catch(e){}
    renderHome();
  }));
  $('#briefBack').addEventListener('click',()=>{ renderHome(); show('s-home'); });
  $('#beginBtn').addEventListener('click',begin);
  $('#dxBtn').addEventListener('click',openDx);
  $('#modalClose').addEventListener('click',closeModal);
  $('#modal').addEventListener('click',e=>{ if(e.target===$('#modal')) closeModal(); });
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&!$('#modal').hidden) closeModal();
  });
  $('#resetBtn').addEventListener('click',()=>{
    if(!resetArm){
      resetArm=true;
      toast('Clique encore pour confirmer la remise à zéro.');
      clearTimeout(resetTimer);
      resetTimer=setTimeout(()=>{resetArm=false;},3500);
      return;
    }
    resetArm=false;
    state.best={};
    try{ localStorage.removeItem(LS_BEST); }catch(e){}
    renderHome();
    toast('Scores remis à zéro. Le patron ne saura rien.');
  });
}

document.addEventListener('DOMContentLoaded',init);
})();
