import { projects, services, process, contactConfig } from './content.js';
const header = document.querySelector('#header');
addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 30), { passive: true });
const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('#mobile-menu');
function setMenu(open) { menu.hidden = !open; toggle.setAttribute('aria-expanded', String(open)); toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu'); document.body.classList.toggle('menu-open', open); }
toggle.addEventListener('click', () => setMenu(menu.hidden));
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {setMenu(false); const target=document.querySelector(a.hash); if(target){target.setAttribute('tabindex','-1');target.focus({preventScroll:true});}}));
document.addEventListener('keydown', e => {if(e.key==='Tab'&&!menu.hidden){const items=[toggle,...menu.querySelectorAll('a')];const first=items[0],last=items.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
document.addEventListener('keydown', e => {if (e.key === 'Escape' && !menu.hidden) {setMenu(false);toggle.focus();}});
matchMedia('(min-width: 1061px)').addEventListener('change', e => {if(e.matches) setMenu(false);});
const hero = document.querySelector('#hero-video');
const motionButton = document.querySelector('#motion-toggle');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
hero.muted = true; hero.defaultMuted = true;
hero.addEventListener('volumechange', () => {if(!hero.muted) hero.muted=true;});
function syncMotion(){motionButton.textContent=hero.paused?'▷':'Ⅱ';motionButton.setAttribute('aria-label',hero.paused?'Reproduzir vídeo de fundo':'Pausar vídeo de fundo');}
hero.addEventListener('play', syncMotion);hero.addEventListener('pause', syncMotion);
function applyMotion(){if(reducedMotion.matches){hero.autoplay=false;hero.pause();}else{hero.autoplay=true;hero.play().catch(syncMotion);}syncMotion();}
applyMotion();reducedMotion.addEventListener('change',applyMotion);
motionButton.addEventListener('click',()=>{if(hero.paused)hero.play().catch(syncMotion);else hero.pause();});

const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
document.querySelector('#work-grid').innerHTML = projects.map(project=>{const media=project.id==='chronos'?\`<video class="project-preview-video" muted playsinline preload="auto" aria-label="${escapeHtml(project.alt)}"><source src="${escapeHtml(project.src)}#t=0.2" type="video/mp4"></video>\`:\`<img src="${escapeHtml(project.poster)}" alt="${escapeHtml(project.alt)}" width="960" height="640" loading="lazy" decoding="async">\`;return \`<article class="project-card reveal"><a class="project-media" href="${escapeHtml(project.src)}" data-project="${escapeHtml(project.id)}" aria-label="Assistir: ${escapeHtml(project.title)}">${media}<span class="project-tag">${escapeHtml(project.format)} / ${escapeHtml(project.duration)}</span><span class="project-play" aria-hidden="true">▷</span></a><div class="project-meta"><div><h3>${escapeHtml(project.title)}</h3><p>${escapeHtml(project.category)}</p></div><span>SYRAX</span></div></article>\`}).join('');
document.querySelectorAll('.project-preview-video').forEach(preview=>{const seek=()=>{try{if(preview.readyState>=2){preview.currentTime=Math.min(.2,Math.max(0,(preview.duration||1)-.05));}else{preview.addEventListener('loadeddata',seek,{once:true});}}catch{}};preview.addEventListener('seeked',()=>preview.pause(),{once:true});seek();});
const icons={film:'<rect x="3" y="5" width="24" height="20" rx="2"/><path d="M9 5v20M21 5v20M3 11h6m-6 8h6m12-8h6m-6 8h6"/>',phone:'<rect x="8" y="2" width="14" height="26" rx="3"/><path d="M13 6h4m-3 18h2"/>',box:'<path d="m15 2 12 7v14l-12 7-12-7V9L15 2Zm0 14L3 9m12 7L27 9m-12 7v14M9 5l12 7"/>',person:'<circle cx="15" cy="9" r="5"/><path d="M5 28v-4a10 10 0 0 1 20 0v4M2 2v6m0-6h6m20 0h-6m6 0v6"/>',wave:'<path d="M3 12v6m6-11v16m6-21v26m6-21v16m6-11v6"/>',layers:'<path d="m15 3 13 7-13 7-13-7 13-7ZM2 16l13 7 13-7M2 22l13 7 13-7"/>'};
document.querySelector('#services-grid').innerHTML=services.map((s,i)=>`<article class="service-card reveal"><div class="service-head"><svg viewBox="0 0 30 32" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[s.icon]}</svg><span>0${i+1}</span></div><h3>${escapeHtml(s.title)}</h3><p>${escapeHtml(s.description)}</p></article>`).join('');
document.querySelector('#process-grid').innerHTML=process.map(([title,description],i)=>`<article class="step reveal"><span class="step-number">0${i+1}</span><h3>${escapeHtml(title)}</h3><p>${escapeHtml(description)}</p></article>`).join('');

// The native dialog traps focus, closes with Escape and restores focus to its opener.
const dialog=document.querySelector('#project-dialog');
const player=document.querySelector('#project-video');
let resumeHero=false;
document.querySelectorAll('[data-project]').forEach(opener=>opener.addEventListener('click',event=>{
 const project=projects.find(p=>p.id===opener.dataset.project);if(!project)return;
 event.preventDefault();
 document.querySelector('#dialog-title').textContent=project.title;
 document.querySelector('#dialog-category').textContent=project.category;
 document.querySelector('#dialog-description').textContent=project.description;
 player.src=project.src;if(project.id==='chronos')player.removeAttribute('poster');else player.poster=project.poster;player.muted=true;player.defaultMuted=true;
 resumeHero=!hero.paused;hero.pause();dialog.showModal();document.body.classList.add('modal-open');
 player.play().catch(()=>{});
}));
document.querySelector('#close-dialog').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}});
dialog.addEventListener('close',()=>{player.pause();player.removeAttribute('src');player.load();document.body.classList.remove('modal-open');if(resumeHero&&!reducedMotion.matches)hero.play().catch(syncMotion);});
const comparison=document.querySelector('#comparison');
const compareRange=document.querySelector('#compare-range');
if(comparison&&compareRange)compareRange.addEventListener('input',event=>{const value=Number(event.target.value);comparison.style.setProperty('--split',`${value}%`);event.target.setAttribute('aria-valuetext',`${value}% referência, ${100-value}% resultado`);});

const revealObserver = new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.remove('reveal-pending');revealObserver.unobserve(entry.target);}}),{threshold:.08});
if(!reducedMotion.matches)document.querySelectorAll('.reveal').forEach(el=>{el.classList.add('reveal-pending');revealObserver.observe(el);});
const sectionObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){document.querySelectorAll('.desktop-nav a').forEach(a=>{if(a.hash===`#${entry.target.id}`)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}}),{rootMargin:'-20% 0px -55% 0px'});
document.querySelectorAll('main>section[id]').forEach(section=>sectionObserver.observe(section));

// Contact submission: WhatsApp or custom endpoint can override Netlify Forms later.
const form=document.querySelector('#contact-form');
const nameInput=document.querySelector('#name');
const contactInput=document.querySelector('#contact');
const ideaInput=document.querySelector('#idea');
const submit=document.querySelector('#submit-brief');
const result=document.querySelector('#form-result');
const feedback=document.querySelector('#form-feedback');
const download=document.querySelector('#download-brief');
let brief='';
const whatsapp=contactConfig.whatsappNumber?.replace(/\D/g,'');
const netlifyForm=form.hasAttribute('data-netlify');
if(contactConfig.instagramUrl){const a=document.createElement('a');a.href=contactConfig.instagramUrl;a.textContent='Instagram ↗';a.target='_blank';a.rel='noopener noreferrer';const placeholder=document.querySelector('#instagram-placeholder');if(placeholder)placeholder.replaceWith(a);}
if(whatsapp||contactConfig.endpoint||netlifyForm){
 submit.innerHTML=`${whatsapp?'Continuar no WhatsApp':'Enviar briefing'} <span aria-hidden="true">↗</span>`;
 document.querySelector('#form-note').innerHTML=whatsapp
  ? 'Você poderá revisar e enviar a mensagem no WhatsApp.'
  : 'Envie seu briefing diretamente para a SYRAX. Ao enviar, você declara ter lido a <a href="./privacidade.html">Política de Privacidade</a>.';
}
function validate(){nameInput.setCustomValidity(nameInput.value.trim().length>=2?'':'Informe seu nome.');ideaInput.setCustomValidity(ideaInput.value.trim().length>=10?'':'Conte um pouco mais sobre a ideia (pelo menos 10 caracteres).');const value=contactInput.value.trim();const digits=value.replace(/\D/g,'');const valid=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)||(/^[+\d\s().-]+$/.test(value)&&digits.length>=10&&digits.length<=15);contactInput.setCustomValidity(valid?'':'Informe um telefone com DDD (10 a 15 dígitos) ou um e-mail válido.');}
form.addEventListener('input',()=>{validate();result.hidden=true;brief='';});
submit.addEventListener('click',validate);
form.addEventListener('submit',async event=>{
 event.preventDefault();validate();if(!form.reportValidity())return;
 const data=Object.fromEntries(new FormData(form));Object.keys(data).forEach(k=>{if(typeof data[k]==='string')data[k]=data[k].trim();});
 brief=`BRIEFING — SYRAX VISUAL\n\nNome: ${data.name}\nEmpresa ou marca: ${data.company||'Não informada'}\nContato: ${data.contact}\nTipo de projeto: ${data.type}\n\nA IDEIA\n${data.idea}\n`;
 result.hidden=false;download.hidden=false;
 if(whatsapp){const url=new URL(`https://wa.me/${whatsapp}`);url.searchParams.set('text',brief);window.open(url,'_blank','noopener,noreferrer');feedback.textContent='Continue no WhatsApp para revisar e enviar a mensagem. Você também pode baixar seu briefing.';return;}
 submit.disabled=true;submit.setAttribute('aria-busy','true');
 if(contactConfig.endpoint){
  feedback.textContent='Enviando seu briefing…';
  try{const response=await fetch(contactConfig.endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});if(!response.ok)throw new Error('Submission failed');feedback.textContent='Briefing enviado. Obrigado por compartilhar sua ideia com a SYRAX.';form.reset();}
  catch{feedback.textContent='Não foi possível enviar agora. Seus dados continuam no formulário. Tente novamente ou baixe seu briefing.';}
  finally{submit.disabled=false;submit.removeAttribute('aria-busy');}
  return;
 }
 if(netlifyForm){
  feedback.textContent='Enviando seu briefing…';
  try{
   const payload=new URLSearchParams(new FormData(form));
   const response=await fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:payload.toString()});
   if(!response.ok)throw new Error('Submission failed');
   feedback.textContent='Briefing enviado. A SYRAX recebeu suas informações para contato.';
   form.reset();
  }catch{
   feedback.textContent='Não foi possível enviar agora. Seus dados continuam no formulário. Tente novamente ou baixe seu briefing.';
  }finally{
   submit.disabled=false;submit.removeAttribute('aria-busy');
  }
  return;
 }
 submit.disabled=false;submit.removeAttribute('aria-busy');
 feedback.textContent='Seu briefing está pronto para baixar. Ele ainda não foi enviado à SYRAX.';
});
download.addEventListener('click',()=>{if(!brief)return;const url=URL.createObjectURL(new Blob([brief],{type:'text/plain;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download='briefing-syrax-visual.txt';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
