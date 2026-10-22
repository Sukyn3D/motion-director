import {controller,artwork,button,status,setExpanded} from '../shared.mjs';
import {createInputState} from '../../runtime/input-state.mjs';
export function mount(root,id,pref){
 const c=controller(root,pref);let selected=false,epoch=0;
 root.innerHTML=`<div class="preview-card"><div class="art-wrap">${artwork}</div><h4>Field Notes</h4><p>对象的内容与来源保持清楚。</p>${id==='c4'?button('展开摘要',`data-main aria-expanded="false" aria-controls="${id}-summary"`):button(id==='c5'?'加入比较':id==='c3'?'选择对象':'打开项目 <span class="arrow" aria-hidden="true">↗</span>',`data-main ${id==='c3'||id==='c5'?'aria-pressed="false"':''}`)}${id==='c4'?`<div id="${id}-summary" class="summary" hidden inert><p>细节留在同一上下文中。重复点击可以立即收起。</p></div>`:''}</div>${id==='c5'?'<div class="compare-slot">比较对象：<span data-count>0</span> <span data-badge style="display:inline-block;opacity:0" aria-hidden="true">✓</span></div>':''}${status}`;
 const card=c.q('.preview-card'),b=c.q('[data-main]');
 if(id==='c1'||id==='c2'){
  const target=c.q(id==='c1'?'.arrow':'.art');const set=on=>{on=on&&!pref.reduced;return c.to(target,{transform:id==='c1'?`scale(${on?1.08:1})`:`scale(${on?1.04:1})`},{duration:220});};c.scope.clean(pref.subscribe(reduced=>{if(reduced)set(false);}));
  let hovered=false,keyboard=false;const material=()=>set(hovered||keyboard);
  const cardInput=createInputState(card,{activationKeys:[],onChange:state=>{hovered=state.pointerInside;material();}}),buttonInput=createInputState(b,{onChange:state=>{keyboard=state.focusVisible;material();}});
  c.scope.clean(()=>{cardInput.destroy();buttonInput.destroy();});c.scope.on(b,'click',()=>c.status('已打开项目（本地确认）'));
 }else if(id==='c3'){
  let keyboard=false;const paint=()=>c.to(card,{borderColor:selected||keyboard?'#386641':'#d1dac8',backgroundColor:selected?'#eff8dd':'#fffef8'});
  const input=createInputState(b,{onChange:state=>{keyboard=state.focusVisible;paint();}});c.scope.clean(()=>input.destroy());c.scope.on(b,'click',()=>{selected=!selected;b.setAttribute('aria-pressed',String(selected));b.querySelector('.face').textContent=selected?'✓ 已选择':'选择对象';c.status(selected?'对象已选择':'对象未选择');paint();});
 }else if(id==='c4'){
  const panel=c.q('.summary');panel.style.height='0px';panel.style.opacity='0';
  const set=value=>{selected=value;const token=++epoch;setExpanded(b,panel,selected);b.querySelector('.face').textContent=selected?'收起摘要':'展开摘要';if(selected)panel.hidden=false;c.to(panel,{height:selected?'80px':'0px',opacity:selected?1:0},{duration:selected?240:160}).then(ok=>{if(ok&&c.scope.active&&token===epoch&&!selected)panel.hidden=true;});c.status(selected?'摘要已展开':'摘要已收起');};
  c.scope.on(b,'click',()=>set(!selected));c.scope.on(root,'keydown',e=>{if(e.key==='Escape'&&selected){set(false);b.focus();}});c.scope.clean(()=>epoch++);
 }else{
  c.scope.on(b,'click',()=>{selected=!selected;b.setAttribute('aria-pressed',String(selected));b.querySelector('.face').textContent=selected?'移出比较':'加入比较';c.q('[data-count]').textContent=selected?'1':'0';c.to(c.q('[data-badge]'),{opacity:selected?1:0,transform:selected?'scale(1)':'scale(.94)'});c.to(card,{borderColor:selected?'#386641':'#d1dac8'});c.status(selected?'已加入比较':'已移出比较');});
 }
 return c.handle();
}
