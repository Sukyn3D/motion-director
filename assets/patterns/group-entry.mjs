import {createScope} from '../runtime/motion-runtime.mjs';
// One short content-group sequence. Use once for meaningful appearance; replay is a lab control.
export function mountGroupEntry({items,pref,duration=320,interval=45,maxLastStart=180}){
 const scope=createScope(pref);let animations=[],played=false;
 const cancel=()=>{animations.forEach(a=>a.cancel());animations=[];};
 function play({replay=false}={}){if(!scope.active)return;if(played&&!replay)return;played=true;cancel();if(scope.pref.reduced)return;animations=items.map((el,i)=>{const a=el.animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0px)'}],{duration,delay:Math.min(i*interval,maxLastStart),easing:'cubic-bezier(.2,0,0,1)',fill:'backwards'});a.finished.catch(()=>{});return a;});}
 scope.clean(scope.pref.subscribe(reduced=>{if(reduced)cancel();}));scope.clean(cancel);return {play,destroy:()=>scope.destroy()};
}
