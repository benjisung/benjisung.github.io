/* Topic-specific enhancement; content, media controls, and links stay native. */
(() => {
  const root = document.documentElement;
  const systemMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const reduced = () => systemMotion.matches || root.classList.contains('reduced-motion');

  document.querySelectorAll('[data-media-tabs]').forEach(group => {
    const controls = group.querySelector('.tab-buttons');
    const tabs = [...controls.querySelectorAll('[role="tab"]')];
    const panels = [...group.querySelectorAll('.media-panel')];
    const select = index => {
      tabs.forEach((tab, i) => {
        tab.setAttribute('aria-selected', String(i === index));
        tab.tabIndex = i === index ? 0 : -1;
        panels[i].hidden = i !== index;
        if (i !== index) panels[i].querySelectorAll('video').forEach(video => video.pause());
      });
    };
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => select(index));
      tab.addEventListener('keydown', event => {
        let next;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        if (next === undefined) return;
        event.preventDefault();
        select(next);
        tabs[next].focus();
      });
    });
    group.classList.add('tabs-ready');
    controls.hidden = false;
    select(0);
  });

  document.querySelectorAll('[data-compare]').forEach(compare => {
    const slider = compare.querySelector('input[type="range"]');
    const reveal = compare.querySelector('.comparison-reveal');
    const update = () => {
      reveal.style.clipPath = `inset(0 ${100 - Number(slider.value)}% 0 0)`;
      compare.style.setProperty('--compare', `${slider.value}%`);
      slider.setAttribute('aria-valuetext', `${slider.value}% adapted model revealed`);
    };
    slider.addEventListener('input', update);
    slider.disabled = false;
    compare.classList.add('comparison-ready');
    update();
  });

  const scenes = [...document.querySelectorAll('[data-motion-scene]')];
  const replayButtons = [...document.querySelectorAll('.flight-replay')];
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      entry.target.classList.toggle('is-in-view', entry.isIntersecting);
      if (entry.isIntersecting && !reduced()) entry.target.classList.add('is-running');
    });
  }, {threshold: .2});
  scenes.forEach(scene => observer.observe(scene));
  replayButtons.forEach(button => {
    button.hidden = false;
    button.addEventListener('click', () => {
      if (reduced()) return;
      const scene = button.closest('[data-motion-scene]');
      scene.classList.remove('is-running');
      requestAnimationFrame(() => requestAnimationFrame(() => scene.classList.add('is-running')));
    });
  });
  const syncMotion = () => replayButtons.forEach(button => { button.disabled = reduced(); });
  new MutationObserver(syncMotion).observe(root, {attributes: true, attributeFilter: ['class']});
  systemMotion.addEventListener('change', syncMotion);
  document.addEventListener('visibilitychange', () => {
    root.classList.toggle('page-hidden', document.hidden);
    if (document.hidden) document.querySelectorAll('video').forEach(video => video.pause());
  });
  syncMotion();
})();
