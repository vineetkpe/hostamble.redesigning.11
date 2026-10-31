import {formatPrice, getValidFx, BILLING_CYCLES} from '../lib/pricing.mjs';

const body = document.body;
let fx = null;
try { fx = JSON.parse(body.dataset.fx || 'null'); } catch {}
const canUseUsd = Boolean(getValidFx(fx));
let currency = 'INR';
if (canUseUsd) {
  try { currency = localStorage.getItem('hostamble-currency') === 'USD' ? 'USD' : 'INR'; } catch {}
}
const periodText = {monthly:'monthly', quarterly:'quarterly',semiannual:'every 6 months',annual:'annually'};
function renderPrices(announce = false) {
  document.querySelectorAll('[data-pricing]').forEach(section => {
    const active = section.querySelector('[data-cycle][aria-pressed="true"]')?.dataset.cycle || 'monthly';
    section.querySelectorAll('[data-price]').forEach(node => {
      try { const prices=JSON.parse(node.dataset.prices || '{}'); node.textContent = formatPrice(prices[active],currency,fx); } catch {}
    });
    section.querySelectorAll('[data-price-period]').forEach(node => node.textContent = ' / ' + (BILLING_CYCLES[active] || 'month'));
    section.querySelectorAll('[data-total-note]').forEach(node => node.textContent = 'Billed ' + (periodText[active] || 'monthly') + ' in INR');
    section.querySelectorAll('[data-currency-note]').forEach(node => node.textContent = currency === 'USD' ? 'Approximate USD price. Checkout charged in INR. Taxes and final charges are confirmed there.' : 'Prices in INR. Final checkout price and applicable taxes are confirmed in WHMCS.');
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
document.querySelectorAll('[data-pricing]').forEach(section => {
  section.querySelectorAll('[data-cycle]').forEach(button => button.addEventListener('click',() => {
    section.querySelectorAll('[data-cycle]').forEach(b => {
      const selected = b === button;
      b.setAttribute('aria-pressed',String(selected));
      b.classList.toggle('active',selected);
    });
    renderPrices(true);
  }));
});
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
