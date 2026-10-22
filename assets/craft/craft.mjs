import {createPreference} from '../runtime/motion-runtime.mjs';
import {bindComposite,bindState,bindScrollGroup,bindSoftObject} from './continuous.mjs';
const pref=createPreference(),controllers=[],q=s=>document.querySelector(s);
controllers.push(bindComposite(q('#primary'),{pref}),bindComposite(q('#compact'),{pref,compact:true}),bindComposite(q('#scroll-action'),{pref}));
const saved=bindState(q('#save'),{pref});controllers.push(saved);
const soft=bindSoftObject(q('#soft-stage'),q('#soft-object'),{pref});controllers.push(soft);
const groups=[...document.querySelectorAll('[data-scroll-group]')].map(el=>({id:el.id||'header/footer',element:el,control:bindScrollGroup(el,{pref})}));controllers.push(...groups.map(x=>x.control));
q('#reduce').addEventListener('change',()=>pref.set(q('#reduce').checked?true:null));
const report=()=>q('#system-preference').textContent=matchMedia('(prefers-reduced-motion: reduce)').matches?'System reduced motion is active.':'';
pref.subscribe(report);report();
q('#primary').addEventListener('click',()=>q('#action-status').textContent='Collection preview requested.');q('#compact').addEventListener('click',()=>q('#action-status').textContent='Compact preview requested.');
q('#scroll-action').addEventListener('click',()=>q('#moment-status').textContent='Moment kept.');
let disposed=false;function destroy(){if(disposed)return;disposed=true;controllers.forEach(x=>x.destroy());pref.destroy();}
// Demonstration observation outlet only; do not add this interface to real products.
window.__craft={saved,soft,groups,pref,destroy,get disposed(){return disposed;}};
addEventListener('pagehide',e=>{if(!e.persisted)destroy();});document.documentElement.dataset.craftReady='true';
