"use strict";
const fs = require("node:fs");
const data = JSON.parse(
  fs.readFileSync("assets/pacific-land-source.geojson", "utf8"),
);
const bounds = [100, 245, -10, 62],
  project = ([x, y]) => [((x - 100) * 900) / 145, ((62 - y) * 450) / 72];
function clip(poly, axis, value, keepGreater) {
  const out = [];
  if (!poly.length) return out;
  let prev = poly.at(-1),
    prevIn = keepGreater ? prev[axis] >= value : prev[axis] <= value;
  for (const p of poly) {
    const inside = keepGreater ? p[axis] >= value : p[axis] <= value;
    if (inside !== prevIn) {
      let t = (value - prev[axis]) / (p[axis] - prev[axis]);
      out.push([
        prev[0] + t * (p[0] - prev[0]),
        prev[1] + t * (p[1] - prev[1]),
      ]);
    }
    if (inside) out.push(p);
    prev = p;
    prevIn = inside;
  }
  return out;
}
let paths = [];
for (const feature of data.features) {
  let polygons =
    feature.geometry.type === "Polygon"
      ? [feature.geometry.coordinates]
      : feature.geometry.coordinates;
  for (const poly of polygons)
    for (const ring of poly) {
      let u = [];
      for (const [raw, y] of ring) {
        let x = raw;
        if (u.length) {
          while (x - u.at(-1)[0] > 180) x -= 360;
          while (x - u.at(-1)[0] < -180) x += 360;
        }
        u.push([x, y]);
      }
      for (const offset of [-360, 0, 360]) {
        let v = u.map(([x, y]) => [x + offset, y]);
        for (const [a, b, c] of [
          [0, 100, true],
          [0, 245, false],
          [1, -10, true],
          [1, 62, false],
        ])
          v = clip(v, a, b, c);
        if (v.length > 2)
          paths.push(
            v
              .map(
                (p, i) =>
                  (i ? "L" : "M") +
                  project(p)
                    .map((n) => n.toFixed(1))
                    .join(","),
              )
              .join("") + "Z",
          );
      }
    }
}
const grid = [];
for (let lon = 110; lon <= 240; lon += 20) {
  let x = project([lon, 0])[0];
  grid.push("M" + x.toFixed(1) + " 0V450");
}
for (let lat = 0; lat <= 60; lat += 15) {
  let y = project([100, lat])[1];
  grid.push("M0 " + y.toFixed(1) + "H900");
}
const svg =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 450"><rect width="900" height="450" rx="12" fill="#092e3b"/><path d="' +
  grid.join("") +
  '" fill="none" stroke="#b8e1d5" stroke-opacity=".12"/><path d="' +
  paths.join("") +
  '" fill="#658c7c" stroke="#a2bd9e" stroke-width=".65"/><g fill="#bcd2cb" font-family="sans-serif" font-size="16" letter-spacing="3"><text x="395" y="353">PACIFIC OCEAN</text><text x="45" y="160">EAST ASIA</text><text x="685" y="60">NORTH AMERICA</text></g></svg>';
console.log(
  JSON.stringify({
    svg,
    start: project([121, 23.7]),
    end: project([202.21, 21.43]),
  }),
);
