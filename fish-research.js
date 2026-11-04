/* The camera player connects to YouTube only after an explicit load action. */
"use strict";
(() => {
  const group = document.querySelector('[data-camera-observatory]');
  if (!group) return;
  const choices = [...group.querySelectorAll('[data-camera-id]')];
  const view = group.querySelector('.camera-view');
  const gate = group.querySelector('.camera-gate');
  const load = group.querySelector('.camera-load');
  const stop = group.querySelector('.camera-stop');
  const name = group.querySelector('#camera-name');
  const number = group.querySelector('[data-camera-number]');
  const source = group.querySelector('[data-camera-source]');
  const status = group.parentElement.querySelector('.camera-status');
  let selected = choices.find(button => button.getAttribute('aria-pressed') === 'true');
  function unload() {
    view.querySelector('iframe')?.remove();
    view.classList.remove('is-loaded');
    gate.hidden = false;
    stop.hidden = true;
  }
  choices.forEach((button, index) => {
    button.addEventListener('click', () => {
      if (button === selected) return;
      unload();
      selected = button;
      choices.forEach(choice => choice.setAttribute('aria-pressed', String(choice === button)));
      name.textContent = button.dataset.cameraName;
      number.textContent = `CAMERA 0${index + 1} / 04`;
      source.href = 'https://www.youtube.com/watch?v=' + button.dataset.cameraId;
      load.textContent = 'Load ' + button.dataset.cameraName + ' on YouTube ↗';
      status.textContent = button.dataset.cameraName + ' selected. The player is not loaded.';
    });
  });
  load.addEventListener('click', () => {
    const id = selected.dataset.cameraId;
    if (!/^[A-Za-z0-9_-]{11}$/.test(id)) return;
    unload();
    const player = document.createElement('iframe');
    player.src = 'https://www.youtube-nocookie.com/embed/' + id + '?playsinline=1&rel=0&autoplay=0';
    player.title = selected.dataset.cameraName + ' — public underwater camera from 台電-南灣海域珊瑚觀測計畫';
    player.referrerPolicy = 'strict-origin-when-cross-origin';
    player.allow = 'encrypted-media; picture-in-picture; fullscreen';
    player.allowFullscreen = true;
    gate.hidden = true;
    view.classList.add('is-loaded');
    view.append(player);
    stop.hidden = false;
    status.textContent = 'YouTube player loaded. Use its controls to play. This is the public camera stream, without an AI overlay from this portfolio.';
    player.focus();
  });
  stop.addEventListener('click', () => {
    unload();
    status.textContent = 'Player unloaded. Choose Load camera to reconnect to YouTube.';
    load.focus();
  });
  load.hidden = false;
  group.querySelector('.camera-options').hidden = false;
})();
