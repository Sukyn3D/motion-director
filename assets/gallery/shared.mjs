import {createScope,effectsTo,cancelEffects,createSpring} from '../runtime/motion-runtime.mjs';
import {createInputState} from '../runtime/input-state.mjs';
export {createSpring};
export function controller(root,pref){
 const scope=createScope(pref),q=s=>root.querySelector(s),qa=s=>[...root.querySelectorAll(s)],owned=new Set();
 const to=(el,props,opts={})=>{owned.add(el);return effectsTo(el,props,{duration:180,pref:scope.pref,...opts});};
 scope.clean(()=>owned.forEach(cancelEffects));
 return {scope,q,qa,to,status(text){q('[data-status]').textContent=text;},handle(extra={}){return {...extra,destroy:()=>scope.destroy()};}};
}
export function press(c,button,face){
 const spring=createSpring({s:1},v=>face.style.transform=`scale(${v.s})`,{pref:c.scope.pref,omega:38,zeta:.85});
 const input=createInputState(button,{onChange:state=>spring.set({s:state.pressed?.95:1})});
 c.scope.clean(()=>{input.destroy();spring.destroy();});return spring;
}
export function setExpanded(button,panel,on){button.setAttribute('aria-expanded',String(on));panel.inert=!on;panel.setAttribute('aria-hidden',String(!on));}
export const artwork='<div class="art" aria-hidden="true"><span></span><i></i><b></b></div>';
export const button=(label,attrs='')=>`<button type="button" class="action${attrs.includes('class="action secondary"')?' secondary':''}" ${attrs.replace('class="action secondary"','')}><span class="face">${label}</span></button>`;
export const status='<p data-status class="status" role="status" aria-live="polite">准备操作</p>';
const timers=new WeakMap();
export function safeTimer(scope,fn,ms){let owned=timers.get(scope);if(!owned){owned=new Set();timers.set(scope,owned);scope.clean(()=>{owned.forEach(clearTimeout);owned.clear();timers.delete(scope);});}const id=setTimeout(()=>{owned.delete(id);if(scope.active)fn();},ms);owned.add(id);return id;}
