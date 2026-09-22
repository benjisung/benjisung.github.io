/* Native, progressive enhancement: content and navigation remain usable without JS. */
(() => {
  "use strict";
  const root = document.documentElement;
  const header = document.querySelector(".site-header");
  const menu = document.querySelector(".menu-toggle");
  if (header && menu) {
    header.classList.add("js-nav");
    menu.hidden = false;
    const closeMenu = () => {
      header.classList.remove("menu-open");
      menu.setAttribute("aria-expanded", "false");
    };
    menu.addEventListener("click", () => {
      const open = menu.getAttribute("aria-expanded") !== "true";
      header.classList.toggle("menu-open", open);
      menu.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        menu.getAttribute("aria-expanded") === "true"
      ) {
        closeMenu();
        menu.focus();
      }
    });
    header
      .querySelectorAll("nav a")
      .forEach((link) => link.addEventListener("click", closeMenu));
    matchMedia("(min-width: 801px)").addEventListener("change", closeMenu);
  }
  const motionQuery = matchMedia("(prefers-reduced-motion: reduce)");
  const desktopQuery = matchMedia("(min-width: 801px)");
  const motionButton = document.querySelector(".motion-toggle");
  let userReduced = false;
  try {
    userReduced = localStorage.getItem("portfolio-reduced-motion") === "true";
  } catch (_) {
    /* Storage is optional. */
  }
  let reduced = motionQuery.matches || userReduced;
  let revealObserver;
  const reveals = [...document.querySelectorAll(".reveal")];
  function updateMotion() {
    reduced = motionQuery.matches || userReduced;
    root.classList.toggle("reduced-motion", reduced);
    root.classList.toggle(
      "motion-enabled",
      !reduced && "IntersectionObserver" in window,
    );
    if (motionButton) {
      motionButton.hidden = false;
      motionButton.setAttribute("aria-pressed", String(reduced));
      motionButton.textContent = motionQuery.matches
        ? "Reduced motion (system)"
        : userReduced
          ? "Motion reduced · restore"
          : "Reduce motion";
      motionButton.disabled = motionQuery.matches;
    }
    if (reduced) reveals.forEach((el) => el.classList.add("is-visible"));
    syncMediaLayout();
    scheduleUpdate();
  }
  if ("IntersectionObserver" in window) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    reveals.forEach((el) => revealObserver.observe(el));
  }
  motionButton?.addEventListener("click", () => {
    userReduced = !userReduced;
    try {
      localStorage.setItem("portfolio-reduced-motion", String(userReduced));
    } catch (_) {
      /* No persistence required. */
    }
    updateMotion();
  });
  motionQuery.addEventListener("change", updateMotion);
  desktopQuery.addEventListener("change", () => {
    syncMediaLayout();
    scheduleUpdate();
  });
  const chapters = [...document.querySelectorAll("[data-chapter]")];
  const chapterLinks = [...document.querySelectorAll(".chapter-nav a")];
  const sequences = [...document.querySelectorAll("[data-sequence]")].map(
    (section) => ({
      section,
      steps: [...section.querySelectorAll("[data-step]")],
      visual: section.querySelector("[data-phase]"),
    }),
  );
  sequences.forEach((sequence) => {
    sequence.panels = [...sequence.visual.querySelectorAll(".stage-panel")];
    sequence.stageWindow = sequence.visual.querySelector(".stage-window");
    sequence.sticky = sequence.section.querySelector(".sticky-visual");
  });
  function syncMediaLayout() {
    sequences.forEach(({ visual, panels, stageWindow, steps, sticky }) => {
      if (!panels.length) return;
      const inline = reduced || !desktopQuery.matches;
      visual.classList.add("media-enhanced");
      sticky.hidden = inline;
      panels.forEach((panel, index) => {
        const target = inline ? steps[index] : stageWindow;
        if (panel.parentElement !== target) {
          if (inline) target.insertBefore(panel, target.querySelector("a"));
          else target.append(panel);
        }
        panel.hidden = !inline && index !== Number(visual.dataset.phase);
      });
    });
  }
  let frame = 0;
  function scheduleUpdate() {
    if (!frame) frame = requestAnimationFrame(updateScroll);
  }
  function updateScroll() {
    frame = 0;
    const focusLine = window.innerHeight * 0.48;
    let activeChapter = null;
    chapters.forEach((chapter) => {
      if (chapter.getBoundingClientRect().top <= window.innerHeight * 0.4)
        activeChapter = chapter.id;
    });
    chapterLinks.forEach((link) => {
      if (link.hash === "#" + activeChapter)
        link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
    sequences.forEach(({ section, steps, visual, panels }) => {
      const bounds = section.getBoundingClientRect();
      if (bounds.bottom < 0 || bounds.top > window.innerHeight) return;
      let phase = 0;
      steps.forEach((step, index) => {
        if (step.getBoundingClientRect().top <= focusLine) phase = index;
      });
      visual.dataset.phase = String(phase);
      const number = visual.querySelector(".phase-number");
      if (number)
        number.textContent =
          String(phase + 1).padStart(2, "0") +
          " / " +
          String(steps.length).padStart(2, "0");
      const inlineMedia = reduced || !desktopQuery.matches;
      panels.forEach((panel, index) => {
        panel.hidden = !inlineMedia && index !== phase;
      });
      const revealThrough = Number(steps[phase].dataset.revealThrough ?? phase);
      visual
        .querySelectorAll(".amr-layer")
        .forEach((layer, index) =>
          layer.classList.toggle(
            "active",
            reduced || !desktopQuery.matches || index <= revealThrough,
          ),
        );
    });
  }
  if (chapters.length || sequences.length) {
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("pageshow", scheduleUpdate);
  }
  updateMotion();
})();
