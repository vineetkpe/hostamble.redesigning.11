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

const productHtml=Object.fromEntries(productPages.map(path=>[path,readFileSync(resolve(dist,path),'utf8')]));
const siteScript=readFileSync(resolve('src/scripts/site.js'),'utf8');
const catalog=JSON.parse(readFileSync(resolve('src/data/catalog.json'),'utf8'));
assert(home.includes('Get a free .us.cc domain with semiannual hosting.'),'Offer banner text missing');
assert(home.includes('data-select-semiannual'),'Offer CTA missing');
assert(siteScript.includes("selectBillingCycle(section, 'semiannual', true)"),'Offer selector not wired');
assert(home.indexOf('pricing-offer-banner')<home.indexOf('class="plans-grid'),'Offer must appear above hosting cards');
assert(home.includes('name="query"') && home.includes('name="domain" value="register"') && home.includes('name="a" value="add"'),'Domain handoff fields missing');
for (const [path,html] of Object.entries(productHtml)) {
  assert(!html.includes('WHMCS'),'Technical billing language exposed in '+path);
}
for (const path of ['shared-hosting/index.html','wordpress-hosting/index.html']) {
  const html=productHtml[path];
  assert(html.includes('NVMe SSD') && html.includes('LiteSpeed') && html.includes('Imunify360'),'Hosting technology missing on '+path);
  assert(html.includes('Daily JetBackup') && html.includes('three days'),'Backup retention missing on '+path);
  assert(html.includes('cPanel-to-cPanel migration'),'Migration information missing on '+path);
}
for (const item of catalog.domains) {
  assert(home.includes('data-domain-money="'+item.registerPaise+'"'),'Missing registration card price for '+item.tld);
  assert(home.includes('data-domain-money="'+item.renewPaise+'"'),'Missing renewal card price for '+item.tld);
}
const support=readFileSync(resolve(dist,'support/index.html'),'utf8');
for(const label of ['Monday','Saturday','9 AM','8 PM','24/7','12 hours']){
  assert(support.includes(label),'Missing support availability detail '+label);
}
assert(home.includes('https://www.hostamble.com/refund-and-cancellation-policy'),'Verified refund link missing');
assert(!home.includes('href="https://www.hostamble.com/legal-agreement"'),'Unverified terms link exposed');
console.log('Offer, hosting, renewal-rate, support, migration and policy checks passed');
