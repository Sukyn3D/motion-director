const galleryURL=new URL(process.env.MOTION_GALLERY_URL || 'http://127.0.0.1:8765/assets/gallery/index.html'); if(!['http:','https:'].includes(galleryURL.protocol)||!['localhost','127.0.0.1','[::1]'].includes(galleryURL.hostname))throw new Error('Local gallery HTTP URL required');
const fs=require('node:fs/promises'),path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const report={scope:'30 original Web demo behaviors; not aesthetic evaluation, native performance, or independent skill A/B/C',environment:{},tests:[]};
const selectedIds=process.argv[2]?new Set(process.argv[2].split(',')):null;
const probes={b1:'.face',b2:'.arrow',b3:'.face',b4:'.face',b5:'.ring',n1:'.marker',n2:'.marker',n3:'.nested',n4:'.marker',n5:'.step-track',c1:'.arrow',c2:'.art',c3:'.preview-card',c4:'.summary',c5:'[data-badge]',t1:'[data-b]',t2:'[data-b]',t3:'[data-object]',t4:'.sheet',t5:'[data-object]',i1:'.filled',i2:'.chevron',i3:'.menu-line',i4:'[data-pause]',i5:'[data-check]',d1:'.bar',d2:'[data-line]',d3:'[data-arc]',d4:'.delta-bar',d5:'.rank-item'};
async function presentation(loc){return loc.evaluate(e=>{const s=getComputedStyle(e);return [s.transform,s.opacity,s.height,s.width,s.color,s.backgroundColor,s.borderColor,s.strokeDashoffset,e.getAttribute('d')].join('|');});}
async function trigger(page,id,mode='normal'){
 const root=page.locator('#'+id),main=root.locator('[data-main],[data-toggle]').first();await root.scrollIntoViewIfNeeded();
 if(id==='b1'){if(mode==='touch'){await main.tap();return async()=>{};}await main.focus();await page.keyboard.down(' ');return()=>page.keyboard.up(' ');}
 if(id==='b2'||id==='c1'||id==='c2'){await main.focus();return()=>main.evaluate(e=>e.blur());}
 if(id==='b3'){
  if(mode==='touch'){await main.tap();return async()=>{};}
  const r=await main.boundingBox();await page.mouse.move(r.x+r.width*.9,r.y+r.height*.8);return()=>page.mouse.move(0,0);
 }
 if(id==='n1'||id==='n2'){await root.locator('[role=tab]').nth(2).click();return async()=>{};}
 if(id==='n4'){await root.locator('[data-level]').nth(0).click();return async()=>{};}
 if(id==='n5'){await root.locator('[data-step]').nth(2).click();return async()=>{};}
 if(mode==='touch')await main.tap();else await main.click();return async()=>{};
}
async function check(page,id,errors,mode){
 const root=page.locator('#'+id),result={name:id+'-'+mode,status:'fail',checks:[]};report.tests.push(result);
 const ok=(name,pass,detail)=>result.checks.push({name,pass:!!pass,...(detail===undefined?{}:{detail})});
 try{
  await page.reload();await page.waitForSelector('[data-gallery-ready=true]');await page.waitForTimeout(550);
  const probe=root.locator(probes[id]).first(),target=id.startsWith('n')?root.locator('button').first():root.locator('[data-main]');
  await root.scrollIntoViewIfNeeded();const before=await target.boundingBox();const release=await trigger(page,id,mode);
  // Capture intermediate rendering, not just final attributes. Poll over a bounded normal-speed interval.
  if(mode==='reduced'&&id==='i5')await page.waitForTimeout(180);
  const samples=[];for(let i=0;i<10;i++){samples.push(await presentation(probe));await page.waitForTimeout(18);}const changed=new Set(samples).size>1;
  if(mode==='normal')ok('Observable intermediate presentation',changed,{samples:new Set(samples).size});
  if(mode==='reduced')ok('No continuing autonomous interpolation',!changed,{samples:new Set(samples).size});
  const after=await target.boundingBox();ok('Stable input target',Math.abs(before.x-after.x)<.2&&Math.abs(before.y-after.y)<.2&&Math.abs(before.width-after.width)<.2&&Math.abs(before.height-after.height)<.2);
  await release();if(['b2','b3','c1','c2'].includes(id))await root.locator('[data-main]').click();await page.waitForTimeout(id==='b4'?500:id==='i5'?180:450);
  ok('User feedback exists',(await root.locator('[data-status]').textContent())!=='准备操作');
  if(id==='i1'||id==='i4'||id==='c3'||id==='c5')ok('Selected semantics immediately agree',await root.locator('[data-main]').getAttribute('aria-pressed')==='true');
  if(['n3','c4','t3','t4','i2','i3'].includes(id)){const control=root.locator('[data-main],[data-toggle]').first();ok('Expanded semantics',await control.getAttribute('aria-expanded')==='true');await control.click();await page.waitForTimeout(400);ok('Reverse closes',await control.getAttribute('aria-expanded')==='false');}
  if(id==='b4'){await root.locator('[data-main]').click();await root.locator('[data-cancel]').click();await page.waitForTimeout(500);ok('Late result cannot override cancellation',await root.locator('.demo').getAttribute('data-state')==='idle');}
  if(id==='i5')ok('Copy result is explicitly simulated',(await root.locator('[data-status]').textContent()).includes('模拟'));
  if(id.startsWith('d'))ok('Latest dataset immediately exposed',(await root.locator('[data-status]').textContent()).includes('B'));
  ok('No runtime errors',errors.length===0,[...errors]);result.status=result.checks.every(x=>x.pass)?'pass':'fail';
 }catch(e){result.error=e.message;}return result;
}
(async()=>{const browser=await chromium.launch({headless:true});report.environment={browser:browser.version(),node:process.version,viewport:{width:1280,height:900}};
 try{
  for(const mode of ['normal','reduced','touch']){
   const context=await browser.newContext({viewport:mode==='touch'?{width:390,height:844}:{width:1280,height:900},reducedMotion:mode==='reduced'?'reduce':'no-preference',hasTouch:mode==='touch',isMobile:mode==='touch'}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(galleryURL.href);await page.waitForSelector('[data-gallery-ready=true]');
   for(const id of Object.keys(probes).filter(id=>!selectedIds||selectedIds.has(id))){const r=await check(page,id,errors,mode);console.log(r.name+': '+r.status+(r.error?' '+r.error:''));}
   if(mode==='normal'){
    await page.reload();await page.waitForSelector('[data-gallery-ready=true]');await page.waitForTimeout(550);
    for(const id of ['i1','c5','t1','t2','t3','t4','t5','d1','d2','d3','d4','d5']){
     if(selectedIds&&!selectedIds.has(id))continue;
     const root=page.locator('#'+id),control=root.locator('[data-main]');await root.scrollIntoViewIfNeeded();
     const result={name:id+'-rapid-interruption',status:'fail',checks:[]};report.tests.push(result);
     const object=root.locator('[data-object]'),hasObject=await object.count();if(hasObject)await object.evaluate(e=>e.dataset.identityProbe='retained');
     await control.click();await page.waitForTimeout(25);await control.click();await page.waitForTimeout(25);await control.click();await page.waitForTimeout(650);
     result.checks.push({name:'Latest intent has matching semantics',pass:(await root.locator('[data-status]').textContent())!=='准备操作'});
     if(['i1','c5'].includes(id))result.checks.push({name:'Last toggle wins',pass:await control.getAttribute('aria-pressed')==='true'});
     if(['t3','t4'].includes(id))result.checks.push({name:'Last expansion wins',pass:await control.getAttribute('aria-expanded')==='true'});
     if(id==='t1'||id==='t2')result.checks.push({name:'Latest view is operable',pass:await root.locator('[data-b]').evaluate(e=>!e.inert&&e.getAttribute('aria-hidden')==='false')});
     if(id.startsWith('d'))result.checks.push({name:'Latest data wins',pass:(await root.locator('[data-status]').textContent()).includes('B')});
     if(hasObject)result.checks.push({name:'Object identity retained',pass:await object.getAttribute('data-identity-probe')==='retained'});
     result.status=result.checks.every(x=>x.pass)?'pass':'fail';
    }
    await page.screenshot({path:path.resolve(process.env.MOTION_SCREENSHOT || 'gallery-preview.png'),fullPage:true});
    await page.locator('#unmount').click();const baseline=await page.locator('#i1 [data-main]').getAttribute('aria-pressed');await page.locator('#i1 [data-main]').click();await page.waitForTimeout(50);
    report.tests.push({name:'Unmount releases input handlers',status:baseline===await page.locator('#i1 [data-main]').getAttribute('aria-pressed')?'pass':'fail',checks:[]});
   }
   await context.close();
  }
 }finally{await browser.close();const file=path.resolve(process.env.MOTION_REPORT || 'gallery-validation.json');if(selectedIds){const previous=JSON.parse(await fs.readFile(file,'utf8'));const replaced=new Set(report.tests.map(x=>x.name));report.tests=[...previous.tests.filter(x=>!replaced.has(x.name)),...report.tests];report.environment.targetedRerun=[...selectedIds];}report.summary={passed:report.tests.filter(x=>x.status==='pass').length,total:report.tests.length};report.status=report.summary.passed===report.summary.total?'pass':'fail';await fs.writeFile(file,JSON.stringify(report,null,2));console.log(JSON.stringify(report.summary));process.exitCode=report.status==='pass'?0:1;}
})().catch(e=>{console.error(e);process.exitCode=1;});
