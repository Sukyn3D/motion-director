import {catalog,families} from './catalog.mjs';
import {createPreference} from '../runtime/motion-runtime.mjs';
import {mount as buttons} from './patterns/buttons.mjs';
import {mount as navigation} from './patterns/navigation.mjs';
import {mount as cards} from './patterns/cards.mjs';
import {mount as transitions} from './patterns/transitions.mjs';
import {mount as icons} from './patterns/icons.mjs';
import {mount as data} from './patterns/data.mjs';
const mounts={buttons,navigation,cards,transitions,icons,data},pref=createPreference(),handles=[];
const checkbox=document.querySelector('#reduce');
function sync(){checkbox.checked=pref.reduced;document.documentElement.dataset.reduced=String(pref.reduced);}sync();
const off=pref.subscribe(sync);checkbox.addEventListener('change',()=>pref.set(checkbox.checked));document.querySelector('#system').addEventListener('click',()=>pref.set(null));
for(const [family,name] of Object.entries(families)){
 const link=document.createElement('a');link.href='#'+family;link.textContent=name;document.querySelector('#families').append(link);
 const section=document.createElement('section');section.id=family;section.innerHTML=`<div class="section-title"><span>0${Object.keys(families).indexOf(family)+1}</span><h2>${name}</h2><p>5 PATTERNS</p></div><div class="grid"></div>`;document.querySelector('main').append(section);
 for(const item of catalog.filter(x=>x.family===family)){
  const article=document.createElement('article');article.id=item.id;article.dataset.pattern=item.id;
  article.innerHTML=`<div class="card-head"><span class="id">${item.id.toUpperCase()}</span><h3>${item.title}</h3><a href="${item.code}" aria-label="查看${item.title}代码">代码 ↗</a></div><div class="demo"></div><p class="effect">${item.effect}</p><dl><dt>适用</dt><dd>${item.use}</dd><dt>不适用</dt><dd>${item.avoid}</dd><dt>状态合同</dt><dd>${item.contract}</dd></dl>`;
  section.querySelector('.grid').append(article);handles.push(mounts[family](article.querySelector('.demo'),item.id,pref));
 }
}
document.querySelector('#unmount').addEventListener('click',()=>{handles.forEach(h=>h.destroy());off();pref.destroy();document.querySelector('#lifecycle').textContent='30 个控制器已卸载。刷新页面重新挂载。';});
window.motionGallery={catalog,handles,pref};document.documentElement.dataset.galleryReady='true';
