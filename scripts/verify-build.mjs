import {readFileSync, existsSync, readdirSync} from 'node:fs';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
const dist=resolve('dist');
const required=['index.html','shared-hosting/index.html','wordpress-hosting/index.html','domains/index.html','business-email/index.html','vps/index.html','404.html','robots.txt','sitemap.xml','_redirects','_headers'];
for(const path of required) assert(existsSync(resolve(dist,path)), 'Build output is missing '+path);
const home=readFileSync(resolve(dist,'index.html'),'utf8');
assert(home.includes('noindex,nofollow'),'Preview must not be crawlable');
assert(home.includes('hostamble.com/dash/cart.php'),'Domain search must hand off to WHMCS');
assert(home.includes('data-price'),'Pricing controls missing');
assert(home.includes('name="query"'),'Domain form query name missing');
const robots=readFileSync(resolve(dist,'robots.txt'),'utf8');
assert(robots.includes('Disallow: /'),'Preview must disallow all bots');
const sitemap=readFileSync(resolve(dist,'sitemap.xml'),'utf8');
assert(!sitemap.includes('<url>'),'Preview sitemap must be empty');

/**
 * Editorial layout contract: section count is measured from rendered HTML, not
 * JSX source or empty decorative wrappers. Shared Astro components count too.
 * This protects the multi-section product experience from future regressions.
 */
function countSections(page) {
  const html = readFileSync(resolve(dist, page), 'utf8');
  return (html.match(/<section\b/gi) ?? []).length;
}
const minProductSections = 6;
const productPages = [
  'shared-hosting/index.html',
  'wordpress-hosting/index.html',
  'domains/index.html',
  'business-email/index.html',
  'vps/index.html',
];
const homeCount = countSections('index.html');
assert(homeCount >= 8 && homeCount <= 10, 'Homepage must contain 8–10 real sections; found ' + homeCount);
for (const page of productPages) {
  const total = countSections(page);
  assert(total >= minProductSections, page + ' must contain at least ' + minProductSections + ' sections, found ' + total);
  console.log(page + ': ' + total + ' sections');
}
console.log('Homepage: ' + homeCount + ' sections');

console.log('Static assets, section counts and preview protections passed');


for(const p of ['index.html','shared-hosting/index.html','wordpress-hosting/index.html','domains/index.html','business-email/index.html','vps/index.html']){
  const html=readFileSync(resolve(dist,p),'utf8');
  assert(html.includes('/brand/open-waypoint.svg'),'Approved header logo missing: '+p);
  assert(html.includes('/brand/open-waypoint-inverse.svg'),'Approved footer logo missing: '+p);
  assert(!html.includes('BitNinja'),'Discontinued security product in '+p);
  assert(!html.includes('data-price-period'),'Outdated ambiguous pricing period in '+p);
}
assert(home.includes('Get a free'),'Confirmed offer text absent');
assert(home.includes('.us.cc'),'Offer TLD must be consistent');
assert(home.includes('data-select-semiannual'),'Semiannual selection action missing');
assert(home.includes('data-extension=".com"'),'Selectable domain price cards missing');
assert(home.includes('data-domain-money'),'Domain prices must be catalog-derived');
assert(home.indexOf('id="solutions"')<home.indexOf('id="domain-search"'),'Discovery must precede domain search');
assert(home.indexOf('class="pricing-promo"')<home.indexOf('data-plans'),'Offer must appear above plan cards');
assert(home.includes('name="a" value="add"')&&home.includes('name="domain" value="register"'),'Domain search hidden fields missing');
assert(home.includes('Imunify360')&&home.includes('LiteSpeed')&&home.includes('JetBackup'),'Hosting proof missing');
const siteScript=readFileSync(resolve('src/scripts/site.js'),'utf8');
assert(siteScript.includes("setCycle(section,'semiannual'"),'Offer-to-semiannual handler missing');
const sheet=readFileSync(resolve('src/styles/global.css'),'utf8');
for(const token of ['#F7F5F0','#20211F','#A84223','#EDE9E1']){
  assert(sheet.includes(token),'Approved palette token missing: '+token);
}
assert(!sheet.includes('#bdfb76')&&!sheet.includes('#071c2d'),'Deprecated lime/navy design tokens found');
console.log('Brand, offer order, domain handoff and approved features verified');
