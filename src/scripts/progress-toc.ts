function initToc() {
  const progressToc = document.getElementById('progress-toc');
  if (!progressToc) return;

  const lines = progressToc.querySelectorAll<HTMLElement>('.toc-line');
  const tocLinks = progressToc.querySelectorAll<HTMLAnchorElement>('#toc-list a');

  // Exclude footnotes-section h2 from the list
  const h2s = Array.from(document.querySelectorAll('article h2')).filter(
    (h) => !h.closest('[data-footnotes]')
  );

  const h2Elements: Element[] = [];
  lines.forEach((_, i) => {
    if (h2s[i]) h2Elements.push(h2s[i]);
  });

  const allHeadingElements: Element[] = [];
  tocLinks.forEach((link) => {
    const slug = link.dataset.slug;
    const heading = document.getElementById(slug || '');
    if (heading) allHeadingElements.push(heading);
  });

  let skipUpdate = false;

  function setActive(lineIdx: number, tocIdx: number) {
    lines.forEach((line, i) => {
      line.classList.remove('active', 'passed');
      if (i === lineIdx) line.classList.add('active');
      else if (i < lineIdx) line.classList.add('passed');
    });
    tocLinks.forEach((a, i) => {
      a.classList.toggle('active', i === tocIdx);
    });
  }

  function update() {
    if (skipUpdate) return;

    let activeLineIndex = -1;
    h2Elements.forEach((h, idx) => {
      if (h.getBoundingClientRect().top <= window.innerHeight * 0.5) activeLineIndex = idx;
    });

    let activeTocIndex = -1;
    allHeadingElements.forEach((h, idx) => {
      if (h.getBoundingClientRect().top <= window.innerHeight * 0.5) activeTocIndex = idx;
    });

    setActive(activeLineIndex, activeTocIndex);
  }

  tocLinks.forEach((link, tocIdx) => {
    const slug = link.dataset.slug;
    const heading = document.getElementById(slug || '');
    if (heading) {
      link.addEventListener('click', (e) => {
        e.preventDefault();

        // Find the h2 line index: for h3s, use the parent h2
        let lineIdx = h2Elements.indexOf(heading);
        if (lineIdx === -1) {
          // h3 clicked — find the preceding h2
          for (let i = tocIdx - 1; i >= 0; i--) {
            const prev = allHeadingElements[i];
            const prevLineIdx = h2Elements.indexOf(prev);
            if (prevLineIdx !== -1) { lineIdx = prevLineIdx; break; }
          }
        }

        // Set active immediately and block scroll updates briefly
        skipUpdate = true;
        setActive(lineIdx, tocIdx);
        heading.scrollIntoView({ behavior: 'smooth' });

        const panel = document.getElementById('toc-panel');
        if (panel) panel.classList.remove('open');

        setTimeout(() => { skipUpdate = false; }, 800);
      });
    }
  });

  let tocTicking = false;
  window.addEventListener('scroll', () => {
    if (tocTicking) return;
    tocTicking = true;
    requestAnimationFrame(() => {
      update();
      tocTicking = false;
    });
  }, { passive: true });
  update();

  // Tap to toggle panel on touch devices
  const linesEl = document.getElementById('progress-lines');
  const panel = document.getElementById('toc-panel');
  if (linesEl && panel) {
    linesEl.addEventListener('click', (e) => {
      e.stopPropagation();
      panel.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if (!progressToc.contains(e.target as Node)) {
        panel.classList.remove('open');
      }
    });
  }
}

document.addEventListener('astro:page-load', initToc)
