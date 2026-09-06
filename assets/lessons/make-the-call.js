/* Lessons From a Sale — "Make the Call" interactive engine.
   Reusable across all series entries. Each entry provides a DEAL_DECISIONS
   array; this renders a perspective-reveal module (no scoring, no right/wrong).
   The full article below the module is the source of truth for crawlers. */
(function(){
  function el(tag, cls, html){ var e=document.createElement(tag); if(cls)e.className=cls; if(html!=null)e.innerHTML=html; return e; }

  function renderModule(root, data){
    var state = { idx:0, choices:[] };
    var total = data.length;

    var wrap = el('div','mtc-wrap');
    var head = el('div','mtc-head',
      '<div class="mtc-eyebrow">Make the Call</div>'+
      '<div class="mtc-sub">Step into the agent\u2019s seat. At each decision, choose what you\u2019d do \u2014 then see what I actually did and why. There\u2019s no score and no wrong answer; it\u2019s how the judgment gets made.</div>');
    wrap.appendChild(head);

    var progress = el('div','mtc-progress');
    wrap.appendChild(progress);

    var stage = el('div','mtc-stage');
    wrap.appendChild(stage);

    function drawProgress(){
      progress.innerHTML='';
      for(var i=0;i<total;i++){
        var dot=el('span','mtc-dot'+(i<state.idx?' done':i===state.idx?' active':''));
        progress.appendChild(dot);
      }
      progress.appendChild(el('span','mtc-count',' Decision '+Math.min(state.idx+1,total)+' of '+total));
    }

    function drawDecision(){
      var d = data[state.idx];
      stage.innerHTML='';
      var card = el('div','mtc-card');
      card.appendChild(el('div','mtc-label','Decision '+(state.idx+1)+' \u2014 '+d.label));
      card.appendChild(el('div','mtc-prompt', d.prompt));
      var opts = el('div','mtc-opts');
      d.options.forEach(function(opt, oi){
        var b = el('button','mtc-opt', opt);
        b.type='button';
        b.addEventListener('click', function(){ choose(oi, d); });
        opts.appendChild(b);
      });
      card.appendChild(opts);
      stage.appendChild(card);
      drawProgress();
    }

    function choose(oi, d){
      state.choices[state.idx]=oi;
      // disable + mark selection, then show reveal
      var buttons = stage.querySelectorAll('.mtc-opt');
      buttons.forEach(function(b,bi){ b.disabled=true; if(bi===oi) b.classList.add('picked'); });
      var reveal = el('div','mtc-reveal');
      reveal.appendChild(el('div','mtc-reveal-hd','What I did'));
      reveal.appendChild(el('div','mtc-reveal-body', d.reveal));
      var next = el('button','mtc-next', state.idx < total-1 ? 'Next decision \u2192' : 'See how it closed \u2192');
      next.type='button';
      next.addEventListener('click', function(){
        if(state.idx < total-1){ state.idx++; drawDecision(); scrollTop(); }
        else { finish(); }
      });
      reveal.appendChild(next);
      stage.querySelector('.mtc-card').appendChild(reveal);
      // smooth reveal
      requestAnimationFrame(function(){ reveal.classList.add('show'); });
    }

    function finish(){
      stage.innerHTML='';
      var done = el('div','mtc-done');
      done.appendChild(el('div','mtc-done-hd','That\u2019s how the calls got made.'));
      done.appendChild(el('div','mtc-done-body', data.closing || 'Read the full breakdown below \u2014 the numbers, the timeline, and the lessons from this sale.'));
      var a = el('a','mtc-done-cta','Read the full story \u2193');
      a.href='#full-story';
      done.appendChild(a);
      var restart = el('button','mtc-restart','\u21ba Start over');
      restart.type='button';
      restart.addEventListener('click', function(){ state.idx=0; state.choices=[]; drawDecision(); scrollTop(); });
      done.appendChild(restart);
      stage.appendChild(done);
      progress.innerHTML='';
    }

    function scrollTop(){ try{ wrap.scrollIntoView({behavior:'smooth',block:'start'}); }catch(e){} }

    root.appendChild(wrap);
    drawDecision();
  }

  window.LessonsMakeTheCall = function(mountId, data){
    var root = document.getElementById(mountId);
    if(!root || !data || !data.length) return;
    renderModule(root, data);
  };
})();
