import catalog from '../data/pricing.json' with { type: 'json' };
export const cycles = catalog.billingCycles;
export function validatePricing(data=catalog){
 if(data.currency!=='INR')throw Error('Checkout must use INR');
 const ids=new Set();
 for(const p of data.sharedPlans){
  if(!p.id||ids.has(p.id))throw Error('Invalid or duplicate plan'); ids.add(p.id);
  if(!/^https:\/\/hostamble\.com\/dash\//.test(p.checkoutUrl))throw Error('Checkout URL invalid for '+p.id);
  for(const cycle of data.billingCycles){
   const v=p.pricesPaise[cycle.key]; if(v!==null&&(!Number.isSafeInteger(v)||v<0))throw Error('Invalid price for '+p.id);
  }
 }
 const tlds=new Set();for(const p of data.domainPrices){
  if(tlds.has(p.tld)||!p.tld.startsWith('.'))throw Error('Invalid domain extension');tlds.add(p.tld);
  for(const k of ['registrationPaise','renewalPaise'])if(!Number.isSafeInteger(p[k])||p[k]<0)throw Error('Invalid '+k+' for '+p.tld);
 }
 if(data.usdRate!==null&&(!Number.isFinite(data.usdRate)||data.usdRate<=0||!data.usdRateDate))throw Error('USD rate must be positive and dated');
 return true;
}
export const inr=v=>v===null?'Confirm at checkout':new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:2}).format(v/100);
export const priceAt=(plan,cycle)=>{if(!cycles.find(x=>x.key===cycle))throw Error('Invalid cycle');return plan.pricesPaise[cycle]};
export const approxUsd=(paise,data=catalog)=>paise!==null&&data.usdRate!==null&&data.usdRateDate?'$'+(paise/100/data.usdRate).toFixed(2):null;
validatePricing();export {catalog};
