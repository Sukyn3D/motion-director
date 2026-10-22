import {createScope,createSpring,effectsTo,cancelEffects} from '../runtime/motion-runtime.mjs';
// Isolated grid slots demonstrate retained identity/x/v. Adapt existing framework layout in products.
export function mountIdentityList({host,items,filters,pref,columns=3,gap=12}){
 const scope=createScope(pref);let selected=host.dataset.filter||filters.find(b=>b.getAttribute('aria-pressed')==='true')?.dataset.filter||'all',epochs=new Map(),initialized=false;const rowHeight=104;
 const controllers=items.map((el,i)=>createSpring({x:0,y:0},v=>{el.style.transform=`translate(${v.x}px,${v.y}px)`;},{pref:scope.pref}));
 function apply(){if(!scope.active)return;let slot=0;const width=(host.clientWidth-gap*(columns-1))/columns;
  items.forEach((el,i)=>{const active=selected==='all'||el.dataset.category===selected;const epoch=(epochs.get(el)||0)+1;epochs.set(el,epoch);el.style.width=width+'px';el.inert=!active;el.setAttribute('aria-hidden',String(!active));el.style.pointerEvents=active?'':'none';if(active){el.hidden=false;controllers[i].set({x:(slot%columns)*(width+gap),y:Math.floor(slot/columns)*(rowHeight+gap)},{immediate:!initialized});slot++;}
   effectsTo(el,{opacity:active?1:0},{duration:initialized?150:0,pref:scope.pref}).then(finished=>{if(finished&&scope.active&&epochs.get(el)===epoch&&!active)el.hidden=true;});if(scope.pref.reduced)el.hidden=!active;
  });filters.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.filter===selected)));host.dataset.filter=selected;initialized=true;
 }
 function filter(value){if(!scope.active)return;if(!['all',...items.map(x=>x.dataset.category)].includes(value))throw new RangeError('Unknown filter');selected=value;apply();}
 filters.forEach(button=>scope.on(button,'click',()=>filter(button.dataset.filter)));const observer=new ResizeObserver(()=>{if(scope.active)apply();});observer.observe(host);scope.clean(()=>observer.disconnect());scope.clean(scope.pref.subscribe(apply));scope.clean(()=>{controllers.forEach(c=>c.destroy());items.forEach(cancelEffects);});apply();
 return {filter,destroy:()=>scope.destroy()};
}
