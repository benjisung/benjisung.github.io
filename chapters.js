/* Full-screen project identity gates: native scroll only; no time locks. */
(() => {
  "use strict";
  const root = document.documentElement;
  const gates = [...document.querySelectorAll(".project-gate")];
  const headings = [...document.querySelectorAll(".photo-heading")];
  const clamp = (x) => Math.max(0, Math.min(1, x));
  let frame = 0;
  function update() {
    frame = 0;
    const reduced = root.classList.contains("reduced-motion");
    gates.forEach((gate) => {
      const r = gate.getBoundingClientRect();
      if (r.bottom < -100 || r.top > innerHeight + 100) return;
      const progress = reduced
        ? 1
        : clamp((innerHeight - r.top) / (innerHeight * 0.95));
      gate.style.setProperty("--gate-progress", progress.toFixed(4));
    });
    headings.forEach((heading) => {
      const r = heading.getBoundingClientRect();
      heading.style.setProperty(
        "--photo-progress",
        reduced ? 0 : clamp(-r.top / r.height),
      );
    });
  }
  function schedule() {
    if (!frame) frame = requestAnimationFrame(update);
  }
  if (gates.length || headings.length) {
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    addEventListener("pageshow", schedule);
    new MutationObserver(schedule).observe(root, {
      attributes: true,
      attributeFilter: ["class"],
    });
    schedule();
  }
  // Old AMR bookmarks remain usable after the Robotics split.
  if (
    location.pathname.endsWith("/robotics.html") &&
    ["#amr", "#architecture"].includes(location.hash)
  )
    location.replace("amr.html" + location.hash);
})();
