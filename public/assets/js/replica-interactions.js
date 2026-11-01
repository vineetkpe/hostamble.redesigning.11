(function(){
  'use strict';
  document.querySelectorAll('.ace-pricing-area').forEach(section=>{
    const options=Array.from(section.querySelectorAll('.pricing-billing-duration .nav-link'));
    const cycles=['monthly','quarterly','semiannual','annual','yearly'];
    const apply=cycle=>{
      if(!cycles.includes(cycle))return;
      for(const button of options){
        const active=button.dataset.cycle===cycle;
        button.classList.toggle('active',active);
        button.setAttribute('aria-pressed',String(active));
      }
      for(const el of section.querySelectorAll('.monthly-pricing,.quarterly-pricing,.semiannual-pricing,.annual-pricing,.yearly-pricing')){
        const active=el.classList.contains(cycle+'-pricing');
        el.style.display=active?'block':'none';
      }
      for(const el of section.querySelectorAll('.free-domain')){
        // Source did not verify entitlement for annual plans. Avoid inventing it.
        el.style.display='none';
      }
      section.querySelector('[data-active-billing]')?.replaceChildren(document.createTextNode(cycle==='semiannual'?'Showing six-month totals':cycle==='yearly'?'Showing annual totals':'Showing '+cycle+' totals'));
    };
    for(const button of options){
      const cycle=(button.id||'').replace('-plan-btn','').replace('yearly','yearly');
      button.dataset.cycle=cycle;
      button.addEventListener('click',()=>apply(cycle));
    }
    if(options.length)apply(options.find(x=>x.classList.contains('active'))?.dataset.cycle||'monthly');
  });
})();
