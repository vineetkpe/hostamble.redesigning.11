import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {validateCatalog,formatINR,getValidFx,convertUSD,isAllowedCheckoutUrl,formatPrice} from '../src/lib/pricing.mjs';
const catalog = JSON.parse(readFileSync(new URL('../src/data/catalog.json', import.meta.url),'utf8'));
const copy = () => structuredClone(catalog);

test('catalog validates and every family has explicit billing-cycle totals', () => {
  assert.equal(validateCatalog(catalog),catalog);
  assert.equal(catalog.hosting.shared.plans[1].pricingPaise.semiannual,59400);
  assert.equal(catalog.hosting.wordpress.plans[2].pricingPaise.annual,116800);
});
test('duplicate plan IDs and unknown cycles are rejected', () => {
  const a = copy(); a.hosting.wordpress.plans[0].id='shared-basic';
  assert.throws(()=>validateCatalog(a),/Duplicate/);
  const b = copy(); b.hosting.shared.cycles.push('biannual');
  assert.throws(()=>validateCatalog(b),/Unknown/);
});
test('bad values or missing data are rejected', () => {
  const a=copy(); a.hosting.shared.plans[0].pricingPaise.monthly=-1;
  assert.throws(()=>validateCatalog(a),/Invalid/);
  const b=copy(); delete b.hosting.shared.plans[0].features;
  assert.throws(()=>validateCatalog(b),/Incomplete/);
});
test('checkout destinations cannot escape the allowlist', () => {
  assert.equal(isAllowedCheckoutUrl('https://hostamble.com/dash/clientarea.php'),true);
  assert.equal(isAllowedCheckoutUrl('https://hostamble.com.evil.tld/dash/cart.php'),false);
  const a=copy(); a.checkout.sharedStore='javascript:alert(1)';
  assert.throws(()=>validateCatalog(a),/Unsafe/);
});
test('currency conversion uses INR divided by INR/USD, not multiplied', () => {
  assert.equal(formatINR(81480),'₹814.80');
  assert.equal(convertUSD(9000,90),'$1.00');
  assert.equal(getValidFx({inrPerUsd:90,source:'test',observedOn:'2026-10-30',maxAgeDays:7},new Date('2026-11-02T00:00:00Z')),90);
  assert.equal(getValidFx({inrPerUsd:90,source:'test',observedOn:'2026-10-01',maxAgeDays:7},new Date('2026-11-02T00:00:00Z')),null);
  assert.equal(formatPrice(9000,'USD',catalog.fx),'₹90');
});
