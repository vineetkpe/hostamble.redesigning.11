import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { readFileSync, mkdirSync } from 'node:fs';

const base = 'http://127.0.0.1:4329';
const catalog = JSON.parse(readFileSync(new URL('../src/data/catalog.json', import.meta.url), 'utf8'));
const server = spawn('./node_modules/.bin/astro', ['preview', '--host', '127.0.0.1', '--port', '4329'], {stdio: ['ignore','pipe','pipe']});
let output = '';
server.stdout.on('data', chunk => { output += chunk.toString(); });
server.stderr.on('data', chunk => { output += chunk.toString(); });

async function ready() {
  for (let n = 0; n < 80; n++) {
    if (server.exitCode !== null) throw Error('Preview process exited:\n' + output);
    try {
      const response = await fetch(base + '/');
      if (response.ok) return;
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 180));
  }
  throw Error('Preview server failed to start:\n' + output);
}

const pages = ['/','/shared-hosting','/wordpress-hosting','/domains','/business-email','/vps','/support','/legal'];
let browser;
try {
  await ready();
  browser = await chromium.launch({
    executablePath: process.env.CHROME_BIN || '/usr/bin/google-chrome',
    headless: true,
    args: ['--no-sandbox','--disable-dev-shm-usage']
  });
  const page = await browser.newPage();
  page.on('pageerror', error => {throw error;});
  for (const width of [320,375,768,1024,1440]) {
    await page.setViewportSize({width,height:860});
    for(const path of pages) {
      const response = await page.goto(base + path, {waitUntil:'load'});
      assert.equal(response?.status(), 200, 'Broken route '+path);
      const metrics = await page.evaluate(() => ({
        document: document.documentElement.scrollWidth,
        viewport: window.innerWidth,
        pricingRegion: (()=>{const e=document.querySelector('.domain-price-section .domain-price-table'); const c=e?.closest('.container'); const section=e?.closest('section'); return e?{regionWidth:e.getBoundingClientRect().width,regionScrollWidth:e.scrollWidth,containerWidth:c?.getBoundingClientRect().width,sectionWidth:section?.getBoundingClientRect().width,sectionOverflow:getComputedStyle(section).overflowX}:null;})(),
        sectionImpact: Array.from(document.querySelectorAll('main section')).map(section => {
          const original=section.style.display;
          const before=document.documentElement.scrollWidth;
          section.style.display='none';
          const after=document.documentElement.scrollWidth;
          section.style.display=original;
          return {name:section.className,reduce:before-after,after};
        }).filter(x=>x.reduce>0).sort((a,b)=>b.reduce-a.reduce).slice(0,8),
        offenders: Array.from(document.querySelectorAll('body *')).map(el => {
          const r=el.getBoundingClientRect();
          return {tag:el.tagName.toLowerCase(),cls:typeof el.className==='string'?el.className.slice(0,80):'',left:Math.round(r.left),right:Math.round(r.right),width:Math.round(r.width)};
        }).filter(x => x.right > window.innerWidth+2 && x.left < window.innerWidth).sort((a,b)=>b.right-a.right).slice(0,15)
      }));
      assert(metrics.document <= metrics.viewport + 2,
        'Horizontal document overflow at '+width+'px on '+path+': '+JSON.stringify(metrics));
    }
  }
  await page.setViewportSize({width:1440,height:900});
  await page.goto(base + '/', {waitUntil:'load'});
  const offerButton=page.locator('[data-pricing="shared"] [data-select-semiannual]');
  await offerButton.click();
  assert.equal(await page.locator('[data-pricing="shared"] [data-cycle="semiannual"]').getAttribute('aria-pressed'),'true');
  for(const plan of catalog.hosting.shared.plans) {
    const value='₹'+(plan.pricingPaise.semiannual/100).toLocaleString('en-IN');
    assert((await page.locator('[data-pricing="shared"] [data-price]').allTextContents()).includes(value),
      'Missing six-month total '+value);
  }
  assert((await page.locator('[data-pricing="shared"] [data-total-note]').first().textContent()).includes('every 6 months'));
  await page.goto(base + '/shared-hosting?billing=semiannual#pricing',{waitUntil:'load'});
  assert.equal(await page.locator('[data-cycle="semiannual"]').getAttribute('aria-pressed'),'true','Deep-linked 6-month period not selected');
  await page.locator('[data-cycle="monthly"]').click();
  assert.equal(await page.locator('[data-cycle="monthly"]').getAttribute('aria-pressed'),'true','Manual billing change failed');

  await page.goto(base + '/', {waitUntil:'load'});
  const formDetails=await page.locator('form.domain-form').first().evaluate(form=>{
    const data = new FormData(form);
    return {method:form.method.toUpperCase(),action:form.action,hiddenA:data.get('a'),hiddenDomain:data.get('domain'),inputName:form.querySelector('input[name="query"]')?.name};
  });
  assert.equal(formDetails.method,'GET');
  assert.equal(formDetails.action,catalog.checkout.domainSearch);
  assert.equal(formDetails.hiddenA,'add');
  assert.equal(formDetails.hiddenDomain,'register');
  assert.equal(formDetails.inputName,'query');
  const cards=page.locator('.ticker-set:not([aria-hidden]) .domain-rate-card');
  assert.equal(await cards.count(),catalog.domains.length,'Accessible domain price cards do not match catalog');
  assert.equal(await page.locator('[data-domain-money]').count(),catalog.domains.length*4,'Missing first-year/renewal values or duplicate ribbon');
  const ticker=page.locator('[data-ticker]');
  await ticker.locator('[data-ticker-toggle]').click();
  assert(await ticker.evaluate(el=>el.classList.contains('is-paused')),'Ticker pause failed');
  await ticker.locator('[data-ticker-toggle]').click();
  assert(!(await ticker.evaluate(el=>el.classList.contains('is-paused'))),'Ticker resume failed');
  await page.locator('.faq-list summary').first().click();
  assert(await page.locator('.faq-list details').first().evaluate(el=>el.open),'FAQ did not open');
  const refund = page.locator('footer a[href="https://www.hostamble.com/refund-and-cancellation-policy"]');
  assert.equal(await refund.count(),1,'Verified refund link missing');

  await page.setViewportSize({width:375,height:800});
  await page.goto(base+'/',{waitUntil:'load'});
  const menu=page.locator('.mobile-nav');
  await menu.locator('summary').click();
  assert(await menu.evaluate(el=>el.open),'Mobile menu failed to open');
  await page.keyboard.press('Escape');
  assert(!(await menu.evaluate(el=>el.open)),'Escape failed to close mobile menu');
  await page.setViewportSize({width:1024,height:900});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto(base + '/', {waitUntil:'load'});
  assert.equal(await page.locator('.ticker-runner').evaluate(el=>getComputedStyle(el).animationName),'none','Reduced-motion ticker should not move');

  for (const path of pages) {
    const response=await fetch(base+path);
    assert.equal(response.status,200,'Broken internal route '+path);
  }
  mkdirSync('.browser-artifacts',{recursive:true});
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.setViewportSize({width:1440,height:900});
  await page.goto(base+'/',{waitUntil:'load'});
  await page.screenshot({path:'.browser-artifacts/home-desktop.png'});
  await page.setViewportSize({width:375,height:800});
  await page.screenshot({path:'.browser-artifacts/home-mobile.png'});
  console.log('Browser smoke passed: 8 routes × 5 viewports, pricing, domain handoff, FAQ, menu, links and reduced motion');
} finally {
  if (browser) await browser.close();
  server.kill('SIGTERM');
}
