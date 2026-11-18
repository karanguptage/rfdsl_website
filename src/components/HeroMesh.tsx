"use client";

import { useEffect, useRef } from "react";

// Free-floating node network drawn on a canvas that fills its (positioned) parent.
//
// Round nodes are carried by a slowly swirling "wind" and each also wanders on
// its own, so the web drifts endlessly inside the section without being pinned
// anywhere. Nodes that leave one side re-enter from the opposite side (just
// outside the visible area, hidden by the edge fade). Nearby nodes are linked,
// and links fade as nodes drift apart, so connections keep forming and breaking.
//
// Only the connected web is shown: any node or string that drifts off into a
// small group of its own fades out, and fades back in once it has rejoined the
// web, so lone dots and loose segments never appear. Nodes with too few links
// are also drawn back toward their neighbours.
//
// The pointer joins the web: it links to nearby nodes, gently gathers them,
// sweeps them along as it moves, and makes nearby links and nodes glow.
// With "reduce motion" enabled in the visitor's system settings, a still web
// is drawn instead.

const NODE_SPACING = 78; // average distance between nodes, in CSS px
const LINK_DISTANCE = 130; // nodes closer than this are linked
const MIN_GAP = 62; // nodes closer than this gently push apart
const MARGIN = 80; // nodes wrap around this far outside the visible area
const MIN_GROUP = 5; // groups with fewer nodes than this are hidden
const LINE_RGB = "120, 180, 255";
const NODE_RGB = "170, 220, 255";

// Motion (per second)
const WIND_SPEED = 14; // px/s of the swirling wind
const DRIFT_SPEED = 6; // px/s of the overall, slowly turning drift
const WANDER_SPEED = 7; // px/s of each node's own wandering
const FOLLOW = 0.8; // how quickly nodes take on the wind's velocity
const SEPARATION = 70; // strength of the push between nodes that are too close
const COHESION = 25; // pull drawing poorly linked nodes back toward the web
const FADE_SPEED = 2.5; // how quickly hidden groups fade out / rejoining ones fade in

// Strain glow: the most squeezed nodes light up on their own, like the pointer effect.
// Measured in the browser, typical squeeze is ~2 (median), ~11 (top 10%), ~18 (top 3%).
const STRAIN_FROM = 0.8; // glow starts fading in above this share of nodes...
const STRAIN_FULL = 0.95; // ...and is at full strength above this share
const STRAIN_FLOOR = 6; // squeeze below this never glows (keeps a calm web calm)
const STRAIN_GLOW = 1; // brightness of strain glow (same as the pointer glow)

// Pointer
const POINTER_RADIUS = 180; // reach of the pointer, in px (smaller on phones)
const POINTER_PULL = 0.35; // gentle gathering toward the pointer
const POINTER_SWEEP = 1.6; // how strongly a moving pointer drags nodes along

type FloatingNode = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  phase: number; // personalises the node's wandering
  glow: number; // 0..1, from the pointer or from strain
  strain: number; // smoothed squeeze from neighbouring nodes
  visibility: number; // 0..1, fades out while the node is cut off from the web
  degree: number; // number of links in the last frame
};
type Link = { a: number; b: number; closeness: number };

// Swirling wind. The velocity is the "curl" of a smooth, slowly changing
// stream function, which makes the flow swirl without ever converging, so
// nodes are carried around without piling up in one place.
function streamFunction(x: number, y: number, t: number) {
  return (
    260 * Math.sin(x / 260 + t * 0.06) * Math.cos(y / 260 - t * 0.05) +
    170 * Math.sin((x - y) / 170 + t * 0.04) +
    120 * Math.cos((x + 0.6 * y) / 120 - t * 0.07)
  );
}
function wind(x: number, y: number, t: number): [number, number] {
  const dPdx = (streamFunction(x + 1, y, t) - streamFunction(x - 1, y, t)) / 2;
  const dPdy = (streamFunction(x, y + 1, t) - streamFunction(x, y - 1, t)) / 2;
  // Overall drift whose direction turns slowly, like a changing breeze.
  const driftAngle = t * 0.02;
  return [
    (dPdy / 2.5) * WIND_SPEED + Math.cos(driftAngle) * DRIFT_SPEED,
    (-dPdx / 2.5) * WIND_SPEED + Math.sin(driftAngle) * DRIFT_SPEED * 0.6,
  ];
}

export default function HeroMesh() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let pointerRadius = POINTER_RADIUS;
    let nodes: FloatingNode[] = [];
    let links: Link[] = [];
    let frame = 0;
    let running = false;
    let lastTime = 0;
    let elapsed = 0;
    const pointer = { x: 0, y: 0, vx: 0, vy: 0, inside: false, presence: 0 };

    // Finds the links between nearby nodes and works out which nodes belong
    // to the main web; small cut-off groups fade out, rejoining ones fade in.
    const updateLinks = (fade: number) => {
      links = [];
      const parent = nodes.map((_, i) => i);
      const root = (i: number): number => {
        while (parent[i] !== i) {
          parent[i] = parent[parent[i]];
          i = parent[i];
        }
        return i;
      };
      for (const node of nodes) node.degree = 0;

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const d2 = dx * dx + dy * dy;
          if (d2 >= LINK_DISTANCE * LINK_DISTANCE) continue;
          links.push({ a: i, b: j, closeness: 1 - Math.sqrt(d2) / LINK_DISTANCE });
          a.degree++;
          b.degree++;
          parent[root(i)] = root(j);
        }
      }

      const groupSize = new Map<number, number>();
      for (let i = 0; i < nodes.length; i++) {
        const r = root(i);
        groupSize.set(r, (groupSize.get(r) ?? 0) + 1);
      }
      for (let i = 0; i < nodes.length; i++) {
        const target = (groupSize.get(root(i)) ?? 0) >= MIN_GROUP ? 1 : 0;
        nodes[i].visibility += (target - nodes[i].visibility) * fade;
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pointerRadius = Math.max(110, Math.min(POINTER_RADIUS, width * 0.12));

      const area = (width + MARGIN * 2) * (height + MARGIN * 2);
      const count = Math.max(40, Math.round(area / (NODE_SPACING * NODE_SPACING)));
      nodes = Array.from({ length: count }, () => ({
        x: -MARGIN + Math.random() * (width + MARGIN * 2),
        y: -MARGIN + Math.random() * (height + MARGIN * 2),
        vx: 0,
        vy: 0,
        phase: Math.random() * Math.PI * 2,
        glow: 0,
        strain: 0,
        visibility: 1,
        degree: 0,
      }));
      updateLinks(1); // start with cut-off groups already hidden
      draw();
    };

    const step = (dt: number) => {
      elapsed += dt;
      const t = elapsed;
      pointer.presence += ((pointer.inside ? 1 : 0) - pointer.presence) * Math.min(1, dt * 5);
      // Pointer velocity decays so the sweep fades out once the mouse stops.
      pointer.vx *= Math.exp(-6 * dt);
      pointer.vy *= Math.exp(-6 * dt);

      const ax = new Float32Array(nodes.length);
      const ay = new Float32Array(nodes.length);
      const squeeze = new Float32Array(nodes.length);

      // Gentle separation keeps an even, mesh-like spread. The total push on
      // each node is also its "squeeze", used for the strain glow.
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const d2 = dx * dx + dy * dy;
          if (d2 >= MIN_GAP * MIN_GAP || d2 === 0) continue;
          const d = Math.sqrt(d2);
          const push = ((MIN_GAP - d) / MIN_GAP) * SEPARATION;
          ax[i] -= (dx / d) * push;
          ay[i] -= (dy / d) * push;
          ax[j] += (dx / d) * push;
          ay[j] += (dy / d) * push;
          squeeze[i] += push;
          squeeze[j] += push;
        }
      }

      // Strain glow: smooth each node's squeeze, then light up the most
      // strained visible nodes, ramping from STRAIN_FROM to STRAIN_FULL.
      const strainEase = Math.min(1, dt * 3);
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].strain += (squeeze[i] - nodes[i].strain) * strainEase;
      }
      const visibleStrains = nodes
        .filter((node) => node.visibility > 0.5)
        .map((node) => node.strain)
        .sort((p, q) => p - q);
      const percentile = (share: number) =>
        visibleStrains[Math.floor((visibleStrains.length - 1) * share)] ?? Infinity;
      const strainLow = Math.max(STRAIN_FLOOR, percentile(STRAIN_FROM));
      const strainHigh = Math.max(strainLow * 1.5, percentile(STRAIN_FULL));

      // Cohesion: nodes with fewer than two links drift back toward their
      // nearest neighbour, so strays rejoin the web instead of wandering off.
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].degree >= 2) continue;
        let nearest = -1;
        let best = Infinity;
        for (let j = 0; j < nodes.length; j++) {
          if (j === i) continue;
          const d2 = (nodes[j].x - nodes[i].x) ** 2 + (nodes[j].y - nodes[i].y) ** 2;
          if (d2 < best) {
            best = d2;
            nearest = j;
          }
        }
        if (nearest < 0) continue;
        const d = Math.sqrt(best) || 1;
        ax[i] += ((nodes[nearest].x - nodes[i].x) / d) * COHESION;
        ay[i] += ((nodes[nearest].y - nodes[i].y) / d) * COHESION;
      }

      const spanX = width + MARGIN * 2;
      const spanY = height + MARGIN * 2;
      for (let n = 0; n < nodes.length; n++) {
        const node = nodes[n];

        // Target velocity: the wind plus the node's own wandering.
        const [windX, windY] = wind(node.x, node.y, t);
        const wander = t * 0.6 + node.phase;
        const targetX = windX + Math.cos(wander) * WANDER_SPEED;
        const targetY = windY + Math.sin(wander * 1.3) * WANDER_SPEED;
        ax[n] += (targetX - node.vx) * FOLLOW;
        ay[n] += (targetY - node.vy) * FOLLOW;

        // Pointer: gather nearby nodes and sweep them along with its movement.
        let near = 0;
        if (pointer.presence > 0.01) {
          const dx = pointer.x - node.x;
          const dy = pointer.y - node.y;
          const d = Math.hypot(dx, dy);
          if (d < pointerRadius) {
            near = (1 - d / pointerRadius) * pointer.presence;
            ax[n] += dx * POINTER_PULL * near + pointer.vx * POINTER_SWEEP * near;
            ay[n] += dy * POINTER_PULL * near + pointer.vy * POINTER_SWEEP * near;
          }
        }
        const strained = Math.min(1, Math.max(0, (node.strain - strainLow) / (strainHigh - strainLow)));
        const glowTarget = Math.max(near, strained * STRAIN_GLOW);
        node.glow += (glowTarget - node.glow) * Math.min(1, dt * 4);

        node.vx += ax[n] * dt;
        node.vy += ay[n] * dt;
        node.x += node.vx * dt;
        node.y += node.vy * dt;

        // Wrap around outside the visible area.
        if (node.x < -MARGIN) node.x += spanX;
        else if (node.x > width + MARGIN) node.x -= spanX;
        if (node.y < -MARGIN) node.y += spanY;
        else if (node.y > height + MARGIN) node.y -= spanY;
      }

      updateLinks(Math.min(1, dt * FADE_SPEED));
    };

    // Links are grouped into opacity buckets so each bucket is one stroke call.
    const BUCKETS = 12;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Node-to-node links: stronger when closer, brighter near the pointer,
      // and only as visible as the faintest of their two nodes.
      const paths = Array.from({ length: BUCKETS }, () => new Path2D());
      for (const link of links) {
        const a = nodes[link.a];
        const b = nodes[link.b];
        const shown = Math.min(a.visibility, b.visibility);
        if (shown < 0.02) continue;
        const alpha = Math.min(1, link.closeness * 0.5 + Math.max(a.glow, b.glow) * 0.5) * shown;
        const bucket = Math.min(BUCKETS - 1, Math.floor(alpha * BUCKETS));
        paths[bucket].moveTo(a.x, a.y);
        paths[bucket].lineTo(b.x, b.y);
      }
      ctx.lineWidth = 1;
      for (let b = 0; b < BUCKETS; b++) {
        ctx.strokeStyle = `rgba(${LINE_RGB}, ${((b + 0.5) / BUCKETS) * 0.8})`;
        ctx.stroke(paths[b]);
      }

      // Pointer links: the cursor joins the web.
      if (pointer.presence > 0.01) {
        ctx.lineWidth = 1.2;
        for (const node of nodes) {
          if (node.visibility < 0.02) continue;
          const d = Math.hypot(pointer.x - node.x, pointer.y - node.y);
          if (d >= pointerRadius) continue;
          const alpha = (1 - d / pointerRadius) * 0.85 * pointer.presence * node.visibility;
          ctx.strokeStyle = `rgba(${NODE_RGB}, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(pointer.x, pointer.y);
          ctx.lineTo(node.x, node.y);
          ctx.stroke();
        }
      }

      // Nodes: a soft halo near the pointer, then the round dot itself.
      for (const node of nodes) {
        if (node.visibility < 0.02) continue;
        if (node.glow > 0.05) {
          ctx.fillStyle = `rgba(${NODE_RGB}, ${0.2 * node.glow * node.visibility})`;
          ctx.beginPath();
          ctx.arc(node.x, node.y, 4 + node.glow * 7, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = `rgba(${NODE_RGB}, ${(0.7 + node.glow * 0.3) * node.visibility})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 2 + node.glow * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const tick = (time: number) => {
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0;
      lastTime = time;
      step(dt);
      draw();
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running || reduceMotion) return;
      running = true;
      lastTime = 0;
      frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    // Pointer tracking (mouse hover, or a finger dragging across the hero).
    let lastMove = 0;
    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const now = performance.now();
      if (pointer.inside && lastMove) {
        const dt = Math.max(0.008, (now - lastMove) / 1000);
        // Smoothed pointer velocity, used to sweep nodes along.
        pointer.vx += ((x - pointer.x) / dt - pointer.vx) * 0.5;
        pointer.vy += ((y - pointer.y) / dt - pointer.vy) * 0.5;
      }
      pointer.x = x;
      pointer.y = y;
      pointer.inside = true;
      lastMove = now;
    };
    const onPointerLeave = () => {
      pointer.inside = false;
      lastMove = 0;
    };
    // A lifted finger releases the pointer; a mouse keeps acting while hovering.
    const onPointerUp = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") onPointerLeave();
    };
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);
    canvas.addEventListener("pointercancel", onPointerLeave);
    canvas.addEventListener("pointerup", onPointerUp);

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    // Only animate while the hero is on screen.
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) start();
      else stop();
    });
    visibilityObserver.observe(canvas);

    return () => {
      stop();
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("pointercancel", onPointerLeave);
      canvas.removeEventListener("pointerup", onPointerUp);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 size-full touch-pan-y [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)]"
    />
  );
}
