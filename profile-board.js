/* Lines follow the real card pins at every viewport size. Navigation stays native. */
(() => {
  const board = document.querySelector('.connection-board');
  if (!board) return;
  const svg = board.querySelector('.board-strings');
  const cards = [...board.querySelectorAll('[data-node]')];
  const note = document.querySelector('.thread-note');
  const defaultNote = note.textContent;
  const threads = [
    ['me', 'vex', 'Code becomes movement.'],
    ['me', 'amr', 'Building a system from the inside out.'],
    ['me', 'field', 'Learning from the world beyond the workshop.'],
    ['me', 'fish', 'Computer vision meets the living world.'],
    ['me', 'sdg', 'Making an idea useful, together.'],
    ['me', 'court', 'Practice, leadership, and another kind of teamwork.'],
    ['me', 'code', 'A foundation in computational problem solving.'],
    ['vex', 'amr', 'Two settings for the same questions about control.'],
    ['field', 'fish', 'Environmental questions meet computer vision.'],
    ['sdg', 'court', 'Different teams. Shared responsibility.'],
    ['code', 'fish', 'Algorithms become a tool for observation.'],
  ];
  const paths = threads.map(([from, to, label]) => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.dataset.from = from;
    path.dataset.to = to;
    path.dataset.label = label;
    svg.append(path);
    return path;
  });
  let frame;
  function draw() {
    const bounds = board.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${bounds.width} ${bounds.height}`);
    const pins = new Map(cards.map(card => {
      const r = card.querySelector('.board-pin').getBoundingClientRect();
      return [card.dataset.node, {x: r.left + r.width / 2 - bounds.left, y: r.top + r.height / 2 - bounds.top}];
    }));
    paths.forEach(path => {
      const a = pins.get(path.dataset.from), b = pins.get(path.dataset.to);
      const sag = Math.min(38, Math.abs(a.x - b.x) * .06 + 12);
      path.setAttribute('d', `M ${a.x} ${a.y} Q ${(a.x+b.x)/2} ${(a.y+b.y)/2+sag} ${b.x} ${b.y}`);
    });
  }
  function schedule() {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(draw);
  }
  function highlight(id) {
    board.classList.toggle('has-thread', Boolean(id));
    const connected = new Set([id]);
    paths.forEach(path => {
      const active = Boolean(id) && (path.dataset.from === id || path.dataset.to === id);
      path.classList.toggle('is-thread', active);
      if (active) { connected.add(path.dataset.from); connected.add(path.dataset.to); }
    });
    cards.forEach(card => card.classList.toggle('is-connected', connected.has(card.dataset.node)));
    note.textContent = id && id !== 'me' ? threads.find(([a,b]) => a === 'me' && b === id)[2] : defaultNote;
  }
  cards.forEach(card => {
    card.addEventListener('pointerenter', () => highlight(card.dataset.node));
    card.addEventListener('focusin', () => highlight(card.dataset.node));
  });
  board.addEventListener('pointerleave', () => {
    const focused = cards.find(card => card.contains(document.activeElement));
    highlight(focused?.dataset.node);
  });
  board.addEventListener('focusout', event => {
    if (!board.contains(event.relatedTarget)) highlight(null);
  });
  new ResizeObserver(schedule).observe(board);
  cards.forEach(card => card.querySelectorAll('img').forEach(img => img.addEventListener('load', schedule)));
  document.fonts.ready.then(schedule);
  schedule();
})();
