// Geometry helpers: polygon tests and visibility-graph pathfinding inside walkable areas.

export function pointInPoly(x, y, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) inside = !inside;
  }
  return inside;
}

export function inRect(x, y, r) { return x >= r[0] && y >= r[1] && x <= r[0] + r[2] && y <= r[1] + r[3]; }

export function hitShape(x, y, h) {
  if (h.poly) return pointInPoly(x, y, h.poly);
  if (h.rect) return inRect(x, y, h.rect);
  if (h.circle) { const [cx, cy, r] = h.circle; return (x - cx) ** 2 + (y - cy) ** 2 <= r * r; }
  return false;
}

export function shapeCenter(h) {
  if (h.rect) return [h.rect[0] + h.rect[2] / 2, h.rect[1] + h.rect[3] / 2];
  if (h.circle) return [h.circle[0], h.circle[1]];
  if (h.poly) { let x = 0, y = 0; for (const p of h.poly) { x += p[0]; y += p[1]; } return [x / h.poly.length, y / h.poly.length]; }
  return [960, 600];
}

export function shapeBounds(h) {
  if (h.rect) return { x: h.rect[0], y: h.rect[1], w: h.rect[2], h: h.rect[3] };
  if (h.circle) return { x: h.circle[0] - h.circle[2], y: h.circle[1] - h.circle[2], w: h.circle[2] * 2, h: h.circle[2] * 2 };
  const xs = h.poly.map(p => p[0]), ys = h.poly.map(p => p[1]);
  const x = Math.min(...xs), y = Math.min(...ys);
  return { x, y, w: Math.max(...xs) - x, h: Math.max(...ys) - y };
}

function segIntersect(a, b, c, d) {
  // proper intersection (excluding shared endpoints / colinear touching)
  const o = (p, q, r) => (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]);
  const d1 = o(c, d, a), d2 = o(c, d, b), d3 = o(a, b, c), d4 = o(a, b, d);
  return ((d1 > 1e-9 && d2 < -1e-9) || (d1 < -1e-9 && d2 > 1e-9)) && ((d3 > 1e-9 && d4 < -1e-9) || (d3 < -1e-9 && d4 > 1e-9));
}

function insideAny(x, y, polys) { return polys.some(p => pointInPoly(x, y, p)); }

/** Walk area = array of polygons (union). */
export function normalizeWalk(walk) {
  if (!walk || !walk.length) return [];
  return typeof walk[0][0] === 'number' ? [walk] : walk;
}

export function inWalk(x, y, polys) { return insideAny(x, y, polys); }

function segmentClear(a, b, polys) {
  // Sample the segment: every sample must be inside some polygon, and no edge crossing between polygons' outside.
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const steps = Math.max(2, Math.ceil(len / 12));
  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    const x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t;
    if (!insideAny(x, y, polys)) return false;
  }
  if (polys.length === 1) {
    const p = polys[0];
    for (let i = 0, j = p.length - 1; i < p.length; j = i++) if (segIntersect(a, b, p[j], p[i])) return false;
  }
  return true;
}

/** Closest point inside the walk area to (x, y). */
export function clampToWalk(x, y, polys) {
  if (!polys.length || insideAny(x, y, polys)) return [x, y];
  let best = null, bd = Infinity;
  for (const p of polys) {
    for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
      const [ax, ay] = p[j], [bx, by] = p[i];
      const dx = bx - ax, dy = by - ay;
      const l2 = dx * dx + dy * dy || 1;
      let t = ((x - ax) * dx + (y - ay) * dy) / l2; t = Math.max(0, Math.min(1, t));
      const px = ax + dx * t, py = ay + dy * t;
      const d = (px - x) ** 2 + (py - y) ** 2;
      if (d < bd) { bd = d; best = [px, py]; }
    }
  }
  // nudge slightly inside
  if (best) {
    for (const r of [2, 4, 8, 14]) {
      for (const [ox, oy] of [[0, -r], [0, r], [r, 0], [-r, 0], [r, r], [-r, -r], [r, -r], [-r, r]]) {
        if (insideAny(best[0] + ox, best[1] + oy, polys)) return [best[0] + ox, best[1] + oy];
      }
    }
  }
  return best || [x, y];
}

/** Shortest path from a to b inside polys (visibility graph over polygon vertices, slightly inset). */
export function findPath(a, b, polys) {
  if (!polys.length) return [b];
  b = clampToWalk(b[0], b[1], polys);
  a = clampToWalk(a[0], a[1], polys);
  if (segmentClear(a, b, polys)) return [b];
  // candidate nodes: polygon vertices nudged inward
  const nodes = [];
  for (const p of polys) {
    for (let i = 0; i < p.length; i++) {
      const prev = p[(i - 1 + p.length) % p.length], cur = p[i], next = p[(i + 1) % p.length];
      // bisector nudge
      for (const r of [6, 14]) {
        const cand = [[cur[0] + r, cur[1]], [cur[0] - r, cur[1]], [cur[0], cur[1] + r], [cur[0], cur[1] - r], [cur[0] + r, cur[1] + r], [cur[0] - r, cur[1] - r], [cur[0] + r, cur[1] - r], [cur[0] - r, cur[1] + r]];
        const mid = [(prev[0] + next[0]) / 2, (prev[1] + next[1]) / 2];
        cand.sort((u, v) => Math.hypot(u[0] - mid[0], u[1] - mid[1]) - Math.hypot(v[0] - mid[0], v[1] - mid[1]));
        const ok = cand.find(c => insideAny(c[0], c[1], polys));
        if (ok) { nodes.push(ok); break; }
      }
    }
  }
  const all = [a, b, ...nodes];
  const n = all.length;
  const dist = new Array(n).fill(Infinity), prev = new Array(n).fill(-1), done = new Array(n).fill(false);
  dist[0] = 0;
  const vis = new Map();
  const clear = (i, j) => { const k = i < j ? i * n + j : j * n + i; if (!vis.has(k)) vis.set(k, segmentClear(all[i], all[j], polys)); return vis.get(k); };
  for (let it = 0; it < n; it++) {
    let u = -1, bd = Infinity;
    for (let i = 0; i < n; i++) if (!done[i] && dist[i] < bd) { bd = dist[i]; u = i; }
    if (u < 0) break;
    if (u === 1) break;
    done[u] = true;
    for (let v = 0; v < n; v++) {
      if (done[v] || v === u) continue;
      const w = Math.hypot(all[u][0] - all[v][0], all[u][1] - all[v][1]);
      if (dist[u] + w < dist[v] && clear(u, v)) { dist[v] = dist[u] + w; prev[v] = u; }
    }
  }
  if (prev[1] < 0) return [b]; // fallback: straight line
  const path = [];
  for (let v = 1; v > 0; v = prev[v]) path.unshift(all[v]);
  return path;
}
