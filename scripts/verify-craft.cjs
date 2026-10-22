const fs=require('node:fs'),path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const url=process.env.MOTION_CRAFT_URL||'http://127.0.0.1:8765/assets/craft/index.html';
if(!['localhost','127.0.0.1','[::1]'].includes(new URL(url).hostname))throw Error('Only an authorized local fixture is accepted');
const output=path.resolve(process.env.MOTION_REPORT||'craft-validation.json');
const delay=ms=>new Promise(r=>setTimeout(r,ms));
async function sample(page,selector,ms=380){return page.evaluate(async({selector,ms})=>{const el=document.querySelector(selector),out=[],start=performance.now();while(performance.now()-start<ms){await new Promise(requestAnimationFrame);const r=el.getBoundingClientRect(),css=getComputedStyle(el);out.push({t:performance.now()-start,x:r.x,y:r.y,w:r.width,h:r.height,transform:css.transform,opacity:+css.opacity,color:css.backgroundColor,clip:css.clipPath});}return out;},{selector,ms});}
const varies=values=>new Set(values).size>2;
const intermediate=(values,start,end)=>values.some(x=>Math.abs(x-start)>.05&&Math.abs(x-end)>.05&&x>Math.min(start,end)&&x<Math.max(start,end));
(async()=>{const browser=await chromium.launch({headless:true}),results=[],evidence={};
for(const mode of ['desktop','touch','reduced']){
 const context=await browser.newContext({viewport:mode==='touch'?{width:390,height:844}:{width:1280,height:900},hasTouch:mode==='touch',isMobile:mode==='touch',reducedMotion:mode==='reduced'?'reduce':'no-preference'});
 const page=await context.newPage(),checks=[],errors=[];page.on('pageerror',e=>errors.push(e.message));const ok=(pass,label)=>{if(!pass)throw Error(label);checks.push(label);};
 try{
  await page.goto(url);await page.waitForFunction(()=>window.__craft);await page.waitForTimeout(100);
  ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'no viewport overflow');
  await page.locator('#primary').scrollIntoViewIfNeeded();await page.waitForTimeout(100);
  const bbox=await page.locator('#primary').boundingBox();
  if(mode==='desktop'){
   const trace=sample(page,'#primary [data-surface]',500);await page.locator('#primary').hover();const frames=await trace;evidence.compositeFrames=frames;
   ok(varies(frames.map(x=>x.y)),'primary surface has intermediate spatial feedback');ok(varies(frames.map(x=>x.clip))||await page.locator('#primary [data-reveal]').evaluate(e=>getComputedStyle(e).clipPath!=='inset(0px 100% 0px 0px)'),'related surface reveal actually changes');
   const slopes=frames.slice(1).map((x,i)=>(x.y-frames[i].y)/(x.t-frames[i].t));ok(Math.max(...slopes)-Math.min(...slopes)>.005,'spatial motion is not constant-speed');
   ok(await page.locator('#primary [data-mark]').evaluate(e=>getComputedStyle(e).transform!=='none'),'child mark has a separate response');
   const after=await page.locator('#primary').boundingBox();ok(Math.abs(after.x-bbox.x)<.1&&Math.abs(after.y-bbox.y)<.1&&Math.abs(after.width-bbox.width)<.1,'actual button target stays fixed');
   await page.mouse.down();await page.waitForTimeout(90);ok(await page.locator('#primary [data-surface]').evaluate(e=>new DOMMatrix(getComputedStyle(e).transform).a<1),'press is distinct from hover');await page.mouse.up();await page.mouse.move(1,1);await page.locator('h2').first().click();await page.waitForTimeout(650);
   ok(await page.locator('#primary [data-surface]').evaluate(e=>Math.abs(new DOMMatrix(getComputedStyle(e).transform).m42)<.05),'hover/press restores a stable surface');
   await page.locator('#compact').focus();await page.waitForTimeout(180);ok(await page.locator('#compact [data-mark]').evaluate(e=>getComputedStyle(e).transform!=='none'),'compact tool has keyboard response');await page.keyboard.press('Enter');ok((await page.locator('#action-status').textContent()).includes('Compact'),'keyboard action semantics remain functional');
  }else{await page.locator('#primary').click();ok((await page.locator('#action-status').textContent()).includes('requested'),'touch/reduced primary action remains functional');}
  await page.locator('#save').scrollIntoViewIfNeeded();await page.locator('#save').click();ok(await page.locator('#save').getAttribute('aria-pressed')==='true','save semantic state changes immediately');
  if(mode==='desktop'){
   await page.waitForTimeout(45);const before=await page.locator('[data-thumb]').evaluate(e=>new DOMMatrix(getComputedStyle(e).transform).m41);const velocity=await page.evaluate(()=>__craft.saved.state().motion.x.v);
   await page.locator('#save').click();const after=await page.locator('[data-thumb]').evaluate(e=>new DOMMatrix(getComputedStyle(e).transform).m41);
   ok(before>0&&before<30&&after>0&&after<30,'state reversal continues from intermediate presentation');
   const trace=sample(page,'[data-thumb]',350);evidence.stateFrames=await trace;ok(varies(evidence.stateFrames.map(x=>x.x)),'state thumb moves through intermediate frames');ok(Number.isFinite(velocity),'state controller reports a finite handoff velocity');
   await page.locator('#save').click();await page.waitForTimeout(40);await page.locator('#save').click();
  }else await page.locator('#save').click();
  await page.waitForTimeout(700);ok(await page.locator('#save').getAttribute('aria-pressed')==='false','rapid state sequence ends at latest semantic state');
  ok(await page.locator('[data-check]').evaluate(e=>+getComputedStyle(e).opacity<.01),'icon reaches matching latest state');ok(await page.locator('[data-state-track]').evaluate(e=>getComputedStyle(e).backgroundColor==='rgb(174, 173, 164)'),'color reaches matching latest state');
  const stage=page.locator('#soft-stage');await stage.scrollIntoViewIfNeeded();await page.waitForTimeout(100);await page.locator('#soft-object').focus();await page.keyboard.press('ArrowRight');await page.waitForTimeout(700);
  ok(await page.evaluate(()=>Math.abs(__craft.soft.state().position.x-24)<.1),'soft object has equivalent keyboard movement');await page.keyboard.press('Home');await page.waitForTimeout(700);
  if(mode==='desktop'){
   const r=await page.locator('#soft-object').boundingBox();await page.mouse.move(r.x+r.width/2,r.y+r.height/2);await page.mouse.down();await page.mouse.move(r.x+r.width/2+100,r.y+r.height/2+25,{steps:5});
   const now=await page.evaluate(()=>__craft.soft.state());ok(Math.abs(now.position.x-100)<.5&&Math.abs(now.position.y-25)<.5,'actual center follows direct input without an ease chase');await page.waitForTimeout(70);
   ok(await page.locator('[data-skin]').evaluate(e=>{const m=new DOMMatrix(getComputedStyle(e).transform);return Math.abs(Math.hypot(m.a,m.b)-1)>.01;}),'speed-driven material deformation is visibly rendered');
   await page.mouse.move(r.x+r.width/2+140,r.y+r.height/2+20);const release=await page.evaluate(()=>__craft.soft.state());await page.mouse.up();await page.waitForTimeout(60);
   const following=await page.evaluate(()=>__craft.soft.state());ok(following.position.x>release.position.x,'release carries input momentum');ok(Math.abs(release.velocity.x)>0,'release velocity comes from input');
   await page.waitForTimeout(1600);ok(await page.evaluate(()=>!__craft.soft.state().running),'soft release dissipates to rest');ok(await page.evaluate(()=>Math.abs(__craft.soft.state().stretch)<.001),'material stabilizes after release');
   const r2=await page.locator('#soft-object').boundingBox();await page.mouse.move(r2.x+r2.width/2,r2.y+r2.height/2);await page.mouse.down();const grabbed=await page.evaluate(()=>__craft.soft.state());ok(Math.abs(grabbed.position.x-following.target.x)<1,'regrab does not jump to initial origin');await page.mouse.move(r2.x+r2.width/2-30,r2.y+r2.height/2,{steps:2});await page.keyboard.press('Escape');await page.mouse.up();await page.waitForTimeout(800);ok(await page.evaluate(()=>!__craft.soft.state().dragging),'Escape cancels drag');
  }
  await page.locator('h1').click();
  const scroll=await page.locator('#scroll-example').evaluate(e=>({top:e.offsetTop,height:e.offsetHeight}));const height=await page.evaluate(()=>innerHeight);
  await page.evaluate(({top,height})=>scrollTo({top:top-height/2,behavior:'instant'}),{top:scroll.top,height});await page.waitForTimeout(70);
  ok(await page.locator('#scroll-example [data-scroll-layer]').evaluate(e=>+getComputedStyle(e).opacity>.98),'scroll content fully enters');
  await page.evaluate(({top,height})=>scrollTo({top:top+height-65,behavior:'instant'}),{top:scroll.top,height:scroll.height});await page.waitForTimeout(70);
  const exiting=await page.locator('#scroll-example [data-scroll-layer]').evaluate(e=>+getComputedStyle(e).opacity);
  ok(mode==='reduced'?exiting===1:exiting>0&&exiting<1,'scroll has an actual exit phase or reduced static equivalent');
  await page.evaluate(({top,height})=>scrollTo({top:top-height/2,behavior:'instant'}),{top:scroll.top,height});await page.waitForTimeout(70);ok(await page.locator('#scroll-example [data-scroll-layer]').evaluate(e=>+getComputedStyle(e).opacity>.98),'scroll reversal re-enters the same content');
  await page.locator('#scroll-action').focus();const focusTop=await page.locator('#scroll-action').evaluate(e=>e.getBoundingClientRect().top+scrollY);await page.evaluate(top=>scrollTo({top:top-30,behavior:'instant'}),focusTop);await page.waitForTimeout(70);
  ok(await page.locator('#scroll-example [data-scroll-layer]').evaluate(e=>+getComputedStyle(e).opacity===1),'focused scroll control is not hidden by exit');ok(await page.locator('#scroll-action').evaluate(e=>document.activeElement===e),'scroll effect keeps focus identity');ok(await page.locator('#scroll-action [data-mark]').evaluate(e=>(()=>{const m=new DOMMatrix(getComputedStyle(e).transform);return Math.abs(m.b)<.001&&Math.abs(m.e)<.001&&Math.abs(m.f)<.001;})()),'plus mark has no independent rotation or translation');
  await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(120);ok(await page.evaluate(()=>__craft.pref.reduced),'dynamic system preference is honored');ok(await page.locator('#scroll-example [data-scroll-layer]').evaluate(e=>+getComputedStyle(e).opacity===1),'dynamic reduction preserves scroll content');
  await page.locator('#save').scrollIntoViewIfNeeded();await page.locator('#save').click();await page.waitForTimeout(60);ok(await page.locator('[data-thumb]').evaluate(e=>new DOMMatrix(getComputedStyle(e).transform).m41===30),'reduced state change snaps to true endpoint');
  ok(await page.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running').length===0),'no autonomous WAAPI remains under reduced motion');
  await page.evaluate(()=>__craft.destroy());await page.waitForTimeout(100);ok(await page.evaluate(()=>__craft.disposed&&!__craft.soft.state().running),'unload cleanup stops active controller');ok(errors.length===0,'no browser runtime errors');
  results.push({mode,passed:true,checks,errors});
 }catch(e){results.push({mode,passed:false,checks,error:e.message,errors});}
 await context.close();
}
// Instrument calibration: same rendered samples must detect a known hard cut.
const fault=await browser.newPage();await fault.setContent('<button id="cut">Toggle</button><div id="probe" style="width:30px;height:30px;background:black"></div><script>cut.onclick=()=>probe.style.transform="translateX(80px)"</script>');
const faultTrace=sample(fault,'#probe',180);await fault.locator('#cut').click();const broken=await faultTrace;const xs=broken.map(x=>x.x);const detected=!intermediate(xs,Math.min(...xs),Math.max(...xs));results.push({mode:'known-fault-calibration',passed:detected,checks:detected?['known instantaneous hard cut is rejected as continuous motion']:[],error:detected?undefined:'validator missed known fault'});await fault.close();
const noJS=await browser.newContext({javaScriptEnabled:false});const plain=await noJS.newPage();await plain.goto(url);const present=await plain.locator('#scroll-example [data-scroll-layer]').evaluate(e=>+getComputedStyle(e).opacity===1);results.push({mode:'no-js',passed:present,checks:present?['progressive fallback keeps content visible']:[]});await noJS.close();await browser.close();
fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify({at:new Date().toISOString(),environment:'Headless Chromium; touch simulation; not real-device performance',results,evidence},null,2));console.log(JSON.stringify(results.map(x=>({mode:x.mode,passed:x.passed,checks:x.checks.length,error:x.error})),null,2));if(results.some(x=>!x.passed))process.exitCode=1;
})();

