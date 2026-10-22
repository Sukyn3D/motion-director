import {createScope,effectsTo,cancelEffects} from '../runtime/motion-runtime.mjs';
// Numbers are factual immediately; only the bar presentation interpolates, within a fixed domain.
export function mountDataChart({bars,labels,pref,domain=100}){
 const scope=createScope(pref);let values=bars.map(()=>0);
 function set(next){if(!scope.active)return;if(next.length!==bars.length||next.some(v=>!Number.isFinite(v)||v<0||v>domain))throw new RangeError('Data must be finite and inside the declared domain');values=[...next];bars.forEach((bar,i)=>{labels[i].textContent=String(values[i]);bar.setAttribute('aria-valuenow',String(values[i]));effectsTo(bar,{width:`${values[i]/domain*100}%`},{duration:260,pref:scope.pref});});}
 scope.clean(scope.pref.subscribe(()=>set(values)));scope.clean(()=>bars.forEach(cancelEffects));return {set,destroy:()=>scope.destroy()};
}
