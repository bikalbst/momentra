/* A small, local-only interactive preview. No API keys, uploads or model calls. */
(() => {
  'use strict';
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const config=window.MOMENTRA_CONFIG||{};
  const samples={speed:{title:'Caught mid-apology',src:'assets/samples/speed.mp4',poster:'assets/samples/speed-poster.jpg'},clip003:{title:'Little man prize',src:'assets/samples/clip003.mp4',poster:'assets/samples/clip003-poster.jpg'},clip007:{title:'What is Hulk doing?',src:'assets/samples/clip007.mp4',poster:'assets/samples/clip007-poster.jpg'}};
  let calm=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches||false;
  try{if(localStorage.getItem('momentra-calm-mode')==='true')calm=true;}catch{}
  const hero=$('.hero-video'),studio=$('#studioVideo'),dialog=$('#sampleDialog'),player=$('#samplePlayer');
  let lastTrigger=null,toastTimer;
  const safeUrl=(value)=>{try{const u=new URL(value,location.href);return ['https:','http:'].includes(u.protocol)?u.href:null;}catch{return null;}};
  $$('[data-download]').forEach(a=>{const u=safeUrl(config.downloadUrl||'assets/downloads/Momentra-Source-Setup-v16.zip');if(u)a.href=u;});
  $$('[data-github]').forEach(a=>{const u=safeUrl(config.githubUrl||'https://github.com/bikalbst/momentra');if(u)a.href=u;});
  const toast=message=>{const box=$('#siteToast');box.textContent=message;box.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>box.hidden=true,3200);};
  function setCalm(value){calm=value;document.documentElement.classList.toggle('is-calm',value);const b=$('#calmMode');b.setAttribute('aria-pressed',String(value));$('span',b).textContent=value?'on':'off';if(value){hero.pause();studio.pause();$('#studioPlay').setAttribute('aria-label','Play the muted studio preview');}else if(!document.hidden&&!dialog.open)hero.play().catch(()=>{});}
  setCalm(calm);
  $('#calmMode').addEventListener('click',()=>{setCalm(!calm);try{localStorage.setItem('momentra-calm-mode',String(calm));}catch{};});
  const menu=$('.menu-toggle'),nav=$('#navigation');
  function closeNav(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation');}
  menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');});
  $$('a[href^="#"]').forEach(a=>a.addEventListener('click',closeNav));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeNav();});
  $('.wave-bars').innerHTML=Array.from({length:40},(_,i)=>`<i style="height:${7+Math.round((Math.sin(i*1.8)+1)*8+(i%4)*2)}px"></i>`).join('');
  function setTab(name,focus=false){
    $$('[data-studio-tab]').forEach(b=>{const selected=b.dataset.studioTab===name;b.setAttribute('aria-selected',String(selected));b.tabIndex=selected?0:-1;if(selected&&focus)b.focus();});
    $$('.studio-panel').forEach(p=>p.hidden=p.id!=='panel-'+name);
    $$('.desk-tool').forEach(b=>b.classList.toggle('active',b.dataset.studioStep===name||(!b.dataset.studioStep&&name==='find')));
  }
  $$('[data-studio-tab]').forEach(b=>{b.addEventListener('click',()=>setTab(b.dataset.studioTab));b.addEventListener('keydown',e=>{if(!['ArrowRight','ArrowLeft','Home','End'].includes(e.key))return;e.preventDefault();const tabs=$$('[data-studio-tab]'),index=tabs.indexOf(b);const next=e.key==='Home'?0:e.key==='End'?tabs.length-1:(index+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;setTab(tabs[next].dataset.studioTab,true);});});
  $$('[data-studio-step]').forEach(b=>b.addEventListener('click',()=>setTab(b.dataset.studioStep)));
  $('.desk-tool:not([data-studio-step])').addEventListener('click',()=>setTab('find'));
  $$('[data-caption]').forEach(b=>b.addEventListener('click',()=>{$$('[data-caption]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));$('#demoOutput').dataset.style=b.dataset.caption;}));
  $('#captionPosition').addEventListener('input',e=>{const n=Number(e.target.value);$('#demoCaption').style.top=n+'%';$('#captionPositionValue').textContent=n<40?'Up top':n<60?'In the middle':'Lower third';});
  $$('[data-selection]').forEach(b=>b.addEventListener('click',()=>{$$('[data-selection]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));const everyday=b.dataset.selection==='everyday';$('#selectionTitle').textContent=everyday?'The quiet gems belong here.':'Save room for the big reactions.';$('#selectionText').textContent=everyday?'Complete, watchable moments — even without a big reaction.':'A stricter selection with words and reaction signals.';}));
  function loadStudio(){if(!studio.getAttribute('src')){studio.src=studio.dataset.src;studio.load();}}
  async function playStudio(){loadStudio();try{if(studio.paused){await studio.play();$('#studioPlay').setAttribute('aria-label','Pause the muted studio preview');}else{studio.pause();$('#studioPlay').setAttribute('aria-label','Play the muted studio preview');}}catch{toast('The preview could not play. You can still explore the controls.');}}
  $('#studioPlay').addEventListener('click',playStudio);
  const previewButton=$('#previewClip');
  previewButton.addEventListener('click',async()=>{if(previewButton.disabled)return;previewButton.disabled=true;previewButton.setAttribute('aria-busy','true');previewButton.innerHTML='<span class="spinner" aria-hidden="true"></span> Making a little preview…';$('#clipPreviewStatus').textContent='Illustrative preview — no video is being processed.';await new Promise(r=>setTimeout(r,calm?80:900));if(studio.paused)await playStudio();previewButton.innerHTML='<svg class="icon"><use href="#i-check"/></svg> Preview ready';previewButton.removeAttribute('aria-busy');previewButton.disabled=false;$('#clipPreviewStatus').textContent='A little preview, ready. Try Style to make it yours.';});
  $$('[data-destination]').forEach(b=>b.addEventListener('click',()=>{const active=b.getAttribute('aria-pressed')==='true';b.setAttribute('aria-pressed',String(!active));const chosen=$$('[data-destination][aria-pressed="true"]').map(x=>x.dataset.destination);$('#destinationStatus').textContent=chosen.length?'Selected: '+chosen.join(' + '):'Choose a destination to preview.';}));
  $('#previewCheck').addEventListener('click',async e=>{const b=e.currentTarget;if(b.disabled)return;b.disabled=true;b.setAttribute('aria-busy','true');b.innerHTML='<span class="spinner" aria-hidden="true"></span> Checking the preview…';$('#checkStatus').textContent='Previewing the saved-export checklist…';await new Promise(r=>setTimeout(r,calm?80:1000));b.innerHTML='<svg class="icon"><use href="#i-check"/></svg> Ready for your review';b.disabled=false;b.removeAttribute('aria-busy');$('#checkStatus').textContent='Preview: finished render · vertical format · human review still needed. Nothing was uploaded.';});
  const chatButtons=$$('[data-chat]');
  chatButtons.forEach(b=>b.addEventListener('click',()=>{const active=b.getAttribute('aria-pressed')==='true';if(!active&&chatButtons.filter(x=>x.getAttribute('aria-pressed')==='true').length>=2){$('#chatStatus').textContent='Pick up to two chats. Deselect one to try another.';toast('Two chats, one stream. Deselect a chat to choose another.');return;}b.setAttribute('aria-pressed',String(!active));const selected=chatButtons.filter(x=>x.getAttribute('aria-pressed')==='true').map(x=>x.dataset.chat);$('#chatStatus').textContent=selected.length?'Preview: '+selected.join(' + ')+(selected.length===1?' · add another if you like':' · one video feed'):'Choose one or two chat sources.';}));
  $$('[data-manual]').forEach(b=>b.addEventListener('click',()=>{$$('[data-manual]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));$('#manualRange').style.left=b.dataset.manual==='60'?'3px':'49%';$('#manualStatus').textContent=`Preview: the last ${b.dataset.manual} seconds, ready to select.`;}));
  $('#tryFailover').addEventListener('click',async e=>{const b=e.currentTarget;if(b.disabled)return;b.disabled=true;const first=$('[data-provider-row="first"]'),second=$('[data-provider-row="second"]');first.classList.remove('ready');second.classList.remove('ready');$('.provider-state',first).innerHTML='<span class="spinner" aria-hidden="true"></span>';$('#failoverStatus').textContent='Preview: the primary service is unavailable…';await new Promise(r=>setTimeout(r,calm?80:850));$('.provider-state',first).textContent='Waiting';$('.provider-state',second).textContent='Trying…';await new Promise(r=>setTimeout(r,calm?80:650));second.classList.add('ready');$('.provider-state',second).textContent='Ready';$('#failoverStatus').textContent='Preview: a backup answers. Your primary profile stays saved. No real service was contacted.';b.disabled=false;});
  let journeyTimer;
  function replayJourney(){clearTimeout(journeyTimer);const steps=$$('.journey-step');steps.forEach((s,i)=>{s.classList.toggle('current',i===0);s.classList.remove('finished');});let index=0;function next(){steps[index].classList.remove('current');steps[index].classList.add('finished');index++;if(index<steps.length){steps[index].classList.add('current');if(index<steps.length-1)journeyTimer=setTimeout(next,calm?80:950);}}journeyTimer=setTimeout(next,calm?80:950);}
  $('#replayProgress').addEventListener('click',replayJourney);
  $$('[data-open-clip]').forEach(b=>b.addEventListener('click',()=>{const sample=samples[b.dataset.openClip];if(!sample)return;lastTrigger=b;hero.pause();studio.pause();$('#sampleDialogTitle').textContent=sample.title;player.src=sample.src;player.poster=sample.poster;player.muted=false;$('#samplePlaybackStatus').textContent='Loading your sample…';dialog.showModal();document.body.style.overflow='hidden';player.play().catch(()=>$('#samplePlaybackStatus').textContent='Press play in the video controls to watch this sample.');}));
  player.addEventListener('playing',()=>$('#samplePlaybackStatus').textContent='Use the video controls to play, pause or change volume.');
  player.addEventListener('error',()=>$('#samplePlaybackStatus').textContent='The sample could not load. Close this window and try again.');
  function closeSample(){if(dialog.open)dialog.close();}
  $('#closeSample').addEventListener('click',closeSample);
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeSample();}});
  dialog.addEventListener('close',()=>{player.pause();player.removeAttribute('src');player.load();document.body.style.overflow='';lastTrigger?.focus();if(!calm&&!document.hidden&&hero.getBoundingClientRect().bottom>0)hero.play().catch(()=>{});});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){hero.pause();studio.pause();player.pause();}else if(!calm&&!dialog.open&&hero.getBoundingClientRect().bottom>0)hero.play().catch(()=>{});});
  if('IntersectionObserver'in window){
    const reveal=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');reveal.unobserve(e.target);}}),{threshold:.12});$$('.reveal').forEach(el=>reveal.observe(el));
    const videos=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.target===hero){if(e.isIntersecting&&!calm&&!dialog.open&&!document.hidden)hero.play().catch(()=>{});else hero.pause();}else if(!e.isIntersecting)studio.pause();}),{threshold:.12});videos.observe(hero);videos.observe(studio);
    const sections=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)$$('#navigation a').forEach(a=>a.classList.toggle('active',a.hash==='#'+e.target.id));}),{rootMargin:'-20% 0px -60% 0px'});$$('section[id]').forEach(s=>sections.observe(s));
  }else{$$('.reveal').forEach(el=>el.classList.add('is-visible'));}
  let scrollTick=false;
  function scrollState(){const total=document.documentElement.scrollHeight-innerHeight;$('.scroll-progress').style.width=(total>0?scrollY/total*100:0)+'%';if(!calm&&scrollY<1000)$('.clip-stack').style.setProperty('--hero-drift',Math.min(30,scrollY*.04)+'px');scrollTick=false;}
  addEventListener('scroll',()=>{if(!scrollTick){scrollTick=true;requestAnimationFrame(scrollState);}},{passive:true});scrollState();
})();
