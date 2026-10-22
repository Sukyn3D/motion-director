// Motion Director 1.0. Input truth only; native focus and business state are retained.
const documents=new WeakMap();
function inputChannel(doc){
 let channel=documents.get(doc);if(channel)return channel;
 const win=doc.defaultView,abort=new AbortController(),listeners=new Set();
 channel={modality:null,point:null,listeners,abort,notify(){for(const sync of listeners)sync();}};
 const on=(target,type,fn)=>target.addEventListener(type,fn,{capture:true,signal:abort.signal});
 on(doc,'pointerdown',e=>{channel.modality='pointer';channel.point={x:e.clientX,y:e.clientY,type:e.pointerType};channel.notify();});
 on(doc,'pointermove',e=>{channel.point={x:e.clientX,y:e.clientY,type:e.pointerType};});
 on(doc,'keydown',e=>{if(['Shift','Control','Alt','Meta'].includes(e.key)||e.metaKey||e.ctrlKey||e.altKey)return;channel.modality='keyboard';channel.notify();queueMicrotask(()=>channel.notify());});
 on(win,'blur',()=>{channel.point=null;channel.notify();});
 on(win,'focus',()=>channel.notify());
 on(doc,'visibilitychange',()=>{if(doc.hidden)channel.point=null;channel.notify();});
 documents.set(doc,channel);return channel;
}
export function deriveContact({pointerInside=false,focusVisible=false,pressed=false,disabled=false,suspended=false}){
 const active=!disabled&&!suspended;return {contact:active&&(pointerInside||focusVisible),pressed:active&&pressed};
}
export function createInputState(el,{onChange=()=>{},activationKeys=el.matches('input,select,textarea')?[]:['Enter',' ']}={}){
 const doc=el.ownerDocument,win=doc.defaultView,channel=inputChannel(doc),abort=new AbortController();
 let pointer=null,key=null,pressInside=false,hover=false,suspended=false,disposed=false,last='';
 const on=(target,type,fn)=>target.addEventListener(type,fn,{signal:abort.signal});
 const disabled=()=>el.disabled||el.getAttribute('aria-disabled')==='true'||!!el.closest('[inert]');
 function calibrate(){
  const point=channel.point;hover=!!point&&point.type==='mouse'&&!!doc.elementFromPoint(point.x,point.y)&&el.contains(doc.elementFromPoint(point.x,point.y));
 }
 function state(){
  const focused=doc.activeElement===el;
  const focusVisible=focused&&doc.hasFocus()&&channel.modality!=='pointer'&&el.matches(':focus-visible');
  const flags={pointerInside:hover,focused,focusVisible,pressed:(pointer!==null&&pressInside)||key!==null,disabled:!!disabled(),suspended};
  return {...flags,...deriveContact(flags),modality:channel.modality};
 }
 function sync({hitTest=false}={}){if(disposed)return;if(hitTest)calibrate();const next=state(),serial=JSON.stringify(next);if(serial!==last){last=serial;onChange(next);}}
 const clearPress=()=>{pointer=null;key=null;pressInside=false;sync({hitTest:true});};
 const channelSync=()=>{if(!doc.hasFocus()){pointer=null;key=null;hover=false;}sync();};channel.listeners.add(channelSync);
 on(el,'pointerenter',e=>{channel.point={x:e.clientX,y:e.clientY,type:e.pointerType};hover=e.pointerType==='mouse';pressInside=true;sync();});
 on(el,'pointerleave',()=>{hover=false;pressInside=false;sync();});
 on(el,'pointerdown',e=>{if(e.button!==0||e.isPrimary===false||disabled()||suspended)return;pointer=e.pointerId;pressInside=true;hover=e.pointerType==='mouse';sync();});
 for(const type of ['pointerup','pointercancel'])on(win,type,e=>{if(pointer===e.pointerId){pointer=null;pressInside=false;sync({hitTest:type==='pointerup'});}});
 on(el,'lostpointercapture',clearPress);
 on(el,'keydown',e=>{if(activationKeys.includes(e.key)&&!disabled()&&!suspended){key=e.key;sync();}});
 on(el,'keyup',e=>{if(key===e.key){key=null;sync();}});
 on(el,'focus',()=>sync());on(el,'blur',clearPress);
 on(win,'blur',()=>{pointer=null;key=null;hover=false;sync();});
 on(doc,'visibilitychange',()=>{if(doc.hidden){pointer=null;key=null;hover=false;sync();}});
 const observer=new MutationObserver(()=>{if(disabled()){pointer=null;key=null;}sync();});observer.observe(el,{attributes:true,attributeFilter:['disabled','aria-disabled','inert']});
 sync();return {state,sync,clearPress,suspend(){suspended=true;pointer=null;key=null;hover=false;sync();},resume(){suspended=false;sync({hitTest:true});},destroy(){if(disposed)return;disposed=true;abort.abort();observer.disconnect();channel.listeners.delete(channelSync);if(!channel.listeners.size){channel.abort.abort();documents.delete(doc);}}};
}
