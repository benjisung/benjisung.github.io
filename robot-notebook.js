"use strict";
(() => {
  const explorer = document.querySelector("[data-robot-explorer]");
  const pdf = "portfolio-assets/vex/notebook/reaper-engineering-notebook.pdf";
  const builds = {
    personal: {
      image: "portfolio-assets/vex/team-robot-front.webp",
      alt: "Separate VEX robot built mainly by Benjamin, with numbered mechanism callouts",
      label: "Separate build / Built mainly by me",
      ownership: "I built this robot mainly myself. It is separate from our main team competition robot.",
      parts: [
        { name: "Intake", x: 34, y: 77, description: "The front rollers collect game objects and feed them into the conveyor." },
        { name: "Conveyor", x: 46, y: 49, description: "The inclined chain conveyor carries game objects from the intake toward the upper mechanism." },
        { name: "Upper rollers", x: 57, y: 25, description: "The upper roller assembly continues the path from the conveyor, feeding game objects through the top of the robot." },
        { name: "Drivetrain", x: 59, y: 86, description: "The wheels and chassis move and turn the robot while supporting the mechanisms above." },
      ],
    },
    team: {
      image: "portfolio-assets/vex/team-robot-side.webp",
      alt: "Side view of the main team competition robot, with numbered mechanism callouts",
      label: "Main robot / Shared team build",
      ownership: "Our main competition robot is shared team engineering. The notebook records the design process across several robot versions.",
      parts: [
        { name: "Intake", x: 40, y: 62, description: "The intake collects blocks and feeds them into the robot. Our notebook follows the team’s loading-guide experiments and intake testing.", page: 143 },
        { name: "Conveyor", x: 51, y: 47, description: "The conveyor moves blocks through the robot toward scoring height. The notebook documents our early intake and scoring-system design choices.", page: 77 },
        { name: "Aligner", x: 30, y: 23, description: "The guide helps position the robot at the long goal. My notebook entries follow the aligner from a trapezoid through notched prototypes to a funnel-like guide.", page: 323 },
        { name: "Drivetrain", x: 57, y: 87, description: "The chassis carries the robot and controls its movement. Our team documented the wheel assembly, gear placement, and chassis CAD before building.", page: 97 },
        { name: "Wing", x: 45, y: 16, description: "The raised hook/wing is a key Push Back mechanism: it sweeps blocks out of the long goal and moves them toward the control-bonus section. My notebook entries cover its pneumatic actuation, stronger frame, and retraction.", page: 337 },
      ],
    },
  };
  if (explorer) {
    const image = explorer.querySelector("#explorer-image");
    const pins = explorer.querySelector(".robot-pins");
    const list = explorer.querySelector(".robot-part-list");
    const source = explorer.querySelector("#robot-part-source");
    let build = "team";
    function selectPart(index) {
      const part = builds[build].parts[index];
      const regions = build === "personal" ? [[27,20],[22,43],[24,24],[49,15]] : [[25,23],[32,32],[21,20],[50,15],[16,32]];
      pins.style.setProperty("--part-x", `${part.x}%`);
      pins.style.setProperty("--part-y", `${part.y}%`);
      pins.style.setProperty("--part-w", `${regions[index][0]}%`);
      pins.style.setProperty("--part-h", `${regions[index][1]}%`);
      explorer.querySelectorAll("[data-part]").forEach(button => button.setAttribute("aria-pressed", String(Number(button.dataset.part) === index)));
      explorer.querySelector(".part-number").textContent = String(index + 1).padStart(2, "0");
      explorer.querySelector("#robot-part-title").textContent = part.name;
      explorer.querySelector("#robot-part-description").textContent = part.description;
      if (part.page) {
        source.href = `#notebook`;
        source.dataset.notebookPage = part.page;
        source.textContent = `Open notebook / p. ${part.page} ↙`;
        source.removeAttribute("target");
      } else {
        source.href = builds[build].image;
        delete source.dataset.notebookPage;
        source.textContent = "Look closer ↗";
        source.target = "_blank";
      }
    }
    function selectBuild(name) {
      build = name;
      const data = builds[build];
      image.src = data.image;
      image.alt = data.alt;
      image.height = build === "personal" ? 1172 : 1132;
      explorer.querySelector("#robot-build-label").textContent = data.label;
      explorer.querySelector("#robot-ownership").textContent = data.ownership;
      explorer.querySelectorAll("[data-robot]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.robot === build)));
      pins.replaceChildren(); list.replaceChildren();
      data.parts.forEach((part, index) => {
        for (const target of [pins, list]) {
          const button = document.createElement("button");
          button.type = "button";
          button.dataset.part = index;
          button.textContent = target === pins ? String(index + 1).padStart(2, "0") : `${String(index + 1).padStart(2, "0")} / ${part.name}`;
          button.setAttribute("aria-label", `${part.name}, ${index + 1} of ${data.parts.length}`);
          if (target === pins) {
            button.className = "robot-pin";
            button.style.setProperty("--x", `${part.x}%`);
            button.style.setProperty("--y", `${part.y}%`);
          }
          button.addEventListener("click", () => selectPart(index));
          target.append(button);
        }
      });
      selectPart(0);
    }
    explorer.querySelectorAll("[data-robot]").forEach(button => button.addEventListener("click", () => selectBuild(button.dataset.robot)));
    selectBuild("team");
    explorer.querySelector(".robot-switch").hidden = pins.hidden = list.hidden = false;
  }

  const notebook = document.querySelector("[data-notebook]");
  if (!notebook) return;
  const total = 439;
  const spread = notebook.querySelector(".notebook-spread");
  const left = notebook.querySelector("#notebook-left");
  const right = notebook.querySelector("#notebook-right");
  const previous = notebook.querySelector(".book-prev");
  const next = notebook.querySelector(".book-next");
  const input = notebook.querySelector("#notebook-page");
  const loader = notebook.querySelector(".notebook-loading");
  const single = window.matchMedia("(max-width: 700px)");
  let page = 1;
  let busy = false;
  let pending = null;
  const pageURL = n => `portfolio-assets/vex/notebook/pages/page-${String(n).padStart(3, "0")}.webp`;
  const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.body.classList.contains("reduced-motion") || document.documentElement.classList.contains("reduced-motion") || document.body.classList.contains("motion-reduced");
  function setSheet(sheet, n) {
    const valid = n <= total;
    sheet.classList.toggle("is-blank", !valid);
    sheet.hidden = !valid;
    if (!valid) return;
    sheet.href = pageURL(n);
    sheet.setAttribute("aria-label", `Enlarge notebook page ${n}`);
    const image = sheet.querySelector("img");
    image.src = pageURL(n);
    image.alt = `Team engineering notebook, page ${n}. Enlarge to read.`;
  }
  function render() {
    setSheet(left, page);
    setSheet(right, page + 1);
    const end = single.matches ? page : Math.min(total, page + 1);
    notebook.querySelector(".book-range").textContent = page === end ? `Page ${page} of ${total}` : `Pages ${page}–${end} of ${total}`;
    input.value = page;
    previous.disabled = page <= 1;
    next.disabled = end >= total;
    const text = notebook.querySelector(".notebook-text");
    text.replaceChildren();
    for (let n = page; n <= end; n++) {
      const article = document.createElement("article");
      const title = document.createElement("h3"); title.textContent = `Page ${n}`;
      const body = document.createElement("p"); body.textContent = window.REAPER_NOTEBOOK?.[n - 1] || "This page contains images or diagrams. Open the enlarged page or complete PDF to view it.";
      article.append(title, body); text.append(article);
    }
    notebook.querySelectorAll(".notebook-index [data-notebook-page]").forEach(link => {
      const n = Number(link.dataset.notebookPage);
      if (n >= page && n <= end) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }
  function load(n) {
    return new Promise((resolve, reject) => {
      if (n > total) return resolve();
      const image = new Image(); image.onload = resolve; image.onerror = reject; image.src = pageURL(n);
    });
  }
  async function go(requested, animate = true) {
    const target = Math.min(total, Math.max(1, Math.round(Number(requested)) || 1));
    if (busy) { pending = target; return; }
    if (target === page) return;
    busy = true; loader.hidden = false; spread.setAttribute("aria-busy", "true");
    let turn;
    try {
      await Promise.all([load(target), ...(single.matches ? [] : [load(target + 1)])]);
      const backwards = target < page;
      if (animate && !reduced()) {
        turn = document.createElement("div");
        turn.className = `page-turn${backwards ? " is-backward" : ""}`;
        turn.setAttribute("aria-hidden", "true");
        const front = document.createElement("img"); front.alt = ""; front.src = pageURL(single.matches || backwards ? page : Math.min(total, page + 1));
        const back = document.createElement("img"); back.alt = ""; back.src = pageURL(single.matches || !backwards ? target : Math.min(total, target + 1));
        turn.append(front, back); spread.append(turn);
      }
      page = target; render(); loader.hidden = true;
      if (turn) {
        await new Promise(resolve => {
          turn.addEventListener("animationend", resolve, { once: true });
          requestAnimationFrame(() => turn.classList.add("is-moving"));
          setTimeout(resolve, 750);
        });
        turn.remove();
      }
    } catch {
      loader.textContent = "This page couldn’t load. Try again or open the complete PDF below.";
    } finally {
      busy = false; spread.removeAttribute("aria-busy");
      if (loader.hidden) loader.textContent = "Opening the next page…";
      if (pending !== null) { const target = pending; pending = null; go(target); }
    }
  }
  previous.addEventListener("click", () => go(page - (single.matches ? 1 : 2)));
  next.addEventListener("click", () => go(page + (single.matches ? 1 : 2)));
  notebook.querySelector(".book-jump").addEventListener("submit", event => { event.preventDefault(); go(input.value); });
  spread.addEventListener("keydown", event => {
    const targets = { ArrowLeft: page - (single.matches ? 1 : 2), ArrowRight: page + (single.matches ? 1 : 2), Home: 1, End: total };
    if (event.key in targets) { event.preventDefault(); go(targets[event.key]); }
  });
  document.addEventListener("click", event => {
    const link = event.target.closest("[data-notebook-page]");
    if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault(); go(link.dataset.notebookPage);
    if (!notebook.contains(link)) document.querySelector("#notebook").scrollIntoView({ behavior: reduced() ? "auto" : "smooth" });
  });
  single.addEventListener("change", () => render());
  render();
  notebook.querySelector(".notebook-controls").hidden = false;
})();
