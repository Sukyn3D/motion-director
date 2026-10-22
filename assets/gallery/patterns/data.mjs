import {controller,createSpring,button,status} from '../shared.mjs';
// Monotonic numeric tween snapshots actual presentation when retargeted. No fake intermediate text.
function tween(c,initial,render){
 let values=[...initial],from=[...initial],target=[...initial],raf=0,start=0;
 const paint=()=>render(values),stop=()=>{cancelAnimationFrame(raf);raf=0;};
 function frame(t){const p=Math.min(1,(t-start)/260),e=1-(1-p)**3;values=from.map((v,i)=>v+(target[i]-v)*e);paint();if(p<1)raf=requestAnimationFrame(frame);else raf=0;}
 const snap=()=>{stop();values=[...target];paint();};const off=c.scope.pref.subscribe(reduced=>{if(reduced)snap();});c.scope.clean(()=>{stop();off();});paint();
 return next=>{stop();from=[...values];target=[...next];if(c.scope.pref.reduced)snap();else{start=performance.now();raf=requestAnimationFrame(frame);}};
}
export function mount(root,id,pref){
 const c=controller(root,pref);let alternate=false;
 const datasets=id==='d4'?[[35,-20,15],[-30,40,-10]]:[[30,68,42],[80,40,90]];
 const controls=`<div class="controls row">${button('切换数据','data-main')}</div>${status}`;
 let update;
 if(id==='d1'){
  root.innerHTML=`<div class="bars">${[0,1,2].map(()=>'<div class="bar" aria-hidden="true"></div>').join('')}</div><div class="values">${[0,1,2].map(()=>'<span data-value></span>').join('')}</div>${controls}`;
  const bars=c.qa('.bar'),labels=c.qa('[data-value]');update=values=>{labels.forEach((l,i)=>l.textContent=values[i]);bars.forEach((b,i)=>c.to(b,{transform:`scaleY(${values[i]/100})`},{duration:260}));};
 }else if(id==='d2'){
  root.innerHTML=`<svg class="chart-svg" viewBox="0 0 260 110" role="img" aria-label="相同三个时间点的数值"><path d="M20 95H240" stroke="#acbd9c"/><path data-line fill="none" stroke="#355949" stroke-width="3"/></svg><div class="values">${[0,1,2].map(()=>'<span data-value></span>').join('')}</div>${controls}`;
  const labels=c.qa('[data-value]'),line=c.q('[data-line]');const animate=tween(c,datasets[0],v=>{line.setAttribute('d',v.map((x,i)=>`${i?'L':'M'}${20+i*110} ${95-x*.8}`).join(' '));});
  update=values=>{labels.forEach((l,i)=>l.textContent=values[i]);c.q('svg').setAttribute('aria-label','数值 '+values.join('、'));animate(values);};
 }else if(id==='d3'){
  root.innerHTML=`<div class="donut-wrap"><svg class="donut" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="40" fill="none" stroke="#d2dfc4" stroke-width="10"/><circle data-arc cx="50" cy="50" r="40" fill="none" stroke="#355949" stroke-width="10" pathLength="100" style="stroke-dasharray:100;stroke-dashoffset:70"/></svg><span class="donut-label" data-value></span></div><p class="muted-note">示例比例，有明确共同分母；不表示上传进度。</p>${controls}`;
  update=values=>{c.q('[data-value]').textContent=values[0]+'%';c.to(c.q('[data-arc]'),{strokeDashoffset:String(100-values[0])},{duration:260});};
 }else if(id==='d4'){
  root.innerHTML=[0,1,2].map((_,i)=>`<div class="delta-row"><span>${String.fromCharCode(65+i)}</span><div class="delta-track"><div class="delta-bar" aria-hidden="true"></div></div><span data-value></span></div>`).join('')+controls;
  const bars=c.qa('.delta-bar'),labels=c.qa('[data-value]');const animate=tween(c,datasets[0],values=>values.forEach((v,i)=>{bars[i].style.left=(v<0?50+v:50)+'%';bars[i].style.width=Math.abs(v)+'%';bars[i].style.backgroundColor=v<0?'#a15840':'#355949';}));
  update=values=>{labels.forEach((l,i)=>l.textContent=(values[i]>0?'+':'')+values[i]);animate(values);};
 }else{
  root.innerHTML=`<ol class="rank-stage">${['A','B','C'].map((name,i)=>`<li class="rank-item" data-key="${name}"><span data-label>${name}</span><span data-value></span></li>`).join('')}</ol>${controls}`;
  const items=c.qa('[data-key]'),motion=items.map((el,i)=>createSpring({y:i*40},v=>el.style.transform=`translateY(${v.y}px)`,{pref,omega:29,zeta:1}));c.scope.clean(()=>motion.forEach(m=>m.destroy()));
  update=values=>{const order=values.map((v,i)=>({v,i})).sort((a,b)=>b.v-a.v);order.forEach(({v,i},rank)=>{items[i].querySelector('[data-label]').textContent=(rank+1)+'. '+String.fromCharCode(65+i);items[i].querySelector('[data-value]').textContent=v;motion[i].set({y:rank*40});c.q('.rank-stage').append(items[i]);});};
 }
 update(datasets[0]);c.status('数据组 A');c.scope.on(c.q('[data-main]'),'click',()=>{alternate=!alternate;root.dataset.state=alternate?'b':'a';update(datasets[alternate?1:0]);c.status('数据组 '+(alternate?'B':'A')+'；文本为最新值');});return c.handle();
}
