import {createScope,createSpring,effectsTo,cancelEffects} from '../runtime/motion-runtime.mjs';
// One isolated visual surface, unchanged image identity; text never scales with it.
export function mountAnchoredDetail({host,surface,image,details,toggle,pref,endpoints}){
 const scope=createScope(pref);let expanded=false,epoch=0;const getTarget=()=>endpoints(expanded,host);
 const motion=createSpring(getTarget(),v=>{surface.style.left=v.x+'px';surface.style.top=v.y+'px';surface.style.width=v.w+'px';surface.style.height=v.h+'px';image.style.height=v.artH+'px';},{pref:scope.pref});
 function set(value,{restoreFocus=false}={}){if(!scope.active)return;expanded=!!value;const token=++epoch;toggle.setAttribute('aria-expanded',String(expanded));toggle.querySelector('[data-label]').textContent=expanded?'返回项目':'查看项目';surface.dataset.state=expanded?'expanded':'compact';details.inert=!expanded;details.setAttribute('aria-hidden',String(!expanded));
  if(expanded)details.hidden=false;motion.set(getTarget());effectsTo(details,{opacity:expanded?1:0},{duration:170,pref:scope.pref}).then(finished=>{if(finished&&scope.active&&token===epoch&&!expanded)details.hidden=true;});if(scope.pref.reduced)details.hidden=!expanded;if(restoreFocus)toggle.focus({preventScroll:true});
 }
 scope.on(toggle,'click',()=>set(!expanded));const escape=e=>{if(e.key==='Escape'&&expanded){e.preventDefault();set(false,{restoreFocus:true});}};scope.on(host,'keydown',escape);scope.on(toggle,'keydown',escape);
 scope.clean(scope.pref.subscribe(()=>set(expanded)));const observer=new ResizeObserver(()=>{if(scope.active)motion.set(getTarget());});observer.observe(host);scope.clean(()=>observer.disconnect());scope.clean(()=>{epoch++;motion.destroy();cancelEffects(details);});set(false);
 return {set,destroy:()=>scope.destroy()};
}
