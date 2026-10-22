import {springStep,isSettled} from './spring.mjs';
export function createPreference(){
 const media=matchMedia('(prefers-reduced-motion: reduce)');let override=null;const listeners=new Set();
 const notify=()=>listeners.forEach(fn=>fn(api.reduced));const api={get reduced(){return override===null?media.matches:override;},set(value){override=value===null?null:!!value;notify();},subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn);},destroy(){media.removeEventListener('change',notify);listeners.clear();}};
 media.addEventListener('change',notify);return api;
}
export function createScope(pref){
 const own=!pref;pref= pref||createPreference();const abort=new AbortController(),cleanups=[];
 return {pref,get active(){return !abort.signal.aborted;},on(el,type,fn,opts={}){el.addEventListener(type,fn,{...opts,signal:abort.signal});},clean(fn){cleanups.push(fn);return fn;},destroy(){if(abort.signal.aborted)return;abort.abort();for(const fn of cleanups.splice(0))fn();if(own)pref.destroy();}};
}
export function createSpring(initial,render,{pref,omega=30,zeta=1,onRest}={}){
 const state=Object.fromEntries(Object.entries(initial).map(([k,x])=>[k,{x,v:0,target:x}]));let raf=0,last=0,disposed=false;
 const values=()=>Object.fromEntries(Object.entries(state).map(([k,a])=>[k,a.x]));const paint=()=>{if(!disposed)render(values());};
 const stop=()=>{cancelAnimationFrame(raf);raf=0;};
 function snap(){stop();for(const a of Object.values(state)){a.x=a.target;a.v=0;}paint();onRest?.(values());}
 function frame(t){raf=0;if(disposed)return;const dt=Math.max(0,(t-last)/1000);last=t;let active=false;
  for(const a of Object.values(state)){Object.assign(a,springStep(a,a.target,dt,{omega,zeta}));if(isSettled(a,a.target,.0005,.01)){a.x=a.target;a.v=0;}else active=true;}paint();if(active)raf=requestAnimationFrame(frame);else onRest?.(values());
 }
 function wake(){if(!raf&&!disposed){last=performance.now();raf=requestAnimationFrame(frame);}}
 function validate(next){for(const [k,v] of Object.entries(next))if(!state[k]||!Number.isFinite(v))throw new RangeError('Known finite motion axes required');}
 const off=pref?.subscribe(reduced=>{if(reduced)snap();});
 const api={set(next,{immediate=false,velocity}={}){if(disposed)return;validate(next);for(const [k,v] of Object.entries(next)){state[k].target=v;if(velocity&&Number.isFinite(velocity[k]))state[k].v=velocity[k];}if(immediate||pref?.reduced)snap();else wake();},jump(next){if(disposed)return;validate(next);stop();for(const [k,v] of Object.entries(next)){state[k].x=state[k].target=v;state[k].v=0;}paint();},rebase(next){validate(next);for(const [k,v] of Object.entries(next))state[k].x=v;paint();},state(){return structuredClone(state);},stop,destroy(){if(disposed)return;stop();off?.();disposed=true;}};
 paint();return api;
}
const effectOwners=new WeakMap();
export function cancelEffects(el){const owners=effectOwners.get(el);if(owners)for(const a of owners.values())a.cancel();owners?.clear();}
export function effectsTo(el,next,{duration=180,pref,easing='cubic-bezier(.2,0,0,1)'}={}){
 let owners=effectOwners.get(el);if(!owners){owners=new Map();effectOwners.set(el,owners);}
 const promises=Object.entries(next).map(([property,target])=>{
  const current=getComputedStyle(el)[property];owners.get(property)?.cancel();owners.delete(property);el.style[property]=current;
  if(pref?.reduced||duration===0){el.style[property]=String(target);return Promise.resolve(true);}
  const a=el.animate([{[property]:current},{[property]:String(target)}],{duration,easing,fill:'both'});owners.set(property,a);
  const off=pref?.subscribe(reduced=>{if(reduced&&owners.get(property)===a)a.finish();});
  return a.finished.then(()=>{if(owners.get(property)!==a)return false;el.style[property]=String(target);owners.delete(property);a.cancel();return true;},()=>false).finally(()=>off?.());
 });return Promise.all(promises).then(results=>results.every(Boolean));
}
export const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
