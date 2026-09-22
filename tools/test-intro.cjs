"use strict";
const fs = require("node:fs");
const vm = require("node:vm");
const assert = require("node:assert/strict");
const path = require("node:path");
const code = fs.readFileSync(path.join(__dirname, "..", "intro.js"), "utf8");
function scenario(options = {}) {
  let time = 0,
    nextId = 0;
  const timers = new Map(),
    events = new Map(),
    classes = new Set();
  const greeting = { textContent: "Hello", lang: "" };
  const overlay = {
    hidden: true,
    dataset: {},
    classList: {
      add: (value) => classes.add(value),
      remove: (...values) => values.forEach((value) => classes.delete(value)),
    },
    contains: () => false,
    querySelector: (selector) =>
      selector === ".intro-greeting" ? greeting : { addEventListener() {} },
  };
  const preference = {
    matches: !!options.reduced,
    addEventListener() {},
    removeEventListener() {},
  };
  const storage = new Map(
    options.seen ? [["portfolio-intro-seen-v4-cinema", "true"]] : [],
  );
  const document = {
    activeElement: null,
    documentElement: { classList: { add() {}, remove() {} } },
    querySelector: (selector) =>
      selector === ".replay-intro" ? null : overlay,
    addEventListener: (name, fn) => events.set(name, fn),
    removeEventListener: (name) => events.delete(name),
  };
  const context = {
    document,
    location: { hash: options.hash || "" },
    matchMedia: () => preference,
    localStorage: { getItem: () => (options.userReduced ? "true" : null) },
    sessionStorage: {
      getItem: (key) => {
        if (options.storageBlocked) throw new Error("blocked");
        return storage.get(key);
      },
      setItem: (key, value) => storage.set(key, value),
    },
    window: {
      addEventListener() {},
      performance: {
        getEntriesByType: () => [
          { type: options.reload ? "reload" : "navigate" },
        ],
      },
    },
    setTimeout: (fn, delay) => {
      const id = ++nextId;
      timers.set(id, { at: time + delay, fn });
      return id;
    },
    clearTimeout: (id) => timers.delete(id),
  };
  vm.runInNewContext(code, context);
  return {
    overlay,
    greeting,
    classes,
    events,
    storage,
    timers,
    advance(target) {
      while (true) {
        const due = [...timers]
          .sort((a, b) => a[1].at - b[1].at)
          .find(([, task]) => task.at <= target);
        if (!due) break;
        timers.delete(due[0]);
        time = due[1].at;
        due[1].fn();
      }
      time = target;
    },
  };
}
const first = scenario();
assert.equal(first.overlay.hidden, false);
assert.equal(first.storage.size, 0);
first.advance(190);
assert.equal(first.greeting.textContent, "你好");
first.advance(950);
assert.equal(first.greeting.textContent, "Aloha");
first.advance(1140);
assert(first.classes.has("show-identity"));
first.advance(1800);
assert(first.classes.has("intro-leaving"));
first.advance(2750);
assert.equal(first.overlay.hidden, true);
assert.equal(first.timers.size, 0);
for (const option of [
  { reduced: true },
  { userReduced: true },
  { hash: "#vision" },
]) {
  const test = scenario(option);
  assert.equal(test.overlay.hidden, true);
  assert.equal(test.timers.size, 0);
}
for (const options of [
  { seen: true },
  { storageBlocked: true },
  { reload: true },
  { reload: true, hash: "#vision" },
]) {
  const repeated = scenario(options);
  assert.equal(repeated.overlay.hidden, false);
  repeated.advance(2750);
  assert.equal(repeated.overlay.hidden, true);
}
for (const event of ["pointerdown", "keydown"]) {
  const test = scenario();
  test.advance(380);
  test.events.get(event)();
  assert.equal(test.overlay.hidden, true);
  assert.equal(test.timers.size, 0);
}
console.log(
  "PASS: intro timeline, 2.75s deadline, pointer/key skip, every refresh/revisit, reduced motion, direct deep links, anchored refresh, and blocked storage.",
);
