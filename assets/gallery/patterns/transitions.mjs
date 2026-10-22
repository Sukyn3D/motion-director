import {controller,createSpring,artwork,button,status,setExpanded} from '../shared.mjs';
export function mount(root,id,pref){
 const c=controller(root,pref);let selected=false,epoch=0;
 if(id==='t1'||id==='t2'){
  root.innerHTML=`<div class="view-stage"><div class="view" data-a><h4>Overview</h4><p>当前项目概览</p></div><div class="view" data-b aria-hidden="true" inert><h4>Details</h4><p>同一项目的细节视图</p></div></div><div class="controls">${button('切换视图','data-main')}</div>${status}`;
  const a=c.q('[data-a]'),b=c.q('[data-b]');let motion;
  if(id==='t1'){a.style.opacity='1';b.style.opacity='0';}
  else{motion=createSpring({a:0,b:100},v=>{a.style.transform=`translateX(${v.a}%)`;b.style.transform=`translateX(${v.b}%)`;},{pref,omega:26,zeta:1});c.scope.clean(()=>motion.destroy());}
  c.scope.on(c.q('[data-main]'),'click',()=>{selected=!selected;root.dataset.state=selected?'details':'overview';a.inert=selected;b.inert=!selected;a.setAttribute('aria-hidden',String(selected));b.setAttribute('aria-hidden',String(!selected));if(motion)motion.set({a:selected?-100:0,b:selected?0:100});else{c.to(a,{opacity:selected?0:1},{duration:200});c.to(b,{opacity:selected?1:0},{duration:200});}c.status(selected?'详情视图':'概览视图');});
 }else if(id==='t3'){
  root.innerHTML=`<div class="anchored-stage"><div class="anchored" data-object>${artwork}<div class="anchor-copy" id="${id}-copy" hidden inert>同一项目 · 来源保持连续</div></div></div><div class="controls">${button('查看项目',`data-main aria-expanded="false" aria-controls="${id}-copy"`)}</div>${status}`;
  const stage=c.q('.anchored-stage'),object=c.q('[data-object]'),copy=c.q('.anchor-copy'),b=c.q('[data-main]');
  const endpoint=()=>({w:selected?stage.clientWidth:150,h:selected?160:110});
  const motion=createSpring(endpoint(),v=>{object.style.width=v.w+'px';object.style.height=v.h+'px';},{pref,omega:27,zeta:1});
  const set=value=>{selected=value;const token=++epoch;setExpanded(b,copy,selected);b.querySelector('.face').textContent=selected?'返回项目':'查看项目';if(selected)copy.hidden=false;motion.set(endpoint());c.to(copy,{opacity:selected?1:0},{duration:170}).then(ok=>{if(ok&&c.scope.active&&token===epoch&&!selected)copy.hidden=true;});c.status(selected?'同一对象已展开':'对象已返回来源');};
  c.scope.on(b,'click',()=>set(!selected));c.scope.on(root,'keydown',e=>{if(e.key==='Escape'&&selected){set(false);b.focus();}});const ro=new ResizeObserver(()=>motion.set(endpoint()));ro.observe(stage);c.scope.clean(()=>{epoch++;ro.disconnect();motion.destroy();});
 }else if(id==='t4'){
  root.innerHTML=`<div class="view-stage"><div class="view"><h4>Workspace</h4><p>辅助视图来自底部。</p></div><section class="view sheet" id="${id}-sheet" aria-label="辅助详情" hidden inert aria-hidden="true"><h4>Quick detail</h4><p>非模态面板，可随时关闭。</p></section></div><div class="controls">${button('打开面板',`data-main aria-expanded="false" aria-controls="${id}-sheet"`)}</div>${status}`;
  const panel=c.q('.sheet'),b=c.q('[data-main]');panel.style.opacity='0';const motion=createSpring({y:100},v=>panel.style.transform=`translateY(${v.y}%)`,{pref,omega:28,zeta:1});
  const set=value=>{selected=value;const token=++epoch;setExpanded(b,panel,selected);if(selected)panel.hidden=false;motion.set({y:selected?0:100});c.to(panel,{opacity:selected?1:0},{duration:selected?200:150}).then(ok=>{if(ok&&c.scope.active&&token===epoch&&!selected)panel.hidden=true;});b.querySelector('.face').textContent=selected?'关闭面板':'打开面板';c.status(selected?'辅助面板已打开':'辅助面板已关闭');};
  c.scope.on(b,'click',()=>set(!selected));c.scope.on(root,'keydown',e=>{if(e.key==='Escape'&&selected){set(false);b.focus();}});c.scope.clean(()=>{epoch++;motion.destroy();});
 }else{
  root.innerHTML=`<div class="object-stage"><div class="dock" data-start>来源</div><div class="dock" data-end>目的地</div><div class="shared-object" data-object aria-hidden="true">✦</div></div><div class="controls">${button('交接对象','data-main')}</div>${status}`;
  const stage=c.q('.object-stage'),obj=c.q('[data-object]');const endpoint=()=>{const box=c.q(selected?'[data-end]':'[data-start]').getBoundingClientRect(),r=stage.getBoundingClientRect();return{x:box.left-r.left+(box.width-48)/2};};
  const motion=createSpring(endpoint(),v=>obj.style.transform=`translateX(${v.x}px)`,{pref,omega:26,zeta:1});obj.style.left='0';
  c.scope.on(c.q('[data-main]'),'click',()=>{selected=!selected;motion.set(endpoint());c.status(selected?'对象已交接到目的地':'对象已返回来源');});const ro=new ResizeObserver(()=>motion.set(endpoint()));ro.observe(stage);c.scope.clean(()=>{ro.disconnect();motion.destroy();});
 }
 return c.handle();
}
