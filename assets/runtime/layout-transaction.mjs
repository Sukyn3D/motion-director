import {createSpring} from './motion-runtime.mjs';
// No await/rAF between target commit and inverse installation. Framework adapters
// may use their own pre-paint layout API; do not run this in a passive effect.
export function runLayoutTransaction({read,commit,invert}){
 for(const fn of [read,commit,invert])if(fn?.constructor.name==='AsyncFunction')throw new TypeError('Layout stages must be synchronous');
 const before=read();if(before?.then)throw new TypeError('Layout read cannot return a promise');const value=commit(before);
 if(value?.then)throw new TypeError('Layout commit cannot return a promise');
 const result=invert(before,value);if(result?.then)throw new TypeError('Inverse installation cannot return a promise');return value;
}
// Only neutralizes the individual translate owned by the caller, in this same
// task. No permanent height/width, wrapper, ancestor transform or crop changes.
export function measureWithoutOwnedTranslation(el){const previous=el.style.translate;el.style.translate='none';try{return el.getBoundingClientRect();}finally{el.style.translate=previous;}}

// Auto-height block/simple intrinsic grid adapter. Constraint-coupled flex,
// percentage/fr rows and scaled ancestors require the platform layout adapter.
// Constrain natural tracks BEFORE reading child inverse boxes, in the same task.
export function createNaturalHeightMotion(el,{pref,onFrame=()=>{},omega=24}={}){
 let extra=0;const abort=new AbortController();
 const previousHeight=el.style.getPropertyValue('height'),heightPriority=el.style.getPropertyPriority('height');
 const previousAlign=el.style.getPropertyValue('align-content'),alignPriority=el.style.getPropertyPriority('align-content');
 const restore=()=>{if(previousHeight)el.style.setProperty('height',previousHeight,heightPriority);else el.style.removeProperty('height');if(previousAlign)el.style.setProperty('align-content',previousAlign,alignPriority);else el.style.removeProperty('align-content');};
 const spring=createSpring({h:0},({h})=>{el.style.height=Math.max(0,h-extra)+'px';onFrame();},{pref,omega,zeta:1,onRest:()=>{restore();onFrame();}});restore();
 const api={set(from){spring.stop();restore();const css=getComputedStyle(el);if(css.display.includes('flex'))throw new TypeError('Flex height requires a content constraint adapter');extra=css.boxSizing==='border-box'?0:['paddingTop','paddingBottom','borderTopWidth','borderBottomWidth'].reduce((sum,key)=>sum+(parseFloat(css[key])||0),0);const target=el.getBoundingClientRect().height;if(css.display.includes('grid'))el.style.setProperty('align-content','start');spring.rebase({h:from});spring.set({h:target});return target;},destroy(){abort.abort();spring.destroy();restore();},state:()=>spring.state()};
 // Content/async changes are committed by the consumer in its next transaction.
 // Width/font invalidation remeasures from the current presented outer height.
 const remeasure=()=>{if(el.isConnected)api.set(el.getBoundingClientRect().height);};
 el.ownerDocument.defaultView.addEventListener('resize',remeasure,{signal:abort.signal});el.ownerDocument.fonts?.addEventListener('loadingdone',remeasure,{signal:abort.signal});return api;
}

let snapshotId=0;
export function snapshotPresentation(source,{document=source.ownerDocument}={}){
 const bounds=source.getBoundingClientRect();if(!bounds.width||!bounds.height||bounds.bottom<=0||bounds.top>=document.defaultView.innerHeight)return null;
 // This HTML snapshot adapter is for translation-only roots. Rotated/scaled
 // roots need the platform's snapshot/layout mechanism, not an AABB fabrication.
 const rootStyle=getComputedStyle(source);if(rootStyle.transform!=='none'&&!new DOMMatrix(rootStyle.transform).isIdentity)return null;
 const clone=source.cloneNode(true),prefix='motion-visual-'+(++snapshotId)+'-',ids=new Map();
 const original=[source,...source.querySelectorAll('*')],copies=[clone,...clone.querySelectorAll('*')];
 original.forEach((el,i)=>{if(el.id)ids.set(el.id,prefix+i);});
 function references(value){for(const [id,replacement]of ids)value=value.replaceAll('#'+id, '#'+replacement);return value;}
 original.forEach((el,i)=>{const copy=copies[i],css=getComputedStyle(el);copy.style.cssText=[...css].map(p=>p+':'+references(css.getPropertyValue(p))+';').join('');
  // Freeze sampled paint; a visual duplicate cannot claim the live object's
  // shared-transition/anchor identity or restart its declarative animations.
  Object.assign(copy.style,{animation:'none',transition:'none',viewTransitionName:'none',anchorName:'none'});
  for(const attribute of [...copy.attributes])if(attribute.name==='class'||attribute.name==='id'||attribute.name==='tabindex'||attribute.name==='role'||attribute.name.startsWith('data-')||attribute.name.startsWith('on')||attribute.name==='name')copy.removeAttribute(attribute.name);
  // Preserve namespaced visual SVG resources, never business IDs or links.
  if(el.namespaceURI==='http://www.w3.org/2000/svg'&&el.id)copy.id=ids.get(el.id);
  if(copy.hasAttribute('href')){const href=copy.getAttribute('href');if(href.startsWith('#')&&ids.has(href.slice(1)))copy.setAttribute('href',references(href));else copy.removeAttribute('href');}
 });
 const host=document.createElement('div');host.setAttribute('aria-hidden','true');host.inert=true;
 host.style.cssText=`position:fixed;left:${bounds.left}px;top:${bounds.top}px;width:${bounds.width}px;height:${bounds.height}px;pointer-events:none;overflow:hidden;z-index:42;`;
 Object.assign(clone.style,{position:'absolute',inset:'0',margin:'0',width:bounds.width+'px',height:bounds.height+'px',translate:'none'});host.attachShadow({mode:'closed'}).append(clone);return host;
}
