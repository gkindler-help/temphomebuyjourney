/* GA4 events for Key Takeaways (TL;DR) boxes. HTML-first; this only adds
   analytics, the content works without it. Fires on expand/collapse. */
(function(){
  function init(){
    var items=document.querySelectorAll('.tldr details');
    if(!items.length) return;
    items.forEach(function(d,i){
      d.addEventListener('toggle',function(){
        if(typeof gtag!=='function') return;
        var sum=d.querySelector('summary');
        gtag('event','tldr_toggle',{
          state: d.open ? 'open' : 'closed',
          takeaway_index: i+1,
          takeaway_label: sum ? sum.textContent.trim().slice(0,80) : '',
          page: location.pathname
        });
      });
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();
