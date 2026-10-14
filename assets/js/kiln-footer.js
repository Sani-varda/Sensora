/**
 * Kiln Wordmark Footer Engine for Sensora
 * Vanilla JS conversion of kiln-wordmark-footer.tsx
 * Supports interactive superellipse wordmark, mouse-weight swell lens, composition tile switching, and back-to-top key.
 */
(function() {
  const XH = 100;
  const ASC = 36;
  const DESC = 36;
  const SQUARE = 2.4;
  const TAU = Math.PI * 2;
  const B = 112;

  const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);
  const n1 = (v) => String(Math.round(v * 10) / 10);

  const signedArea = (p) => {
    let a = 0;
    for (let i = 0; i < p.length; i++) {
      const j = (i + 1) % p.length;
      a += p[i][0] * p[j][1] - p[j][0] * p[i][1];
    }
    return a / 2;
  };

  const orient = (p, sign) => (signedArea(p) * sign >= 0 ? p : p.slice().reverse());

  const sePt = (cx, cy, rx, ry, t) => {
    const c = Math.cos(t);
    const s = Math.sin(t);
    const sgnC = c > 0 ? 1 : c < 0 ? -1 : 0;
    const sgnS = s > 0 ? 1 : s < 0 ? -1 : 0;
    return [
      cx + rx * sgnC * Math.pow(Math.abs(c), 2 / SQUARE),
      cy + ry * sgnS * Math.pow(Math.abs(s), 2 / SQUARE)
    ];
  };

  const ring = (x0, y0, x1, y1, V, h) => {
    const cx = (x0 + x1) / 2;
    const cy = (y0 + y1) / 2;
    const rx = (x1 - x0) / 2;
    const ry = (y1 - y0) / 2;
    const irx = Math.max(1, rx - V);
    const iry = Math.max(1, ry - h);
    const outer = [];
    const inner = [];
    for (let i = 0; i < 96; i++) {
      const t = (i / 96) * TAU;
      outer.push(sePt(cx, cy, rx, ry, t));
      inner.push(sePt(cx, cy, irx, iry, t));
    }
    return [orient(outer, 1), orient(inner, -1)];
  };

  const clipHalf = (poly, [axis, at, side]) => {
    const out = [];
    const inside = (p) => (p[axis] - at) * side <= 0;
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i];
      const b = poly[(i + 1) % poly.length];
      const ia = inside(a);
      const ib = inside(b);
      if (ia) out.push(a);
      if (ia !== ib) {
        const u = (at - a[axis]) / (b[axis] - a[axis]);
        out.push([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u]);
      }
    }
    return out;
  };

  const keep = (shape, ...halves) =>
    shape.map((poly) => halves.reduce(clipHalf, poly)).filter((poly) => poly.length >= 3 && Math.abs(signedArea(poly)) > 1e-6);

  const rect = (x0, y0, x1, y1) => orient([[x0, y0], [x1, y0], [x1, y1], [x0, y1]], 1);

  const GLYPHS = {
    a: [B, (V, h) => [...ring(0, 0, B, XH, V, h), rect(B - V, 0, B, XH)]],
    e: [B, (V, h) => {
      const o = ring(0, 0, B, XH, V, h);
      return [...keep(o, [1, XH / 2, 1]), ...keep(o, [1, XH / 2, -1], [0, 82, 1]), rect(V * 0.5, XH / 2 - h / 2, B, XH / 2 + h / 2)];
    }],
    n: [B, (V, h) => [rect(0, 0, V, XH), ...keep(ring(0, 0, B, XH, V, h), [1, XH / 2, 1]), rect(B - V, XH / 2, B, XH)]],
    o: [B, (V, h) => ring(0, 0, B, XH, V, h)],
    r: [84, (V, h) => [rect(0, 0, V, XH), ...keep(ring(0, 0, 108, XH + 10, V, h), [1, (XH + 10) / 2, 1], [0, 84, 1])]],
    s: [104, (V, h) => {
      const m = XH / 2;
      const up = ring(0, 0, 104, m + h / 2, V, h);
      const lo = ring(0, m - h / 2, 104, XH, V, h);
      return [
        ...keep(up, [0, 52, 1]),
        ...keep(up, [0, 52, -1], [0, 90, 1], [1, (m + h / 2) / 2, 1]),
        ...keep(lo, [0, 52, -1]),
        ...keep(lo, [0, 52, 1], [0, 14, -1], [1, (m - h / 2 + XH) / 2, -1]),
      ];
    }]
  };

  const strokes = (k) => {
    const w = clamp(Number.isFinite(k) ? k : 1, 0.4, 1.6);
    return { V: 30 * w, h: 19 * (0.55 + 0.45 * w) };
  };

  const glyphPath = (ch, k, dx = 0) => {
    const g = GLYPHS[ch];
    if (!g) return "";
    const { V, h } = strokes(k);
    return g[1](V, h)
      .map((poly) => "M" + poly.map((p) => n1(p[0] + dx) + " " + n1(p[1])).join("L") + "Z")
      .join("");
  };

  const TILES = [
    { cx: 0.385, cy: 0.5, r: 0.415, sx: 0.755, sw: 0.245 },
    { cx: 0.615, cy: 0.5, r: 0.415, sx: 0, sw: 0.245 },
    { cx: 0.5, cy: 1.04, r: 0.5, sx: 0.5, sw: 0 },
    { cx: 1, cy: 0, r: 0.6, sx: 0, sw: 0.3 }
  ];

  const leanTile = (t, px, py, amount = 0.035) => ({
    ...t,
    cx: t.cx + amount * clamp(Number.isFinite(px) ? px : 0, -1, 1),
    cy: t.cy + amount * 1.6 * clamp(Number.isFinite(py) ? py : 0, -1, 1)
  });

  const approach = (from, to, k, dt) =>
    to + (from - to) * Math.pow(1 - clamp(k, 0, 1), clamp(dt, 0, 0.1) * 60);

  const lensWeights = (centres, px, base, boost, radius) =>
    centres.map((c) => {
      if (px === null || !Number.isFinite(px) || !(radius > 0)) return base;
      const d = (c - px) / radius;
      return base + boost * Math.exp(-d * d);
    });

  function initKilnFooter(footer) {
    const word = "sensora";
    const tracking = 10;
    const letters = [];
    let curX = 0;
    for (const ch of word) {
      const g = GLYPHS[ch];
      letters.push({ ch, x: curX, w: g[0] });
      curX += g[0] + tracking;
    }
    const wordWidth = curX - tracking;
    const centres = letters.map((l) => l.x + l.w / 2);
    const baseWeight = 1.0;
    const boost = 0.42;

    let tileIdx = 0;
    let anim = {
      k: letters.map(() => baseWeight),
      kT: letters.map(() => baseWeight),
      cur: { ...TILES[0] },
      target: { ...TILES[0] },
      lean: [0, 0],
      raf: 0,
      last: 0
    };

    const disc = footer.querySelector(".kwf-disc");
    const slab = footer.querySelector(".kwf-slab");
    const tileSvg = footer.querySelector(".kwf-tile");
    const wordSvg = footer.querySelector(".kwf-word");
    const paths = footer.querySelectorAll(".kwf-word path");
    const keyBtn = footer.querySelector(".kwf-key");

    function getBounds() {
      const r = footer.getBoundingClientRect();
      return { w: Math.max(1, r.width), h: Math.max(1, r.height) };
    }

    function paint() {
      const { w, h } = getBounds();
      if (tileSvg) {
        tileSvg.setAttribute("viewBox", `0 0 ${w} ${h}`);
      }
      if (disc) {
        disc.setAttribute("cx", n1(anim.cur.cx * w));
        disc.setAttribute("cy", n1(anim.cur.cy * h));
        disc.setAttribute("rx", n1(anim.cur.r * w));
        disc.setAttribute("ry", n1(anim.cur.r * w));
      }
      if (slab) {
        slab.setAttribute("x", n1(anim.cur.sx * w));
        slab.setAttribute("width", n1(Math.max(0, anim.cur.sw * w)));
        slab.setAttribute("height", String(h));
      }
      letters.forEach((l, i) => {
        if (paths[i]) {
          paths[i].setAttribute("d", glyphPath(l.ch, anim.k[i], l.x));
        }
      });
    }

    function kick() {
      if (anim.raf) return;
      anim.last = 0;
      function step(now) {
        const dt = anim.last ? (now - anim.last) / 1000 : 1 / 60;
        anim.last = now;
        let busy = false;
        const goal = leanTile(anim.target, anim.lean[0], anim.lean[1]);

        ["cx", "cy", "r", "sx", "sw"].forEach((key) => {
          const next = approach(anim.cur[key], goal[key], 0.075, dt);
          anim.cur[key] = Math.abs(next - goal[key]) < 1e-4 ? goal[key] : next;
          if (anim.cur[key] !== goal[key]) busy = true;
        });

        for (let i = 0; i < anim.k.length; i++) {
          const next = approach(anim.k[i], anim.kT[i], 0.16, dt);
          anim.k[i] = Math.abs(next - anim.kT[i]) < 1e-3 ? anim.kT[i] : next;
          if (anim.k[i] !== anim.kT[i]) busy = true;
        }

        paint();
        anim.raf = busy ? requestAnimationFrame(step) : 0;
      }
      anim.raf = requestAnimationFrame(step);
    }

    // Interactive pointer movement across footer
    footer.addEventListener("pointermove", (e) => {
      if (e.pointerType === "touch") return;
      const r = footer.getBoundingClientRect();
      anim.lean = [((e.clientX - r.left) / r.width) * 2 - 1, ((e.clientY - r.top) / r.height) * 2 - 1];
      kick();
    });

    footer.addEventListener("pointerleave", () => {
      anim.lean = [0, 0];
      kick();
    });

    // Clicking empty space rotates through composition tiles
    footer.addEventListener("click", (e) => {
      if (e.target.closest("a, button, .kwf-word")) return;
      if (window.getSelection && window.getSelection().toString()) return;
      tileIdx = (tileIdx + 1) % TILES.length;
      anim.target = { ...TILES[tileIdx] };
      kick();
    });

    // Wordmark lens swelling
    if (wordSvg) {
      wordSvg.addEventListener("pointermove", (e) => {
        const r = wordSvg.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width) * wordWidth;
        anim.kT = lensWeights(centres, x, baseWeight, boost, 150);
        kick();
      });

      wordSvg.addEventListener("pointerleave", () => {
        anim.kT = lensWeights(centres, null, baseWeight, boost, 150);
        kick();
      });

      paths.forEach((p, idx) => {
        p.addEventListener("click", () => {
          anim.k[idx] = Math.min(1.6, anim.k[idx] + 0.55);
          kick();
          if (typeof p.animate === "function") {
            p.animate(
              [
                { transform: "none" },
                { transform: "scale(1.05, 0.8)", offset: 0.25 },
                { transform: "scale(0.98, 1.05)", offset: 0.6 },
                { transform: "none" }
              ],
              { duration: 620, easing: "cubic-bezier(.3,.7,.3,1)" }
            );
          }
        });
      });
    }

    // Back to top key
    if (keyBtn) {
      keyBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    // Reveal when in view
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          footer.classList.add("kwf-shown");
          io.disconnect();
        }
      }, { threshold: 0.15 });
      io.observe(footer);
    } else {
      footer.classList.add("kwf-shown");
    }

    paint();
  }

  function boot() {
    document.querySelectorAll(".kwf").forEach(initKilnFooter);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
