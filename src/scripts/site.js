import {formatPrice, getValidFx} from '../lib/pricing.mjs';
const fx = (()=>{try{return JSON.parse(document.body.dataset.fx||'null');}catch{return null;}})();
const canUseUsd=Boolean(getValidFx(fx));
const billingLabels={monthly:'1 month',quarterly:'3 months',semiannual:'6 months',annual:'12 months'};
let currency='INR';
try {if(canUseUsd&&localStorage.getItem('hostamble-currency')==='USD')currency='USD';}catch{}
function setCycle(section,cycle,announce=true){
  const buttons=[...section.querySelectorAll('[data-cycle]')];
  if(!buttons.some(button=>button.dataset.cycle===cycle))return false;
  for(const button of buttons){
    const active=button.dataset.cycle===cycle;
    button.setAttribute('aria-pressed',String(active));
    button.classList.toggle('active',active);
  }
  renderPrices(announce);
  return true;
}
function renderPrices(announce=false){
  document.querySelectorAll('[data-pricing]').forEach(section=>{
    const active=section.querySelector('[data-cycle][aria-pressed="true"]')?.dataset.cycle||'monthly';
    const label=billingLabels[active]||'1 month';
    section.querySelectorAll('[data-price]').forEach(element=>{
      try{
        const prices=JSON.parse(element.dataset.prices||'{}');
        element.textContent=formatPrice(prices[active],currency,fx);
      }catch{}
    });
    section.querySelectorAll('[data-total-note]').forEach(element=>{
      element.textContent='Total due for '+label+' · billed in INR';
    });
    section.querySelectorAll('[data-currency-note]').forEach(element=>{
      element.textContent=currency==='USD'?'Approximate USD price. Checkout charged in INR. Review taxes and renewal terms before purchase.':'Totals shown in INR for the selected billing period. Review taxes and renewal terms before purchase.';
    });
    if(announce){
      const status=section.querySelector('[data-price-status]');
      if(status)status.textContent='Showing '+label+' totals in '+(currency==='USD'?'approximate US dollars':'Indian rupees')+'.';
    }
  });
  document.querySelectorAll('[data-currency]').forEach(button=>{
    button.disabled=button.dataset.currency==='USD'&&!canUseUsd;
    button.setAttribute('aria-pressed',String(button.dataset.currency===currency));
    if(button.disabled)button.title='USD estimates are unavailable until a recent verified exchange rate is supplied.';
  });
  document.querySelectorAll('[data-domain-money]').forEach(element=>{
    const paise=Number(element.dataset.domainMoney);
    try{element.textContent=formatPrice(paise,currency,fx);}catch{}
  });
  document.querySelectorAll('[data-domain-currency-note]').forEach(element=>{
    element.textContent=currency==='USD'?'Approximate USD price. Checkout charged in INR. Recheck live registration and renewal amounts.':'Prices shown in INR. Recheck live registration and renewal amounts.';
  });
}
document.querySelectorAll('[data-pricing]').forEach(section=>{
  section.querySelectorAll('[data-cycle]').forEach(button=>{
    button.addEventListener('click',()=>setCycle(section,button.dataset.cycle,true));
  });
  section.querySelectorAll('[data-select-semiannual]').forEach(button=>{
    button.addEventListener('click',()=>{
      if(!setCycle(section,'semiannual',true))return;
      const cards=section.querySelector('[data-plans]');
      if(cards){
        const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        cards.scrollIntoView({block:'start',behavior:reduced?'instant':'smooth'});
        cards.focus({preventScroll:true});
      }
    });
  });
});
const desiredCycle=new URLSearchParams(window.location.search).get('billing');
if(desiredCycle&&Object.hasOwn(billingLabels,desiredCycle)){
  document.querySelectorAll('[data-pricing]').forEach(section=>setCycle(section,desiredCycle,false));
}
document.querySelectorAll('[data-currency]').forEach(button=>button.addEventListener('click',()=>{
  if(button.dataset.currency==='USD'&&!canUseUsd)return;
  currency=button.dataset.currency==='USD'?'USD':'INR';
  try{localStorage.setItem('hostamble-currency',currency);}catch{}
  renderPrices(true);
}));
const motionPairs=[['[data-ribbon]','[data-ribbon-toggle]'],['[data-ticker]','[data-ticker-toggle]']];
for(const [containerSelector,controlSelector] of motionPairs){
  document.querySelectorAll(containerSelector).forEach(container=>{
    const button=container.querySelector(controlSelector);
    if(!button)return;
    button.addEventListener('click',()=>{
      const paused=container.classList.toggle('is-paused');
      button.textContent=paused?'Resume motion':'Pause motion';
      button.setAttribute('aria-label',paused?'Resume movement':'Pause movement');
      button.setAttribute('aria-pressed',String(paused));
    });
  });
}
document.querySelectorAll('.domain-ticker').forEach(ticker=>{
  const input=ticker.closest('.domain-section')?.querySelector('input[name="query"]');
  if(!input)return;
  ticker.querySelectorAll('button[data-extension]').forEach(button=>{
    button.addEventListener('click',()=>{
      const extension=button.dataset.extension;
      if(!/^[.][a-z]+$/.test(extension))return;
      const name=input.value.trim().replace(/\.(com|in|online|site)$/i,'');
      if(name)input.value=name+extension;
      else input.placeholder='yourname'+extension;
      input.focus();
    });
  });
});
document.querySelectorAll('.mobile-nav').forEach(menu=>{
  menu.addEventListener('keydown',event=>{
    if(event.key==='Escape'){
      menu.open=false;
      menu.querySelector('summary')?.focus();
    }
  });
  document.addEventListener('click',event=>{
    if(!menu.contains(event.target))menu.open=false;
  });
  menu.querySelectorAll('nav a').forEach(link=>link.addEventListener('click',()=>menu.open=false));
});
renderPrices();
