import {controller,createSpring,button,status,setExpanded} from '../shared.mjs';
import {mountNavigation} from '../../patterns/navigation.mjs';
export function mount(root,id,pref){
 const c=controller(root,pref);
 if(id==='n1'||id==='n2'){
  root.innerHTML=`<div class="rail ${id==='n1'?'underline':''}" role="tablist" aria-label="示例视图"><span class="marker" aria-hidden="true"></span>${['概览','详情','记录'].map((x,i)=>`<button type="button" class="tab" id="${id}-tab-${i}" role="tab" aria-selected="${i===0}" aria-controls="${id}-panel-${i}">${x}</button>`).join('')}</div><div class="panels">${['项目概览','项目详情','最近记录'].map((x,i)=>`<div id="${id}-panel-${i}" role="tabpanel" aria-labelledby="${id}-tab-${i}" tabindex="0" ${i?'hidden':''}>${x}</div>`).join('')}</div>${status}`;
  const tabs=c.qa('[role=tab]'),nav=mountNavigation({host:c.q('.rail'),tabs,panels:c.qa('[role=tabpanel]'),indicator:c.q('.marker'),pref});c.scope.clean(()=>nav.destroy());
  const report=()=>c.status('当前：'+tabs.find(x=>x.getAttribute('aria-selected')==='true').textContent);
  tabs.forEach(t=>{c.scope.on(t,'click',report);c.scope.on(t,'keydown',()=>queueMicrotask(()=>{if(c.scope.active)report();}));});
 }else if(id==='n3'){
  root.innerHTML=button('项目分类 <span class="arrow aligned-icon" aria-hidden="true"><span data-closed>⌄</span><span data-open style="opacity:0">⌃</span></span>',`data-toggle aria-expanded="false" aria-controls="${id}-content"`)+`<div id="${id}-content" class="nested" hidden inert><a href="#n3">设计资源</a><a href="#n3">研发资源</a></div>${status}`;
  let open=false,epoch=0;const b=c.q('[data-toggle]'),panel=c.q('.nested');panel.style.height='0px';panel.style.opacity='0';
  function set(value){open=value;const token=++epoch;setExpanded(b,panel,open);if(open)panel.hidden=false;c.to(b.querySelector('[data-closed]'),{opacity:open?0:1});c.to(b.querySelector('[data-open]'),{opacity:open?1:0});c.to(panel,{height:open?'86px':'0px',opacity:open?1:0},{duration:open?230:160}).then(ok=>{if(ok&&c.scope.active&&token===epoch&&!open)panel.hidden=true;});c.status(open?'分类已展开':'分类已收起');}
  c.scope.on(b,'click',()=>set(!open));c.scope.on(root,'keydown',e=>{if(e.key==='Escape'&&open){set(false);b.focus();}});c.scope.clean(()=>epoch++);
 }else if(id==='n4'){
  root.innerHTML=`<nav class="crumbs" aria-label="示例层级"><span class="marker" aria-hidden="true" style="height:3px;top:auto;bottom:0"></span>${['工作区','项目','资源'].map((x,i)=>`<button type="button" data-level="${i}">${x}</button>`).join('<span aria-hidden="true">/</span>')}</nav><div class="panels">选择层级，当前位置保持明确。</div>${status}`;
  const tabs=c.qa('[data-level]'),host=c.q('.crumbs'),mark=c.q('.marker');let index=2;
  const target=()=>{const r=tabs[index].getBoundingClientRect(),h=host.getBoundingClientRect();return{x:r.left-h.left,w:r.width};};
  const spring=createSpring(target(),v=>{mark.style.transform=`translateX(${v.x}px)`;mark.style.width=v.w+'px';},{pref});
  const select=i=>{index=i;tabs.forEach((x,n)=>{if(n===i)x.setAttribute('aria-current','location');else x.removeAttribute('aria-current');});spring.set(target());c.status('当前位置：'+tabs[i].textContent);};
  tabs.forEach((x,i)=>c.scope.on(x,'click',()=>select(i)));const ro=new ResizeObserver(()=>spring.set(target()));ro.observe(host);c.scope.clean(()=>{ro.disconnect();spring.destroy();});select(index);
 }else{
  root.innerHTML=`<div class="steps" role="group" aria-label="示例步骤"><span class="step-track" aria-hidden="true"></span>${['资料','配置','预览'].map((x,i)=>`<button type="button" class="tab" data-step="${i}">${i+1}. ${x}</button>`).join('')}</div><div class="panels" data-content>资料步骤</div>${status}`;
  const tabs=c.qa('[data-step]');let index=0;const select=i=>{index=i;tabs.forEach((t,n)=>{if(n===i)t.setAttribute('aria-current','step');else t.removeAttribute('aria-current');});c.q('[data-content]').textContent=tabs[i].textContent+'步骤';c.to(c.q('.step-track'),{transform:`scaleX(${i/2})`},{duration:220});c.status('当前步骤 '+(i+1));};
  tabs.forEach((t,i)=>c.scope.on(t,'click',()=>select(i)));c.scope.on(root,'keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();select(Math.max(0,Math.min(2,index+(e.key==='ArrowRight'?1:-1))));tabs[index].focus();}});select(0);
 }
 return c.handle();
}
