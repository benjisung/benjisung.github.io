"use strict";
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const pages = fs.readdirSync(root).filter((name) => name.endsWith(".html"));
const errors = [];
const fail = (message) => errors.push(message);
const source = new Map(
  pages.map((name) => [name, fs.readFileSync(path.join(root, name), "utf8")]),
);
const ids = new Map();
const media = JSON.parse(
  fs.readFileSync(path.join(root, "assets/media-plan.json"), "utf8"),
).assets;
const mediaByKey = new Map(media.map((asset) => [asset.key, asset]));
if (mediaByKey.size !== media.length) fail("Duplicate keys in media manifest");
const email = "benjisung@gmail.com";
for (const [name, html] of source) {
  const found = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  ids.set(name, new Set(found));
  if (new Set(found).size !== found.length) fail(name + ": duplicate IDs");
  if (!/^<!doctype html>/i.test(html)) fail(name + ": missing doctype");
  if (
    !/<html\s+lang=/.test(html) ||
    !/<meta\s+charset=/.test(html) ||
    !/<meta\s+name="viewport"/.test(html)
  )
    fail(name + ": missing document metadata");
  if ((html.match(/<h1[ >]/g) || []).length !== 1)
    fail(name + ": expected one h1");
  if (!/<meta\s+name="description"\s+content="[^"]+"/.test(html))
    fail(name + ": missing meta description");
  if (!/<title>[^<]+<\/title>/.test(html)) fail(name + ": missing title");
  for (const match of html.matchAll(/href="mailto:([^"]+)"/g))
    if (match[1] !== email) fail(name + ": unexpected personal email");
  for (const match of html.matchAll(/data-asset-key="([^"]+)"/g)) {
    const asset = mediaByKey.get(match[1]);
    if (!asset) fail(name + ": undocumented media key " + match[1]);
    else if (!asset.pages.includes(name))
      fail(name + ": media manifest page mismatch for " + match[1]);
  }
  for (const image of html.matchAll(/<img\b[^>]*>/g))
    if (!/\balt=/.test(image[0])) fail(name + ": image without alt");
}
for (const asset of media) {
  for (const name of asset.pages) {
    if (!source.get(name)?.includes('data-asset-key="' + asset.key + '"'))
      fail(asset.key + ": missing slot on " + name);
  }
  if (asset.current && !fs.existsSync(path.join(root, asset.current)))
    fail(asset.key + ": missing current image");
}
let references = 0;
function exactExists(relative) {
  let directory = root;
  for (const part of relative.split(/[\\/]/)) {
    if (!fs.existsSync(directory) || !fs.readdirSync(directory).includes(part))
      return false;
    directory = path.join(directory, part);
  }
  return fs.existsSync(directory);
}
for (const [name, html] of source) {
  for (const match of html.matchAll(/\b(?:src|href|poster)="([^"]+)"/g)) {
    const ref = match[1].replaceAll("&amp;", "&");
    if (/^(?:https?:|mailto:|tel:|data:)/i.test(ref)) continue;
    const [pathname, hash] = ref.split("#");
    const file = decodeURIComponent(pathname.split("?")[0] || name);
    const relative = path.posix.normalize(
      path.posix.join(path.posix.dirname(name), file),
    );
    references++;
    if (!exactExists(relative))
      fail(name + ": missing or wrong-case path " + ref);
    if (
      hash &&
      ids.has(relative) &&
      !ids.get(relative).has(decodeURIComponent(hash))
    )
      fail(name + ": missing fragment " + ref);
  }
}
const outdated = [
  /\bI[E]P\b/i,
  /International Education Progra[m]/i,
  /Grade 1[1]/i,
  /AI Researche[r]/i,
  /Robotics Lea[d]/i,
  /Marine AI Fello[w]/i,
  /thermal refugi[a]/i,
  /15[%]/,
  /shuttlecoc[k]/i,
  /Gemin[i]/i,
  /[a-z0-9._%+-]+@stu[.]wghs[.]tp[.]edu[.]tw/i,
];
for (const name of fs
  .readdirSync(root)
  .filter((name) => /\.(html|md|css|js)$/.test(name))) {
  const text = fs.readFileSync(path.join(root, name), "utf8");
  if (outdated.some((pattern) => pattern.test(text)))
    fail(name + ": outdated wording needs review");
}
console.log(
  "Checked " +
    pages.length +
    " HTML pages and " +
    references +
    " local references (including fragments and filename case).",
);
console.log(
  "Checked " +
    media.length +
    " documented media keys and personal email links.",
);
if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else
  console.log(
    "PASS: metadata, IDs, image alt text, local links/assets, and factual-wording audit.",
  );
if (process.argv.includes("--http")) {
  const paths = new Set(pages);
  for (const [name, html] of source) {
    for (const match of html.matchAll(/\b(?:src|href|poster)="([^"]+)"/g)) {
      if (/^(https?:|mailto:|tel:|data:|#)/i.test(match[1])) continue;
      paths.add(match[1].split("#")[0]);
    }
  }
  Promise.all(
    [...paths].map(async (file) => {
      const response = await fetch("http://127.0.0.1:8766/" + file);
      if (!response.ok) throw new Error(file + ": HTTP " + response.status);
      await response.arrayBuffer();
    }),
  )
    .then(() =>
      console.log(
        "PASS: HTTP 200 for " +
          paths.size +
          " distinct pages and local assets.",
      ),
    )
    .catch((error) => {
      console.error(error.message);
      process.exitCode = 1;
    });
}
