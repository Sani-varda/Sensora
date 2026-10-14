/**
 * Sensora Interactive Shutter Glyph Engine
 * Vanilla JS conversion of shutter-glyph-footer.tsx
 * Supports interactive display wordmark with mouse-tracking shutter blade and waist-flip animations.
 */
(function() {
  const CAP = 100;
  const S = 19; // stem
  const B = 17; // bar
  const SHUTTER = 100;
  const K = 21;
  const REST = 77;
  const NOISE = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&*+=/<>";

  const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);
  const f = (n) => String(Math.round(n * 100) / 100);

  const rect = (x, y, w, h) => "M" + f(x) + " " + f(y) + "H" + f(x + w) + "V" + f(y + h) + "H" + f(x) + "Z";
  const slant = (x1, y1, x2, y2, t) => "M" + f(x1) + " " + f(y1) + "H" + f(x1 + t) + "L" + f(x2 + t) + " " + f(y2) + "H" + f(x2) + "Z";
  
  const at = (cx, cy, rx, ry, deg) => {
    const a = (deg * Math.PI) / 180;
    return f(cx + rx * Math.cos(a)) + " " + f(cy + ry * Math.sin(a));
  };

  const band = (cx, cy, rx, ry, tx, ty, a0, a1) => {
    const large = Math.abs(a1 - a0) > 180 ? 1 : 0;
    const cw = a1 > a0 ? 1 : 0;
    const irx = rx - tx;
    const iry = ry - ty;
    return (
      "M" + at(cx, cy, rx, ry, a0) +
      "A" + f(rx) + " " + f(ry) + " 0 " + large + " " + cw + " " + at(cx, cy, rx, ry, a1) +
      "L" + at(cx, cy, irx, iry, a1) +
      "A" + f(irx) + " " + f(iry) + " 0 " + large + " " + (1 - cw) + " " + at(cx, cy, irx, iry, a0) +
      "Z"
    );
  };

  const ring = (cx, cy, rx, ry, tx, ty) => {
    const e = (r1, r2) =>
      "M" + f(cx - r1) + " " + f(cy) +
      "A" + f(r1) + " " + f(r2) + " 0 1 1 " + f(cx + r1) + " " + f(cy) +
      "A" + f(r1) + " " + f(r2) + " 0 1 1 " + f(cx - r1) + " " + f(cy) + "Z";
    return e(rx, ry) + e(rx - tx, ry - ty);
  };

  const bowl = (x, y, w, h, t, tb) => {
    const ry = h / 2;
    const rx = Math.min(w - t, ry * 0.95);
    const sx = x + w - rx;
    return (
      "M" + f(x) + " " + f(y) + "H" + f(sx) +
      "A" + f(rx) + " " + f(ry) + " 0 0 1 " + f(sx) + " " + f(y + h) + "H" + f(x) + "Z" +
      "M" + f(x + t) + " " + f(y + tb) + "H" + f(sx) +
      "A" + f(rx - t) + " " + f(ry - tb) + " 0 0 1 " + f(sx) + " " + f(y + h - tb) + "H" + f(x + t) + "Z"
    );
  };

  const GLYPHS = {
    A: { w: 96, d: [slant(37, 0, 0, 100, 23), slant(37, 0, 73, 100, 23), rect(18, 60, 60, 16)] },
    B: { w: 84, d: [rect(0, 0, S, 100), bowl(0, 0, 78, 52, S, B), bowl(0, 52 - B, 84, 100 - 52 + B, S, B)] },
    C: { w: 90, d: [band(45, 50, 45, 50, S + 2, B, -40, -320)] },
    D: { w: 90, d: [rect(0, 0, S + 1, 100), bowl(0, 0, 90, 100, S + 2, B)] },
    E: { w: 72, d: [rect(0, 0, S, 100), rect(0, 0, 72, B), rect(0, 41.5, 64, B), rect(0, 100 - B, 72, B)] },
    F: { w: 70, d: [rect(0, 0, S, 100), rect(0, 0, 70, B), rect(0, 43, 62, B)] },
    G: { w: 94, d: [band(47, 50, 47, 50, S + 2, B, -38, -360), rect(48, 46, 46, B)] },
    H: { w: 86, d: [rect(0, 0, S, 100), rect(86 - S, 0, S, 100), rect(0, 42, 86, B)] },
    I: { w: S + 2, d: [rect(0, 0, S + 2, 100)] },
    J: { w: 72, d: [rect(72 - S, 0, S, 64), band(36, 62, 36, 38, S, B, 0, 180)] },
    K: { w: 86, d: [rect(0, 0, S, 100), slant(62, 0, 10, 62, 24), slant(30, 42, 62, 100, 24)] },
    L: { w: 68, d: [rect(0, 0, S, 100), rect(0, 100 - B, 68, B)] },
    M: { w: 112, d: [rect(0, 0, S + 3, 100), slant(0, 0, 46, 100, 9), slant(68, 0, 40, 100, 22), rect(112 - S - 3, 0, S + 3, 100)] },
    N: { w: 88, d: [rect(0, 0, S, 100), rect(88 - S, 0, S, 100), slant(0, 0, 63, 100, 25)] },
    O: { w: 100, d: [ring(50, 50, 50, 50, S + 2, B)] },
    P: { w: 80, d: [rect(0, 0, S, 100), bowl(0, 0, 80, 60, S, B)] },
    Q: { w: 100, d: [ring(50, 50, 50, 50, S + 2, B), slant(50, 62, 78, 100, 22)] },
    R: { w: 84, d: [rect(0, 0, S, 100), bowl(0, 0, 82, 58, S, B), slant(34, 50, 62, 100, 22)] },
    S: { w: 80, d: [band(40, 29.25, 40, 29.25, S, B, -22, -273), band(40, 70.75, 40, 29.25, S, B, -93, 158)] },
    T: { w: 82, d: [rect(0, 0, 82, B), rect(41 - S / 2 - 1, 0, S + 2, 100)] },
    U: { w: 86, d: [rect(0, 0, S, 60), rect(86 - S, 0, S, 60), band(43, 58, 43, 42, S, B, 0, 180)] },
    V: { w: 94, d: [slant(0, 0, 36, 100, 22), slant(72, 0, 36, 100, 22)] },
    W: { w: 132, d: [slant(0, 0, 26, 100, 20), slant(56, 0, 26, 100, 20), slant(56, 0, 86, 100, 20), slant(112, 0, 86, 100, 20)] },
    X: { w: 92, d: [slant(0, 0, 68, 100, 24), slant(68, 0, 0, 100, 24)] },
    Y: { w: 92, d: [slant(0, 0, 35, 56, 22), slant(70, 0, 35, 56, 22), rect(35, 50, 22, 50)] },
    Z: { w: 80, d: [rect(0, 0, 80, B), rect(0, 100 - B, 80, B), slant(56, B - 1, 0, 100 - B + 1, 24)] }
  };

  const glyphOf = (ch) => GLYPHS[ch.toUpperCase()] ?? { w: 42, d: [] };

  const turn = (x, y, turns) => {
    const n = ((turns % 4) + 4) % 4;
    let a = x, b = y;
    for (let i = 0; i < n; i++) {
      const t = a;
      a = SHUTTER - b;
      b = t;
    }
    return [a, b];
  };

  const restPivot = (turns) => turn(REST, REST, turns);

  const blades = (px, py, turns) => {
    const [qx, qy] = turn(clamp(px, 8, 92), clamp(py, 8, 92), -turns);
    const shapes = [
      [0, 0, K, 0, qx, qy, 0, K],
      [qx, 0, SHUTTER, 0, SHUTTER, K, qx, qy],
      [0, qy, qx, qy, K, SHUTTER, 0, SHUTTER]
    ];
    return shapes.map((s) => {
      const out = [];
      for (let i = 0; i < s.length; i += 2) {
        out.push(...turn(s[i], s[i + 1], turns));
      }
      return out;
    });
  };

  const layout = (word, shutterAt, gap = 12) => {
    const items = [];
    let x = 0;
    Array.from(word).forEach((ch, i) => {
      const isShutter = i === shutterAt && ch.trim() !== "";
      const w = isShutter ? SHUTTER : glyphOf(ch).w;
      items.push({ ch, x, w, shutter: isShutter });
      x += w + gap;
    });
    return { items, width: Math.max(1, x - (items.length ? gap : 0)) };
  };

  const approach = (from, to, k, dt) =>
    to + (from - to) * Math.pow(1 - clamp(k, 0, 1), clamp(dt, 0, 0.1) * 60);

  const scramble = (text, progress, seed) => {
    const chars = Array.from(text);
    const settled = Math.floor(clamp(Number.isFinite(progress) ? progress : 1, 0, 1) * chars.length);
    return chars
      .map((ch, i) => {
        if (i < settled || !/[a-z0-9]/i.test(ch)) return ch;
        const r = Math.abs(Math.sin((i + 1) * 12.9898 + seed * 78.233) * 43758.5453) % 1;
        return NOISE[Math.floor(r * NOISE.length)];
      })
      .join("");
  };

  function initShutterHero(container) {
    const word = (container.getAttribute("data-wordmark") || "SENSORA").toUpperCase();
    const shutterAt = parseInt(container.getAttribute("data-shutter-at") || "2", 10);
    const gap = 14;
    const { items, width } = layout(word, shutterAt, gap);
    const shutter = items.find((it) => it.shutter);

    let turns = 0;
    let pivot = restPivot(0);
    const ptr = { x: 0, y: 0, inside: false };
    const bladeElements = [];

    let svg = container.querySelector("svg");
    if (svg) {
      // SVG is already pre-rendered in HTML
      svg.querySelectorAll(".sgf-blade-poly").forEach((p) => bladeElements.push(p));
      const shutterG = container.querySelector(".sgf-sh");
      if (shutterG) {
        shutterG.addEventListener("click", () => {
          turns = (turns + 1) % 4;
          paint(pivot[0], pivot[1]);
        });
      }
    } else {
      const uid = Math.random().toString(36).substring(2, 8);
      const upId = "sgf-up-" + uid;
      const dnId = "sgf-dn-" + uid;

      // Build SVG
      svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("class", "sgf-svg");
      svg.setAttribute("viewBox", "0 0 " + f(width) + " " + CAP);
      svg.setAttribute("style", "aspect-ratio: " + width + " / " + CAP + "; width: 100%; height: auto; display: block; overflow: hidden; fill: var(--sgf-ink, #0F172A);");
      svg.setAttribute("aria-hidden", "true");

    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    defs.innerHTML = `
      <clipPath id="${upId}" clipPathUnits="userSpaceOnUse">
        <rect x="-40" y="-200" width="400" height="252.6" />
      </clipPath>
      <clipPath id="${dnId}" clipPathUnits="userSpaceOnUse">
        <rect x="-40" y="51.4" width="400" height="250" />
      </clipPath>
    `;
    svg.appendChild(defs);

    items.forEach((it, i) => {
      if (it.ch.trim() === "") return;
      const itemG = document.createElementNS("http://www.w3.org/2000/svg", "g");
      itemG.setAttribute("transform", "translate(" + f(it.x) + " 0)");

      const riseG = document.createElementNS("http://www.w3.org/2000/svg", "g");
      riseG.setAttribute("class", "sgf-rise");
      riseG.style.setProperty("--sgf-d", (200 + i * 80) + "ms");

      if (it.shutter) {
        const shutterG = document.createElementNS("http://www.w3.org/2000/svg", "g");
        shutterG.setAttribute("class", "sgf-g sgf-sh");
        shutterG.style.cursor = "pointer";

        const bgRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        bgRect.setAttribute("width", String(SHUTTER));
        bgRect.setAttribute("height", String(CAP));
        bgRect.setAttribute("fill", "transparent");
        shutterG.appendChild(bgRect);

        const currentBlades = blades(pivot[0], pivot[1], turns);
        currentBlades.forEach((pts) => {
          const poly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
          poly.setAttribute("points", pts.map(f).join(" "));
          bladeElements.push(poly);
          shutterG.appendChild(poly);
        });

        shutterG.addEventListener("click", () => {
          turns = (turns + 1) % 4;
          paint(pivot[0], pivot[1]);
        });

        riseG.appendChild(shutterG);
      } else {
        const g = glyphOf(it.ch);
        const flipG = document.createElementNS("http://www.w3.org/2000/svg", "g");
        flipG.setAttribute("class", "sgf-g sgf-flip");
        flipG.style.cursor = "pointer";

        const bgRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        bgRect.setAttribute("width", String(g.w));
        bgRect.setAttribute("height", String(CAP));
        bgRect.setAttribute("fill", "transparent");
        flipG.appendChild(bgRect);

        const pathsHtml = g.d.map((p) => `<path d="${p}" fill-rule="evenodd" />`).join("");

        const upClip = document.createElementNS("http://www.w3.org/2000/svg", "g");
        upClip.setAttribute("clip-path", `url(#${upId})`);
        upClip.innerHTML = `<g class="sgf-half sgf-up">${pathsHtml}</g>`;

        const dnClip = document.createElementNS("http://www.w3.org/2000/svg", "g");
        dnClip.setAttribute("clip-path", `url(#${dnId})`);
        dnClip.innerHTML = `<g class="sgf-half sgf-dn">${pathsHtml}</g>`;

        flipG.appendChild(upClip);
        flipG.appendChild(dnClip);

        flipG.addEventListener("click", function() {
          this.classList.remove("is-flip");
          void this.getBoundingClientRect();
          this.classList.add("is-flip");
        });

        flipG.addEventListener("animationend", function() {
          this.classList.remove("is-flip");
        });

        riseG.appendChild(flipG);
      }

      itemG.appendChild(riseG);
      svg.appendChild(itemG);
    });

    container.appendChild(svg);
    }

    function paint(x, y) {
      const bShapes = blades(x, y, turns);
      bShapes.forEach((pts, i) => {
        if (bladeElements[i]) {
          bladeElements[i].setAttribute("points", pts.map(f).join(" "));
        }
      });
    }

    // Pointer movement tracking
    function updatePointer(e) {
      ptr.inside = e.type !== "pointerleave" && e.type !== "mouseleave";
      if (!shutter) return;
      const r = svg.getBoundingClientRect();
      const scale = r.width / width || 1;
      ptr.x = (e.clientX - r.left) / scale - shutter.x;
      ptr.y = (e.clientY - r.top) / scale;
    }

    container.addEventListener("pointermove", updatePointer);
    container.addEventListener("pointerenter", updatePointer);
    container.addEventListener("pointerleave", updatePointer);

    // Animation Loop
    let last = performance.now();
    function tick(now) {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const rest = restPivot(turns);
      const tx = ptr.inside ? clamp(ptr.x, 8, 92) : rest[0];
      const ty = ptr.inside ? clamp(ptr.y, 8, 92) : rest[1];
      pivot = [approach(pivot[0], tx, 0.12, dt), approach(pivot[1], ty, 0.12, dt)];
      paint(pivot[0], pivot[1]);
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    // Initial reveal animation trigger
    setTimeout(() => {
      container.setAttribute("data-in", "true");
    }, 150);
  }

  // Scramble mono links
  function initScrambleLinks() {
    document.querySelectorAll(".sgf-scramble-link").forEach((link) => {
      const textSpan = link.querySelector("span");
      if (!textSpan) return;
      const text = textSpan.textContent.trim();
      let raf = 0;

      const run = () => {
        cancelAnimationFrame(raf);
        const t0 = performance.now();
        const seed = Math.random() * 100;
        let n = 0;
        const step = (now) => {
          const p = (now - t0) / 420;
          if (p >= 1) {
            textSpan.textContent = text;
            return;
          }
          if (n++ % 2 === 0) textSpan.textContent = scramble(text, p, seed + Math.floor(n / 2));
          raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      };

      link.addEventListener("pointerenter", run);
      link.addEventListener("focus", run);
    });
  }

  // Subscribe form handler in hero
  function initHeroSubscribe() {
    const form = document.querySelector(".sgf-hero-form");
    if (!form) return;
    const input = form.querySelector(".sgf-input");
    const field = form.querySelector(".sgf-field");
    const msg = form.querySelector(".sgf-msg");

    form.addEventListener("submit", function(e) {
      e.preventDefault();
      const val = (input.value || "").trim();
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val);

      if (!isEmail) {
        field.setAttribute("data-state", "error");
        msg.textContent = "Please enter a valid business email address.";
        msg.style.color = "#E11D48";
        return;
      }

      field.setAttribute("data-state", "sending");
      msg.textContent = "Connecting to Sensora Growth Sprint...";
      msg.style.color = "#0284C7";

      setTimeout(() => {
        field.setAttribute("data-state", "done");
        field.innerHTML = `
          <div style="display: flex; align-items: center; gap: 8px; color: #059669; font-weight: 600; padding: 4px 0;">
            <svg viewBox="0 0 12 12" width="14" height="14" aria-hidden="true">
              <path d="M1.5 6.4 4.6 9.4 10.6 2.6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="square" />
            </svg>
            <span>You're on the priority consultation list!</span>
          </div>
        `;
        msg.textContent = "Our strategy team will contact you within 24 hours.";
        msg.style.color = "#059669";
      }, 900);
    });
  }

  function boot() {
    document.querySelectorAll(".sgf-mark-container").forEach(initShutterHero);
    initScrambleLinks();
    initHeroSubscribe();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
