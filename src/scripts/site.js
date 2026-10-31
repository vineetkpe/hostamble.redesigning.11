import {formatPrice, getValidFx} from '../lib/pricing.mjs';

const body = document.body;
let fx = null;
try { fx = JSON.parse(body.dataset.fx || 'null'); } catch {}
const canUseUsd = Boolean(getValidFx(fx));
let currency = 'INR';
if (canUseUsd) {
  try { currency = localStorage.getItem('hostamble-currency') === 'USD' ? 'USD' : 'INR'; } catch {}
}
const periodText = {monthly:'monthly', quarterly:'every 3 months',semiannual:'every 6 months',annual:'annually'};
const periodLength = {monthly:'1 month',quarterly:'3 months',semiannual:'6 months',annual:'12 months'};
function renderPrices(announce = false) {
  document.querySelectorAll('[data-pricing]').forEach(section => {
    const active = section.querySelector('[data-cycle][aria-pressed="true"]')?.dataset.cycle || 'monthly';
    section.querySelectorAll('[data-price]').forEach(node => {
      try { const prices=JSON.parse(node.dataset.prices || '{}'); node.textContent = formatPrice(prices[active],currency,fx); } catch {}
    });
    section.querySelectorAll('[data-price-period]').forEach(node => node.textContent = ' total for ' + (periodLength[active] || '1 month'));
    section.querySelectorAll('[data-total-note]').forEach(node => node.textContent = 'Billed ' + (periodText[active] || 'monthly') + ' in INR');
    section.querySelectorAll('[data-currency-note]').forEach(node => node.textContent = currency === 'USD' ? 'Approximate USD price. Checkout charged in INR. Taxes and final charges are confirmed there.' : 'Prices in INR. Review the final total and taxes at checkout.');
    if (announce) {
      const status = section.querySelector('[data-price-status]');
      if (status) status.textContent = 'Showing ' + (periodText[active] || 'monthly') + ' prices in ' + (currency === 'USD' ? 'approximate US dollars; checkout in Indian rupees' : 'Indian rupees') + '.';
    }
  });
  document.querySelectorAll('[data-currency]').forEach(button => {
    button.disabled = button.dataset.currency === 'USD' && !canUseUsd;
    button.setAttribute('aria-pressed',String(button.dataset.currency === currency));
    if (button.disabled) button.title='USD estimates are unavailable until a current exchange rate is verified.';
  });
  document.querySelectorAll('[data-domain-money]').forEach(node => {
    const paise = Number(node.dataset.domainMoney);
    node.textContent = formatPrice(paise,currency,fx);
  });
  document.querySelectorAll('[data-domain-currency-note]').forEach(node => {
    node.textContent = currency === 'USD' ? 'Approximate USD price. Checkout charged in INR.' : 'Prices shown in INR. Confirm final prices during checkout.';
  });
}
function selectBillingCycle(section, cycle, announce = true) {
  const buttons = [...section.querySelectorAll('[data-cycle]')];
  if (!buttons.some(button => button.dataset.cycle === cycle)) return false;
  buttons.forEach(button => {
    const selected = button.dataset.cycle === cycle;
    button.setAttribute('aria-pressed', String(selected));
    button.classList.toggle('active', selected);
  });
  renderPrices(announce);
  return true;
}
document.querySelectorAll('[data-pricing]').forEach(section => {
  section.querySelectorAll('[data-cycle]').forEach(button => button.addEventListener('click',() => {
    selectBillingCycle(section, button.dataset.cycle, true);
  }));
  section.querySelectorAll('[data-select-semiannual]').forEach(button => button.addEventListener('click',() => {
    if (selectBillingCycle(section, 'semiannual', true)) {
      const option = section.querySelector('[data-cycle="semiannual"]');
      option?.focus({preventScroll: true});
      section.querySelector('.plans-grid')?.scrollIntoView({
        block: 'start',
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
      });
    }
  }));
});
const requestedPeriod = new URLSearchParams(window.location.search).get('billing');
if (requestedPeriod && Object.hasOwn(periodLength, requestedPeriod)) {
  document.querySelectorAll('[data-pricing]').forEach(section => selectBillingCycle(section, requestedPeriod, false));
}
document.querySelectorAll('[data-currency]').forEach(button => button.addEventListener('click',() => {
  if (button.dataset.currency === 'USD' && !canUseUsd) return;
  currency = button.dataset.currency;
  try { localStorage.setItem('hostamble-currency',currency); } catch {}
  renderPrices(true);
}));
for (const [containerSelector,buttonSelector] of [['[data-ribbon]','[data-ribbon-toggle]'],['[data-ticker]','[data-ticker-toggle]']]) {
  document.querySelectorAll(containerSelector).forEach(container => {
    const button = container.querySelector(buttonSelector);
    if (!button) return;
    button.addEventListener('click',() => {
      const paused=container.classList.toggle('is-paused');
      button.textContent=paused ? 'Resume motion' : 'Pause motion';
      button.setAttribute('aria-label',paused ? 'Resume animation' : 'Pause animation');
    });
  });
}
document.querySelectorAll('.mobile-nav').forEach(menu => {
  menu.addEventListener('keydown',event => {
    if (event.key === 'Escape') { menu.open=false; menu.querySelector('summary')?.focus(); }
  });
  document.addEventListener('click',event => {
    if (!menu.contains(event.target)) menu.open=false;
  });
});
renderPrices();
