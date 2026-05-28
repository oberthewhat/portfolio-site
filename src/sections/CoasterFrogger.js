import { useEffect, useRef, useState, useCallback } from 'react';
import './CoasterFrogger.css';

const COLS = 13;
const ROWS = 13;
const CELL = 54;
const W = COLS * CELL;
const H = ROWS * CELL;

const SAFE_ROWS = new Set([0, 6, 12]);
const FLUME_ROWS = new Set([3, 9]);
const WATER_ROWS = new Set([3, 9]); // same as flume, water underneath logs

const LOG_W = 110;
const LOG_H = 30;
const CAR_W = 46;
const CAR_H = 32;
const TRAM_W = 52;
const TRAM_H = 36;
const CARS_PER_TRAIN = 3;

function randBetween(a, b) { return a + Math.random() * (b - a); }

// All trains in a row share the same speed
const LANE_CONFIG = [
  { row: 1,  baseSpeed: 0.8, dir:  1, color: '#C4521A', type: 'coaster' },
  { row: 2,  baseSpeed: 1.1, dir: -1, color: '#4A7FA5', type: 'coaster' },
  { row: 3,  baseSpeed: 0.7, dir:  1, color: '#2255AA', type: 'flume'   },
  { row: 4,  baseSpeed: 0.9, dir: -1, color: '#E8842A', type: 'tram'    },
  { row: 5,  baseSpeed: 1.3, dir:  1, color: '#9B2335', type: 'coaster' },
  { row: 7,  baseSpeed: 0.75, dir: -1, color: '#3A6B3F', type: 'tram'   },
  { row: 8,  baseSpeed: 1.0, dir:  1, color: '#C4521A', type: 'coaster' },
  { row: 9,  baseSpeed: 0.6, dir: -1, color: '#2255AA', type: 'flume'   },
  { row: 10, baseSpeed: 1.4, dir:  1, color: '#E8842A', type: 'coaster' },
  { row: 11, baseSpeed: 0.85, dir: -1, color: '#9B2335', type: 'tram'   },
];

function makeLaneObjects(lane, level) {
  const levelMult = 1 + (level - 1) * 0.12;
  // ONE speed for the whole row — randomized once
  const rowSpeed = randBetween(lane.baseSpeed * 0.8, lane.baseSpeed * 1.2) * levelMult;

  const objects = [];
  const isFlume = lane.type === 'flume';
  const objW = isFlume ? LOG_W : (lane.type === 'tram' ? TRAM_W : CAR_W) * CARS_PER_TRAIN;
  const count = isFlume ? Math.floor(randBetween(3, 5)) : Math.floor(randBetween(2, 4));
  const minGap = isFlume ? 80 : 120;
  const maxGap = isFlume ? 200 : 320;

  let cursor = lane.dir === 1
    ? -objW - 30
    : W + 30;

  for (let i = 0; i < count; i++) {
    const gap = randBetween(minGap, maxGap);
    objects.push({
      x: cursor,
      speed: rowSpeed,       // same for every object in this row
      dir: lane.dir,
      row: lane.row,
      color: lane.color,
      type: lane.type,
      w: objW,
    });
    cursor += lane.dir === 1
      ? -(objW + gap)
      : (objW + gap);
  }
  return objects;
}

function initAllObjects(level = 1) {
  return LANE_CONFIG.flatMap(lane => makeLaneObjects(lane, level));
}

function initPlayer() { 
  return { 
    col: 6, 
    row: 12, 
    facing: 'up', 
    onLog: null,
    pixelX: 6 * CELL + (CELL - 36) / 2, // track exact pixel position for log riding
  }; 
}

const KEY_MAP = {
  ArrowUp:    { dc: 0, dr: -1, facing: 'up'    },
  ArrowDown:  { dc: 0, dr:  1, facing: 'down'  },
  ArrowLeft:  { dc: -1, dr: 0, facing: 'left'  },
  ArrowRight: { dc:  1, dr: 0, facing: 'right' },
  w: { dc: 0, dr: -1, facing: 'up'    },
  s: { dc: 0, dr:  1, facing: 'down'  },
  a: { dc: -1, dr: 0, facing: 'left'  },
  d: { dc:  1, dr: 0, facing: 'right' },
};

function drawCoasterCar(ctx, x, y, w, h, color, carIdx, totalCars) {
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.roundRect(x + 1, y + 2, w - 2, h - 4, 5); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  ctx.beginPath(); ctx.roundRect(x + 3, y + 3, w - 6, (h - 6) * 0.45, 3); ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,0.28)';
  ctx.fillRect(x + 4, y + h * 0.52, w - 8, 3);
  ctx.fillStyle = '#1a1610';
  const ws = 5;
  [[x + 4, y + 4],[x + w - 4, y + 4],[x + 4, y + h - 4],[x + w - 4, y + h - 4]].forEach(([ex, ey]) => {
    ctx.beginPath(); ctx.ellipse(ex, ey, ws, ws * 0.55, 0, 0, Math.PI * 2); ctx.fill();
  });
  if (carIdx < totalCars - 1) { ctx.fillStyle = '#666'; ctx.fillRect(x + w - 2, y + h / 2 - 2, 4, 4); }
  if (carIdx > 0)              { ctx.fillStyle = '#666'; ctx.fillRect(x - 2,     y + h / 2 - 2, 4, 4); }
}

function drawTramCar(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.roundRect(x + 1, y + 1, w - 2, h - 2, 8); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.22)';
  ctx.beginPath(); ctx.roundRect(x + 4, y + 4, w - 8, h * 0.38, 5); ctx.fill();
  ctx.fillStyle = 'rgba(180,220,255,0.45)';
  ctx.fillRect(x + 5, y + h * 0.55, w - 10, h * 0.28);
  ctx.fillStyle = 'rgba(255,255,255,0.28)';
  ctx.fillRect(x + 1, y + h * 0.48, w - 2, 2);
  ctx.fillStyle = '#1a1610';
  const ws = 5;
  [[x + 6, y + 4],[x + w - 6, y + 4],[x + 6, y + h - 4],[x + w - 6, y + h - 4]].forEach(([ex, ey]) => {
    ctx.beginPath(); ctx.ellipse(ex, ey, ws, ws * 0.55, 0, 0, Math.PI * 2); ctx.fill();
  });
}

function drawLog(ctx, x, y, w, h, img) {
  if (img) { ctx.drawImage(img, x, y, w, h); return; }
  // Log shape — brown oval with wood grain
  ctx.fillStyle = '#7B4A1E';
  ctx.beginPath(); ctx.roundRect(x, y + 3, w, h - 6, h / 2 - 3); ctx.fill();
  // Grain lines
  ctx.strokeStyle = 'rgba(0,0,0,0.2)'; ctx.lineWidth = 1.5;
  for (let i = 1; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(x + w * 0.1, y + 3 + (h - 6) * (i / 4));
    ctx.lineTo(x + w * 0.9, y + 3 + (h - 6) * (i / 4));
    ctx.stroke();
  }
  // End rings
  ctx.fillStyle = '#5C3510';
  ctx.beginPath(); ctx.ellipse(x + 10, y + h / 2, 8, h / 2 - 4, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#7B4A1E';
  ctx.beginPath(); ctx.ellipse(x + 10, y + h / 2, 5, h / 2 - 7, 0, 0, Math.PI * 2); ctx.fill();
  // Flume water in log
  ctx.fillStyle = 'rgba(100,180,255,0.3)';
  ctx.beginPath(); ctx.roundRect(x + 16, y + h * 0.35, w - 26, h * 0.35, 4); ctx.fill();
  // Splash marks
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.beginPath(); ctx.arc(x + 20, y + 5, 3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + w - 15, y + h - 6, 2, 0, Math.PI * 2); ctx.fill();
}

function drawGuest(ctx, x, y, size, facing, isDead, imgs) {
  const img = isDead ? imgs['guest-hit'] : imgs[`guest-${facing}`] || imgs['guest-up'] || imgs['guest'];
  if (img) { ctx.drawImage(img, x, y, size, size); return; }
  const cx = x + size / 2, cy = y + size / 2;
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.beginPath(); ctx.ellipse(cx, cy + 4, size * 0.32, size * 0.15, 0, 0, Math.PI * 2); ctx.fill();
  if (isDead) {
    ctx.fillStyle = '#FAF6EF';
    ctx.beginPath(); ctx.arc(cx, cy - 4, 9, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#C4521A'; ctx.lineWidth = 2.5;
    [[cx-5,cy-9,cx+5,cy+1],[cx+5,cy-9,cx-5,cy+1],[cx-5,cy+1,cx+5,cy+1]].forEach(([x1,y1,x2,y2]) => {
      ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
    });
    ctx.fillStyle = '#E8842A';
    ctx.beginPath(); ctx.roundRect(cx - 7, cy + 3, 14, 10, 3); ctx.fill();
    return;
  }
  const hx = facing === 'left' ? cx - 4 : facing === 'right' ? cx + 4 : cx;
  const hy = cy - 4 + (facing === 'up' ? -5 : facing === 'down' ? 3 : 0);
  ctx.fillStyle = '#E8842A';
  ctx.beginPath(); ctx.ellipse(cx, cy + 3, size * 0.27, size * 0.33, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#FAF6EF';
  ctx.beginPath(); ctx.arc(hx, hy, 8, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#5C3D1E';
  ctx.beginPath(); ctx.arc(hx, hy - 2, 5.5, Math.PI, 0); ctx.fill();
  ctx.fillStyle = '#C4521A';
  ctx.beginPath(); ctx.roundRect(cx - 5, cy + 6, 10, 6, 2); ctx.fill();
}

export default function CoasterFrogger() {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    player: initPlayer(),
    objects: initAllObjects(1),
    lives: 3, score: 0, level: 1,
    phase: 'idle',
    deathTimer: 0,
    imgs: {},
    particles: [],
  });
  const animRef = useRef(null);
  const [display, setDisplay] = useState({ lives: 3, score: 0, level: 1, phase: 'idle' });

  useEffect(() => {
    const s = stateRef.current;
    ['guest-up','guest-down','guest-left','guest-right','guest-hit','coaster-top','tram-top','log-top'].forEach(name => {
      const img = new Image(); img.src = `/${name}.png`;
      img.onload = () => { s.imgs[name] = img; };
    });
  }, []);

  const sync = useCallback(() => {
    const s = stateRef.current;
    setDisplay({ lives: s.lives, score: s.score, level: s.level, phase: s.phase });
  }, []);

  const spawnParticles = useCallback((px, py, water = false) => {
    const s = stateRef.current;
    for (let i = 0; i < 14; i++) {
      const angle = (Math.PI * 2 * i) / 14 + Math.random() * 0.4;
      const spd = randBetween(1.5, 4.5);
      s.particles.push({
        x: px, y: py,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd - (water ? 2 : 0),
        life: 45, maxLife: 45,
        color: water
          ? ['#60B8FF','#A8D8FF','#FFFFFF','#3090EE'][Math.floor(Math.random() * 4)]
          : ['#E8842A','#C4521A','#FAF6EF','#F5C97A'][Math.floor(Math.random() * 4)],
        size: randBetween(2, water ? 5 : 7),
      });
    }
  }, []);

  // Check if player is on a log this frame; returns log or null
  const getLogUnder = useCallback(() => {
    const s = stateRef.current;
    if (!FLUME_ROWS.has(s.player.row)) return null;
    // Use pixel center of player
    const px = s.player.pixelX + 18; // center of 36px guest
    const py = s.player.row * CELL + CELL / 2;
    for (const obj of s.objects) {
      if (obj.type !== 'flume' || obj.row !== s.player.row) continue;
      const ch = LOG_H;
      const top = obj.row * CELL + (CELL - ch) / 2;
      if (px > obj.x + 2 && px < obj.x + obj.w - 2 && py > top - 4 && py < top + ch + 4) {
        return obj;
      }
    }
    return null;
  }, []);

  const checkTrainCollision = useCallback(() => {
    const s = stateRef.current;
    if (SAFE_ROWS.has(s.player.row) || FLUME_ROWS.has(s.player.row)) return false;
    const px = s.player.col * CELL + CELL / 2;
    const py = s.player.row * CELL + CELL / 2;
    for (const obj of s.objects) {
      if (obj.row !== s.player.row || obj.type === 'flume') continue;
      const cw = obj.type === 'tram' ? TRAM_W : CAR_W;
      const ch = obj.type === 'tram' ? TRAM_H : CAR_H;
      const top = obj.row * CELL + (CELL - ch) / 2;
      if (px > obj.x + 8 && px < obj.x + obj.w - 8 && py > top + 6 && py < top + ch - 6) return true;
    }
    return false;
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const s = stateRef.current;

    ctx.fillStyle = '#2A2520';
    ctx.fillRect(0, 0, W, H);

    // Draw rows
    for (let r = 0; r < ROWS; r++) {
      const y = r * CELL;
      if (r === 0) {
        ctx.fillStyle = '#2D5A32';
        ctx.fillRect(0, y, W, CELL);
        ctx.fillStyle = 'rgba(255,255,255,0.06)';
        for (let c = 0; c < COLS; c++) ctx.fillRect(c * CELL + 14, y + 16, 5, 5);
        ctx.fillStyle = 'rgba(232,132,42,0.75)';
        ctx.font = 'bold 11px DM Sans, sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('🎢  PARK ENTRANCE  🎢', W / 2, y + CELL / 2 + 4);
        ctx.textAlign = 'left';
      } else if (r === 6) {
        ctx.fillStyle = '#3D3530'; ctx.fillRect(0, y, W, CELL);
        ctx.strokeStyle = 'rgba(232,132,42,0.35)'; ctx.lineWidth = 2; ctx.setLineDash([8, 6]);
        ctx.beginPath(); ctx.moveTo(0, y + CELL / 2); ctx.lineTo(W, y + CELL / 2); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = 'rgba(232,132,42,0.6)'; ctx.font = '10px DM Sans, sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('SAFE ZONE', W / 2, y + CELL / 2 + 4); ctx.textAlign = 'left';
      } else if (r === 12) {
        ctx.fillStyle = '#35302B'; ctx.fillRect(0, y, W, CELL);
        ctx.fillStyle = 'rgba(253,249,243,0.3)'; ctx.font = '10px DM Sans, sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('PARKING LOT — START HERE', W / 2, y + CELL / 2 + 4); ctx.textAlign = 'left';
      } else if (FLUME_ROWS.has(r)) {
        // Water channel
        ctx.fillStyle = '#1244AA'; ctx.fillRect(0, y, W, CELL);
        // Animated water ripples
        const t = Date.now() / 800;
        for (let c = 0; c < W; c += 28) {
          ctx.fillStyle = 'rgba(100,180,255,0.15)';
          ctx.fillRect(c + Math.sin(t + c * 0.05) * 4, y + 8, 18, 3);
          ctx.fillRect(c + 12 + Math.sin(t * 1.3 + c * 0.05) * 4, y + CELL - 12, 14, 3);
        }
        ctx.fillStyle = 'rgba(100,200,255,0.2)'; ctx.font = '10px DM Sans, sans-serif'; ctx.textAlign = 'right';
        ctx.fillText('🌊 LOG FLUME — ride the log!', W - 8, y + CELL - 8); ctx.textAlign = 'left';
      } else {
        // Track lane
        ctx.fillStyle = r % 2 === 0 ? '#1C1814' : '#201C18';
        ctx.fillRect(0, y, W, CELL);
        ctx.fillStyle = 'rgba(255,255,255,0.07)';
        ctx.fillRect(0, y + 6, W, 2); ctx.fillRect(0, y + CELL - 8, W, 2);
        ctx.fillStyle = 'rgba(255,255,255,0.03)';
        for (let c = 0; c < COLS; c++) ctx.fillRect(c * CELL + CELL * 0.3, y + 8, 4, CELL - 16);
        const lane = LANE_CONFIG.find(l => l.row === r);
        if (lane) {
          ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.font = '10px DM Sans, sans-serif'; ctx.textAlign = 'right';
          ctx.fillText(lane.type === 'tram' ? '🚃 TRAM' : '🎢 COASTER', W - 8, y + CELL - 8);
          ctx.textAlign = 'left';
        }
      }
    }

    // Draw objects
    for (const obj of s.objects) {
      const ch = obj.type === 'flume' ? LOG_H : (obj.type === 'tram' ? TRAM_H : CAR_H);
      const cy = obj.row * CELL + (CELL - ch) / 2;

      if (obj.type === 'flume') {
        ctx.save();
        if (obj.dir === -1) { ctx.scale(-1, 1); drawLog(ctx, -obj.x - obj.w, cy, obj.w, ch, s.imgs['log-top']); }
        else drawLog(ctx, obj.x, cy, obj.w, ch, s.imgs['log-top']);
        ctx.restore();
      } else {
        const cw = obj.type === 'tram' ? TRAM_W : CAR_W;
        ctx.save();
        if (obj.dir === -1) {
          ctx.scale(-1, 1);
          for (let i = 0; i < CARS_PER_TRAIN; i++) {
            const cx = -(obj.x + i * cw + cw);
            if (obj.type === 'tram') drawTramCar(ctx, cx, cy, cw, ch, obj.color);
            else drawCoasterCar(ctx, cx, cy, cw, ch, obj.color, i, CARS_PER_TRAIN);
          }
        } else {
          for (let i = 0; i < CARS_PER_TRAIN; i++) {
            const cx = obj.x + i * cw;
            if (obj.type === 'tram') drawTramCar(ctx, cx, cy, cw, ch, obj.color);
            else drawCoasterCar(ctx, cx, cy, cw, ch, obj.color, i, CARS_PER_TRAIN);
          }
        }
        ctx.restore();
      }
    }

    // Particles
    s.particles = s.particles.filter(p => p.life > 0);
    for (const p of s.particles) {
      ctx.globalAlpha = p.life / p.maxLife;
      ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size * (p.life / p.maxLife), 0, Math.PI * 2); ctx.fill();
      p.x += p.vx; p.y += p.vy; p.vy += 0.1; p.life--;
    }
    ctx.globalAlpha = 1;

    // Player
    const px = s.player.pixelX;
    const py = s.player.row * CELL + (CELL - 36) / 2;
    drawGuest(ctx, px, py, 36, s.player.facing, s.phase === 'dead', s.imgs);

    // Overlays
    const overlay = (title, sub, cta, titleColor = '#FAF6EF') => {
      ctx.fillStyle = 'rgba(26,20,16,0.9)'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = titleColor; ctx.font = 'bold 26px Fraunces, serif'; ctx.textAlign = 'center';
      ctx.fillText(title, W / 2, H / 2 - 36);
      ctx.fillStyle = 'rgba(253,249,243,0.6)'; ctx.font = '15px DM Sans, sans-serif';
      ctx.fillText(sub, W / 2, H / 2 + 2);
      ctx.fillStyle = '#E8842A'; ctx.font = 'bold 14px DM Sans, sans-serif';
      ctx.fillText(cta, W / 2, H / 2 + 42); ctx.textAlign = 'left';
    };

    if (s.phase === 'idle') overlay('Coaster Crossing', 'Dodge trains. Ride logs. Reach the park.', 'Arrow keys or WASD to start');
    if (s.phase === 'gameover') overlay('Flattened.', `Score: ${s.score}  |  Level ${s.level}`, 'Press R to try again', '#C4521A');
    if (s.phase === 'levelup') overlay(`Level ${s.level}!`, `Score: ${s.score}`, 'Get ready...', '#E8842A');
  }, []);

  const gameLoop = useCallback(() => {
    const s = stateRef.current;

    if (s.phase === 'playing' || s.phase === 'dead' || s.phase === 'levelup') {
      // Move all objects
      for (const obj of s.objects) {
        obj.x += obj.speed * obj.dir;
        if (obj.dir === 1 && obj.x > W + 20) obj.x = -obj.w - 20;
        if (obj.dir === -1 && obj.x < -obj.w - 20) obj.x = W + 20;
      }

      // Flume: carry player on log
      if (s.phase === 'playing' && FLUME_ROWS.has(s.player.row)) {
        const log = getLogUnder();
        if (log) {
          // Move player pixel position with the log
          s.player.pixelX += log.speed * log.dir;
          // Derive col from pixel position
          s.player.col = Math.floor((s.player.pixelX + 18) / CELL);
          s.player.onLog = log;
          // Fell off screen edge
          if (s.player.pixelX < -36 || s.player.pixelX > W + 10) {
            s.lives--;
            s.phase = 'dead'; s.deathTimer = 80;
            spawnParticles(s.player.pixelX + 18, s.player.row * CELL + CELL / 2, true);
            sync();
          }
        } else {
          // Standing in water with no log = drown
          s.lives--;
          s.phase = 'dead'; s.deathTimer = 80;
          spawnParticles(s.player.pixelX + 18, s.player.row * CELL + CELL / 2, true);
          s.player.onLog = null;
          sync();
        }
      } else {
        s.player.onLog = null;
        // Keep pixelX in sync with col when not on log
        s.player.pixelX = s.player.col * CELL + (CELL - 36) / 2;
      }

      // Death timer
      if (s.phase === 'dead') {
        s.deathTimer--;
        if (s.deathTimer <= 0) {
          s.phase = s.lives <= 0 ? 'gameover' : 'playing';
          if (s.phase === 'playing') s.player = initPlayer();
          sync();
        }
      }

      // Level up timer
      if (s.phase === 'levelup') {
        s.deathTimer--;
        if (s.deathTimer <= 0) {
          s.objects = initAllObjects(s.level);
          s.player = initPlayer();
          s.phase = 'playing';
          sync();
        }
      }

      // Train collision
      if (s.phase === 'playing' && checkTrainCollision()) {
        s.lives--;
        s.phase = 'dead'; s.deathTimer = 80;
        spawnParticles(s.player.col * CELL + CELL / 2, s.player.row * CELL + CELL / 2, false);
        sync();
      }
    }

    draw();
    animRef.current = requestAnimationFrame(gameLoop);
  }, [draw, checkTrainCollision, getLogUnder, sync, spawnParticles]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animRef.current);
  }, [gameLoop]);

  const handleKey = useCallback((e) => {
    const s = stateRef.current;
    const move = KEY_MAP[e.key];

    if ((e.key === 'r' || e.key === 'R') && s.phase === 'gameover') {
      Object.assign(s, { lives: 3, score: 0, level: 1, player: initPlayer(), objects: initAllObjects(1), particles: [], phase: 'playing' });
      sync(); return;
    }

    if (!move) return;
    e.preventDefault();

    if (s.phase === 'idle') { s.phase = 'playing'; sync(); }
    if (s.phase !== 'playing') return;

    s.player.facing = move.facing;
    const newCol = Math.max(0, Math.min(COLS - 1, s.player.col + move.dc));
    const newRow = Math.max(0, Math.min(ROWS - 1, s.player.row + move.dr));
    s.player.col = newCol;
    s.player.row = newRow;
    // Reset pixelX to grid position when moving (log carry will take over if on flume)
    s.player.pixelX = s.player.col * CELL + (CELL - 36) / 2;
    if (move.dr === -1) { s.score += 10; sync(); }

    if (s.player.row === 0) {
      s.score += 200 + s.level * 50;
      s.level++;
      s.phase = 'levelup';
      s.deathTimer = 110;
      sync();
    }
  }, [sync]);

  const handleBtn = useCallback((key) => {
    handleKey({ key, preventDefault: () => {} });
  }, [handleKey]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  return (
    <div className="frogger-wrap">
      <div className="frogger-header">
        <div className="frogger-title serif">Coaster Crossing</div>
        <div className="frogger-hud">
          <div className="hud-item"><span className="hud-label">Score</span><span className="hud-val">{display.score}</span></div>
          <div className="hud-item"><span className="hud-label">Level</span><span className="hud-val">{display.level}</span></div>
          <div className="hud-item">
            <span className="hud-label">Lives</span>
            <span className="hud-val lives-row">
              {Array.from({ length: 3 }).map((_, i) => (
                <span key={i} className={i < display.lives ? 'life-on' : 'life-off'}>🎢</span>
              ))}
            </span>
          </div>
        </div>
      </div>
      <div className="frogger-canvas-wrap">
        <canvas ref={canvasRef} width={W} height={H} className="frogger-canvas" tabIndex={0} />
      </div>
      <div className="frogger-controls">
        <div className="ctrl-row"><button className="ctrl-btn" onClick={() => handleBtn('ArrowUp')}>▲</button></div>
        <div className="ctrl-row">
          <button className="ctrl-btn" onClick={() => handleBtn('ArrowLeft')}>◀</button>
          <button className="ctrl-btn" onClick={() => handleBtn('ArrowDown')}>▼</button>
          <button className="ctrl-btn" onClick={() => handleBtn('ArrowRight')}>▶</button>
        </div>
      </div>
      <p className="frogger-hint">Arrow keys or WASD · Ride the logs across the flume · R to restart</p>
    </div>
  );
}