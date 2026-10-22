#!/usr/bin/env node
// Declarative local-page behavior probes. No network installs; no FPS or aesthetics claims.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createRequire} from 'node:module';
const args=process.argv.slice(2),opts={};
for(let i=0;i<args.length;i+=2){if(!args[i]?.startsWith('--')||!args[i+1])throw new Error('Use --option value pairs');opts[args[i].slice(2)]=args[i+1];}
const root=fileURLToPath(new URL('../',import.meta.url));
const report={status:'not_run',scope:'Behavior and intermediate presentation; not aesthetics, FPS, or a skill A/B benchmark',tests:[]};
let browser;
async function save(){const text=JSON.stringify(report,null,2);if(opts.output){await fs.mkdir(path.dirname(path.resolve(opts.output)),{recursive:true});await fs.writeFile(opts.output,text);}console.log(text);}
try{
 let playwright;
 if(opts['playwright-module'])playwright=createRequire(import.meta.url)(path.resolve(opts['playwright-module']));
 else playwright=await import('playwright');
 const target=opts.url?(opts.url.includes('://')?opts.url:pathToFileURL(path.resolve(opts.url)).href):pathToFileURL(path.join(root,'assets/lab/index.html')).href;
 const url=new URL(target);
 if(!['file:','http:','https:'].includes(url.protocol)||url.protocol!=='file:'&&!['localhost','127.0.0.1','[::1]'].includes(url.hostname))throw new Error('Local file/localhost URLs only; use a separate authorized harness for remote projects');
 const spec=JSON.parse(await fs.readFile(opts.spec||path.join(root,'assets/lab/checks.json'),'utf8'));
 browser=await playwright.chromium.launch({headless:true});
 report.environment={browser:browser.version(),headless:true,url:target,node:process.version};
 for(const test of spec.tests){
  const context=await browser.newContext({viewport:test.viewport||{width:1180,height:900},reducedMotion:test.reduced?'reduce':'no-preference',hasTouch:!!test.touch,isMobile:!!test.touch});
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  const result={name:test.name,status:'fail',checks:[]};report.tests.push(result);
  function check(name,ok,detail){result.checks.push({name,pass:!!ok,...(detail===undefined?{}:{detail})});}
  async function step(s){
   const el=s.selector?page.locator(s.selector):null;
   if(s.type==='click')await el.click({force:!!s.force});
   else if(s.type==='focus')await el.focus();
   else if(s.type==='hover'){await el.scrollIntoViewIfNeeded();const b=await el.boundingBox();await page.mouse.move(b.x+b.width*(s.x??.5),b.y+b.height*(s.y??.5));}
   else if(s.type==='key')await page.keyboard.press(s.key);
   else if(s.type==='keydown')await page.keyboard.down(s.key);
   else if(s.type==='keyup')await page.keyboard.up(s.key);
   else if(s.type==='down')await page.mouse.down();
   else if(s.type==='up')await page.mouse.up();
   else if(s.type==='move')await page.mouse.move(s.x,s.y);
   else if(s.type==='drag'){await el.scrollIntoViewIfNeeded();const b=await el.boundingBox();await page.mouse.move(b.x+b.width/2,b.y+b.height/2);await page.mouse.down();await page.mouse.move(b.x+b.width/2+(s.dx||0),b.y+b.height/2+(s.dy||0),{steps:4});if(s.release!==false)await page.mouse.up();}
   else if(s.type==='wait')await page.waitForTimeout(s.ms);
   else if(s.type==='scroll'){if(el)await el.evaluate((e,block)=>e.scrollIntoView({block:block||'center',behavior:'instant'}),s.block);else await page.evaluate(({top,left})=>scrollTo({top:top??scrollY,left:left??scrollX,behavior:'instant'}),s);}
   else if(s.type==='reduce'){await page.emulateMedia({reducedMotion:s.value?'reduce':'no-preference'});await page.waitForFunction(v=>matchMedia('(prefers-reduced-motion: reduce)').matches===v,s.value);await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));}
   else throw new Error('Unknown input step '+s.type);
  }
  async function assertions(list=[]){
   for(const a of list){const el=page.locator(a.selector);
    if(a.count!==undefined)check(a.selector+' count',await el.count()===a.count);
    else if(a.attr)check(a.selector+' '+a.attr,await el.getAttribute(a.attr)===String(a.value));
    else if(a.text!==undefined)check(a.selector+' text',(await el.textContent()).trim()===a.text);
    else if(a.hidden!==undefined)check(a.selector+' hidden',await el.evaluate(e=>e.hidden)===a.hidden);
    else if(a.inert!==undefined)check(a.selector+' inert',await el.evaluate(e=>e.inert)===a.inert);
    else if(a.focus)check(a.selector+' focus',await el.evaluate(e=>e===document.activeElement));
    else if(a.style){const actual=await el.evaluate((e,p)=>getComputedStyle(e)[p],a.style);check(a.selector+' '+a.style,a.value!==undefined?actual===String(a.value):Math.abs(parseFloat(actual)-a.number)<(a.tolerance??.02),actual);}
   }
  }
  try{
   await page.goto(target);if(spec.ready)await page.waitForSelector(spec.ready);
   await page.waitForTimeout(test.initialWait??500);
   for(const s of test.setup||[])await step(s);
   const probes=test.probes||[];
   const before=await page.evaluate(probes=>probes.map(p=>{const e=document.querySelector(p.selector);if(!e)throw new Error('Missing probe '+p.selector);const r=e.getBoundingClientRect(),s=getComputedStyle(e);return {x:r.x+scrollX,y:r.y+scrollY,w:r.width,h:r.height,value:s[p.property||'transform']};}),probes);
   await page.evaluate(selectors=>{window.__motionProbeNodes=selectors.map(s=>document.querySelector(s));},test.identity||[]);
   for(const s of test.steps||[])await step(s);
   await assertions(test.immediate);
   // Real rAF samples after input: instant endpoint changes alone do not count as animation.
   const samples=await page.evaluate(async ({probes,ms})=>{
    const data=[],start=performance.now();while(performance.now()-start<ms){await new Promise(requestAnimationFrame);data.push(probes.map(p=>{const e=document.querySelector(p.selector),r=e.getBoundingClientRect();return{x:r.x+scrollX,y:r.y+scrollY,w:r.width,h:r.height,value:getComputedStyle(e)[p.property||'transform']};}));}return data;
   },{probes,ms:test.sampleMs??240});
   probes.forEach((p,i)=>{
    const range=Math.max(...samples.map(s=>s[i][p.axis||'x']))-Math.min(...samples.map(s=>s[i][p.axis||'x']));
    const changed=p.axis?range>(p.epsilon??.1):new Set(samples.map(s=>s[i].value)).size>1;
    if(p.motion!==undefined)check(p.selector+' intermediate motion',changed===p.motion,{changed,range});
    if(p.stable){const delta=Math.max(...samples.map(s=>Math.max(Math.abs(s[i].x-before[i].x),Math.abs(s[i].y-before[i].y),Math.abs(s[i].w-before[i].w),Math.abs(s[i].h-before[i].h))));check(p.selector+' stable target',delta<.1,delta);}
   });
   result.sampleCount=samples.length;
   if(test.identity?.length)check('DOM identity retained',await page.evaluate(selectors=>selectors.every((s,i)=>document.querySelector(s)===window.__motionProbeNodes[i]),test.identity));
   for(const s of test.after||[])await step(s);
   await page.waitForTimeout(test.settle??650);await assertions(test.final);
   check('No page/runtime errors',errors.length===0,errors);
   result.status=result.checks.every(c=>c.pass)?'pass':'fail';
   if(opts.screenshots){await fs.mkdir(opts.screenshots,{recursive:true});await page.screenshot({path:path.join(opts.screenshots,test.name.replace(/[^a-z0-9-]/gi,'_')+'.png'),fullPage:true});}
  }catch(e){result.error=e.message;}finally{await context.close();}
 }
 report.status=report.tests.every(t=>t.status==='pass')?'pass':'fail';
 report.summary={passed:report.tests.filter(t=>t.status==='pass').length,total:report.tests.length,assertions:report.tests.reduce((n,t)=>n+t.checks.length,0)};
}catch(e){report.error=e.message;}finally{await browser?.close();await save();process.exitCode=report.status==='pass'?0:1;}

