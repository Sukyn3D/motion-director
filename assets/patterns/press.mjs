import {createScope,createSpring} from '../runtime/motion-runtime.mjs';
import {createInputState} from '../runtime/input-state.mjs';
// Stable hit area; only the nested presentation face scales. Business clicks remain native.
export function mountPress({button,face,pref}){
 const scope=createScope(pref);let pressed=false;
 const motion=createSpring({scale:1},({scale})=>{face.style.transform=`scale(${scale})`;},{pref:scope.pref,omega:36});
 const update=()=>{button.dataset.pressed=String(pressed);motion.set({scale:scope.pref.reduced?1:(pressed ? .975 : 1)});};
 const input=createInputState(button,{onChange:state=>{pressed=state.pressed;update();}});
 scope.clean(scope.pref.subscribe(update));scope.clean(()=>{input.destroy();pressed=false;motion.jump({scale:1});motion.destroy();});
 return {destroy:()=>scope.destroy()};
}
