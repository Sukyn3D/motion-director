import {createScope,createSpring,effectsTo,cancelEffects,clamp} from '../runtime/motion-runtime.mjs';
import {springStep,isSettled} from '../runtime/spring.mjs';
import {createInputState} from '../runtime/input-state.mjs';
export const smoothstep=t=>{t=clamp(t,0,1);return t*t*(3-2*t);};

// Surface and child motion have separate owners; the actual button never shifts.
export function bindComposite(button,{pref,compact=false}={}){
 const scope=createScope(pref),surface=button.querySelector('[data-surface]'),mark=button.querySelector('[data-mark]'),reveal=button.querySelector('[data-reveal]');
 let hover=false,focus=false,pressed=false,pointer={x:0,y:0};
 const material=createSpring({lift:0,scale:1,rotation:0,x:0,y:0,markScale:1},p=>{
  if(surface)surface.style.transform=`translateY(${p.lift}px) scale(${p.scale})`;
  if(mark)mark.style.transform=`scale(${p.markScale})`;
 },{pref:scope.pref,omega:compact?38:26,zeta:.82});
 function update(){const active=hover||focus;
  material.set(scope.pref.reduced?{lift:0,scale:1,rotation:0,x:0,y:0,markScale:1}:{lift:active&&!compact?-3.5:0,scale:pressed?.975:1,rotation:0,x:0,y:0,markScale:pressed?.96:active?1.035:1});
  if(reveal)effectsTo(reveal,{clipPath:active?'inset(0% 0% 0% 0%)':'inset(0% 100% 0% 0%)'},{pref:scope.pref,duration:compact?140:240,easing:'cubic-bezier(.42,0,.22,1)'});
 }
 const input=createInputState(button,{onChange:state=>{hover=state.pointerInside;focus=state.focusVisible;pressed=state.pressed;update();}});scope.clean(()=>input.destroy());
 scope.clean(scope.pref.subscribe(update));scope.clean(()=>{material.destroy();if(surface)surface.style.transform='';if(mark)mark.style.transform='';if(reveal){cancelEffects(reveal);reveal.style.clipPath='';}});
 return {update,destroy:()=>scope.destroy(),state:()=>({hover,focus,pressed,motion:material.state()})};
}

// Demo business semantics update synchronously; both position and icon retain identity.
export function bindState(button,{pref}={}){
 const scope=createScope(pref),thumb=button.querySelector('[data-thumb]'),check=button.querySelector('[data-check]'),label=button.querySelector('[data-state-label]');
 let selected=button.getAttribute('aria-pressed')==='true',hover=false,focus=false,pressed=false;
 const move=createSpring({x:selected?30:0,rotation:selected?0:-35,scale:1,lift:0},p=>{thumb.style.transform=`translateX(${p.x}px) scale(${p.scale})`;check.style.transform=`scale(${p.scale})`;},{pref:scope.pref,omega:27,zeta:1});
 const feedback=()=>{move.set({scale:scope.pref.reduced?1:pressed?.92:hover||focus?1.07:1,lift:scope.pref.reduced?0:hover||focus?-1.5:0});effectsTo(button,{borderColor:hover||focus?'rgb(42,90,218)':'rgb(159,157,145)'},{pref:scope.pref,duration:140,easing:'cubic-bezier(.42,0,.22,1)'});};
 function set(next){selected=!!next;button.setAttribute('aria-pressed',String(selected));label.textContent=selected?'Saved to collection':'Save to collection';
  move.set({x:selected?30:0,rotation:selected?0:-35});
  effectsTo(check,{opacity:selected?'1':'0',strokeDashoffset:selected?'0':'22'},{pref:scope.pref,duration:220,easing:'cubic-bezier(.42,0,.22,1)'});
  effectsTo(button.querySelector('[data-state-track]'),{backgroundColor:selected?'rgb(42,90,218)':'rgb(174,173,164)'},{pref:scope.pref,duration:220,easing:'cubic-bezier(.42,0,.22,1)'});
 }
 const input=createInputState(button,{onChange:state=>{hover=state.pointerInside;focus=state.focusVisible;pressed=state.pressed;feedback();}});scope.clean(()=>input.destroy());
 scope.on(button,'click',()=>set(!selected));scope.clean(scope.pref.subscribe(feedback));scope.clean(()=>{move.destroy();cancelEffects(button);cancelEffects(check);cancelEffects(button.querySelector('[data-state-track]'));});
 return {set,state:()=>({selected,motion:move.state()}),destroy:()=>scope.destroy()};
}

// Direct non-linear scroll mapping, without imposing a lag on native scrolling.
export function bindScrollGroup(host,{pref,band=null,distance=28}={}){
 const scope=createScope(pref),layer=host.querySelector('[data-scroll-layer]');let raf=0,progress=1,side='visible',disposed=false;
 function paint(){raf=0;if(disposed)return;const r=host.getBoundingClientRect();const span=band??clamp(innerHeight*.32,180,320);const entering=clamp((innerHeight-r.top)/span,0,1),exiting=clamp(r.bottom/span,0,1);
  const active=document.activeElement,fr=active?.getBoundingClientRect();const focused=host.contains(active)&&fr&&fr.bottom>0&&fr.top<innerHeight&&fr.right>0&&fr.left<innerWidth;const held=host.contains(document.querySelector('[data-held="true"]'));
  progress=scope.pref.reduced||focused||held?1:smoothstep(Math.min(entering,exiting));side=entering<1?'before':exiting<1?'after':'visible';
  layer.style.opacity=String(progress);layer.style.transform=`translateY(${(side==='after'?-1:1)*(1-progress)*distance}px)`;
 }
 const request=()=>{if(!raf&&!disposed)raf=requestAnimationFrame(paint);};
 scope.on(window,'scroll',request,{passive:true});scope.on(window,'resize',request);scope.on(document,'focusin',paint);scope.on(document,'focusout',request);
 scope.on(host,'pointerdown',()=>{host.dataset.held='true';paint();});
 const release=()=>{delete host.dataset.held;request();};for(const event of ['pointerup','pointercancel'])scope.on(window,event,release);
 scope.clean(scope.pref.subscribe(paint));scope.clean(()=>{disposed=true;cancelAnimationFrame(raf);layer.style.opacity='';layer.style.transform='';delete host.dataset.held;});
 paint();return {state:()=>({progress,side,focused:host.contains(document.activeElement)}),destroy:()=>scope.destroy()};
}

// Bounded 2D material approximation, not a fluid or cloth solver.
export function bindSoftObject(stage,handle,{pref}={}){
 const scope=createScope(pref),skin=handle.querySelector('[data-skin]');let drag=null,raf=0,last=0,target={x:0,y:0},state={x:{x:0,v:0},y:{x:0,v:0}},config={omega:16,zeta:.78},disposed=false;
 const bounds=()=>({x:Math.max(0,(stage.clientWidth-handle.offsetWidth)/2),y:Math.max(0,(stage.clientHeight-handle.offsetHeight)/2)});
 const limit=p=>{const b=bounds();return {x:clamp(p.x,-b.x,b.x),y:clamp(p.y,-b.y,b.y)};};
 let materialStretch=0,materialAngle=0;
 const material=createSpring({stretch:0,angle:0},p=>{materialStretch=p.stretch;materialAngle=p.angle;const s=clamp(p.stretch,0,.22);skin.style.transform=`rotate(${p.angle}deg) scale(${1+s},${1/(1+s)})`;},{pref:scope.pref,omega:21,zeta:.82});
 const render=()=>{handle.style.transform=`translate(${state.x.x}px,${state.y.x}px)`;handle.setAttribute('aria-description',`Position ${Math.round(state.x.x)}, ${Math.round(state.y.x)}. Arrow keys move; Home resets.`);};
 const stop=()=>{cancelAnimationFrame(raf);raf=0;};
 function loop(now){raf=0;if(disposed)return;const dt=Math.max(0,(now-last)/1000);last=now;let active=false;const b=bounds();
  for(const k of ['x','y']){state[k]=springStep(state[k],target[k],dt,config);if(Math.abs(state[k].x)>b[k]){state[k].x=clamp(state[k].x,-b[k],b[k]);state[k].v*= -.12;}if(isSettled(state[k],target[k],.03,.2)){state[k]={x:target[k],v:0};}else active=true;}
  render();if(active)raf=requestAnimationFrame(loop);
 }
 function settle(next,velocity={x:0,y:0},elastic=true){target=limit(next);config=elastic?{omega:16,zeta:.78}:{omega:25,zeta:1};for(const k of ['x','y'])state[k].v=velocity[k];
  if(scope.pref.reduced){stop();for(const k of ['x','y'])state[k]={x:target[k],v:0};render();}else if(!raf){last=performance.now();raf=requestAnimationFrame(loop);}material.set({stretch:0,angle:materialAngle});
 }
 scope.on(handle,'pointerdown',e=>{if(e.button!==0||drag)return;stop();handle.setPointerCapture(e.pointerId);handle.dataset.held='true';
  drag={id:e.pointerId,start:{x:state.x.x,y:state.y.x},client:{x:e.clientX,y:e.clientY},position:{x:state.x.x,y:state.y.x},time:e.timeStamp,velocity:{x:0,y:0}};
 });
 scope.on(handle,'pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;const next=limit({x:drag.start.x+e.clientX-drag.client.x,y:drag.start.y+e.clientY-drag.client.y});const dt=(e.timeStamp-drag.time)/1000;
  let velocity={x:0,y:0},acceleration=0;if(dt>0){for(const k of ['x','y'])velocity[k]=clamp((next[k]-drag.position[k])/dt,-1400,1400);acceleration=Math.hypot(velocity.x-drag.velocity.x,velocity.y-drag.velocity.y)/dt;}
  for(const k of ['x','y'])state[k]={x:next[k],v:velocity[k]};target=next;render();
  const speed=Math.hypot(velocity.x,velocity.y);if(speed>1){let angle=Math.atan2(velocity.y,velocity.x)*180/Math.PI;angle+=Math.round((materialAngle-angle)/360)*360;material.set({stretch:scope.pref.reduced?0:clamp(speed/9000+acceleration/280000,0,.20),angle});}
  drag.position=next;drag.velocity=velocity;drag.time=e.timeStamp;
 });
 function release(e,cancel=false){if(!drag||(e&&e.pointerId!==drag.id))return;const old=drag;drag=null;delete handle.dataset.held;
  const velocity=cancel||!e||e.timeStamp-old.time>100?{x:0,y:0}:old.velocity;
  settle(cancel?old.start:{x:state.x.x+velocity.x*.065,y:state.y.x+velocity.y*.065},velocity,!cancel);
  if(handle.hasPointerCapture(old.id))handle.releasePointerCapture(old.id);
 }
 scope.on(handle,'pointerup',e=>release(e));scope.on(handle,'pointercancel',e=>release(e,true));scope.on(handle,'lostpointercapture',e=>{if(drag)release(e,true);});scope.on(handle,'blur',()=>release(null,true));
 scope.on(handle,'keydown',e=>{if(e.key==='Escape'&&drag){e.preventDefault();release(null,true);return;}const delta={ArrowLeft:{x:-24,y:0},ArrowRight:{x:24,y:0},ArrowUp:{x:0,y:-24},ArrowDown:{x:0,y:24}}[e.key];if(delta){e.preventDefault();settle({x:target.x+delta.x,y:target.y+delta.y});}if(e.key==='Home'){e.preventDefault();settle({x:0,y:0});}});
 scope.on(window,'resize',()=>{if(drag)release(null,true);settle(limit(target),{x:0,y:0},false);});
 scope.clean(scope.pref.subscribe(reduced=>{if(reduced){material.set({stretch:0,angle:0});stop();if(!drag){for(const k of ['x','y'])state[k]={x:target[k],v:0};render();}}}));
 scope.on(document,'visibilitychange',()=>{if(document.hidden){release(null,true);stop();for(const k of ['x','y'])state[k]={x:target[k],v:0};render();material.jump({stretch:0,angle:0});}});
 scope.clean(()=>{disposed=true;stop();material.destroy();delete handle.dataset.held;handle.style.transform='';skin.style.transform='';});render();
 return {state:()=>({position:{x:state.x.x,y:state.y.x},velocity:{x:state.x.v,y:state.y.v},target:{...target},stretch:materialStretch,angle:materialAngle,dragging:!!drag,running:!!raf}),destroy:()=>scope.destroy()};
}
