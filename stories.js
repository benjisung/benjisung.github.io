/* Progressive enhancement: native scrolling, five persistent project stages. */
(() => {
  "use strict";
  const root = document.documentElement;
  const chapters = [...document.querySelectorAll(".project-story")].map(
    (section) => ({
      section,
      shell: section.querySelector(".story-shell"),
      panels: [...section.querySelectorAll(".story-scene")],
      links: [...section.querySelectorAll(".scene-steps a")],
      active: -1,
      travel: 1,
    }),
  );
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const smallHeight = matchMedia("(max-height: 700px)");
  let enabled = false,
    raf = 0;
  function reduced() {
    return motion.matches || root.classList.contains("reduced-motion");
  }
  function activate(chapter, index) {
    if (chapter.active === index) return;
    chapter.active = index;
    chapter.panels.forEach((panel, i) => {
      const show = !enabled || i === index;
      panel.classList.toggle("is-active", show);
      panel.inert = !show;
      if (show) panel.removeAttribute("aria-hidden");
      else panel.setAttribute("aria-hidden", "true");
    });
    chapter.links.forEach((link, i) => {
      if (i === index) link.setAttribute("aria-current", "step");
      else link.removeAttribute("aria-current");
    });
  }
  function layout() {
    const next = chapters.length > 0 && !reduced() && !smallHeight.matches;
    if (root.classList.contains("story-enhanced") !== next)
      root.classList.toggle("story-enhanced", next);
    enabled = next;
    chapters.forEach((c) => {
      c.active = -1;
      c.travel = Math.max(450, c.shell.offsetHeight * 0.82) * c.panels.length;
      c.section.style.setProperty(
        "--story-height",
        c.shell.offsetHeight + c.travel + "px",
      );
      activate(c, 0);
    });
    schedule();
  }
  function update() {
    raf = 0;
    for (const c of chapters) {
      if (!enabled) continue;
      const r = c.section.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) continue;
      const top = parseFloat(getComputedStyle(c.shell).top) || 0;
      const p = Math.max(0, Math.min(1, (top - r.top) / c.travel));
      activate(
        c,
        Math.min(c.panels.length - 1, Math.floor(p * c.panels.length)),
      );
      c.section.style.setProperty("--story-progress", p.toFixed(4));
      c.section.style.setProperty(
        "--story-inset",
        Math.max(0, Math.min(4, ((r.top - top) / innerHeight) * 5)).toFixed(3),
      );
    }
  }
  function schedule() {
    if (!raf) raf = requestAnimationFrame(update);
  }
  function goToStage(c, index, smooth) {
    if (!enabled) return;
    const top = parseFloat(getComputedStyle(c.shell).top) || 0;
    const target =
      scrollY +
      c.section.getBoundingClientRect().top -
      top +
      c.travel * (index === 0 ? 0 : (index + 0.12) / c.panels.length);
    scrollTo({
      top: target,
      behavior: smooth && !reduced() ? "smooth" : "instant",
    });
  }
  chapters.forEach((c) =>
    c.links.forEach((link, i) =>
      link.addEventListener("click", (event) => {
        if (!enabled) return;
        event.preventDefault();
        history.replaceState(null, "", link.hash);
        goToStage(c, i, true);
      }),
    ),
  );
  function restoreHash() {
    const c = chapters.find((c) =>
      c.panels.some((p) => "#" + p.id === location.hash),
    );
    if (c)
      goToStage(
        c,
        c.panels.findIndex((p) => "#" + p.id === location.hash),
        false,
      );
  }
  if (chapters.length) {
    layout();
    restoreHash();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", layout);
    addEventListener("pageshow", () => {
      layout();
      restoreHash();
    });
    addEventListener("hashchange", restoreHash);
    motion.addEventListener("change", layout);
    smallHeight.addEventListener("change", layout);
  }
  const email = document.querySelector(".typing-email");
  const routes = [...document.querySelectorAll(".route-feature")];
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          if (entry.target === email && !reduced())
            email.classList.add("is-typing");
          else entry.target.classList.add("route-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.35 },
    );
    if (email) observer.observe(email);
    routes.forEach((route) => observer.observe(route));
  }
  let previousReduced = reduced();
  new MutationObserver(() => {
    const now = reduced();
    if (now === previousReduced) return;
    previousReduced = now;
    if (email && now) email.classList.remove("is-typing");
    layout();
  }).observe(root, { attributes: true, attributeFilter: ["class"] });
})();
