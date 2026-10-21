/* Intro scene: scroll drives the logo fade-out and headline fade-in; the header ([data-reveal-nav]) slides in once the intro is passed. */
(function(){
  var scene=document.querySelector('[data-intro]'), nav=document.querySelector('[data-reveal-nav]');
  if(!scene){ if(nav) nav.classList.add('show'); return; }
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var photo=scene.querySelector('.intro-photo'), logo=scene.querySelector('.intro-logo'), shade=scene.querySelector('.intro-shade'), arrow=scene.querySelector('.intro-arrow');
  var items=[].slice.call(scene.querySelectorAll('.ifade'));
  function clamp(x){return x<0?0:x>1?1:x;}
  function render(){
    var r=scene.getBoundingClientRect(), span=scene.offsetHeight-window.innerHeight;
    var p=reduce?1:clamp(-r.top/(span*0.8));
    if(!reduce){
      if(photo) photo.style.opacity=(1-0.08*p).toFixed(3);
      if(logo){ var l=clamp(p/0.28); logo.style.opacity=(1-l).toFixed(3); logo.style.transform='translateY('+(-20*l).toFixed(1)+'px)'; }
      if(shade) shade.style.opacity=clamp(p*1.4).toFixed(3);
      if(arrow){ arrow.style.opacity=(1-clamp(p*4)).toFixed(3); arrow.style.pointerEvents=p>0.2?'none':''; }
      items.forEach(function(el,i){ var q=clamp((p-(0.3+i*0.1))/0.3); el.style.opacity=q.toFixed(3); el.style.transform='translateY('+(14*(1-q)).toFixed(1)+'px)'; });
    }
    var past=r.bottom<=window.innerHeight*1.02;
    document.documentElement.classList.toggle('intro-active', !past && !reduce);
    if(nav) nav.classList.toggle('show', reduce || past || nav.contains(document.activeElement));
  }
  var ticking=false;
  function onScroll(){ if(!ticking){ ticking=true; requestAnimationFrame(function(){ ticking=false; render(); }); } }
  window.addEventListener('scroll',onScroll,{passive:true}); window.addEventListener('resize',onScroll);
  if(nav) nav.addEventListener('focusin',function(){ nav.classList.add('show'); });
  render();
})();
