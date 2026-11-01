import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import {readFileSync,mkdirSync} from 'node:fs';
const base='http://127.0.0.1:4338';
const pages=['/','/shared-hosting.html','/wordpress-hosting.html','/domain-search.html','/transfer-domain.html','/about-us.html','/contacts.html','/legal-agreement.html','/privacy-policy.html','/refund-and-cancellation-policy.html','/business-email.html','/vps-server.html','/login.html','/register.html'];
const catalog=JSON.parse(readFileSync('src/data/pricing.json','utf8'));
const server=spawn('./node_modules/.bin/astro',['preview','--host','127.0.0.1','--port','4338'],{stdio:['ignore','pipe','pipe']});
let log='';for(const stream of [server.stdout,server.stderr])stream.on('data',chunk=>log+=chunk.toString());
async function ready(){for(let i=0;i<100;i++){if(server.exitCode!==null)throw Error('Preview exited: '+log);try{if((await fetch(base+'/')).ok)return;}catch{}await new Promise(r=>setTimeout(r,160));}throw Error('Preview unavailable '+log);}
let browser;
try{
 await ready();
 browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',args:['--no-sandbox','--disable-dev-shm-usage']});
 const page=await browser.newPage();
 for(const width of [320,375,768,1024,1440]){
  await page.setViewportSize({width,height:850});
  for(const path of pages){
   const resp=await page.goto(base+path,{waitUntil:'domcontentloaded'});
   assert.equal(resp?.status(),200,`Route ${path} failed`);
   const state=await page.evaluate(()=>({h1:document.querySelectorAll('h1').length,scrollWidth:document.documentElement.scrollWidth,windowWidth:innerWidth,rootOverflow:getComputedStyle(document.documentElement).overflowX,offenders:[...document.querySelectorAll('body *')].map(el=>{const r=el.getBoundingClientRect();return {tag:el.tagName,cls:typeof el.className==='string'?el.className.slice(0,65):'',left:Math.round(r.left),right:Math.round(r.right),width:Math.round(r.width)}}).filter(el=>el.right>innerWidth+3&&el.left<innerWidth).sort((a,b)=>b.right-a.right).slice(0,12)}));
   assert.equal(state.h1,1,`${path} must have one H1`);
   assert(state.scrollWidth<=state.windowWidth+3||state.rootOverflow==='clip',`${path} horizontally overflows at ${width}: ${JSON.stringify(state)}`);
  }
 }
 await page.setViewportSize({width:1440,height:900});
 await page.goto(base+'/');
 const internal=new Set();
 for(const route of pages){
  await page.goto(base+route,{waitUntil:'domcontentloaded'});
  const targets=await page.evaluate(()=>({
   links:[...document.querySelectorAll('a[href]')].map(a=>({href:a.getAttribute('href'),nav:!!a.closest('header,footer,.popup-mobile-menu')})),
   forms:[...document.querySelectorAll('form')].map(f=>({action:f.getAttribute('action')||'',method:f.method}))
  }));
  for(const link of targets.links){
   if(link.nav) {
    assert(link.href!=='#' && !link.href?.startsWith('javascript:'),`Placeholder nav link ${route}: ${link.href}`);
    assert(!link.href?.startsWith('https://www.hostamble.com/'),`Nav links must stay on Astro: ${route}: ${link.href}`);
   }
   if(link.href?.startsWith('/')&&!link.href.startsWith('/assets/'))internal.add(link.href.split('#')[0]||'/');
  }
  for(const form of targets.forms){
   assert(form.action.startsWith('https://hostamble.com/dash/'),`Unsupported form action on ${route}: ${form.action}`);
   assert.equal(form.method.toUpperCase(),'GET',`Unexpected form submission method on ${route}`);
  }
 }
 for(const url of internal){
  const response=await fetch(base+url);assert.equal(response.status,200,`Broken internal link ${url}`);
 }
 await page.goto(base+'/');
 const cycles=page.locator('[data-billing-cycle]');assert.equal(await cycles.count(),4);
 await page.locator('[data-billing-cycle="semiannual"]').click();
 assert.equal(await page.locator('[data-billing-cycle="semiannual"]').getAttribute('aria-pressed'),'true');
 const pricingTexts=await page.locator('[data-hosting-price]').allTextContents();
 assert(pricingTexts.length===catalog.sharedPlans.length);
 assert(pricingTexts.every(t=>t.includes('Confirm at checkout')),'Unverified pricing exposed');
 const domain=page.locator('form[role="search"]').first();
 assert((await domain.getAttribute('action')).includes('/dash/cart.php'));
 const fields=await domain.evaluate(form=>Object.fromEntries(new FormData(form)));
 assert.equal(fields.a,'add');assert.equal(fields.domain,'register');
 await page.goto(base+'/transfer-domain.html');
 assert.equal(await page.locator('form[role="search"] input[name="domain"]').getAttribute('value'),'transfer');
 await page.goto(base+'/shared-hosting.html');
 const faq=page.locator('details').first();await faq.locator('summary').click();assert(await faq.evaluate(el=>el.open));
 await page.goto(base+'/');
 await page.setViewportSize({width:375,height:820});
 const menu=page.locator('.popup-mobile-menu');
 const toggle=page.locator('.hamberger-button');
 await toggle.click();
 assert(await menu.evaluate(el=>el.classList.contains('active')),'Mobile menu open failed');
 await page.keyboard.press('Escape');
 assert(!(await menu.evaluate(el=>el.classList.contains('active'))),'Mobile menu Esc close failed');
 await page.emulateMedia({reducedMotion:'reduce'});
 mkdirSync('.browser-artifacts',{recursive:true});
 for(const viewport of [375,1440]){
  await page.setViewportSize({width:viewport,height:900});
  await page.emulateMedia({reducedMotion:'no-preference'});
  for(const route of ['/','/shared-hosting.html','/wordpress-hosting.html']){
   await page.goto(base+route,{waitUntil:'load'});
   await page.screenshot({path:'.browser-artifacts/'+(route==='/'?'home':route.slice(1).replace('.html',''))+'-'+viewport+'.png',fullPage:true});
  }
 }
 console.log(`Browser smoke passed: ${pages.length} routes, five viewports, navigation, mobile menu, FAQs, billing selection and domain form`);
} finally {if(browser)await browser.close();server.kill('SIGTERM');}
