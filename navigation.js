/* Native details keeps every project reachable without JavaScript. */
(() => {
  const header = document.querySelector('.fresh-header');
  const explore = header?.querySelector('.nav-explore');
  if (!explore) return;
  const summary = explore.querySelector('summary');
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && explore.open) {
      explore.open = false;
      summary.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!explore.contains(event.target)) explore.open = false;
  });
  header.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => { explore.open = false; });
  });
  header.querySelector('.menu-toggle')?.addEventListener('click', () => {
    if (!header.classList.contains('menu-open')) explore.open = false;
  });
})();
