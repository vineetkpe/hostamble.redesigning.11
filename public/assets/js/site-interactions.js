(function(){
 const cycleNames={monthly:'Monthly billing · total due',quarterly:'Quarterly billing · total due',semiannual:'Six-month billing · total due',annual:'Annual billing · total due'};
 document.querySelectorAll('[data-hosting-pricing]').forEach(section=>{
  function select(cycle){
   if(!Object.hasOwn(cycleNames,cycle))return;
   section.querySelectorAll('[data-billing-cycle]').forEach(button=>{
    const active=button.dataset.billingCycle===cycle;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));
   });
   section.querySelectorAll('[data-hosting-price]').forEach(node=>{
    try{const prices=JSON.parse(node.dataset.prices||'{}');const value=prices[cycle];node.textContent=value===null?'Confirm at checkout':new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR'}).format(value/100);}catch{node.textContent='Confirm at checkout';}
   });
   section.querySelectorAll('[data-pricing-period]').forEach(node=>node.textContent=cycleNames[cycle]);
  }
  section.querySelectorAll('[data-billing-cycle]').forEach(button=>button.addEventListener('click',()=>select(button.dataset.billingCycle)));
  const query=new URLSearchParams(location.search).get('billing');select(Object.hasOwn(cycleNames,query)?query:'monthly');
 });
})();
