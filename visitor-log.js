/* Public portfolio integration. The endpoint is public; no dashboard credentials belong here. */
"use strict";
(() => {
  const endpoint = document.currentScript?.dataset.endpoint;
  if (!endpoint || location.origin !== 'https://benjisung.github.io') return;
  if (navigator.globalPrivacyControl || navigator.doNotTrack === '1' || window.doNotTrack === '1') return;
  const pages = new Set(['/', '/index.html', '/about.html', '/robotics.html', '/sdg.html', '/environment.html', '/research.html', '/amr.html', '/activities.html', '/honors.html', '/contact.html']);
  if (!pages.has(location.pathname)) return;
  let target;
  try { target = new URL(endpoint); } catch { return; }
  if (target.protocol !== 'https:' || target.pathname !== '/collect' || target.username || target.password || target.search || target.hash) return;
  const send = () => fetch(target.href, { method: 'POST', mode: 'cors', credentials: 'omit', cache: 'no-store', keepalive: true, referrerPolicy: 'no-referrer', headers: { 'Content-Type': 'text/plain;charset=UTF-8' }, body: JSON.stringify({ page: location.pathname }) }).catch(() => {});
  if (document.visibilityState === 'visible') send();
  else {
    const visible = () => {
      if (document.visibilityState !== 'visible') return;
      document.removeEventListener('visibilitychange', visible);
      send();
    };
    document.addEventListener('visibilitychange', visible);
  }
})();
