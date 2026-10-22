import {createScope,createSpring,effectsTo,cancelEffects} from '../runtime/motion-runtime.mjs';
// Tabs with a movable indicator. Keep full keyboard and panel semantics when integrating.
export function mountNavigation({host,tabs,panels,indicator,pref}){
 const scope=createScope(pref);let index=Math.max(0,tabs.findIndex(t=>t.getAttribute('aria-selected')==='true'));
 const position=i=>{const a=tabs[i].getBoundingClientRect(),b=host.getBoundingClientRect();return{x:a.left-b.left,w:a.width};};
 const motion=createSpring(position(index),({x,w})=>{indicator.style.transform=`translateX(${x}px)`;indicator.style.width=`${w}px`;},{pref:scope.pref});
 function select(i,focus=false){if(!scope.active)return;index=(i+tabs.length)%tabs.length;tabs.forEach((tab,n)=>{tab.setAttribute('aria-selected',String(n===index));tab.tabIndex=n===index?0:-1;panels[n].hidden=n!==index;effectsTo(tab,{color:n===index?'#143d3b':'#697674'},{duration:150,pref:scope.pref});});motion.set(position(index));if(focus)tabs[index].focus();}
 tabs.forEach((tab,i)=>{scope.on(tab,'click',()=>select(i));scope.on(tab,'keydown',e=>{const offset={ArrowRight:1,ArrowLeft:-1}[e.key];if(offset!==undefined){e.preventDefault();select(index+offset,true);}else if(e.key==='Home'||e.key==='End'){e.preventDefault();select(e.key==='Home'?0:tabs.length-1,true);}});});
 const observer=new ResizeObserver(()=>{if(scope.active)motion.set(position(index));});observer.observe(host);scope.clean(()=>observer.disconnect());scope.clean(()=>{motion.destroy();tabs.forEach(cancelEffects);});select(index);
 return {select,destroy:()=>scope.destroy()};
}
