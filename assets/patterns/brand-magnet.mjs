import {createScope,createSpring,clamp} from '../runtime/motion-runtime.mjs';
// Optional low-frequency brand moment; the button hit box stays fixed. Fine pointer only.
export function mountBrandMagnet({button,visual,icon,pref,limit=6}){
 const scope=createScope(pref),fine=matchMedia('(pointer: fine)');
 const motion=createSpring({x:0,y:0},v=>{visual.style.transform=`translate(${v.x}px,${v.y}px)`;if(icon)icon.style.transform="";},{pref:scope.pref,omega:24,zeta:.85});
 const home=()=>motion.set({x:0,y:0});scope.on(button,'pointermove',e=>{if(scope.pref.reduced||!fine.matches||e.pointerType==='touch')return;const r=button.getBoundingClientRect();motion.set({x:clamp((e.clientX-r.left-r.width/2)/r.width*limit*2,-limit,limit),y:clamp((e.clientY-r.top-r.height/2)/r.height*limit*2,-limit,limit)});});
 scope.on(button,'pointerleave',home);scope.on(button,'pointercancel',home);scope.on(button,'blur',home);scope.on(window,'blur',home);scope.on(fine,'change',home);scope.clean(scope.pref.subscribe(home));scope.clean(()=>{motion.jump({x:0,y:0});motion.destroy();});return {destroy:()=>scope.destroy()};
}
