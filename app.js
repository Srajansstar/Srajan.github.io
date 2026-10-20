'use strict';
const $ = (s, root=document) => root.querySelector(s);
const escapeHTML = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const projects = window.PROJECTS || [];

function render(filter='All') {
  const list = projects.filter(p => filter === 'All' || p.category === filter);
  const grid = $('#projects');
  grid.classList.toggle('filtered', filter !== 'All');

  const featured = list.filter(p => p.featured);
  const supporting = list.filter(p => !p.featured);

  const renderCard = (p) => {
    const isOngoing = p.tags.some(t => t.toLowerCase() === 'ongoing');
    return `
      <article class="project-card ${p.featured ? 'featured' : 'supporting'} ${isOngoing ? 'is-ongoing' : ''}" data-id="${escapeHTML(p.id)}">
        <div class="project-meta">
          <span>${p.featured ? '<span class="featured-label">Featured work</span> · ' : ''}${isOngoing ? '<span class="ongoing-badge">Ongoing</span> · ' : ''}${escapeHTML(p.category)}</span>
          <span>${escapeHTML(p.year)}</span>
        </div>
        <h3>${escapeHTML(p.title)}</h3>
        <p>${escapeHTML(p.text)}</p>
        <div class="project-tag-list">
          ${p.tags.slice(0, 3).map(t => `<span class="project-tag ${t.toLowerCase() === 'ongoing' ? 'tag-ongoing' : ''}">${escapeHTML(t)}</span>`).join('')}
        </div>
        <div class="project-card-footer">
          <button class="project-more" data-project="${escapeHTML(p.id)}" aria-label="Read more about ${escapeHTML(p.title)}">Details <span>↗</span></button>
          <div class="project-links">
            ${p.url ? `<a class="project-link" href="${escapeHTML(p.url)}" target="_blank" rel="noopener" aria-label="Read paper for ${escapeHTML(p.title)}">Paper ↗</a>` : ''}
            ${p.github ? `<a class="project-link" href="${escapeHTML(p.github)}" target="_blank" rel="noopener" aria-label="View code on GitHub for ${escapeHTML(p.title)}">Code ↗</a>` : ''}
            ${!p.url && !p.github ? `<span class="project-status-badge ${isOngoing ? 'ongoing-status' : ''}">${escapeHTML(p.status || 'Research')}</span>` : ''}
          </div>
        </div>
      </article>
    `;
  };

  let html = '';
  if (featured.length) {
    html += `<div class="featured-projects-grid">${featured.map(renderCard).join('')}</div>`;
  }
  if (supporting.length) {
    html += `<div class="supporting-projects-grid">${supporting.map(renderCard).join('')}</div>`;
  }
  grid.innerHTML = html;

  $('#filter-status').textContent = `Showing ${list.length} projects${filter === 'All' ? '' : ` in ${filter}`}.`;
  const allCount = $('#all-count');
  if (allCount) allCount.textContent = String(projects.length).padStart(2, '0');
}

render();

$('.filters').addEventListener('click', e => {
  const b = e.target.closest('[data-filter]');
  if (!b) return;
  document.querySelectorAll('[data-filter]').forEach(x => {
    x.classList.toggle('active', x === b);
    x.setAttribute('aria-pressed', String(x === b));
  });
  render(b.dataset.filter);
});

const dialog = $('#project-dialog');
$('#projects').addEventListener('click', e => {
  const button = e.target.closest('[data-project]');
  if (!button) return;
  const p = projects.find(x => x.id === button.dataset.project);
  if (!p) return;
  $('#dialog-body').innerHTML = `
    <p class="eyebrow">${escapeHTML(p.category)} · ${escapeHTML(p.status)}</p>
    <h2 id="dialog-title">${escapeHTML(p.title)}</h2>
    ${p.subtitle ? `<p class="dialog-subtitle"><em>${escapeHTML(p.subtitle)}</em></p>` : ''}
    <p class="dialog-detail">${escapeHTML(p.detail)}</p>
    <div class="tags">${p.tags.map(t => `<span>${escapeHTML(t)}</span>`).join('')}</div>
    <div class="dialog-actions">
      ${p.url ? `<a class="button" href="${escapeHTML(p.url)}" target="_blank" rel="noopener">Read the paper ↗</a>` : ''}
      ${p.github ? `<a class="button button-outline" href="${escapeHTML(p.github)}" target="_blank" rel="noopener">View code on GitHub ↗</a>` : ''}
      ${!p.url && !p.github ? `<span class="dialog-status-pill">Code &amp; manuscript in preparation</span>` : ''}
      <a class="text-link" href="mailto:srajan22@iisertvm.ac.in?subject=${encodeURIComponent(p.title)}">Inquire about this project ↗</a>
    </div>
  `;
  dialog.showModal();
  document.body.style.overflow = 'hidden';
});

$('.close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', e => {
  const r = dialog.getBoundingClientRect();
  if (e.target === dialog && (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)) dialog.close();
});
dialog.addEventListener('close', () => document.body.style.overflow = '');

const menu = $('.menu-button'), nav = $('#nav');
function closeMenu() {
  nav.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
}
menu.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
});
nav.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

function setupCopy(btnId, text, defaultLabel) {
  const btn = $(btnId);
  if (!btn) return;
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(text);
      btn.textContent = 'Copied ✓';
      $('#copy-status').textContent = `${text} copied to clipboard.`;
      setTimeout(() => btn.textContent = defaultLabel, 2200);
    } catch {
      btn.textContent = text;
      $('#copy-status').textContent = 'Copy unavailable. Select the address manually.';
    }
  });
}
setupCopy('#copy-email', 'srajan22@iisertvm.ac.in', 'Copy IISER email');
setupCopy('#copy-gmail', 'srajansstar@gmail.com', 'Copy Gmail');

$('#year').textContent = new Date().getFullYear();

// Render Srajan's original artwork (blurred by default, tap to reveal, no names)
const sketches = window.SKETCHES || [];
const sketchGallery = $('#sketch-gallery');
if (sketchGallery) {
  sketchGallery.innerHTML = sketches.map((s, i) => {
    const isLandscape = s.orientation === 'landscape';
    return `
      <div class="sketch-mini-card ${isLandscape ? 'landscape' : 'portrait'}" data-index="${i}">
        <div class="sketch-thumb-wrap ${isLandscape ? 'landscape' : 'portrait'}" data-sketch-index="${i}" role="button" tabindex="0" aria-label="Tap to reveal sketch">
          <img src="${escapeHTML(s.image)}" alt="Hand-drawn study" loading="lazy">
          <div class="sketch-tap-prompt">
            <span class="sketch-tap-pill">Tap to reveal</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

const sketchDialog = $('#sketch-dialog');
if (sketchDialog) {
  const openSketch = (index) => {
    const s = sketches[index];
    if (!s) return;
    const isLandscape = s.orientation === 'landscape';
    $('#sketch-dialog-body').innerHTML = `
      <div class="sketch-dialog-content ${isLandscape ? 'landscape' : 'portrait'}">
        <img src="${escapeHTML(s.image)}" alt="Original sketch">
        <div class="sketch-dialog-meta">
          <span class="sketch-meta-badge">${isLandscape ? 'Landscape study' : 'Portrait study'}</span>
          <a class="button button-outline" href="${escapeHTML(s.image)}" target="_blank" rel="noopener">Open full resolution ↗</a>
        </div>
      </div>
    `;
    sketchDialog.showModal();
    document.body.style.overflow = 'hidden';
  };

  document.addEventListener('click', e => {
    const thumb = e.target.closest('.sketch-thumb-wrap');
    if (!thumb) return;
    e.preventDefault();
    const index = Number(thumb.dataset.sketchIndex);
    if (!thumb.classList.contains('revealed')) {
      // First tap reveals (unblurs) the sketch
      thumb.classList.add('revealed');
    } else {
      // Second tap opens the full high-res modal
      openSketch(index);
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      const thumb = document.activeElement?.closest('.sketch-thumb-wrap');
      if (thumb) {
        e.preventDefault();
        const index = Number(thumb.dataset.sketchIndex);
        if (!thumb.classList.contains('revealed')) {
          thumb.classList.add('revealed');
        } else {
          openSketch(index);
        }
      }
    }
  });

  const closeSketchBtn = $('.close-sketch-dialog');
  if (closeSketchBtn) closeSketchBtn.addEventListener('click', () => sketchDialog.close());
  sketchDialog.addEventListener('click', e => {
    const r = sketchDialog.getBoundingClientRect();
    if (e.target === sketchDialog && (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)) {
      sketchDialog.close();
    }
  });
  sketchDialog.addEventListener('close', () => document.body.style.overflow = '');
}
