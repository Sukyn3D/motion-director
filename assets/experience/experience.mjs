import {createPreference,createScope,createSpring,effectsTo,cancelEffects,clamp} from '../runtime/motion-runtime.mjs';
import {bindScrollGroup} from '../craft/continuous.mjs';
const pref=createPreference(),scope=createScope(pref),q=s=>document.querySelector(s),controls=[];
const groups=[...document.querySelectorAll('[data-group]')];
for(const host of groups){controls.push(bindScrollGroup(host,{pref,distance:28}));const entry=host.querySelector('[data-entry]');if(!pref.reduced){entry.style.opacity='0';entry.style.transform='translateY(12px)';effectsTo(entry,{opacity:'1',transform:'translateY(0px)'},{pref,duration:380,easing:'cubic-bezier(.42,0,.22,1)'});}scope.clean(()=>cancelEffects(entry));}
scope.on(q('#reduce'),'change',()=>pref.set(q('#reduce').checked?true:null));
let paused=false;scope.on(q('#pause-art'),'click',()=>{paused=!paused;document.body.dataset.paused=String(paused);q('#pause-art').setAttribute('aria-pressed',String(paused));q('#pause-art').textContent=paused?'恢复视觉润色':'暂停视觉润色';});
const setPref=()=>document.documentElement.dataset.reduced=String(pref.reduced);scope.clean(pref.subscribe(setPref));setPref();
let count=0;scope.on(q('#add'),'click',()=>q('#icon-status').textContent=`已新增${++count}次；加号含义不变。`);scope.on(q('#play-action'),'click',()=>q('#icon-status').textContent='预览提示已触发；播放图形保持方向。');scope.on(q('#reading-action'),'click',()=>q('#reading-status').textContent='段落已记录；视口内操作目标保持可读。');
const dialog=q('#viewer'),source=q('#video-open'),frame=q('#video-frame'),video=q('#video'),backdrop=q('.backdrop'),copy=q('#video-copy'),poster=q('#handoff-poster'),badge=q('#handoff-play'),tag=q('#handoff-label'),sourceBadge=source.querySelector('.thumb-play'),sourceTag=source.querySelector('.thumb-label'),toggle=q('#media-toggle');
let motion=null,decoded=null,closing=false,goal=null,mode='closed',fallback=false,last=null,decodedValue=video.readyState>=2?1:0;
// Native chrome is absent throughout this fixture. The custom control follows
// actual playback events, with keyboard activation and accessible labels.
video.controls=false;
function mediaState(){const playing=!video.paused&&!video.ended;toggle.dataset.playing=String(playing);const label=playing?'暂停视频':video.ended?'重播视频':'播放视频';toggle.setAttribute('aria-label',label);q('#media-toggle-label').textContent=label;}
async function play(){try{if(video.ended)video.currentTime=0;await video.play();}catch{if(mode==='open')q('#media-status').textContent='播放未获许可或加载失败，请用播放按钮重试。';}mediaState();}
scope.on(toggle,'click',()=>{if(video.paused||video.ended)play();else video.pause();});
for(const event of ['play','pause','ended','emptied'])scope.on(video,event,mediaState);
const targetRect=()=>{const w=Math.min(900,innerWidth-48),h=w*9/16;return{x:(innerWidth-w)/2,y:Math.max(75,(innerHeight-h-115)/2),w,h,round:14,reveal:1};};
function rect(el){const r=el.getBoundingClientRect();return{x:r.left,y:r.top,w:r.width,h:r.height,round:14,reveal:0};}
function sourceVisible(){const r=source.getBoundingClientRect();return source.isConnected&&r.width>0&&r.height>0&&r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth;}
function paintMedia(){if(!last)return;const media=clamp(last.reveal,0,1)*clamp(decodedValue,0,1),sourceAlpha=1-clamp(last.reveal,0,1);video.style.opacity=String(media);poster.style.opacity=String(1-media);badge.style.opacity=String(sourceAlpha);tag.style.opacity=String(sourceAlpha);}
function resetClosed(){if(mode==='closed')return;mode='closed';closing=false;motion?.destroy();motion=null;decoded?.destroy();decoded=null;video.pause();for(const el of [backdrop,copy,frame])cancelEffects(el);
 // The moving frame already carries the source badge and label before it is
 // removed. Restore the matching real layers before removing that frame.
 sourceBadge.style.opacity='1';sourceTag.style.opacity='1';if(dialog.open)dialog.close();source.setAttribute('aria-expanded','false');if(source.isConnected)source.focus({preventScroll:true});else{const heading=q('#media h2');heading.tabIndex=-1;heading.focus({preventScroll:true});}}
function render(p){last=p;Object.assign(frame.style,{left:p.x+'px',top:p.y+'px',width:Math.max(1,p.w)+'px',height:Math.max(1,p.h)+'px',borderRadius:p.round+'px'});copy.style.top=(p.y+p.h)+'px';paintMedia();if(closing&&goal&&['x','y','w','h','reveal'].every(k=>Math.abs(p[k]-goal[k])<.0006))queueMicrotask(()=>{if(closing)resetClosed();});}
function syncDecoded(){if(video.readyState>=2)decoded?.set({value:1});}
scope.on(video,'loadeddata',syncDecoded);scope.on(video,'playing',()=>{syncDecoded();q('#media-status').textContent='本地视频正在播放；关闭会立即暂停。';});scope.on(video,'error',()=>q('#media-status').textContent='视频加载失败；可以关闭并重试本地视频链接。');
function open(){if(typeof dialog.showModal!=='function')return;closing=false;mode='open';fallback=false;source.setAttribute('aria-expanded','true');if(!dialog.open){
 dialog.showModal();frame.style.opacity='1';backdrop.style.backgroundColor='rgba(12,25,19,0)';copy.style.opacity='0';badge.style.backgroundColor=getComputedStyle(sourceBadge).backgroundColor;
 decodedValue=video.readyState>=2?1:0;decoded=createSpring({value:decodedValue},p=>{decodedValue=p.value;paintMedia();},{pref,omega:24,zeta:1});
 const initial=pref.reduced?targetRect():rect(source);motion=createSpring(initial,render,{pref,omega:20,zeta:1});sourceBadge.style.opacity='0';sourceTag.style.opacity='0';
 }goal=targetRect();motion.set(goal);effectsTo(frame,{opacity:'1'},{pref,duration:140});effectsTo(backdrop,{backgroundColor:'rgba(12,25,19,0.74)'},{pref,duration:210});effectsTo(copy,{opacity:'1'},{pref,duration:240});q('#close-video').focus({preventScroll:true});play();}
function close(){if(!dialog.open||closing)return;closing=true;mode='closing';source.setAttribute('aria-expanded','false');video.pause();fallback=!sourceVisible();badge.style.backgroundColor=getComputedStyle(sourceBadge).backgroundColor;goal=fallback?{...rect(frame),y:rect(frame).y+10,reveal:1}:rect(source);effectsTo(backdrop,{backgroundColor:'rgba(12,25,19,0)'},{pref,duration:180});effectsTo(copy,{opacity:'0'},{pref,duration:120});if(fallback)effectsTo(frame,{opacity:'0'},{pref,duration:150});motion.set(goal);if(pref.reduced&&closing)resetClosed();}
scope.on(source,'click',e=>{if(typeof dialog.showModal!=='function')return;e.preventDefault();open();});scope.on(q('#close-video'),'click',close);scope.on(dialog,'cancel',e=>{e.preventDefault();close();});scope.on(backdrop,'click',close);
scope.on(window,'resize',()=>{if(!dialog.open)return;if(closing){fallback=!sourceVisible();goal=fallback?{...rect(frame),y:rect(frame).y+10,reveal:1}:rect(source);}else goal=targetRect();motion?.set(goal);});
scope.on(document,'visibilitychange',()=>{if(document.hidden)video.pause();});let disposed=false;function destroy(){if(disposed)return;disposed=true;resetClosed();controls.forEach(c=>c.destroy());scope.destroy();pref.destroy();}
scope.on(window,'pagehide',e=>{if(e.persisted){video.pause();if(dialog.open)resetClosed();}else destroy();});
mediaState();window.__experience={get mode(){return mode;},get fallback(){return fallback;},get disposed(){return disposed;},groups,controls,pref,open,close,destroy};document.documentElement.dataset.experienceReady='true';
