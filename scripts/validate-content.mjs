import assert from 'node:assert/strict';
import {readFileSync,readdirSync,statSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {validatePricing,catalog,priceAt,inr} from '../src/lib/pricing.mjs';
validatePricing();
assert(catalog.sharedPlans.length===3);
assert(catalog.sharedPlans.every(p=>p.pricesPaise.monthly===null));
assert.equal(priceAt(catalog.sharedPlans[0],'semiannual'),null);
assert(inr(29900).includes('299'));
assert.equal(catalog.usdRate,null);
const dist=resolve('dist');
function files(dir){return readdirSync(dir).flatMap(n=>{const p=join(dir,n);return statSync(p).isDirectory()?files(p):[p]});}
const pages=files(dist).filter(p=>p.endsWith('.html'));
const expected=['index','shared-hosting.html','wordpress-hosting.html','domain-search.html','transfer-domain.html','about-us.html','contacts.html','legal-agreement.html','privacy-policy.html','refund-and-cancellation-policy.html','business-email.html','vps-server.html','login.html','register.html'];
const html=pages.map(p=>({p,s:readFileSync(p,'utf8')}));
for(const name of expected){
 const page=html.find(x=>x.p.endsWith('/'+name) || x.p.endsWith('/'+name+'/index.html') || name==='index'&&x.p.endsWith('/index.html'));
 assert(page,'Missing route '+name);
 assert(page.s.includes('noindex'),'Staging noindex missing '+name);
 assert(page.s.includes('<h1'),'H1 missing '+name);
 assert(page.s.includes('rel="canonical"'),'Canonical missing '+name);
}
const allPublic=html.map(x=>x.s).join('\n');
for(const forbidden of ['grows this July','Conatct Now','Get Start Now','Auto Indexing','BitNinja','Meet Our Team','Cloud Hosting','Our Latest News Feed','semi-managed support','javascript:void(Tawk_API']){
 assert(!allPublic.includes(forbidden),'Obsolete text exposed: '+forbidden);
}
assert(allPublic.includes('Get a free .us.cc domain with semiannual hosting.'));
assert(!allPublic.includes('₹59 /monthly'),'Old homepage price still exposed');
console.log('Validated '+expected.length+' public routes, staging metadata, content and pricing invariants');
