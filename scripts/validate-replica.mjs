import assert from 'node:assert/strict';
import {readdirSync,statSync,readFileSync,existsSync} from 'node:fs';
import {resolve,join,relative} from 'node:path';
const root=resolve('dist');
function walk(dir){return readdirSync(dir).flatMap(n=>{const p=join(dir,n);return statSync(p).isDirectory()?walk(p):[p]});}
const paths=walk(root);
const expected=['index.html','shared-hosting.html','wordpress-hosting.html','domain-search.html','transfer-domain.html','about-us.html','contacts.html','legal-agreement.html','privacy-policy.html','refund-and-cancellation-policy.html','business-email.html','vps-server.html','login.html','register.html'];
const htmlFiles=paths.filter(p=>p.endsWith('.html'));
for (const name of expected){
 const p=htmlFiles.find(p=>p.endsWith('/'+name)||p.endsWith('/'+name+'/index.html'));
 assert(p,'Missing public route '+name);
 const s=readFileSync(p,'utf8');
 assert(s.includes('noindex'),'Staging noindex missing '+name);
 assert(s.includes('rel="canonical"'),'Canonical missing '+name);
 assert(s.includes('ace-header')&&s.includes('aceorbit-footer'),'Shared header/footer missing '+name);
 assert(s.includes('logo.png'),'Original Hostamble logo missing '+name);
 for(const m of s.matchAll(/(?:src|href)="(\/assets\/[^"?#]+)"/g)){
  const pathname=m[1];
  assert(existsSync(resolve(root,pathname.slice(1))),`Missing asset ${pathname} in ${name}`);
 }
}
for(const name of ['shared-hosting.html','wordpress-hosting.html','domain-search.html','transfer-domain.html','about-us.html','contacts.html','legal-agreement.html','privacy-policy.html','refund-and-cancellation-policy.html']){
 const s=readFileSync(htmlFiles.find(p=>p.endsWith('/'+name)),'utf8');
 assert(s.includes('ace-section-gap')||s.includes('ace-domain-area'),'Original inner-page sections missing '+name);
}
const home=readFileSync(resolve(root,'index.html'),'utf8');
assert(home.includes('ace-pricing-area')&&home.includes('aceorbit-service'),'Existing homepage sections missing');
assert(!home.includes('cdn.onesignal.com'),'Archived marketing push SDK should not load');
assert(!readFileSync(resolve('public/assets/js/main.js'),'utf8').includes('aceorbitJs.headerSticky();'),'Legacy header layout shift returned');
assert(readFileSync(resolve('public/assets/js/replica-interactions.js'),'utf8').includes('aria-pressed'),'Billing script missing accessibility state');
assert(readFileSync(resolve('src/pages/transfer-domain.html.astro'),'utf8').includes('domain="transfer"')||readFileSync(resolve('src/pages/transfer-domain.html.astro'),'utf8').includes('value="transfer"'),'Transfer form handoff missing');
console.log(`Verified ${expected.length} native Astro routes, original assets, layout, and interaction guards`);
