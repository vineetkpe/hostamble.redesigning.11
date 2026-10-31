export const BILLING_CYCLES = Object.freeze({
  monthly: 'month',
  quarterly: '3 months',
  semiannual: '6 months',
  annual: 'year'
});

const ALLOWED_HOST = new Set(['hostamble.com', 'www.hostamble.com']);
const REQUIRED_LINKS = ['login', 'register', 'sharedStore', 'wordpressStore', 'domainSearch', 'domainTransfer', 'domainPrices'];

export function isAllowedCheckoutUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' && ALLOWED_HOST.has(parsed.hostname) &&
      parsed.pathname.startsWith('/dash/') && !parsed.username && !parsed.password;
  } catch { return false; }
}

export function validateCatalog(data) {
  if (!data || data.currency !== 'INR' || !data.hosting || !data.checkout || !Array.isArray(data.domains)) throw new Error('Required catalog fields are missing');
  for (const key of REQUIRED_LINKS) {
    if (!isAllowedCheckoutUrl(data.checkout[key])) throw new Error('Unsafe or missing checkout destination: ' + key);
  }
  const ids = new Set();
  for (const family of ['shared', 'wordpress']) {
    const collection = data.hosting[family];
    if (!collection || !Array.isArray(collection.plans) || !collection.plans.length || !Array.isArray(collection.cycles) || !collection.cycles.length) throw new Error('Missing hosting family: ' + family);
    if (new Set(collection.cycles).size !== collection.cycles.length || collection.cycles.some(c => !(c in BILLING_CYCLES))) throw new Error('Unknown or duplicate billing cycle');
    for (const plan of collection.plans) {
      if (!plan?.id || !plan.name || !plan.description || !Array.isArray(plan.features) || !plan.features.length || !plan.pricingPaise) throw new Error('Incomplete plan');
      if (ids.has(plan.id)) throw new Error('Duplicate ID: ' + plan.id);
      ids.add(plan.id);
      const prices = Object.keys(plan.pricingPaise);
      if (prices.length !== collection.cycles.length || prices.some(c => !collection.cycles.includes(c))) throw new Error('Unknown/missing cycle for ' + plan.id);
      for (const cycle of collection.cycles) {
        const amount = plan.pricingPaise[cycle];
        if (!Number.isSafeInteger(amount) || amount <= 0) throw new Error('Invalid price for ' + plan.id + ':' + cycle);
      }
    }
  }
  for (const domain of data.domains) {
    if (!domain.id || !/^[.][a-z]+$/.test(domain.tld) || ids.has(domain.id)) throw new Error('Invalid/duplicate domain ID');
    ids.add(domain.id);
    for (const key of ['registerPaise','renewPaise']) {
      if (!Number.isSafeInteger(domain[key]) || domain[key] <= 0) throw new Error('Invalid domain price');
    }
  }
  return data;
}

export function formatINR(paise) {
  if (!Number.isSafeInteger(paise) || paise < 0) throw new Error('Invalid price');
  return '₹' + (paise / 100).toLocaleString('en-IN', {minimumFractionDigits: paise % 100 ? 2 : 0, maximumFractionDigits: 2});
}

export function getValidFx(fx, now = new Date()) {
  if (!fx || typeof fx.inrPerUsd !== 'number' || !Number.isFinite(fx.inrPerUsd) || fx.inrPerUsd <= 0 || !fx.source || !fx.observedOn) return null;
  const date = new Date(fx.observedOn + 'T00:00:00Z');
  const age = (now.getTime() - date.getTime()) / 86400000;
  if (Number.isNaN(date.getTime()) || age < 0 || age > (fx.maxAgeDays ?? 7)) return null;
  return fx.inrPerUsd;
}

export function convertUSD(paise, rate) {
  if (!Number.isSafeInteger(paise) || paise < 0 || typeof rate !== 'number' || !Number.isFinite(rate) || rate <= 0) throw new Error('Invalid conversion');
  return '$' + ((paise / 100) / rate).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
}

export function formatPrice(paise, currency, fx, now = new Date()) {
  const rate = getValidFx(fx, now);
  return currency === 'USD' && rate ? convertUSD(paise, rate) : formatINR(paise);
}
