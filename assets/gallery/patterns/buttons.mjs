import {controller,press,button,status,createSpring,safeTimer} from '../shared.mjs';
import {createInputState} from '../../runtime/input-state.mjs';
export function mount(root,id,pref){
 root.innerHTML=button(id==='b4'?'模拟请求':id==='b5'?'模拟成功确认':'探索项目 <span class="arrow" aria-hidden="true">↗</span>','data-main')+(id==='b4'?'<div class="controls row">'+button('模拟失败','data-fail class="action secondary"')+button('取消请求','data-cancel class="action secondary"')+'</div><p class="muted-note">本地模拟，不发送请求。</p>':'')+status;
 const c=controller(root,pref),b=c.q('[data-main]'),face=b.querySelector('.face');let count=0;
 if(id==='b1'){press(c,b,face);c.scope.on(b,'click',()=>c.status('完成 '+(++count)+' 次'));}
 if(id==='b2'){
  const arrow=face.querySelector('.arrow');const set=on=>c.to(arrow,{transform:on&&!pref.reduced?'scale(1.08)':'scale(1)',opacity:on?'1':'.78'});c.scope.clean(pref.subscribe(reduced=>{if(reduced)set(false);}));
  const input=createInputState(b,{onChange:state=>set(state.contact)});c.scope.clean(()=>input.destroy());c.scope.on(b,'click',()=>c.status('打开 '+(++count)+' 次'));
 }
 if(id==='b3'){
  const arrow=face.querySelector('.arrow'),spring=createSpring({x:0,y:0,ix:0,iy:0},v=>{face.style.transform=`translate(${v.x}px,${v.y}px)`;arrow.style.transform="";},{pref:c.scope.pref,omega:30,zeta:.82});
  const reset=()=>spring.set({x:0,y:0,ix:0,iy:0});
  c.scope.on(b,'pointermove',e=>{if(e.pointerType!=='mouse'||!matchMedia('(hover:hover) and (pointer:fine)').matches||pref.reduced)return;const r=b.getBoundingClientRect(),x=Math.max(-6,Math.min(6,(e.clientX-r.left-r.width/2)*.07)),y=Math.max(-4,Math.min(4,(e.clientY-r.top-r.height/2)*.07));spring.set({x,y,ix:x*.5,iy:y*.5});});
  c.scope.on(b,'pointerleave',reset);c.scope.on(b,'pointercancel',reset);c.scope.on(b,'blur',reset);c.scope.on(window,'blur',reset);c.scope.clean(()=>spring.destroy());c.scope.on(b,'click',()=>c.status('探索 '+(++count)+' 次'));
 }
 if(id==='b4'){
  let epoch=0;root.dataset.state='idle';const label=(state,text)=>{root.dataset.state=state;b.setAttribute('aria-busy',String(state==='pending'));face.textContent=text;c.to(face,{backgroundColor:state==='error'?'#87402f':state==='success'?'#386641':state==='pending'?'#526340':'#143d3b'});};
  const request=fail=>{const token=++epoch;label('pending','请求中…');c.status('模拟请求进行中，可重试或取消');safeTimer(c.scope,()=>{if(token!==epoch)return;label(fail?'error':'success',fail?'重试':'完成 · 再试');c.status(fail?'模拟失败，可以重试':'模拟成功');},420);};
  c.scope.on(b,'click',()=>request(false));c.scope.on(c.q('[data-fail]'),'click',()=>request(true));c.scope.on(c.q('[data-cancel]'),'click',()=>{epoch++;label('idle','模拟请求');c.status('已取消模拟请求');});c.scope.clean(()=>{epoch++;});
 }
 if(id==='b5'){
  face.insertAdjacentHTML('afterend','<span class="ring" aria-hidden="true"></span>');const ring=c.q('.ring');let epoch=0;
  c.scope.on(b,'click',()=>{const token=++epoch;c.status('已确认 '+(++count)+' 次（模拟）');c.to(ring,{opacity:1,transform:'scale(1)'},{duration:100}).then(()=>{if(c.scope.active&&token===epoch)c.to(ring,{opacity:0,transform:'scale(1.14)'},{duration:260});});});
  c.scope.clean(()=>epoch++);
 }
 return c.handle();
}
