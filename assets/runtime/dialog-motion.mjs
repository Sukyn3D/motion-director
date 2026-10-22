import {createSpring,clamp} from './motion-runtime.mjs';
// Adapt CSS: dialog::backdrop {background:rgb(0 0 0 / var(--backdrop-alpha,0))}
// The panel and backdrop have separate owners; native close waits for both.
export function createDialogMotion({dialog,pref,renderPanel=()=>{},setBackdrop=a=>dialog.style.setProperty('--backdrop-alpha',a),backdropOpacity=.66,onIntent=()=>{},onClosed=()=>{},omega=19}){
 let intent=false,epoch=0,panelRest=true,backdropRest=true,disposed=false,pending;
 function complete(){if(disposed||!panelRest||!backdropRest)return;const completion=pending;pending=null;if(!intent&&dialog.open){dialog.close();onClosed();}completion?.resolve(true);}
 const panel=createSpring({p:0},({p})=>renderPanel(clamp(p,0,1)),{pref,omega,zeta:1,onRest:()=>{panelRest=true;complete();}});
 const backdrop=createSpring({a:0},({a})=>setBackdrop(clamp(a,0,backdropOpacity)),{pref,omega:26,zeta:1,onRest:()=>{backdropRest=true;complete();}});
 return {set(open){if(disposed)return Promise.resolve(false);pending?.resolve(false);pending=null;epoch++;intent=!!open;panelRest=backdropRest=false;
   if(intent&&!dialog.open)dialog.showModal();onIntent(intent);
   const promise=new Promise(resolve=>pending={epoch,resolve});
   panel.set({p:intent?1:0});backdrop.set({a:intent?backdropOpacity:0});return promise;
  },state(){return {intent,panel:panel.state(),backdrop:backdrop.state(),epoch};},destroy(){if(disposed)return;disposed=true;epoch++;pending?.resolve(false);pending=null;panel.destroy();backdrop.destroy();if(dialog.open){dialog.close();onClosed();}setBackdrop(0);}};
}
