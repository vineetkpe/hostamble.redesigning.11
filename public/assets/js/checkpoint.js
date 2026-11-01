/* Small keyboard repair for original mobile navigation. */
document.addEventListener('keydown',function(event){
 if(event.key!=='Escape')return;
 const menu=document.querySelector('.popup-mobile-menu.active');
 if(menu){menu.classList.remove('active');document.querySelector('.hamberger-button')?.focus();}
 const search=document.querySelector('.ace-search-popup.open');
 if(search){search.classList.remove('open');document.querySelector('.search-trigger')?.focus();}
});
