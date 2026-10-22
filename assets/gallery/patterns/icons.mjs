import {controller,createSpring,button,status,safeTimer,setExpanded} from '../shared.mjs';
const heart='<svg viewBox="0 0 32 32" aria-hidden="true"><path class="filled" d="M16 27 L5 16 C-2 7 10 1 16 9 C22 1 34 7 27 16Z" fill="#c4ef79"/><path d="M16 27 L5 16 C-2 7 10 1 16 9 C22 1 34 7 27 16Z" fill="none" stroke="#c4ef79" stroke-width="2"/></svg>';
const copy='<svg viewBox="0 0 32 32" aria-hidden="true"><g data-copy><rect x="10" y="9" width="15" height="19" rx="2" fill="none" stroke="#c4ef79" stroke-width="2"/><path d="M7 23H5V4h15v2" fill="none" stroke="#c4ef79" stroke-width="2"/></g><path data-check d="M5 16l7 7L27 7" fill="none" stroke="#c4ef79" stroke-width="3" pathLength="1" style="stroke-dasharray:1;stroke-dashoffset:1"/></svg>';
export function mount(root,id,pref){
 const inner={i1:heart,i2:'<span class="aligned-icon" aria-hidden="true"><span class="chevron" data-closed>⌄</span><span data-open style="opacity:0">⌃</span></span>',i3:'<span class="aligned-icon" aria-hidden="true"><svg class="menu-line" data-closed viewBox="0 0 32 32"><path d="M5 8h22M5 16h22M5 24h22" fill="none" stroke="currentColor" stroke-width="2"/></svg><svg data-open viewBox="0 0 32 32" style="opacity:0"><path d="m7 7 18 18M25 7 7 25" fill="none" stroke="currentColor" stroke-width="2"/></svg></span>',i4:'<span class="glyph" data-play aria-hidden="true">▶</span><span class="glyph alt" data-pause aria-hidden="true">Ⅱ</span>',i5:copy}[id];
 const labels={i1:'收藏',i2:'展开详情',i3:'打开示例区域',i4:'模拟播放',i5:'模拟复制'};
 root.innerHTML=button(`<span class="icon" aria-hidden="true">${inner}</span>`,`data-main aria-label="${labels[id]}" ${id==='i1'||id==='i4'?'aria-pressed="false"':id==='i2'||id==='i3'?`aria-expanded="false" aria-controls="${id}-content"`:''}`)+((id==='i2'||id==='i3')?`<div id="${id}-content" class="summary" hidden inert><p>由图标按钮控制的示例内容。</p></div>`:'')+(id==='i5'?'<div class="controls">'+button('模拟失败','data-fail')+'</div>':'')+(id==='i4'||id==='i5'?'<p class="muted-note">本地模拟，不播放音频、不写剪贴板。</p>':'')+status;
 const c=controller(root,pref),b=c.q('[data-main]');b.querySelector('.face').classList.add('icon-face');let selected=false,epoch=0;
 if(id==='i1'){
  c.scope.on(b,'click',()=>{selected=!selected;b.setAttribute('aria-pressed',String(selected));b.setAttribute('aria-label',selected?'取消收藏':'收藏');c.to(c.q('.filled'),{opacity:selected?1:0},{duration:180});c.status(selected?'已收藏':'未收藏');});
 }else if(id==='i2'||id==='i3'){
  const panel=c.q('.summary');panel.style.height='0px';panel.style.opacity='0';const closed=c.q('[data-closed]'),opened=c.q('[data-open]');
  const set=value=>{selected=value;const token=++epoch;setExpanded(b,panel,selected);b.setAttribute('aria-label',selected?'关闭示例区域':labels[id]);if(selected)panel.hidden=false;c.to(panel,{height:selected?'62px':'0px',opacity:selected?1:0},{duration:selected?220:150}).then(ok=>{if(ok&&c.scope.active&&token===epoch&&!selected)panel.hidden=true;});c.to(closed,{opacity:selected?0:1});c.to(opened,{opacity:selected?1:0});c.status(selected?'内容已展开':'内容已收起');};
  c.scope.on(b,'click',()=>set(!selected));c.scope.on(root,'keydown',e=>{if(e.key==='Escape'&&selected){set(false);b.focus();}});
 }else if(id==='i4'){
  c.scope.on(b,'click',()=>{selected=!selected;b.setAttribute('aria-pressed',String(selected));b.setAttribute('aria-label',selected?'模拟暂停':'模拟播放');c.to(c.q('[data-play]'),{opacity:selected?0:1});c.to(c.q('[data-pause]'),{opacity:selected?1:0});c.status(selected?'模拟状态：播放中':'模拟状态：已暂停');});
 }else{
  const result=fail=>{const token=++epoch;b.setAttribute('aria-busy','true');c.status('模拟复制请求中');safeTimer(c.scope,()=>{if(token!==epoch)return;b.setAttribute('aria-busy','false');root.dataset.state=fail?'error':'success';c.status(fail?'模拟复制失败，请重试':'模拟复制成功');c.to(c.q('[data-copy]'),{opacity:fail?1:0});c.to(c.q('[data-check]'),{strokeDashoffset:fail?'1':'0'},{duration:220});safeTimer(c.scope,()=>{if(token!==epoch)return;root.dataset.state='idle';c.to(c.q('[data-copy]'),{opacity:1});c.to(c.q('[data-check]'),{strokeDashoffset:'1'});},900);},130);};
  c.scope.on(b,'click',()=>result(false));c.scope.on(c.q('[data-fail]'),'click',()=>result(true));
 }
 c.scope.clean(()=>epoch++);return c.handle();
}
