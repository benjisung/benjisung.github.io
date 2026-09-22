/* Natural-scroll camera work. All content remains available without animation. */
(() => {
  "use strict";
  const root = document.documentElement;
  const field = document.querySelector(".field-cinema");
  const machine = document.querySelector(".machine-chapter");
  const slider = document.querySelector("#fish-compare");
  const comparison = document.querySelector(".image-comparison");
  slider?.addEventListener("input", () => {
    comparison.style.setProperty("--split", slider.value + "%");
    slider.setAttribute(
      "aria-valuetext",
      slider.value +
        "% version 2, " +
        (100 - Number(slider.value)) +
        "% version 1",
    );
  });
  // The visible image divider is draggable; the range remains the keyboard control.
  if (comparison && slider) {
    let dragging = false;
    const moveDivider = (event) => {
      const rect = comparison.getBoundingClientRect();
      slider.value = String(
        Math.round(
          Math.max(
            0,
            Math.min(100, ((event.clientX - rect.left) / rect.width) * 100),
          ),
        ),
      );
      slider.dispatchEvent(new Event("input", { bubbles: true }));
    };
    comparison.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      dragging = true;
      comparison.setPointerCapture(event.pointerId);
      moveDivider(event);
    });
    comparison.addEventListener("pointermove", (event) => {
      if (dragging) moveDivider(event);
    });
    for (const type of ["pointerup", "pointercancel", "lostpointercapture"])
      comparison.addEventListener(type, () => {
        dragging = false;
      });
    comparison.addEventListener("dragstart", (event) => event.preventDefault());
  }
  const clamp = (value) => Math.max(0, Math.min(1, value));
  let frame = 0;
  function update() {
    frame = 0;
    const reduced = root.classList.contains("reduced-motion");
    if (field) {
      const rect = field.getBoundingClientRect();
      const header = parseFloat(
        getComputedStyle(root).getPropertyValue("--header"),
      );
      const distance = Math.max(1, field.offsetHeight - (innerHeight - header));
      const progress = reduced ? 0 : clamp((header - rect.top) / distance);
      field.style.setProperty("--field-progress", progress);
      field.style.setProperty("--field-scale", 1.08 - progress * 0.08);
      field.style.setProperty("--field-two", clamp((progress - 0.17) / 0.3));
      field.style.setProperty("--field-three", clamp((progress - 0.65) / 0.3));
    }
    if (machine) {
      const rect = machine.getBoundingClientRect();
      const progress = clamp(
        (innerHeight - rect.top) / (innerHeight + rect.height),
      );
      machine.style.setProperty(
        "--machine-shift",
        reduced ? "0px" : (progress - 0.5) * -38 + "px",
      );
    }
  }
  function schedule() {
    if (!frame) frame = requestAnimationFrame(update);
  }
  addEventListener("scroll", schedule, { passive: true });
  addEventListener("resize", schedule);
  addEventListener("pageshow", schedule);
  new MutationObserver(schedule).observe(root, {
    attributes: true,
    attributeFilter: ["class"],
  });
  schedule();
})();
