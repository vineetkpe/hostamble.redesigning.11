import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdirSync} from 'node:fs';
const base='http://127.0.0.1:4338';
const paths=['/','/shared-hosting.html','/wordpress-hosting.html','/domain-search.html','/transfer-domain.html','/about-us.html','/contacts.html','/legal-agreement.html','/privacy-policy.html','/refund-and-cancellation-policy.html','/business-email.html','/vps-server.html','/login.html','/register.html'];
const srv=spawn('./node_modules/.bin/astro',['preview','--host','127.0.0.1','--port','4338'],{stdio:['ignore','pipe','pipe']});
let log='';for(const stream of [srv.stdout,srv.stderr])stream.on('data',s=>log+=s.toString());
async function ready(){for(let i=0;i<100;i++){if(srv.exitCode!==null)throw Error('Server exited: '+log);try{if((await fetch(base+'/')).ok)return;}catch{}await new Promise(r=>setTimeout(r,160));}throw Error('Preview unavailable '+log);}
let browser;
try {
 await ready();
 browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',args:['--no-sandbox','--disable-dev-shm-usage']});
 const page=await browser.newPage();
 const broken=[];
 for(const width of [320,375,768,1024,1440]){
  await page.setViewportSize({width,height:850});
  for(const path of paths){
   const resp=await page.goto(base+path,{waitUntil:'domcontentloaded'});
   assert.equal(resp?.status(),200,'Route failed '+path);
   const state=await page.evaluate(()=>({width:innerWidth,htmlScroll:document.documentElement.scrollWidth,overflow:getComputedStyle(document.documentElement).overflowX,header:!!document.querySelector('.ace-header'),footer:!!document.querySelector('.aceorbit-footer-one')}));
   assert(state.header&&state.footer,'Missing theme chrome on '+path);
   assert(state.htmlScroll<=width+3||state.overflow==='clip','Overflow at '+width+'px on '+path+': '+JSON.stringify(state));
  }
 }
 await page.setViewportSize({width:1440,height:900});
 for(const path of paths){
  await page.goto(base+path,{waitUntil:'domcontentloaded'});
  const refs=await page.locator('header a[href],footer a[href]').evaluateAll(els=>els.map(x=>x.getAttribute('href')).filter(Boolean));
  for(const href of refs){
   assert(!href.startsWith('javascript:'),'Broken script link on '+path);
   if(href.startsWith('/')){
    const target=href.split('#')[0].split('?')[0]||'/';
    if(target.startsWith('/assets/'))continue;
    const r=await fetch(base+target);
    if(r.status!==200)broken.push(path+' → '+href+' = '+r.status);
   }
  }
 }
 assert.equal(broken.length,0,'Broken shared navigation: '+broken.slice(0,10).join('; '));
 await page.goto(base+'/shared-hosting.html',{waitUntil:'load'});
 const shared=page.locator('.ace-pricing-area');
 await shared.locator('#semiannual-plan-btn').click();
 assert.equal(await shared.locator('#semiannual-plan-btn').getAttribute('aria-pressed'),'true');
 assert(await shared.locator('.semiannual-pricing:visible').count()>0,'Six-month prices not visible');
 await shared.locator('#monthly-plan-btn').click();
 assert(await shared.locator('.monthly-pricing:visible').count()>0,'Monthly prices not restored');
 await page.goto(base+'/wordpress-hosting.html',{waitUntil:'load'});
 await page.locator('#yearly-plan-btn').click();
 assert(await page.locator('.yearly-pricing:visible').count()>0,'WordPress annual prices not displayed');
 await page.goto(base+'/domain-search.html',{waitUntil:'load'});
 const domain=page.locator('form.input-box').first();
 assert((await domain.getAttribute('action'))?.includes('hostamble.com/dash/cart.php'),'Domain search should hand off to WHMCS');
 const values=await domain.evaluate(form=>Object.fromEntries(new FormData(form)));
 assert.equal(values.a,'add');assert.equal(values.domain,'register');
 await page.goto(base+'/transfer-domain.html',{waitUntil:'load'});
 const transfer=page.locator('form.input-box').first();
 const transferValues=await transfer.evaluate(form=>Object.fromEntries(new FormData(form)));
 assert.equal(transferValues.domain,'transfer');
 await page.setViewportSize({width:375,height:850});
 await page.goto(base+'/',{waitUntil:'load'});
 await page.locator('.hamberger-button').click();
 assert(await page.locator('.popup-mobile-menu').evaluate(el=>el.classList.contains('active')),'Mobile menu did not open');
 await page.keyboard.press('Escape');
 assert(!(await page.locator('.popup-mobile-menu').evaluate(el=>el.classList.contains('active'))),'Mobile menu did not close');
 mkdirSync('.browser-artifacts',{recursive:true});
 for(const width of [375,1440]){
  await page.setViewportSize({width,height:900});
  for(const path of ['/','/shared-hosting.html','/wordpress-hosting.html','/domain-search.html','/about-us.html']){
   await page.goto(base+path,{waitUntil:'load'});
   await page.screenshot({path:'.browser-artifacts/'+(path==='/'?'home':path.slice(1).replace('.html',''))+'-'+width+'.png',fullPage:true});
  }
 }
 console.log('Browser checks passed: 14 routes, 5 widths, navigation, billing, domain/transfer forms and mobile menu');
} finally {if(browser)await browser.close();srv.kill('SIGTERM');}
