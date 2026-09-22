/* A short greeting, never a loader. Replay is explicit; reduced motion always wins. */
(() => {
  "use strict";
  const overlay = document.querySelector(".intro-overlay");
  if (!overlay) return;
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const root = document.documentElement;
  const replay = document.querySelector(".replay-intro");
  const timers = [];
  let playing = false;
  function reduced() {
    try {
      return (
        motion.matches ||
        localStorage.getItem("portfolio-reduced-motion") === "true"
      );
    } catch (_) {
      return motion.matches;
    }
  }
  function finish() {
    if (!playing) return;
    playing = false;
    timers.forEach(clearTimeout);
    timers.length = 0;
    const hadFocus = overlay.contains(document.activeElement);
    overlay.hidden = true;
    overlay.dataset.state = "complete";
    root.classList.remove("intro-running");
    document.removeEventListener("pointerdown", finish, true);
    document.removeEventListener("keydown", finish, true);
    if (hadFocus)
      document.querySelector("#hero-title")?.focus({ preventScroll: true });
  }
  function play() {
    if (reduced()) return;
    finish();
    overlay.classList.remove("show-identity", "intro-leaving");
    const greeting = overlay.querySelector(".intro-greeting");
    greeting.textContent = "Hello";
    greeting.lang = "en";
    playing = true;
    timers.push(setTimeout(finish, 2750));
    overlay.hidden = false;
    overlay.dataset.state = "playing";
    root.classList.add("intro-running");
    document.addEventListener("pointerdown", finish, {
      capture: true,
      once: true,
    });
    document.addEventListener("keydown", finish, { capture: true, once: true });
    [
      ["你好", "zh-Hant"],
      ["こんにちは", "ja"],
      ["Bonjour", "fr"],
      ["안녕하세요", "ko"],
      ["Aloha", "en"],
    ].forEach(([text, lang], index) => {
      timers.push(
        setTimeout(
          () => {
            greeting.textContent = text;
            greeting.lang = lang;
          },
          (index + 1) * 190,
        ),
      );
    });
    timers.push(setTimeout(() => overlay.classList.add("show-identity"), 1140));
    timers.push(setTimeout(() => overlay.classList.add("intro-leaving"), 1800));
  }
  motion.addEventListener("change", () => {
    if (motion.matches) finish();
  });
  window.addEventListener("pagehide", finish);
  overlay.querySelector(".intro-skip").addEventListener("click", finish);
  if (replay) {
    replay.hidden = false;
    replay.addEventListener("click", () => {
      if (reduced()) return;
      window.scrollTo({ top: 0, behavior: "instant" });
      play();
    });
    const syncReplay = () => {
      replay.disabled = reduced();
    };
    new MutationObserver(syncReplay).observe(root, {
      attributes: true,
      attributeFilter: ["class"],
    });
    syncReplay();
  }
  const isRefresh =
    window.performance?.getEntriesByType("navigation")[0]?.type === "reload";
  if (!reduced() && (!location.hash || isRefresh)) play();
  else overlay.dataset.state = "skipped";
})();
