'use strict';
// Living Cortical Connectome with Volumetric Depth Hierarchy, Peripheral Dissolve,
// Dendritic Tendril Arborization, Synaptic Dust Embers, and Touch-Activated Cascades.
// Adapted from ICBM152 cortical atlas.
(()=>{
  const hero = document.querySelector('.neural-hero');
  const canvas = document.querySelector('#brain-canvas');
  if (!hero || !canvas || !window.BRAIN_GRAPH) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  const { points, edges } = window.BRAIN_GRAPH;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const motion = document.querySelector('#motion');

  // Fast math helpers
  const fract = x => x - Math.floor(x);
  const rand = (i, seed = 1) => fract(Math.sin(i * 12.9898 + seed * 43.123) * 43758.5453);
  const clamp = (v, min, max) => (v < min ? min : v > max ? max : v);

  // 1. Build adjacency list and compute node degrees & anatomical hub classification
  const nodeCount = points.length;
  const degrees = new Uint16Array(nodeCount);
  const adj = Array.from({ length: nodeCount }, () => []);

  for (let i = 0; i < edges.length; i++) {
    const [a, b] = edges[i];
    degrees[a]++;
    degrees[b]++;
    adj[a].push(b);
    adj[b].push(a);
  }

  // Identify high-degree structural hubs (major cortical integration centres)
  const isHub = new Uint8Array(nodeCount);
  const hubIndices = [];
  for (let i = 0; i < nodeCount; i++) {
    // Degree >= 8 and high anatomical weight
    if (degrees[i] >= 8 && points[i][4] >= 0.8) {
      isHub[i] = 1;
      hubIndices.push(i);
    }
  }

  // Precompute normalized radial distance from 3D anatomical center for organic edge dissolve
  // Mesh envelope: X ~ [-0.78, 0.78], Y ~ [-0.74, 0.74], Z ~ [-1.02, 1.01]
  const radialDist = new Float32Array(nodeCount);
  const rimNodes = [];
  for (let i = 0; i < nodeCount; i++) {
    const pt = points[i];
    const nx = pt[0] / 0.76;
    const ny = pt[1] / 0.72;
    const nz = pt[2] / 1.00;
    const r3d = Math.sqrt(nx * nx + ny * ny + nz * nz);
    radialDist[i] = r3d;
    // Boundary rim nodes for dissolving tendrils and synaptic embers
    if (r3d >= 0.88 && rand(i, 3) > 0.45) {
      rimNodes.push(i);
    }
  }

  // Pre-classify edges into highway tracts vs standard mesh
  const edgeCount = edges.length;
  const isHighwayEdge = new Uint8Array(edgeCount);
  for (let i = 0; i < edgeCount; i++) {
    const [a, b] = edges[i];
    if (degrees[a] >= 7 && degrees[b] >= 7) {
      isHighwayEdge[i] = 1;
    }
  }

  // Dynamic projection & position buffers
  const projected = Array.from({ length: nodeCount }, () => [0, 0, 0]);
  const positions = Array.from({ length: nodeCount }, () => [0, 0, 0]);
  const activation = new Float32Array(nodeCount);

  // Soft, balanced neural chromatic palettes (blended gently into atmospheric bg)
  // Regions: 0 = Frontal (Sage), 1 = Parietal (Slate Cyan), 2 = Occipital (Muted Lavender), 3 = Temporal (Warm Ochre)
  const regionColors = [
    '95,175,150',   // gentle sage
    '90,165,190',   // soft slate cyan
    '155,145,195',  // muted lavender
    '195,165,115'   // warm soft ochre
  ];

  const signalColors = [
    '105,190,160',  // soft emerald
    '95,175,200',   // quiet cyan
    '165,150,205',  // soft lilac
    '205,170,120',  // muted amber
    '120,200,170'   // gentle mint
  ];

  // 2. Peripheral Dendritic Filaments / Tendrils (Organic Edge Dissolve)
  // These reach outward from boundary nodes into empty space and fade softly to zero
  const tendrilCount = Math.min(48, rimNodes.length);
  const tendrils = [];
  for (let t = 0; t < tendrilCount; t++) {
    const nodeIdx = rimNodes[Math.floor(rand(t, 21) * rimNodes.length)];
    const pt = points[nodeIdx];
    // Outward unit normal
    const len = Math.hypot(pt[0], pt[1], pt[2]) || 1;
    const nx = pt[0] / len;
    const ny = pt[1] / len;
    const nz = pt[2] / len;
    tendrils.push({
      nodeIdx,
      nx, ny, nz,
      lengthScale: 0.08 + rand(t, 22) * 0.12,
      curlSpeed: 0.35 + rand(t, 23) * 0.55,
      phase: rand(t, 24) * Math.PI * 2,
      hasTipSpark: rand(t, 25) > 0.65,
      color: regionColors[pt[3] % 4]
    });
  }

  // 3. Floating Synaptic Dust / Embers (Dissolve into surrounding dark space)
  const EMBER_COUNT = 52;
  const embers = Array.from({ length: EMBER_COUNT }, (_, i) => {
    const anchorIdx = rimNodes[Math.floor(rand(i, 31) * rimNodes.length)];
    const pt = points[anchorIdx];
    return {
      anchorIdx,
      x: pt[0], y: pt[1], z: pt[2],
      vx: (rand(i, 32) - 0.5) * 0.04,
      vy: (rand(i, 33) - 0.5) * 0.04,
      vz: (rand(i, 34) - 0.5) * 0.04,
      life: rand(i, 35),
      speed: 0.12 + rand(i, 36) * 0.18,
      size: 0.8 + rand(i, 37) * 1.2,
      color: signalColors[i % signalColors.length]
    };
  });

  // 4. Atmospheric Background Graph (Geometric clusters blended into deep space)
  const clusterCenters = [
    { cx: 0.14, cy: 0.22, r: 0.15 }, { cx: 0.12, cy: 0.74, r: 0.16 },
    { cx: 0.38, cy: 0.20, r: 0.15 }, { cx: 0.44, cy: 0.80, r: 0.16 },
    { cx: 0.72, cy: 0.22, r: 0.16 }, { cx: 0.84, cy: 0.54, r: 0.17 },
    { cx: 0.68, cy: 0.88, r: 0.15 }, { cx: 0.90, cy: 0.86, r: 0.14 }
  ];
  const fieldCount = 140;
  const field = Array.from({ length: fieldCount }, (_, i) => {
    const c = clusterCenters[i % clusterCenters.length];
    const angle = rand(i, 1) * Math.PI * 2;
    const rad = Math.pow(rand(i, 2), 0.65) * c.r;
    return {
      u: clamp(c.cx + Math.cos(angle) * rad * (1 + rand(i, 3) * 0.3), 0.02, 0.98),
      v: clamp(c.cy + Math.sin(angle) * rad * (1 + rand(i, 4) * 0.3), 0.03, 0.97),
      phase: i * 1.37,
      speed: 0.025 + rand(i, 5) * 0.04,
      hub: (i % 9 === 0),
      cluster: i % clusterCenters.length
    };
  });
  const fieldPositions = field.map(() => [0, 0]);
  const simplices = [];
  for (let c = 0; c < clusterCenters.length; c++) {
    const cNodes = [];
    for (let i = 0; i < fieldCount; i++) if (field[i].cluster === c) cNodes.push(i);
    for (let k = 0; k + 2 < cNodes.length; k += 3) {
      simplices.push([cNodes[k], cNodes[k + 1], cNodes[k + 2]]);
    }
  }
  const bgPulses = Array.from({ length: 14 }, (_, i) => ({
    phase: rand(i, 7),
    speed: 0.0025 + rand(i, 8) * 0.0035
  }));

  // 5. Action Potential Signal Transmission Cascades
  const SIGNAL_COUNT = 32;
  const signals = Array.from({ length: SIGNAL_COUNT }, (_, i) => {
    const start = Math.floor(rand(i, 11) * nodeCount);
    const neighbors = adj[start];
    const next = neighbors.length ? neighbors[Math.floor(rand(i, 12) * neighbors.length)] : (start + 1) % nodeCount;
    return {
      curr: start,
      prev: -1,
      next: next,
      progress: rand(i, 13),
      speed: 0.75 + rand(i, 14) * 1.05,
      hops: 2 + Math.floor(rand(i, 15) * 4),
      color: signalColors[i % signalColors.length]
    };
  });

  // Runtime state
  let w = 0, h = 0, frame = 0, time = 0, previous = 0;
  let playing = !reduced.matches, visible = true, pointer = null;
  const waves = [];

  function resize() {
    const r = canvas.getBoundingClientRect();
    w = r.width;
    h = r.height;
    const dpr = Math.min(devicePixelRatio || 1, 1.6);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!playing || reduced.matches) draw(true);
  }

  // Draw atmospheric background graph
  function renderBackground(mobile) {
    const t = reduced.matches ? 0 : time;
    for (let i = 0; i < field.length; i++) {
      const f = field[i];
      let x = f.u * w + Math.sin(t * f.speed + f.phase) * (mobile ? 3 : 6);
      let y = f.v * h + Math.cos(t * (f.speed * 0.85) + f.phase) * (mobile ? 3 : 6);
      if (pointer && !reduced.matches) {
        const d = Math.hypot(x - pointer.x, y - pointer.y);
        if (d < 150 && d > 1) {
          x += (pointer.x - x) * 0.02;
          y += (pointer.y - y) * 0.02;
        }
      }
      fieldPositions[i][0] = x;
      fieldPositions[i][1] = y;
    }

    // Simplices (subtle geometric facets blended into bg)
    for (let s = 0; s < simplices.length; s++) {
      const [a, b, c] = simplices[s];
      const [xa, ya] = fieldPositions[a], [xb, yb] = fieldPositions[b], [xc, yc] = fieldPositions[c];
      const maxEdge = Math.max(Math.hypot(xa - xb, ya - yb), Math.hypot(xb - xc, yb - yc), Math.hypot(xc - xa, yc - ya));
      const maxDist = mobile ? 140 : Math.min(240, w * 0.22);
      if (maxEdge < maxDist) {
        const alpha = (1 - maxEdge / maxDist);
        ctx.beginPath();
        ctx.moveTo(xa, ya);
        ctx.lineTo(xb, yb);
        ctx.lineTo(xc, yc);
        ctx.closePath();
        ctx.fillStyle = `rgba(80,150,130,${(mobile ? 0.012 : 0.030) * alpha})`;
        ctx.fill();
        ctx.lineWidth = mobile ? 0.4 : 0.55;
        ctx.strokeStyle = `rgba(110,185,155,${(mobile ? 0.035 : 0.075) * alpha})`;
        ctx.stroke();
      }
    }

    // Background graph edges
    const limit = mobile ? 100 : Math.min(190, w * 0.17);
    const activeEdges = [];
    for (let i = 0; i < field.length; i++) {
      const [x, y] = fieldPositions[i];
      let count = 0;
      const sameClusterMax = field[i].hub ? 4 : 2;
      for (let j = i + 1; j < field.length && count < sameClusterMax; j++) {
        const sameClust = (field[i].cluster === field[j].cluster);
        const connLimit = sameClust ? limit : limit * 0.72;
        const [xx, yy] = fieldPositions[j], distance = Math.hypot(x - xx, y - yy);
        if (distance > connLimit) continue;
        const proximity = pointer ? Math.max(0, 1 - Math.hypot((x + xx) / 2 - pointer.x, (y + yy) / 2 - pointer.y) / 150) : 0;
        const baseAlpha = sameClust ? (mobile ? 0.08 : 0.13) : (mobile ? 0.04 : 0.07);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(xx, yy);
        ctx.lineWidth = mobile ? 0.5 : 0.65;
        ctx.strokeStyle = `rgba(115,175,150,${(baseAlpha + proximity * 0.16) * (1 - distance / connLimit * 0.5)})`;
        ctx.stroke();
        if (activeEdges.length < 35) activeEdges.push([i, j]);
        count++;
      }
    }

    // Traveling pulses along background graph edges
    if (!reduced.matches && activeEdges.length > 0) {
      for (let k = 0; k < bgPulses.length; k++) {
        const pulse = bgPulses[k];
        pulse.phase = (pulse.phase + pulse.speed) % 1;
        const edgeIdx = Math.floor(k * (activeEdges.length / bgPulses.length)) % activeEdges.length;
        const [n1, n2] = activeEdges[edgeIdx];
        const [x1, y1] = fieldPositions[n1], [x2, y2] = fieldPositions[n2];
        const px = x1 + (x2 - x1) * pulse.phase, py = y1 + (y2 - y1) * pulse.phase;
        ctx.beginPath();
        ctx.arc(px, py, mobile ? 0.9 : 1.2, 0, Math.PI * 2);
        ctx.fillStyle = mobile ? 'rgba(160,225,190,0.32)' : 'rgba(160,235,190,0.50)';
        ctx.fill();
      }
    }

    // Background graph nodes
    for (let i = 0; i < field.length; i++) {
      const [x, y] = fieldPositions[i];
      const near = pointer ? Math.max(0, 1 - Math.hypot(x - pointer.x, y - pointer.y) / 140) : 0;
      const isH = field[i].hub;
      const r = isH ? (mobile ? 1.5 : 2.0) : (mobile ? 0.85 : 1.15);
      ctx.beginPath();
      ctx.arc(x, y, r + near * 0.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(145,200,170,${isH ? (0.30 + near * 0.25) : (0.16 + near * 0.22)})`;
      ctx.fill();
    }
  }

  // Wave generator (Triggered ONLY on touch / click interaction)
  function spawnWave(x, y, intensity = 0.9, speed = 250) {
    waves.push({
      x, y,
      time,
      speed,
      maxAge: 2.2,
      intensity
    });
    if (waves.length > 5) waves.shift();
  }

  // Main draw loop
  function draw(still = false) {
    ctx.clearRect(0, 0, w, h);
    const mobile = w < 760;
    const isPhone = w < 600;
    const isSmall = w < 960;

    renderBackground(mobile);

    // Interactive 3D perspective and mouse hover tilt (organic & fluid)
    const nx = pointer ? (pointer.x / w - 0.5) * 2 : 0;
    const ny = pointer ? (pointer.y / h - 0.5) * 2 : 0;
    const yaw = -0.72 + (reduced.matches ? 0 : Math.sin(time * 0.08) * 0.045 + nx * 0.065);
    const pitch = 0.22 + (reduced.matches ? 0 : Math.sin(time * 0.06) * 0.015 + ny * 0.030);
    const ya = Math.cos(yaw), yb = Math.sin(yaw), pa = Math.cos(pitch), pb = Math.sin(pitch);

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (let i = 0; i < nodeCount; i++) {
      const [x, y, z] = points[i];
      const xx = x * ya + z * yb;
      const zz = -x * yb + z * ya;
      const yy = y * pa - zz * pb;
      const depth = y * pb + zz * pa;
      const perspective = 1 + depth * 0.048;
      projected[i][0] = xx * perspective;
      projected[i][1] = -yy * perspective;
      projected[i][2] = depth;
      minX = Math.min(minX, projected[i][0]);
      maxX = Math.max(maxX, projected[i][0]);
      minY = Math.min(minY, projected[i][1]);
      maxY = Math.max(maxY, projected[i][1]);
    }

    // Left-centered placement on desktop (cx ~0.32), centered on mobile
    const availableWidth = mobile ? w - 38 : w * 0.64 - 48;
    const availableHeight = h - (mobile ? 34 : 64);
    const scale = Math.min(availableWidth / (maxX - minX), availableHeight / (maxY - minY));
    const cx = mobile ? w * 0.5 : w * 0.32;
    const cy = h * 0.5;
    const mx = (minX + maxX) / 2, my = (minY + maxY) / 2;

    for (let i = 0; i < nodeCount; i++) {
      positions[i][0] = cx + (projected[i][0] - mx) * scale;
      positions[i][1] = cy + (projected[i][1] - my) * scale;
      positions[i][2] = projected[i][2];
    }

    // =========================================================================
    // 1. VOLUMETRIC 4-TIER DEPTH-GRADED EDGES (MUCH BETTER EDGES + DISSOLVE)
    // =========================================================================
    // Instead of 1 flat line for all 11,392 edges, we batch edges into 4 depth
    // paths with organic peripheral dissolve:
    //  - Deep background: soft receding atmospheric teal
    //  - Midground: clean connectome mesh
    //  - Foreground: luminous emerald-cyan tracts
    //  - Highway tracts: bright structural highways between hubs
    const deepEdges = new Path2D();
    const midEdges = new Path2D();
    const frontEdges = new Path2D();
    const highwayEdges = new Path2D();

    for (let i = 0; i < edgeCount; i++) {
      const [a, b] = edges[i];
      const pa = positions[a], pb = positions[b];
      const meanDepth = (pa[2] + pb[2]) * 0.5;

      // Organic edge dissolve at outer perimeter: edges connecting peripheral nodes
      // soften or dissolve away to feather the boundary silhouette
      const rMax = Math.max(radialDist[a], radialDist[b]);
      if (rMax > 1.02 && (i % 3 === 0)) continue; // Natural stippled perimeter dissolve

      if (isHighwayEdge[i]) {
        highwayEdges.moveTo(pa[0], pa[1]);
        highwayEdges.lineTo(pb[0], pb[1]);
      } else if (meanDepth < -0.16) {
        deepEdges.moveTo(pa[0], pa[1]);
        deepEdges.lineTo(pb[0], pb[1]);
      } else if (meanDepth > 0.28) {
        frontEdges.moveTo(pa[0], pa[1]);
        frontEdges.lineTo(pb[0], pb[1]);
      } else {
        midEdges.moveTo(pa[0], pa[1]);
        midEdges.lineTo(pb[0], pb[1]);
      }
    }

    // Render Deep Background Edges (soft atmospheric depth)
    ctx.lineWidth = mobile ? 0.38 : 0.50;
    ctx.strokeStyle = mobile ? 'rgba(65,120,105,0.045)' : 'rgba(75,135,115,0.065)';
    ctx.stroke(deepEdges);

    // Render Midground Connectome Mesh (balanced, clean tracts)
    ctx.lineWidth = mobile ? 0.45 : 0.58;
    ctx.strokeStyle = mobile ? 'rgba(90,155,130,0.075)' : 'rgba(100,165,140,0.10)';
    ctx.stroke(midEdges);

    // Render Foreground Edges (crisp structural tracts, gently increased thickness)
    ctx.lineWidth = mobile ? 0.55 : 0.68;
    ctx.strokeStyle = mobile ? 'rgba(115,185,155,0.11)' : 'rgba(125,195,165,0.14)';
    ctx.stroke(frontEdges);

    // Render Highway Connectome Hub Tracts (prominent integration paths)
    ctx.lineWidth = mobile ? 0.65 : 0.78;
    ctx.strokeStyle = mobile ? 'rgba(130,205,175,0.15)' : 'rgba(140,215,185,0.18)';
    ctx.stroke(highwayEdges);

    // =========================================================================
    // 2. PERIPHERAL DENDRITIC FILAMENTS (ORGANIC EDGE DISSOLVE ARBORIZATION)
    // =========================================================================
    // Outward-reaching dendritic fibers that curl from boundary nodes into space,
    // tapering and dissolving softly to 0 opacity
    if (!isPhone) {
      for (let t = 0; t < tendrils.length; t++) {
        const tendril = tendrils[t];
        const p = positions[tendril.nodeIdx];
        if (!p) continue;

        // Project outward direction based on 3D rotation
        const tx = tendril.nx * ya + tendril.nz * yb;
        const tz = -tendril.nx * yb + tendril.nz * ya;
        const ty = tendril.ny * pa - tz * pb;

        const baseLen = scale * tendril.lengthScale;
        const sway = Math.sin(time * tendril.curlSpeed + tendril.phase) * (scale * 0.025);
        const swayOrthX = -ty * 0.35;
        const swayOrthY = tx * 0.35;

        // 3-point curling filament
        const x1 = p[0] + tx * baseLen * 0.45 + swayOrthX * sway;
        const y1 = p[1] + ty * baseLen * 0.45 + swayOrthY * sway;
        const x2 = p[0] + tx * baseLen + swayOrthX * sway * 1.8;
        const y2 = p[1] + ty * baseLen + swayOrthY * sway * 1.8;

        // Filament line with dissolve fade
        ctx.beginPath();
        ctx.moveTo(p[0], p[1]);
        ctx.quadraticCurveTo(x1, y1, x2, y2);
        ctx.lineWidth = 0.40;
        ctx.strokeStyle = `rgba(${tendril.color},0.07)`;
        ctx.stroke();

        // Optional micro synaptic terminal spark at tip of filament
        if (tendril.hasTipSpark) {
          const pulse = (Math.sin(time * 2.2 + tendril.phase) + 1) * 0.5;
          ctx.beginPath();
          ctx.arc(x2, y2, 0.7 + pulse * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200,235,220,${0.15 + pulse * 0.20})`;
          ctx.fill();
        }
      }
    }

    // =========================================================================
    // 3. DRIFTING SYNAPTIC DUST EMBERS (ORGANIC DISSOLVE INTO SURROUNDING VOID)
    // =========================================================================
    // Motes of bioluminescent dust drifting off the cortex boundary and fading
    if (!reduced.matches) {
      const dtEmber = 0.016;
      for (let i = 0; i < embers.length; i++) {
        const e = embers[i];
        e.life += e.speed * dtEmber;
        if (e.life >= 1.0) {
          // Recycle to a random boundary rim node
          const newAnchor = rimNodes[Math.floor(Math.random() * rimNodes.length)];
          const pt = points[newAnchor];
          e.anchorIdx = newAnchor;
          e.x = pt[0];
          e.y = pt[1];
          e.z = pt[2];
          const len = Math.hypot(pt[0], pt[1], pt[2]) || 1;
          e.vx = (pt[0] / len) * 0.06 + (Math.random() - 0.5) * 0.03;
          e.vy = (pt[1] / len) * 0.06 + (Math.random() - 0.5) * 0.03;
          e.vz = (pt[2] / len) * 0.06 + (Math.random() - 0.5) * 0.03;
          e.life = 0;
        }

        // Advance 3D position
        e.x += e.vx * dtEmber;
        e.y += e.vy * dtEmber;
        e.z += e.vz * dtEmber;

        // Project ember to 2D
        const xx = e.x * ya + e.z * yb;
        const zz = -e.x * yb + e.z * ya;
        const yy = e.y * pa - zz * pb;
        const depth = e.y * pb + zz * pa;
        const pers = 1 + depth * 0.048;
        const sx = cx + (xx * pers - mx) * scale;
        const sy = cy + (-yy * pers - my) * scale;

        // Dissolve alpha: fade-in at birth, long graceful fade-out into void
        const alpha = Math.sin(e.life * Math.PI) * (mobile ? 0.14 : 0.22);
        if (alpha > 0.02) {
          ctx.beginPath();
          ctx.arc(sx, sy, (mobile ? 0.6 : 0.85) * e.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${e.color},${alpha})`;
          ctx.fill();
        }
      }
    }

    // =========================================================================
    // 4. TOUCH / CLICK DEPOLARIZATION WAVES
    // =========================================================================
    const activeWaves = waves.filter(a => time - a.time < a.maxAge);
    for (let wIdx = 0; wIdx < activeWaves.length; wIdx++) {
      const wave = activeWaves[wIdx];
      const age = time - wave.time;
      if (age < 0 || age > wave.maxAge) continue;
      const radius = age * wave.speed;
      const life = 1 - age / wave.maxAge;
      const alpha = life * wave.intensity;

      // Primary wave crest (clean bioluminescent ripple)
      ctx.beginPath();
      ctx.arc(wave.x, wave.y, radius, 0, Math.PI * 2);
      ctx.lineWidth = Math.max(0.6, (mobile ? 0.9 : 1.3) * life);
      ctx.strokeStyle = `rgba(125,225,185,${(mobile ? 0.20 : 0.30) * alpha})`;
      ctx.stroke();

      // Soft secondary harmonic crest
      if (radius > 18) {
        ctx.beginPath();
        ctx.arc(wave.x, wave.y, radius - 18, 0, Math.PI * 2);
        ctx.lineWidth = Math.max(0.5, (mobile ? 0.6 : 0.8) * life);
        ctx.strokeStyle = `rgba(90,200,225,${(mobile ? 0.10 : 0.16) * alpha})`;
        ctx.stroke();
      }

      // Depolarize cortical nodes within the wave crest
      const step = mobile ? 3 : 2;
      for (let i = 0; i < nodeCount; i += step) {
        const p = positions[i];
        const dist = Math.hypot(p[0] - wave.x, p[1] - wave.y);
        const crestDist = Math.abs(dist - radius);
        if (crestDist < 26) {
          const crestGlow = (1 - crestDist / 26) * life * wave.intensity * (mobile ? 0.38 : 0.78);
          if (crestGlow > activation[i]) {
            activation[i] = crestGlow;
          }
        }
      }
    }

    // Pointer hover gentle spark near cursor
    if (pointer && !reduced.matches) {
      for (let i = 0; i < nodeCount; i += 6) {
        const p = positions[i];
        const d = Math.hypot(p[0] - pointer.x, p[1] - pointer.y);
        if (d < 100) {
          const prox = (1 - d / 100) * (mobile ? 0.25 : 0.45);
          if (prox > activation[i]) activation[i] = prox;
        }
      }
    }

    // =========================================================================
    // 5. ACTION POTENTIAL SIGNAL TRANSMISSION (LUMINOUS SYNAPSE SPARKS)
    // =========================================================================
    const dt = 0.022;
    const signalLimit = isPhone ? 12 : (isSmall ? 18 : signals.length);
    for (let k = 0; k < signalLimit; k++) {
      const s = signals[k];
      s.progress += s.speed * dt;

      if (s.progress >= 1) {
        // Excite target soma
        const boost = isPhone ? 0.42 : (isSmall ? 0.60 : 0.88);
        activation[s.next] = Math.min(1.0, activation[s.next] + boost);
        s.hops--;

        if (s.hops > 0) {
          const neighbors = adj[s.next];
          const candidates = neighbors.filter(n => n !== s.curr);
          const nextNode = candidates.length > 0
            ? candidates[Math.floor(Math.random() * candidates.length)]
            : (neighbors.length ? neighbors[0] : (s.next + 1) % nodeCount);

          s.prev = s.curr;
          s.curr = s.next;
          s.next = nextNode;
          s.progress = 0;
        } else {
          const newStart = Math.floor(Math.random() * nodeCount);
          const neighbors = adj[newStart];
          s.curr = newStart;
          s.prev = -1;
          s.next = neighbors.length ? neighbors[Math.floor(Math.random() * neighbors.length)] : (newStart + 1) % nodeCount;
          s.progress = 0;
          s.hops = 2 + Math.floor(Math.random() * 4);
        }
      }

      const p = positions[s.curr], q = positions[s.next];
      if (!p || !q) continue;

      const px = p[0] + (q[0] - p[0]) * s.progress;
      const py = p[1] + (q[1] - p[1]) * s.progress;

      // Trailing luminous synapse comet tail along edge
      const tailProg = Math.max(0, s.progress - (mobile ? 0.18 : 0.26));
      const tx = p[0] + (q[0] - p[0]) * tailProg;
      const ty = p[1] + (q[1] - p[1]) * tailProg;

      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(px, py);
      ctx.lineWidth = mobile ? 0.55 : 0.75;
      ctx.strokeStyle = `rgba(${s.color},${mobile ? 0.18 : 0.26})`;
      ctx.stroke();

      // Traveling action potential photon spark
      ctx.beginPath();
      ctx.arc(px, py, mobile ? 1.2 : 1.7, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${s.color},${mobile ? 0.14 : 0.20})`;
      ctx.fill();

      // Soft nucleus
      ctx.beginPath();
      ctx.arc(px, py, mobile ? 0.6 : 0.85, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.78)';
      ctx.fill();
    }

    // =========================================================================
    // 6. BIO-LUMINESCENT NEURAL SOMAS (CIRCULAR, SOFT, DELICATE)
    // =========================================================================
    // A. Standard Resting Cortical Somas (soft, atmospheric node points)
    for (let reg = 0; reg < 4; reg++) {
      const regColor = regionColors[reg];
      for (let layer = 0; layer < 4; layer++) {
        ctx.fillStyle = `rgba(${regColor},${0.08 + layer * 0.08})`;
        ctx.beginPath();
        for (let i = 0; i < nodeCount; i++) {
          const pt = points[i];
          if (pt[3] !== reg || isHub[i]) continue;

          const p = positions[i];
          const nodeLayer = clamp(Math.floor((p[2] + 1) * 1.7), 0, 3);
          if (nodeLayer !== layer) continue;

          // Dissolve factor: rim nodes become smaller and softer at the boundary
          const rNorm = radialDist[i];
          const dissolve = rNorm > 0.75 ? clamp(1.0 - (rNorm - 0.75) * 1.8, 0.25, 1.0) : 1.0;
          const radius = (0.50 + layer * 0.20) * pt[4] * (mobile ? 0.65 : 0.88) * dissolve;

          ctx.moveTo(p[0] + radius, p[1]);
          ctx.arc(p[0], p[1], radius, 0, Math.PI * 2);
        }
        ctx.fill();
      }
    }

    // B. Major Structural Hub Somas (Prominent Neural Centers)
    const hubBreathing = Math.sin(time * 1.8) * 0.20;
    for (let hIdx = 0; hIdx < hubIndices.length; hIdx++) {
      const i = hubIndices[hIdx];
      const p = positions[i], pt = points[i];
      const regColor = regionColors[pt[3] % 4];
      const depthFactor = clamp((p[2] + 1) * 0.5, 0.4, 1.2);

      // Outer soft aura
      const auraR = (mobile ? 2.0 : 2.8) * depthFactor + hubBreathing;
      ctx.beginPath();
      ctx.arc(p[0], p[1], auraR, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${regColor},${mobile ? 0.06 : 0.10})`;
      ctx.fill();

      // Soma core (soft, blended)
      const coreR = (mobile ? 0.85 : 1.20) * depthFactor;
      ctx.beginPath();
      ctx.arc(p[0], p[1], coreR, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${regColor},${mobile ? 0.32 : 0.44})`;
      ctx.fill();
    }

    // =========================================================================
    // 7. ACTIVE GLOWING NODES (DEPOLARIZED BURSTS & WAVE FRONTS)
    // =========================================================================
    const actThreshold = isPhone ? 0.40 : (isSmall ? 0.28 : 0.18);
    const decayRate = isPhone ? 0.76 : (isSmall ? 0.84 : 0.89);

    for (let i = 0; i < nodeCount; i++) {
      const act = activation[i];
      if (act > actThreshold) {
        const p = positions[i], pt = points[i];
        const regColor = regionColors[pt[3] % 4];

        if (isPhone) {
          const glowR = 1.0 + act * 1.3;
          ctx.beginPath();
          ctx.arc(p[0], p[1], glowR, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${regColor},${act * 0.32})`;
          ctx.fill();
        } else if (isSmall) {
          const glowR = 1.3 + act * 2.0;
          ctx.beginPath();
          ctx.arc(p[0], p[1], glowR, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${regColor},${act * 0.45})`;
          ctx.fill();

          if (act > 0.42) {
            ctx.beginPath();
            ctx.arc(p[0], p[1], 0.95, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255,255,255,0.85)';
            ctx.fill();
          }
        } else {
          // Desktop: radiant phosphorescent aura + crisp center spark
          const glowR = 1.8 + act * 3.2;
          ctx.beginPath();
          ctx.arc(p[0], p[1], glowR, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${regColor},${act * 0.60})`;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(p[0], p[1], 1.1 + act * 0.7, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(165,245,215,${act * 0.80})`;
          ctx.fill();

          if (act > 0.38) {
            ctx.beginPath();
            ctx.arc(p[0], p[1], 1.15, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
          }
        }
      }
      activation[i] *= decayRate;
    }

    while (waves.length && time - waves[0].time >= waves[0].maxAge) waves.shift();
    if (!still) document.querySelector('.hero-background').classList.add('ready');
  }

  function tick(now) {
    if (!playing || !visible || document.hidden) return;
    if (now - previous > 18) {
      time += Math.min(0.04, (now - previous) / 1000 || 0.028);
      previous = now;
      draw();
    }
    frame = requestAnimationFrame(tick);
  }

  function sync() {
    cancelAnimationFrame(frame);
    if (motion) {
      motion.textContent = playing ? 'Ⅱ' : '▷';
      motion.setAttribute('aria-label', playing ? 'Pause brain animation' : 'Play brain animation');
      motion.title = playing ? 'Pause animation' : 'Play animation';
    }
    if (playing && visible && !document.hidden) {
      previous = performance.now();
      frame = requestAnimationFrame(tick);
    } else {
      draw(true);
    }
  }

  if (motion) motion.addEventListener('click', () => { playing = !playing; sync(); });

  function locate(e) {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  // Pointer move: updates parallax tilt and local hover excitation without spawning waves
  hero.addEventListener('pointermove', e => {
    if (e.pointerType === 'touch') return;
    pointer = locate(e);
    if (!playing) draw(true);
  });

  hero.addEventListener('pointerleave', () => {
    pointer = null;
    if (!playing) draw(true);
  });

  // WAVES & NODE HIGHLIGHT ON TOUCH / CLICK:
  hero.addEventListener('pointerdown', e => {
    if (e.target.closest('a,button') || reduced.matches || !playing) return;
    pointer = locate(e);
    spawnWave(pointer.x, pointer.y, 1.0, 260);

    // Directly highlight nodes around the touch point
    const isMobile = (w < 760);
    const radius = isMobile ? 80 : 110;
    for (let i = 0; i < nodeCount; i++) {
      const p = positions[i];
      const d = Math.hypot(p[0] - pointer.x, p[1] - pointer.y);
      if (d < radius) {
        const tapPower = (1 - d / radius) * (isMobile ? 0.65 : 0.95);
        if (tapPower > activation[i]) activation[i] = tapPower;
      }
    }
  });

  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    sync();
  }, { threshold: 0.05 }).observe(canvas);

  document.addEventListener('visibilitychange', sync);
  reduced.addEventListener('change', () => { playing = !reduced.matches; sync(); });

  resize();
  draw();
  sync();
})();
