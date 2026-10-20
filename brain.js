'use strict';
// Refined cortical connectome with atmospheric background graph, touch-activated waves,
// and bio-luminescent action potential cascades. Derived from ICBM152 brain template.
(()=>{
  const hero = document.querySelector('.neural-hero');
  const canvas = document.querySelector('#brain-canvas');
  if (!hero || !canvas || !window.BRAIN_GRAPH) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  const { points, edges } = window.BRAIN_GRAPH;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const motion = document.querySelector('#motion');

  // Adjacency list for directional signal paths
  const adj = Array.from({ length: points.length }, () => []);
  for (let i = 0; i < edges.length; i++) {
    const [a, b] = edges[i];
    adj[a].push(b);
    adj[b].push(a);
  }

  const projected = points.map(() => [0, 0, 0]);
  const positions = points.map(() => [0, 0, 0]);
  const activation = new Float32Array(points.length);

  // Elegant bioluminescent palette (calibrated for deep contrast & subtlety)
  const signalColors = [
    '64,215,160',   // sage emerald
    '70,195,235',   // soft cyan
    '175,150,235',  // muted lavender
    '235,190,90',   // soft amber
    '115,225,185'   // mint
  ];
  const nodeLayerColors = ['155,205,185', '180,170,220', '220,190,145', '165,200,160'];

  let w = 0, h = 0, frame = 0, time = 0, previous = 0;
  let playing = !reduced.matches, visible = true, pointer = null;

  const waves = [];

  const fract = x => x - Math.floor(x);
  const rand = (i, seed = 1) => fract(Math.sin(i * 12.9898 + seed * 43.123) * 43758.5453);

  // Background graph: distributed interconnected clusters blended softly into background
  const clusterCenters = [
    { cx: 0.14, cy: 0.22, r: 0.15 }, { cx: 0.12, cy: 0.74, r: 0.16 },
    { cx: 0.38, cy: 0.20, r: 0.15 }, { cx: 0.44, cy: 0.80, r: 0.16 },
    { cx: 0.72, cy: 0.22, r: 0.16 }, { cx: 0.84, cy: 0.54, r: 0.17 },
    { cx: 0.68, cy: 0.88, r: 0.15 }, { cx: 0.90, cy: 0.86, r: 0.14 }
  ];
  const fieldCount = 145;
  const field = Array.from({ length: fieldCount }, (_, i) => {
    const c = clusterCenters[i % clusterCenters.length];
    const angle = rand(i, 1) * Math.PI * 2, rad = Math.pow(rand(i, 2), 0.65) * c.r;
    const isHub = (i % 10 === 0);
    return {
      u: Math.max(0.02, Math.min(0.98, c.cx + Math.cos(angle) * rad * (1 + rand(i, 3) * 0.3))),
      v: Math.max(0.03, Math.min(0.97, c.cy + Math.sin(angle) * rad * (1 + rand(i, 4) * 0.3))),
      phase: i * 1.37,
      speed: 0.025 + rand(i, 5) * 0.04,
      hub: isHub,
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

  // Signal transmission on the 3D cortical connectome
  const SIGNAL_COUNT = 30;
  const signals = Array.from({ length: SIGNAL_COUNT }, (_, i) => {
    const start = Math.floor(rand(i, 11) * points.length);
    const neighbors = adj[start];
    const next = neighbors.length ? neighbors[Math.floor(rand(i, 12) * neighbors.length)] : (start + 1) % points.length;
    return {
      curr: start,
      prev: -1,
      next: next,
      progress: rand(i, 13),
      speed: 0.65 + rand(i, 14) * 0.90,
      hops: 2 + Math.floor(rand(i, 15) * 4),
      color: signalColors[i % signalColors.length]
    };
  });

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

  // Atmospheric background graph: blended softly into deep space
  function background(mobile) {
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
        ctx.fillStyle = `rgba(95,160,135,${(mobile ? 0.015 : 0.035) * alpha})`;
        ctx.fill();
        ctx.lineWidth = mobile ? 0.45 : 0.6;
        ctx.strokeStyle = `rgba(120,190,160,${(mobile ? 0.045 : 0.085) * alpha})`;
        ctx.stroke();
      }
    }

    // Background graph edges (delicate, blended, visible)
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
        const baseAlpha = sameClust ? (mobile ? 0.09 : 0.14) : (mobile ? 0.05 : 0.08);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(xx, yy);
        ctx.lineWidth = mobile ? 0.5 : 0.7;
        ctx.strokeStyle = `rgba(125,180,155,${(baseAlpha + proximity * 0.18) * (1 - distance / connLimit * 0.5)})`;
        ctx.stroke();
        if (activeEdges.length < 35) activeEdges.push([i, j]);
        count++;
      }
    }

    // Subtle traveling signal pulses along background graph edges
    if (!reduced.matches && activeEdges.length > 0) {
      for (let k = 0; k < bgPulses.length; k++) {
        const pulse = bgPulses[k];
        pulse.phase = (pulse.phase + pulse.speed) % 1;
        const edgeIdx = Math.floor(k * (activeEdges.length / bgPulses.length)) % activeEdges.length;
        const [n1, n2] = activeEdges[edgeIdx];
        const [x1, y1] = fieldPositions[n1], [x2, y2] = fieldPositions[n2];
        const px = x1 + (x2 - x1) * pulse.phase, py = y1 + (y2 - y1) * pulse.phase;
        ctx.beginPath();
        ctx.arc(px, py, mobile ? 0.9 : 1.3, 0, Math.PI * 2);
        ctx.fillStyle = mobile ? 'rgba(165,225,195,0.35)' : 'rgba(165,235,195,0.55)';
        ctx.fill();
      }
    }

    // Background graph nodes (soft blended halos)
    for (let i = 0; i < field.length; i++) {
      const [x, y] = fieldPositions[i];
      const near = pointer ? Math.max(0, 1 - Math.hypot(x - pointer.x, y - pointer.y) / 140) : 0;
      const isHub = field[i].hub;
      const r = isHub ? (mobile ? 1.6 : 2.1) : (mobile ? 0.9 : 1.2);
      ctx.beginPath();
      ctx.arc(x, y, r + near * 0.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(150,205,175,${isHub ? (0.32 + near * 0.28) : (0.18 + near * 0.25)})`;
      ctx.fill();
    }
  }

  // Wave generator (Triggered ONLY on touch / click interaction)
  function spawnWave(x, y, intensity = 0.85, speed = 240) {
    waves.push({
      x,
      y,
      time,
      speed,
      maxAge: 2.1,
      intensity
    });
    if (waves.length > 5) waves.shift();
  }

  function draw(still = false) {
    ctx.clearRect(0, 0, w, h);
    const mobile = w < 760;
    const isPhone = w < 600;
    const isSmall = w < 960;

    background(mobile);

    // Interactive 3D perspective and mouse hover tilt (fun & responsive!)
    const nx = pointer ? (pointer.x / w - 0.5) * 2 : 0;
    const ny = pointer ? (pointer.y / h - 0.5) * 2 : 0;
    const yaw = -0.72 + (reduced.matches ? 0 : Math.sin(time * 0.08) * 0.045 + nx * 0.06);
    const pitch = 0.22 + (reduced.matches ? 0 : Math.sin(time * 0.06) * 0.015 + ny * 0.025);
    const ya = Math.cos(yaw), yb = Math.sin(yaw), pa = Math.cos(pitch), pb = Math.sin(pitch);

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (let i = 0; i < points.length; i++) {
      const [x, y, z] = points[i];
      const xx = x * ya + z * yb;
      const zz = -x * yb + z * ya;
      const yy = y * pa - zz * pb;
      const depth = y * pb + zz * pa;
      const perspective = 1 + depth * 0.045;
      projected[i][0] = xx * perspective;
      projected[i][1] = -yy * perspective;
      projected[i][2] = depth;
      minX = Math.min(minX, projected[i][0]);
      maxX = Math.max(maxX, projected[i][0]);
      minY = Math.min(minY, projected[i][1]);
      maxY = Math.max(maxY, projected[i][1]);
    }

    // POSITIONING: Left-centered like before (cx ~0.32 on desktop)
    const availableWidth = mobile ? w - 38 : w * 0.64 - 48;
    const availableHeight = h - (mobile ? 34 : 64);
    const scale = Math.min(availableWidth / (maxX - minX), availableHeight / (maxY - minY));
    const cx = mobile ? w * 0.5 : w * 0.32;
    const cy = h * 0.5;
    const mx = (minX + maxX) / 2, my = (minY + maxY) / 2;

    for (let i = 0; i < points.length; i++) {
      positions[i][0] = cx + (projected[i][0] - mx) * scale;
      positions[i][1] = cy + (projected[i][1] - my) * scale;
      positions[i][2] = projected[i][2];
    }

    // 1. Draw base anatomical connectome mesh edges (fine, clean, professional)
    ctx.beginPath();
    for (let i = 0; i < edges.length; i++) {
      const [a, b] = edges[i];
      ctx.moveTo(positions[a][0], positions[a][1]);
      ctx.lineTo(positions[b][0], positions[b][1]);
    }
    ctx.lineWidth = mobile ? 0.45 : 0.55;
    ctx.strokeStyle = mobile ? 'rgba(135,170,155,0.08)' : 'rgba(135,170,155,0.12)';
    ctx.stroke();

    // 2. Ripple waves (Triggered ONLY when touched / clicked; softly blended into bg)
    const activeWaves = waves.filter(a => time - a.time < a.maxAge);
    for (let wIdx = 0; wIdx < activeWaves.length; wIdx++) {
      const wave = activeWaves[wIdx];
      const age = time - wave.time;
      if (age < 0 || age > wave.maxAge) continue;
      const radius = age * wave.speed;
      const life = 1 - age / wave.maxAge;
      const alpha = life * wave.intensity;

      // Primary wave crest (subtly blended)
      ctx.beginPath();
      ctx.arc(wave.x, wave.y, radius, 0, Math.PI * 2);
      ctx.lineWidth = Math.max(0.6, (mobile ? 0.9 : 1.3) * life);
      ctx.strokeStyle = `rgba(115,220,175,${(mobile ? 0.20 : 0.32) * alpha})`;
      ctx.stroke();

      // Soft secondary harmonic crest
      if (radius > 16) {
        ctx.beginPath();
        ctx.arc(wave.x, wave.y, radius - 16, 0, Math.PI * 2);
        ctx.lineWidth = Math.max(0.5, (mobile ? 0.6 : 0.8) * life);
        ctx.strokeStyle = `rgba(85,195,220,${(mobile ? 0.10 : 0.16) * alpha})`;
        ctx.stroke();
      }

      // Cortical depolarization along wave crest
      const step = mobile ? 3 : 2;
      for (let i = 0; i < positions.length; i += step) {
        const p = positions[i];
        const dist = Math.hypot(p[0] - wave.x, p[1] - wave.y);
        const crestDist = Math.abs(dist - radius);
        if (crestDist < 22) {
          const crestGlow = (1 - crestDist / 22) * life * wave.intensity * (mobile ? 0.35 : 0.65);
          if (crestGlow > activation[i]) {
            activation[i] = crestGlow;
          }
        }
      }
    }

    // Pointer hover excitation (gentle local spark near cursor)
    if (pointer && !reduced.matches) {
      for (let i = 0; i < positions.length; i += 6) {
        const p = positions[i];
        const d = Math.hypot(p[0] - pointer.x, p[1] - pointer.y);
        if (d < 95) {
          const prox = (1 - d / 95) * (mobile ? 0.25 : 0.45);
          if (prox > activation[i]) activation[i] = prox;
        }
      }
    }

    // 3. Directional action potential signal transmission
    const dt = 0.022;
    const signalLimit = isPhone ? 10 : (isSmall ? 16 : signals.length);
    for (let k = 0; k < signalLimit; k++) {
      const s = signals[k];
      s.progress += s.speed * dt;

      if (s.progress >= 1) {
        // Trigger activation at destination node
        const boost = isPhone ? 0.38 : (isSmall ? 0.55 : 0.85);
        activation[s.next] = Math.min(1.0, activation[s.next] + boost);
        s.hops--;

        if (s.hops > 0) {
          const neighbors = adj[s.next];
          const candidates = neighbors.filter(n => n !== s.curr);
          const nextNode = candidates.length > 0
            ? candidates[Math.floor(Math.random() * candidates.length)]
            : (neighbors.length ? neighbors[0] : (s.next + 1) % points.length);

          s.prev = s.curr;
          s.curr = s.next;
          s.next = nextNode;
          s.progress = 0;
        } else {
          const newStart = Math.floor(Math.random() * points.length);
          const neighbors = adj[newStart];
          s.curr = newStart;
          s.prev = -1;
          s.next = neighbors.length ? neighbors[Math.floor(Math.random() * neighbors.length)] : (newStart + 1) % points.length;
          s.progress = 0;
          s.hops = 2 + Math.floor(Math.random() * 4);
        }
      }

      const p = positions[s.curr], q = positions[s.next];
      if (!p || !q) continue;

      const px = p[0] + (q[0] - p[0]) * s.progress;
      const py = p[1] + (q[1] - p[1]) * s.progress;

      // Delicate synapse trail
      const tailProg = Math.max(0, s.progress - (mobile ? 0.16 : 0.22));
      const tx = p[0] + (q[0] - p[0]) * tailProg;
      const ty = p[1] + (q[1] - p[1]) * tailProg;

      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(px, py);
      ctx.lineWidth = mobile ? 0.65 : 0.85;
      ctx.strokeStyle = `rgba(${s.color},${mobile ? 0.30 : 0.42})`;
      ctx.stroke();

      // Traveling signal spark
      ctx.beginPath();
      ctx.arc(px, py, mobile ? 1.4 : 2.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${s.color},${mobile ? 0.16 : 0.22})`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(px, py, mobile ? 0.75 : 1.05, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.92)';
      ctx.fill();
    }

    // 4. Base resting cortical nodes
    for (let g = 0; g < 4; g++) {
      for (let layer = 0; layer < 4; layer++) {
        ctx.fillStyle = `rgba(${nodeLayerColors[g]},${0.16 + layer * 0.15})`;
        ctx.beginPath();
        for (let i = 0; i < points.length; i++) {
          const p = positions[i], pt = points[i];
          if (pt[3] !== g || Math.min(3, Math.max(0, Math.floor((p[2] + 1) * 1.7))) !== layer) continue;
          const r = (0.65 + layer * 0.24) * pt[4] * (mobile ? 0.75 : 1);
          ctx.rect(p[0] - r * 0.5, p[1] - r * 0.5, r, r);
        }
        ctx.fill();
      }
    }

    // 5. Active Glowing Nodes (Awesome on desktop; decreased & subtle on phone/small screens)
    const actThreshold = isPhone ? 0.44 : (isSmall ? 0.32 : 0.20);
    const decayRate = isPhone ? 0.74 : (isSmall ? 0.82 : 0.88);

    for (let i = 0; i < points.length; i++) {
      const act = activation[i];
      if (act > actThreshold) {
        const p = positions[i];

        if (isPhone) {
          // Decreased highlight on phone: small subtle halo, gentle opacity
          const glowR = 0.7 + act * 0.8;
          ctx.beginPath();
          ctx.arc(p[0], p[1], glowR, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(120,220,175,${act * 0.22})`;
          ctx.fill();
        } else if (isSmall) {
          // Moderately decreased on tablet
          const glowR = 1.1 + act * 1.6;
          ctx.beginPath();
          ctx.arc(p[0], p[1], glowR, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(105,225,175,${act * 0.42})`;
          ctx.fill();

          if (act > 0.55) {
            ctx.beginPath();
            ctx.arc(p[0], p[1], 0.85, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255,255,255,0.85)';
            ctx.fill();
          }
        } else {
          // Full AWESOME highlight on desktop: radiant halo + white core spark
          const glowR = 1.6 + act * 3.2;
          ctx.beginPath();
          ctx.arc(p[0], p[1], glowR, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(105,230,175,${act * 0.68})`;
          ctx.fill();

          if (act > 0.44) {
            ctx.beginPath();
            ctx.arc(p[0], p[1], 1.2, 0, Math.PI * 2);
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
    if (now - previous > 20) {
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

  // WAVES ONLY ON TOUCH / CLICK:
  hero.addEventListener('pointerdown', e => {
    if (e.target.closest('a,button') || reduced.matches || !playing) return;
    pointer = locate(e);
    spawnWave(pointer.x, pointer.y, 0.9, 250);
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
