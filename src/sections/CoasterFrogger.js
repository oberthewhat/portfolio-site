import { useEffect, useRef, useState, useCallback } from 'react';
import './CoasterFrogger.css';

const COLS = 13;
const ROWS = 13;
const CELL = 54;
const W = COLS * CELL;
const H = ROWS * CELL;

const SAFE_ROWS = new Set([0, 6, 12]);

// Asset dimensions — scaled to fit CELL height with some padding
const LEAD_W = 64;
const LEAD_H = 46;
const ROW_W  = 50;
const ROW_H  = 46;
const FLUME_W = 90;
const FLUME_H = 42;
const GUY_W  = 38;
const GUY_H  = 44;

// Skins available per type
const COASTER_SKINS = ['red', 'blue'];
const TRAM_SKIN = 'train';
const FLUME_SKIN = 'flume';

// Fixed rows — safe rows are 0, 6, 12. Active lanes are everything else.
const ACTIVE_ROWS = [1, 2, 3, 4, 5, 7, 8, 9, 10, 11];

function randomLaneType() {
  const roll = Math.random();
  if (roll < 0.45) return 'coaster';
  if (roll < 0.70) return 'tram';
  return 'flume';
}

function buildLaneConfig(level) {
  // Guarantee at least 2 flumes and at least 1 of each type
  const types = ACTIVE_ROWS.map(() => randomLaneType());
  // Ensure at least 2 flumes
  let flumeCount = types.filter(t => t === 'flume').length;
  for (let i = 0; flumeCount < 2 && i < types.length; i++) {
    if (types[i] !== 'flume') { types[i] = 'flume'; flumeCount++; }
  }
  // Alternate directions per row
  return ACTIVE_ROWS.map((row, i) => {
    const type = types[i];
    const skin = type === 'flume' ? FLUME_SKIN : type === 'tram' ? TRAM_SKIN : COASTER_SKINS[i % 2];
    // Vary base speed by row position — middle rows slightly faster
    const midFactor = 1 + (Math.abs(i - 4.5) / 4.5) * 0.2;
    const baseSpeed = type === 'flume'
      ? randBetween(0.5, 0.75)
      : type === 'tram'
        ? randBetween(0.65, 1.0)
        : randBetween(0.75, 1.35) * midFactor;
    return {
      row,
      baseSpeed,
      dir: i % 2 === 0 ? 1 : -1,
      skin,
      type,
    };
  });
}

function randBetween(a, b) { return a + Math.random() * (b - a); }
function randInt(a, b) { return Math.floor(randBetween(a, b + 1)); }

function makeLaneObjects(lane, level) {
  const levelMult = 1 + (level - 1) * 0.1;
  const rowSpeed = randBetween(lane.baseSpeed * 0.85, lane.baseSpeed * 1.15) * levelMult;
  const isFlume = lane.type === 'flume';
  const count = isFlume ? randInt(3, 5) : randInt(2, 3);
  const minGap = isFlume ? 150 : 250;
  const maxGap = isFlume ? 300 : 420;

  const objects = [];

  // Build trains with known widths first
  const trains = [];
  for (let i = 0; i < count; i++) {
    const rowCount = isFlume ? 0 : randInt(1, 3);
    const objW = isFlume ? FLUME_W : LEAD_W + rowCount * ROW_W;
    trains.push({ rowCount, w: objW });
  }

  // Place sequentially with guaranteed gaps
  // Start the first train already on screen (pre-scrolled in)
  // so the board looks active immediately
  let cursor;
  if (lane.dir === 1) {
    // Moving right — place first train already visible, rest behind left edge
    cursor = randBetween(W * 0.1, W * 0.7);
    for (let i = 0; i < trains.length; i++) {
      const { rowCount, w } = trains[i];
      const gap = randBetween(minGap, maxGap);
      objects.push({ x: cursor, speed: rowSpeed, dir: lane.dir, row: lane.row, skin: lane.skin, type: lane.type, rowCount, w });
      cursor -= (w + gap); // next train to the left
    }
  } else {
    // Moving left — place first train already visible, rest behind right edge
    cursor = randBetween(W * 0.1, W * 0.7) - (trains[0].w);
    for (let i = 0; i < trains.length; i++) {
      const { rowCount, w } = trains[i];
      const gap = randBetween(minGap, maxGap);
      objects.push({ x: cursor, speed: rowSpeed, dir: lane.dir, row: lane.row, skin: lane.skin, type: lane.type, rowCount, w });
      cursor += (w + gap); // next train to the right
    }
  }

  return objects;
}

function initAllObjects(level = 1, config = null) {
  const laneConfig = config || buildLaneConfig(level);
  return laneConfig.flatMap(lane => makeLaneObjects(lane, level));
}

function initPlayer() {
  return {
    col: 6, row: 12,
    pixelX: 6 * CELL + Math.floor((CELL - GUY_W) / 2),
    state: 'stand',
    onLog: null,
  };
}

const KEY_MAP = {
  ArrowUp:    { dc: 0,  dr: -1 },
  ArrowDown:  { dc: 0,  dr:  1 },
  ArrowLeft:  { dc: -1, dr:  0 },
  ArrowRight: { dc:  1, dr:  0 },
  w: { dc: 0,  dr: -1 },
  s: { dc: 0,  dr:  1 },
  a: { dc: -1, dr:  0 },
  d: { dc:  1, dr:  0 },
};

// Draw a repeating track tile across a row
function drawTrack(ctx, y, imgs, trackKey, fallbackColor) {
  const img = imgs[trackKey];
  if (img) {
    // Tile horizontally
    for (let x = 0; x < W; x += img.width * (CELL / img.height)) {
      const tileW = img.width * (CELL / img.height);
      ctx.drawImage(img, x, y, tileW, CELL);
    }
  } else {
    ctx.fillStyle = fallbackColor;
    ctx.fillRect(0, y, W, CELL);
  }
}

// Draw one vehicle (train or flume) using assets
function drawVehicle(ctx, obj, imgs) {
  const ch = obj.type === 'flume' ? FLUME_H : Math.max(LEAD_H, ROW_H);
  const cy = obj.row * CELL + (CELL - ch) / 2;

  if (obj.type === 'flume') {
    const dirStr = obj.dir === 1 ? 'right' : 'left';
    const img = imgs[`flume-${dirStr}`];
    if (img) {
      ctx.drawImage(img, obj.x, cy, FLUME_W, FLUME_H);
    } else {
      // Fallback
      ctx.fillStyle = '#7B4A1E';
      ctx.beginPath(); ctx.roundRect(obj.x, cy + 4, FLUME_W, FLUME_H - 8, 12); ctx.fill();
      ctx.fillStyle = 'rgba(100,180,255,0.4)';
      ctx.beginPath(); ctx.roundRect(obj.x + 12, cy + 10, FLUME_W - 24, FLUME_H - 20, 6); ctx.fill();
    }
    return;
  }

  // Train/coaster: lead car at front, row cars behind
  // dir=1 (going right): lead on LEFT, rows extend RIGHT
  // dir=-1 (going left): lead on RIGHT, rows extend LEFT
  const skin = obj.skin; // 'red' | 'blue' | 'train'
  const dirStr = obj.dir === 1 ? 'right' : 'left';
  const leadImg = imgs[`${skin}Lead-${dirStr}`];
  const rowImg  = imgs[`${skin}Row-${dirStr}`];

  if (obj.dir === 1) {
    // Going RIGHT: row cars first (left), lead car last (rightmost = front)
    for (let r = 0; r < obj.rowCount; r++) {
      const rx = obj.x + r * ROW_W;
      if (rowImg) {
        ctx.drawImage(rowImg, rx, cy, ROW_W, ROW_H);
      } else {
        ctx.fillStyle = '#A03A10';
        ctx.beginPath(); ctx.roundRect(rx + 1, cy, ROW_W - 2, ROW_H, 4); ctx.fill();
      }
    }
    // Lead car on the right (front)
    const leadX = obj.x + obj.rowCount * ROW_W;
    if (leadImg) {
      ctx.drawImage(leadImg, leadX, cy, LEAD_W, LEAD_H);
    } else {
      ctx.fillStyle = '#C4521A';
      ctx.beginPath(); ctx.roundRect(leadX, cy, LEAD_W, LEAD_H, 6); ctx.fill();
    }
  } else {
    // Going LEFT: lead car first (leftmost = front), row cars to the right
    if (leadImg) {
      ctx.drawImage(leadImg, obj.x, cy, LEAD_W, LEAD_H);
    } else {
      ctx.fillStyle = '#2255AA';
      ctx.beginPath(); ctx.roundRect(obj.x, cy, LEAD_W, LEAD_H, 6); ctx.fill();
    }
    for (let r = 0; r < obj.rowCount; r++) {
      const rx = obj.x + LEAD_W + r * ROW_W;
      if (rowImg) {
        ctx.drawImage(rowImg, rx, cy, ROW_W, ROW_H);
      } else {
        ctx.fillStyle = '#4A7FA5';
        ctx.beginPath(); ctx.roundRect(rx + 1, cy, ROW_W - 2, ROW_H, 4); ctx.fill();
      }
    }
  }
}

function drawPlayer(ctx, player, imgs) {
  const img = imgs[`guy-${player.state}`] || imgs['guy-stand'];
  const px = player.pixelX;
  const py = player.row * CELL + Math.floor((CELL - GUY_H) / 2);
  if (img) {
    ctx.drawImage(img, px, py, GUY_W, GUY_H);
  } else {
    const cx = px + GUY_W / 2, cy = py + GUY_H / 2;
    ctx.fillStyle = '#FAF6EF';
    ctx.beginPath(); ctx.arc(cx, cy - 14, 9, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#E8842A';
    ctx.fillRect(cx - 8, cy - 6, 16, 18);
    ctx.fillStyle = '#FAF6EF';
    ctx.fillRect(cx - 8, cy + 8, 6, 10);
    ctx.fillRect(cx + 2, cy + 8, 6, 10);
  }
}

export default function CoasterFrogger() {
  const canvasRef = useRef(null);
  const initialConfig = buildLaneConfig(1);
  const stateRef = useRef({
    player: initPlayer(),
    laneConfig: initialConfig,
    objects: initAllObjects(1, initialConfig),
    lives: 3, score: 0, level: 1,
    phase: 'idle',
    deathTimer: 0,
    imgs: {},
    particles: [],
  });
  const animRef = useRef(null);
  const [display, setDisplay] = useState({ lives: 3, score: 0, level: 1, phase: 'idle' });

  // Load all assets
  useEffect(() => {
    const s = stateRef.current;
    const assets = [
      'redLead-right','redLead-left','redRow-right','redRow-left',
      'blueLead-right','blueLead-left','blueRow-right','blueRow-left',
      'trainLead-right','trainLead-left','trainRow-right','trainRow-left',
      'flume-right','flume-left',
      'flume-track','train-track','coaster-track',
      'guy-stand','guy-jump','guy-hit','guy-splash','guy-win',
    ];
    assets.forEach(name => {
      const img = new Image();
      img.src = `/${name}.png`;
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
      const angle = (Math.PI * 2 * i) / 14 + Math.random() * 0.5;
      const spd = randBetween(1.5, 4.5);
      s.particles.push({
        x: px, y: py,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd - (water ? 2.5 : 0),
        life: 45, maxLife: 45,
        color: water
          ? ['#60B8FF','#A8D8FF','#FFFFFF','#3090EE'][randInt(0, 3)]
          : ['#E8842A','#C4521A','#FAF6EF','#F5C97A'][randInt(0, 3)],
        size: randBetween(2, water ? 5 : 7),
      });
    }
  }, []);

  const getLogUnder = useCallback(() => {
    const s = stateRef.current;
    const laneCfg = s.laneConfig.find(l => l.row === s.player.row);
    if (laneCfg?.type !== 'flume') return null;
    const px = s.player.pixelX + GUY_W / 2;
    for (const obj of s.objects) {
      if (obj.type !== 'flume' || obj.row !== s.player.row) continue;
      if (px > obj.x + 4 && px < obj.x + obj.w - 4) return obj;
    }
    return null;
  }, []);

  const checkTrainHit = useCallback(() => {
    const s = stateRef.current;
    if (SAFE_ROWS.has(s.player.row)) return false;
    const laneCfg = s.laneConfig.find(l => l.row === s.player.row);
    if (laneCfg?.type === 'flume') return false; // flume rows don't hit
    const px = s.player.pixelX + GUY_W / 2;
    const py = s.player.row * CELL + CELL / 2;
    for (const obj of s.objects) {
      if (obj.row !== s.player.row || obj.type === 'flume') continue;
      const ch = LEAD_H;
      const top = obj.row * CELL + (CELL - ch) / 2;
      if (px > obj.x + 6 && px < obj.x + obj.w - 6 && py > top + 4 && py < top + ch - 4) return true;
    }
    return false;
  }, []);

  const killPlayer = useCallback((water = false) => {
    const s = stateRef.current;
    s.lives--;
    s.player.state = water ? 'splash' : 'hit';
    s.phase = 'dead';
    s.deathTimer = 90;
    spawnParticles(s.player.pixelX + GUY_W / 2, s.player.row * CELL + CELL / 2, water);
    sync();
  }, [spawnParticles, sync]);

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
        // Park entrance
        ctx.fillStyle = '#2D5A32'; ctx.fillRect(0, y, W, CELL);
        ctx.fillStyle = 'rgba(255,255,255,0.05)';
        for (let c = 0; c < COLS; c++) { ctx.fillRect(c * CELL + 10, y + 14, 6, 6); ctx.fillRect(c * CELL + 32, y + 30, 5, 5); }
        ctx.fillStyle = 'rgba(232,132,42,0.85)'; ctx.font = 'bold 12px DM Sans, sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('🎢  PARK ENTRANCE  🎢', W / 2, y + CELL / 2 + 4); ctx.textAlign = 'left';
      } else if (r === 6) {
        // Mid safe zone
        ctx.fillStyle = '#3D3530'; ctx.fillRect(0, y, W, CELL);
        ctx.strokeStyle = 'rgba(232,132,42,0.3)'; ctx.lineWidth = 2; ctx.setLineDash([10, 7]);
        ctx.beginPath(); ctx.moveTo(0, y + CELL / 2); ctx.lineTo(W, y + CELL / 2); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = 'rgba(232,132,42,0.5)'; ctx.font = '10px DM Sans, sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('SAFE ZONE', W / 2, y + CELL / 2 + 4); ctx.textAlign = 'left';
      } else if (r === 12) {
        // Start — parking lot
        ctx.fillStyle = '#35302B'; ctx.fillRect(0, y, W, CELL);
        // Parking space lines
        ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 1; ctx.setLineDash([]);
        for (let c = 1; c < COLS; c++) { ctx.beginPath(); ctx.moveTo(c * CELL, y + 4); ctx.lineTo(c * CELL, y + CELL - 4); ctx.stroke(); }
        ctx.fillStyle = 'rgba(253,249,243,0.3)'; ctx.font = '10px DM Sans, sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('PARKING LOT — START HERE', W / 2, y + CELL / 2 + 4); ctx.textAlign = 'left';
      } else {
        // Active lane — look up type from laneConfig
        const laneCfg = s.laneConfig.find(l => l.row === r);
        if (laneCfg?.type === 'flume') {
          // Water channel
          ctx.fillStyle = '#0D3A8A'; ctx.fillRect(0, y, W, CELL);
          drawTrack(ctx, y, s.imgs, 'flume-track', '#0D3A8A');
          const t = Date.now() / 900;
          for (let c = 0; c < W; c += 30) {
            ctx.fillStyle = 'rgba(120,190,255,0.12)';
            ctx.fillRect(c + Math.sin(t + c * 0.04) * 5, y + 7, 20, 3);
            ctx.fillRect(c + 14 + Math.sin(t * 1.2 + c * 0.04) * 5, y + CELL - 11, 15, 3);
          }
          ctx.fillStyle = 'rgba(100,190,255,0.25)'; ctx.font = '10px DM Sans, sans-serif'; ctx.textAlign = 'right';
          ctx.fillText('🌊 LOG FLUME', W - 8, y + CELL - 8); ctx.textAlign = 'left';
        } else {
          const trackKey = laneCfg?.type === 'tram' ? 'train-track' : 'coaster-track';
          const fallback = r % 2 === 0 ? '#1C1814' : '#201C18';
          drawTrack(ctx, y, s.imgs, trackKey, fallback);
          if (!s.imgs[trackKey]) {
            ctx.fillStyle = 'rgba(255,255,255,0.07)';
            ctx.fillRect(0, y + 6, W, 2); ctx.fillRect(0, y + CELL - 8, W, 2);
          }
        }
      }
    }

    // Draw vehicles
    for (const obj of s.objects) {
      drawVehicle(ctx, obj, s.imgs);
    }

    // Draw particles
    s.particles = s.particles.filter(p => p.life > 0);
    for (const p of s.particles) {
      ctx.globalAlpha = p.life / p.maxLife;
      ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size * (p.life / p.maxLife), 0, Math.PI * 2); ctx.fill();
      p.x += p.vx; p.y += p.vy; p.vy += 0.1; p.life--;
    }
    ctx.globalAlpha = 1;

    // Draw player
    drawPlayer(ctx, s.player, s.imgs);

    // Overlays
    const overlay = (title, sub, cta, titleColor = '#FAF6EF') => {
      ctx.fillStyle = 'rgba(22,17,13,0.86)'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = titleColor; ctx.font = 'bold 26px Fraunces, serif'; ctx.textAlign = 'center';
      ctx.fillText(title, W / 2, H / 2 - 36);
      ctx.fillStyle = 'rgba(253,249,243,0.6)'; ctx.font = '15px DM Sans, sans-serif';
      ctx.fillText(sub, W / 2, H / 2 + 2);
      ctx.fillStyle = '#E8842A'; ctx.font = 'bold 14px DM Sans, sans-serif';
      ctx.fillText(cta, W / 2, H / 2 + 42); ctx.textAlign = 'left';
    };

    if (s.phase === 'idle') {
      ctx.fillStyle = 'rgba(22,17,13,0.78)'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#FAF6EF'; ctx.font = 'bold 26px Fraunces, serif'; ctx.textAlign = 'center';
      ctx.fillText('Coaster Crossing', W / 2, H / 2 - 36);
      ctx.fillStyle = 'rgba(253,249,243,0.6)'; ctx.font = '15px DM Sans, sans-serif';
      ctx.fillText('Dodge trains. Ride the flume. Reach the park.', W / 2, H / 2 + 2);
      ctx.fillStyle = '#E8842A'; ctx.font = 'bold 14px DM Sans, sans-serif';
      ctx.fillText('Space to start · tap on mobile', W / 2, H / 2 + 42);
      ctx.textAlign = 'left';
      drawPlayer(ctx, s.player, s.imgs);
    }
    if (s.phase === 'gameover') overlay('Flattened.', `Score: ${s.score}  |  Level ${s.level}`, 'Press R to try again', '#C4521A');
    if (s.phase === 'levelup') overlay(`Level ${s.level}!`, `Score: ${s.score}`, 'Get ready...', '#E8842A');
  }, []);

  const gameLoop = useCallback(() => {
    const s = stateRef.current;

    if (s.phase === 'playing' || s.phase === 'dead' || s.phase === 'levelup') {
      // Move all objects — wrap with large buffer to prevent overlap
      for (const obj of s.objects) {
        obj.x += obj.speed * obj.dir;
        const buf = obj.w + 300;
        if (obj.dir === 1 && obj.x > W + buf) obj.x = -buf;
        if (obj.dir === -1 && obj.x + obj.w < -buf) obj.x = W + buf;
      }

      // Flume carry
      const playerLane = s.laneConfig.find(l => l.row === s.player.row);
      if (s.phase === 'playing' && playerLane?.type === 'flume') {
        const log = getLogUnder();
        if (log) {
          s.player.pixelX += log.speed * log.dir;
          s.player.col = Math.floor((s.player.pixelX + GUY_W / 2) / CELL);
          s.player.onLog = log;
          if (s.player.pixelX < -GUY_W || s.player.pixelX > W + 10) {
            killPlayer(true);
          }
        } else {
          killPlayer(true);
        }
      } else {
        s.player.onLog = null;
        s.player.pixelX = s.player.col * CELL + (CELL - GUY_W) / 2;
      }

      // Train hit
      if (s.phase === 'playing' && checkTrainHit()) {
        killPlayer(false);
      }

      // Timers
      if (s.phase === 'dead') {
        s.deathTimer--;
        if (s.deathTimer <= 0) {
          if (s.lives <= 0) { s.phase = 'gameover'; }
          else { s.player = initPlayer(); s.phase = 'playing'; }
          sync();
        }
      }
      if (s.phase === 'levelup') {
        s.deathTimer--;
        if (s.deathTimer <= 0) {
          const newConfig = buildLaneConfig(s.level);
          s.laneConfig = newConfig;
          s.objects = initAllObjects(s.level, newConfig);
          s.player = initPlayer();
          s.phase = 'playing';
          sync();
        }
      }
    }

    draw();
    animRef.current = requestAnimationFrame(gameLoop);
  }, [draw, checkTrainHit, getLogUnder, killPlayer, sync]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animRef.current);
  }, [gameLoop]);

  const handleKey = useCallback((e) => {
    const s = stateRef.current;

    if ((e.key === 'r' || e.key === 'R') && s.phase === 'gameover') {
      const newConfig = buildLaneConfig(1);
      Object.assign(s, { lives: 3, score: 0, level: 1, player: initPlayer(), laneConfig: newConfig, objects: initAllObjects(1, newConfig), particles: [], phase: 'playing' });
      sync(); return;
    }

    if (e.key === ' ' && s.phase === 'idle') {
      e.preventDefault();
      s.phase = 'playing'; sync(); return;
    }

    const move = KEY_MAP[e.key];
    if (!move) return;
    e.preventDefault();
    if (s.phase === 'idle') { s.phase = 'playing'; sync(); }
    if (s.phase !== 'playing') return;

    s.player.state = 'jump';
    setTimeout(() => { if (stateRef.current.player.state === 'jump') stateRef.current.player.state = 'stand'; }, 200);

    const newCol = Math.max(0, Math.min(COLS - 1, s.player.col + move.dc));
    const newRow = Math.max(0, Math.min(ROWS - 1, s.player.row + move.dr));
    s.player.col = newCol;
    s.player.row = newRow;
    s.player.pixelX = s.player.col * CELL + (CELL - GUY_W) / 2;

    if (move.dr === -1) { s.score += 10; sync(); }

    if (s.player.row === 0) {
      s.player.state = 'win';
      s.score += 200 + s.level * 50;
      s.level++;
      s.phase = 'levelup';
      s.deathTimer = 110;
      sync();
    }
  }, [sync]);

  const handleBtn = useCallback((key) => handleKey({ key, preventDefault: () => {} }), [handleKey]);

  // Swipe to move on mobile
  const touchRef = useRef(null);

  const handleTouchStart = useCallback((e) => {
    touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    const s = stateRef.current;
    if (s.phase === 'idle') { s.phase = 'playing'; sync(); }
    if (s.phase === 'gameover') {
      const newConfig = buildLaneConfig(1);
      Object.assign(s, { lives: 3, score: 0, level: 1, player: initPlayer(), laneConfig: newConfig, objects: initAllObjects(1, newConfig), particles: [], phase: 'playing' });
      sync();
    }
  }, [sync]);

  const handleTouchEnd = useCallback((e) => {
    const s = stateRef.current;
    if (!touchRef.current || s.phase !== 'playing') return;
    const dx = e.changedTouches[0].clientX - touchRef.current.x;
    const dy = e.changedTouches[0].clientY - touchRef.current.y;
    touchRef.current = null;
    const absDx = Math.abs(dx), absDy = Math.abs(dy);
    if (absDx < 8 && absDy < 8) return;
    if (absDx > absDy) {
      handleBtn(dx > 0 ? 'ArrowRight' : 'ArrowLeft');
    } else {
      handleBtn(dy > 0 ? 'ArrowDown' : 'ArrowUp');
    }
  }, [handleBtn]);

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
                <span key={i} style={{ opacity: i < display.lives ? 1 : 0.2 }}>🎢</span>
              ))}
            </span>
          </div>
        </div>
      </div>
      <div className="frogger-canvas-wrap">
        <canvas
          ref={canvasRef}
          width={W} height={H}
          className="frogger-canvas"
          tabIndex={0}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        />
      </div>
      <div className="frogger-controls">
        <div className="ctrl-row">
          <button className="ctrl-btn" onClick={() => handleBtn('ArrowUp')}>▲</button>
        </div>
        <div className="ctrl-row">
          <button className="ctrl-btn" onClick={() => handleBtn('ArrowLeft')}>◀</button>
          <button className="ctrl-btn" onClick={() => handleBtn('ArrowDown')}>▼</button>
          <button className="ctrl-btn" onClick={() => handleBtn('ArrowRight')}>▶</button>
        </div>
      </div>
      <p className="frogger-hint">
        <strong>Desktop:</strong> Space to start · Arrow keys or WASD to move · R to restart
        &nbsp;·&nbsp;
        <strong>Mobile:</strong> Tap to start · Swipe to move · buttons above
      </p>
    </div>
  );
}