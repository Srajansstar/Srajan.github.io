'use strict';
const $ = (s, root=document) => root.querySelector(s);
const escapeHTML = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const projects=window.PROJECTS;
function render(filter='All') {
 const list=projects.filter(p=>filter==='All'||p.category===filter);
 const grid=$('#projects');grid.classList.toggle('filtered',filter!=='All');
 grid.innerHTML=list.map(p=>`<article class="project-card ${p.featured?'featured':'supporting'}">${p.image?`<img class="project-image" src="${escapeHTML(p.image)}" alt="${escapeHTML(p.title)}" loading="lazy">`:''}<div class="project-meta"><span>${p.featured?'<span class="featured-label">Featured work</span> · ':''}${escapeHTML(p.category)}</span><span>${escapeHTML(p.year)}</span></div><h3>${escapeHTML(p.title)}</h3><p>${escapeHTML(p.text)}</p>${p.featured?`<div class="project-status">${escapeHTML(p.status)}</div>`:''}<button class="project-more" data-project="${escapeHTML(p.id)}" aria-label="Read more about ${escapeHTML(p.title)}">Read more <span>↗</span></button></article>`).join('');
 $('#filter-status').textContent=`Showing ${list.length} projects${filter==='All'?'':` in ${filter}`}.`;
}
render();
$('.filters').addEventListener('click',e=>{const b=e.target.closest('[data-filter]');if(!b)return;document.querySelectorAll('[data-filter]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b))});render(b.dataset.filter)});
const dialog=$('#project-dialog');
$('#projects').addEventListener('click',e=>{const button=e.target.closest('[data-project]');if(!button)return;const p=projects.find(x=>x.id===button.dataset.project);$('#dialog-body').innerHTML=`<p class="eyebrow">${escapeHTML(p.category)} / ${escapeHTML(p.status)}</p><h2 id="dialog-title">${escapeHTML(p.title)}</h2><p>${escapeHTML(p.detail)}</p><div class="tags">${p.tags.map(t=>`<span>${escapeHTML(t)}</span>`).join('')}</div>${p.url?`<a class="button" href="${escapeHTML(p.url)}" target="_blank" rel="noopener">Read the preprint ↗</a>`:`<a class="text-link" href="mailto:srajan22@iisertvm.ac.in?subject=${encodeURIComponent(p.title)}">Ask me about this project ↗</a>`}`;dialog.showModal();document.body.style.overflow='hidden'});
$('.close-dialog').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{const r=dialog.getBoundingClientRect();if(e.target===dialog&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))dialog.close()});
dialog.addEventListener('close',()=>document.body.style.overflow='');
const menu=$('.menu-button'),nav=$('#nav');
function closeMenu(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});
nav.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
$('#copy-email').addEventListener('click',async()=>{try{await navigator.clipboard.writeText('srajan22@iisertvm.ac.in');$('#copy-email').textContent='Copied ✓';$('#copy-status').textContent='Email copied to clipboard.';setTimeout(()=>$('#copy-email').textContent='Copy email',2200)}catch{$('#copy-email').textContent='srajan22@iisertvm.ac.in';$('#copy-status').textContent='Copy unavailable. Select the email address or use the email link.'}});
$('#year').textContent=new Date().getFullYear();

// Real artwork can be added through SKETCHES in content.js.
const sketches=window.SKETCHES||[];
$('#sketch-gallery').innerHTML=sketches.map((s,i)=>`<figure class="sketch-card">${s.image?`<a class="sketch-image-link" href="${escapeHTML(s.image)}" target="_blank" rel="noopener" aria-label="Open ${escapeHTML(s.title)}"><img src="${escapeHTML(s.image)}" alt="${escapeHTML(s.title)}" loading="lazy"></a>`:`<div class="sketch-placeholder" role="img" aria-label="Placeholder for a future sketch"><span aria-hidden="true">＋</span><p>Your sketch here</p></div>`}<figcaption><h3>${escapeHTML(s.title||'Untitled sketch')}</h3>${s.caption?`<p>${escapeHTML(s.caption)}</p>`:''}</figcaption></figure>`).join('');
