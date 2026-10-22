import {createScope,effectsTo,cancelEffects} from '../runtime/motion-runtime.mjs';
// Same SVG identity, outline-to-fill. Not a universal path-morph implementation.
export function mountIconState({button,filled,status,pref,onChange}){
 const scope=createScope(pref);let selected=button.getAttribute('aria-pressed')==='true';
 function set(value){if(!scope.active)return;selected=!!value;button.setAttribute('aria-pressed',String(selected));button.setAttribute('aria-label',selected?'取消收藏':'收藏');if(status)status.textContent=selected?'已收藏':'未收藏';effectsTo(filled,{opacity:selected?1:0},{duration:180,pref:scope.pref});}
 scope.on(button,'click',()=>{set(!selected);onChange?.(selected);});scope.clean(scope.pref.subscribe(()=>set(selected)));scope.clean(()=>{cancelEffects(filled);filled.style.opacity=selected?'1':'0';});set(selected);
 return {set,get selected(){return selected;},destroy:()=>scope.destroy()};
}
