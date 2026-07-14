import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const DEFAULT_MILESTONES = [
  { id: 'ms-start',    title: '01. Khởi đầu',       targetAge: 'Tuần 4 thai kỳ',   desc: 'Ngày biết tin có con, chiếc que thử hai vạch mang lại niềm vui bất ngờ cho ba mẹ.' },
  { id: 'ms-heartbeat',title: '02. Nhịp tim',        targetAge: 'Tuần 8 thai kỳ',   desc: 'Lần đầu tiên siêu âm nghe nhịp tim thai đập rộn ràng, chứng minh sự hiện diện của con.' },
  { id: 'ms-growing',  title: '03. Lớn lên',         targetAge: 'TCN 1 thai kỳ',    desc: 'Những tuần đầu thai kỳ đầy lo lắng nhưng cũng tràn ngập mong chờ.' },
  { id: 'ms-hello',    title: '04. Chào con',        targetAge: 'Tuần 20 thai kỳ',  desc: 'Con bắt đầu nghe thấy âm thanh bên ngoài, ba mẹ gọi tên con và trò chuyện.' },
  { id: 'ms-peaceful', title: '05. Bình yên',        targetAge: 'TCN 2 thai kỳ',    desc: 'Lưu giữ nhật ký mang thai, những tấm hình chụp bụng bầu lớn dần thường nhật.' },
  { id: 'ms-prepare',  title: '06. Đón con',         targetAge: 'Tuần 34 thai kỳ',  desc: 'Ba mẹ chuẩn bị phòng riêng, sắm đồ sơ sinh và xếp sẵn vali đi sinh tiện lợi.' },
  { id: 'ms-soon',     title: '07. Sắp gặp con',     targetAge: 'Tuần 38 thai kỳ',  desc: 'Những tuần cuối thai kỳ, cả nhà nôn nao đếm ngược ngày được đón tay con.' },
  { id: 'ms-welcome',  title: '08. Chào đời',        targetAge: 'Ngày sinh',        desc: 'Tiếng khóc chào đời giòn giã của con, khoảnh khắc da kề da ấm áp bên ba mẹ.' },
  { id: 'ms-smile',    title: '09. Nụ cười đầu',     targetAge: '2 tháng tuổi',     desc: 'Bé cười mỉm đáp lại những cử chỉ yêu thương và trêu đùa của ba mẹ.' },
  { id: 'ms-roll',     title: '10. Biết lẫy',        targetAge: '4 tháng tuổi',     desc: 'Bé tự lật sấp người, ngẩng cao đầu tự hào nhìn ngó xung quanh.' },
  { id: 'ms-tooth',    title: '11. Chiếc răng đầu',  targetAge: '6 tháng tuổi',     desc: 'Chiếc răng sữa bé xíu nhú lên làm nụ cười bé thêm phần ngộ nghĩnh.' },
  { id: 'ms-sit',      title: '12. Ngồi vững',       targetAge: '7-8 tháng tuổi',   desc: 'Bé có thể tự ngồi vững vàng một mình mà không cần ba mẹ đỡ sau lưng.' },
  { id: 'ms-crawl',    title: '13. Biết bò',         targetAge: '9-10 tháng tuổi',  desc: 'Bé trườn bò nhanh thoăn thoắt để khám phá mọi ngóc ngách trong nhà.' },
  { id: 'ms-walk',     title: '14. Bước đi đầu',     targetAge: '12 tháng tuổi',    desc: 'Bé chập chững những bước đi đầu đời đầy tự lập và vững chãi.' },
  { id: 'ms-talk',     title: '15. Gọi ba mẹ',       targetAge: '13-15 tháng',      desc: 'Bé cất tiếng gọi "Ba", "Mẹ" rõ ràng đầu tiên làm cả nhà vỡ òa hạnh phúc.' }
];

// ── Cute animal SVG icons — same stroke style as Hero.jsx ────────────────────
// Each returns an <svg> with stroke="var(--accent-color)" at low opacity.
const ANIMAL_SVGS = {

  bear: (sz, op) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none"
      stroke="var(--accent-color)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity={op}>
      <path d="M12 21a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13Z"/>
      <path d="M8 10a2.5 2.5 0 1 1-4-2c0-1.2 1-2 2-2a2.5 2.5 0 0 1 2 4Z"/>
      <path d="M16 10a2.5 2.5 0 1 0 4-2c0-1.2-1-2-2-2a2.5 2.5 0 0 0-2 4Z"/>
      <path d="M9.5 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" fill="var(--accent-color)"/>
      <path d="M14.5 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" fill="var(--accent-color)"/>
      <path d="M12 17a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"/>
      <path d="M10.5 16.5c.8.5 2.2.5 3 0"/>
    </svg>
  ),

  bee: (sz, op) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none"
      stroke="var(--accent-color)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity={op}>
      <path d="M12 2a3 3 0 0 1 3 3v2a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Z"/>
      <path d="M9 7a5 5 0 0 0 6 0"/>
      <path d="M12 12c-2.5 0-5 2-5 5.5s2.5 4.5 5 4.5 5-1 5-4.5S14.5 12 12 12Z"/>
      <path d="M8 14.5c-.8.8-2 1-3 .5s-1.3-1.8-.8-2.8.8-2 2-2.5 2.2 0 2.2.8"/>
      <path d="M16 14.5c.8.8 2 1 3 .5s1.3-1.8.8-2.8-.8-2-2-2.5-2.2 0-2.2.8"/>
      <path d="M12 19v-4"/>
    </svg>
  ),

  bird: (sz, op) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none"
      stroke="var(--accent-color)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity={op}>
      <path d="M16 8A4.5 4.5 0 0 0 11.5 3.5C7.5 3.5 5 6 5 10c0 4 2.5 6.5 6.5 6.5A4.5 4.5 0 0 0 16 12V8Z"/>
      <path d="M16 10h4l-3-3"/>
      <path d="M7 14c-1 1-3 1.5-4 1a2 2 0 0 1 0-3.5"/>
      <path d="M11 16.5V20M8 20h6"/>
      <circle cx="10" cy="8.5" r="0.8" fill="var(--accent-color)"/>
    </svg>
  ),

  horse: (sz, op) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none"
      stroke="var(--accent-color)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity={op}>
      <path d="M3 20c3-2 15-2 18 0"/>
      <path d="M7 20v-5M17 20v-5"/>
      <path d="M7 15h10v-3l-2-2H9L7 12v3Z"/>
      <path d="M9 10V6l-3 1M18 10V5h-3"/>
    </svg>
  ),

  bunny: (sz, op) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none"
      stroke="var(--accent-color)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity={op}>
      <path d="M12 22a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z"/>
      <path d="M9 3c0 3 1 5 3 5s3-2 3-5"/>
      <path d="M7 4c-2 2-2 5 0 6"/>
      <path d="M17 4c2 2 2 5 0 6"/>
      <path d="M10 15a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" fill="var(--accent-color)"/>
      <path d="M14 15a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" fill="var(--accent-color)"/>
      <path d="M12 16.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"/>
    </svg>
  ),

  cat: (sz, op) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none"
      stroke="var(--accent-color)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity={op}>
      <path d="M12 21a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z"/>
      <path d="M8 7L5 3l2 5"/>
      <path d="M16 7l3-4-2 5"/>
      <path d="M10 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" fill="var(--accent-color)"/>
      <path d="M14 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" fill="var(--accent-color)"/>
      <path d="M10 17c.7.7 3.3.7 4 0"/>
      <path d="M12 17v1"/>
      <path d="M9 17.5l-2 1M15 17.5l2 1"/>
    </svg>
  ),

  duck: (sz, op) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none"
      stroke="var(--accent-color)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity={op}>
      <path d="M10 8a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" transform="translate(2 3)"/>
      <path d="M17 7c1.5 0 3 .8 3 2s-1.5 2-3 2"/>
      <path d="M5 15c0 4 3 7 7 7s7-3 7-7H5Z"/>
      <path d="M7 22v-1M17 22v-1"/>
      <circle cx="11" cy="7" r="0.8" fill="var(--accent-color)"/>
    </svg>
  ),

  elephant: (sz, op) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none"
      stroke="var(--accent-color)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity={op}>
      <path d="M5 12a7 7 0 1 1 14 0"/>
      <path d="M5 12c0 4 2 8 4 9l-1 3"/>
      <path d="M19 12c0 4-2 8-4 9l1 3"/>
      <path d="M8 12c0 3-1 6-2 8"/>
      <path d="M5 7c-1-1-3-1-4 0s0 3 1 3"/>
      <circle cx="9" cy="9" r="1" fill="var(--accent-color)"/>
    </svg>
  ),

  star: (sz, op) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none"
      stroke="var(--accent-color)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity={op}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  ),

  flower: (sz, op) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none"
      stroke="var(--accent-color)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity={op}>
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 2a3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3Z"/>
      <path d="M12 16a3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3Z"/>
      <path d="M2 12a3 3 0 0 1 3-3 3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3Z"/>
      <path d="M16 12a3 3 0 0 1 3-3 3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3Z"/>
    </svg>
  ),

  moon: (sz, op) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none"
      stroke="var(--accent-color)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity={op}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  ),

  heart: (sz, op) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none"
      stroke="var(--accent-color)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity={op}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),

  balloon: (sz, op) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none"
      stroke="var(--accent-color)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity={op}>
      <path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7Z"/>
      <path d="M12 15l1 5h-2z"/>
      <circle cx="10" cy="8" r="1" fill="var(--accent-color)" opacity="0.6"/>
    </svg>
  ),

  cloud: (sz, op) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none"
      stroke="var(--accent-color)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity={op}>
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10Z"/>
    </svg>
  ),

  butterfly: (sz, op) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none"
      stroke="var(--accent-color)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity={op}>
      <path d="M12 12c-3-3-8-4-9-1s3 7 9 7"/>
      <path d="M12 12c3-3 8-4 9-1s-3 7-9 7"/>
      <path d="M12 12c-3 3-4 8-1 9s7-3 7-9"/>
      <path d="M12 12c3 3 4 8 1 9s-7-3-7-9"/>
      <circle cx="12" cy="12" r="1" fill="var(--accent-color)"/>
    </svg>
  ),

  chick: (sz, op) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none"
      stroke="var(--accent-color)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity={op}>
      <circle cx="12" cy="9" r="5"/>
      <path d="M5 19a8 8 0 0 1 14 0"/>
      <path d="M12 14v3"/>
      <path d="M10 8l-2-1M14 8l2-1"/>
      <path d="M11 10h2v2l-1 1-1-1v-2Z" fill="var(--accent-color)" opacity="0.6"/>
      <circle cx="10" cy="8.5" r="0.8" fill="var(--accent-color)"/>
      <circle cx="14" cy="8.5" r="0.8" fill="var(--accent-color)"/>
    </svg>
  ),

  panda: (sz, op) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none"
      stroke="var(--accent-color)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity={op}>
      <circle cx="12" cy="13" r="7"/>
      <circle cx="6" cy="7" r="3"/>
      <circle cx="18" cy="7" r="3"/>
      <ellipse cx="9.5" cy="12" rx="2.5" ry="2"/>
      <ellipse cx="14.5" cy="12" rx="2.5" ry="2"/>
      <circle cx="9.5" cy="12" r="1" fill="var(--accent-color)"/>
      <circle cx="14.5" cy="12" r="1" fill="var(--accent-color)"/>
      <path d="M10 16.5c.5.8 3.5.8 4 0"/>
    </svg>
  ),

  frog: (sz, op) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none"
      stroke="var(--accent-color)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity={op}>
      <path d="M5 13a7 7 0 0 0 14 0v-2a7 7 0 0 0-14 0v2Z"/>
      <circle cx="8" cy="8" r="2.5"/>
      <circle cx="16" cy="8" r="2.5"/>
      <circle cx="8" cy="8" r="1" fill="var(--accent-color)"/>
      <circle cx="16" cy="8" r="1" fill="var(--accent-color)"/>
      <path d="M9 17c.8 1.5 5.2 1.5 6 0"/>
      <path d="M5 18c-1 2-3 3-4 3M19 18c1 2 3 3 4 3"/>
    </svg>
  ),

  koala: (sz, op) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none"
      stroke="var(--accent-color)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity={op}>
      <circle cx="12" cy="14" r="6.5"/>
      <circle cx="5" cy="8" r="4"/>
      <circle cx="19" cy="8" r="4"/>
      <ellipse cx="12" cy="17" rx="3.5" ry="2.5"/>
      <circle cx="10" cy="13" r="1" fill="var(--accent-color)"/>
      <circle cx="14" cy="13" r="1" fill="var(--accent-color)"/>
    </svg>
  ),

  pig: (sz, op) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none"
      stroke="var(--accent-color)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity={op}>
      <circle cx="12" cy="13" r="7"/>
      <path d="M5 9c-1-1-3.5-.5-4 1s1 3 2.5 3"/>
      <path d="M19 9c1-1 3.5-.5 4 1s-1 3-2.5 3"/>
      <ellipse cx="12" cy="16" rx="3.5" ry="2.5"/>
      <circle cx="10.5" cy="16" r="0.8" fill="var(--accent-color)"/>
      <circle cx="13.5" cy="16" r="0.8" fill="var(--accent-color)"/>
      <circle cx="10" cy="11.5" r="1" fill="var(--accent-color)"/>
      <circle cx="14" cy="11.5" r="1" fill="var(--accent-color)"/>
    </svg>
  ),

  sheep: (sz, op) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none"
      stroke="var(--accent-color)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity={op}>
      <path d="M12 5a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" transform="translate(0 5)"/>
      <circle cx="7"  cy="9" r="4"/>
      <circle cx="17" cy="9" r="4"/>
      <circle cx="12" cy="7" r="4"/>
      <path d="M8 17v5M16 17v5"/>
      <circle cx="10" cy="11" r="0.8" fill="var(--accent-color)"/>
      <circle cx="14" cy="11" r="0.8" fill="var(--accent-color)"/>
    </svg>
  ),
};

const ANIMAL_KEYS = Object.keys(ANIMAL_SVGS);
const ANIM_TYPES  = ['drift', 'bounce', 'swing', 'heartbt', 'floatx'];

// ── Deterministic RNG (Park-Miller) ────────────────────────────────────────
function makeRng(seed = 42) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

// ── Fully random scatter — 600 icons tung khắp màn hình ──────────────────
const TOTAL_ICONS = 600;

function generateDecorations(totalHeight) {
  const rng  = makeRng(7777);
  const list = [];

  for (let i = 0; i < TOTAL_ICONS; i++) {
    const x       = rng() * 100;                   // 0–100% full width
    const y       = 180 + rng() * (totalHeight - 280); // top 180 → bottom
    const sz      = 18 + rng() * 50;               // 18–68 px
    const opacity = 0.07 + rng() * 0.15;           // 0.07–0.22
    const rotate  = rng() * 360 - 180;             // fully random tilt
    const anim    = rng() > 0.38                   // ~62% animated
      ? ANIM_TYPES[Math.floor(rng() * ANIM_TYPES.length)]
      : null;
    const type = ANIMAL_KEYS[Math.floor(rng() * ANIMAL_KEYS.length)];

    list.push({
      top: y,
      left: x,
      type,
      size: sz,
      opacity,
      rotate,
      anim,
      dur:   `${2 + rng() * 4}s`,
      delay: `${rng() * 2.5}s`,
    });
  }
  return list;
}

// ── Map points ────────────────────────────────────────────────────────────────
const MAP_POINTS = [
  { x:20,  y: 320 }, // 1 (Left)
  { x:80,  y: 750 }, // 2 (Right)
  { x:20,  y:1180 }, // 3 (Left)
  { x:80,  y:1610 }, // 4 (Right)
  { x:20,  y:2040 }, // 5 (Left)
  { x:80,  y:2470 }, // 6 (Right)
  { x:20,  y:2900 }, // 7 (Left)
  { x:80,  y:3330 }, // 8 (Right)
  { x:20,  y:3760 }, // 9 (Left)
  { x:80,  y:4190 }, // 10 (Right)
  { x:20,  y:4620 }, // 11 (Left)
  { x:80,  y:5050 }, // 12 (Right)
  { x:20,  y:5480 }, // 13 (Left)
  { x:80,  y:5910 }, // 14 (Right)
  { x:20,  y:6340 }, // 15 (Left)
];
const TOTAL_HEIGHT = MAP_POINTS[MAP_POINTS.length - 1].y + 200;
const DECORATIONS  = generateDecorations(TOTAL_HEIGHT);

// ── Baby Footprint ────────────────────────────────────────────────────────────
const BabyFootprint = ({ isLeft, angle, x, y }) => (
  <div style={{ position:'absolute', left:`${x}%`, top:`${y}px`,
    transform:`translate(-50%,-50%) rotate(${angle}deg)`, zIndex:2, pointerEvents:'none' }}>
    <svg width="22" height="28" viewBox="0 0 20 28">
      <ellipse cx={isLeft?7:13} cy="18" rx="4.5" ry="6.5" fill="var(--accent-color)" opacity="0.75"/>
      <ellipse cx={isLeft?9:11} cy="11" rx="5.5" ry="3.5" fill="var(--accent-color)" opacity="0.75"/>
      <circle cx={isLeft?3.5:16.5} cy="5.5" r="1.8" fill="var(--accent-color)" opacity="0.75"/>
      <circle cx={isLeft?7.5:12.5} cy="4.5" r="2"   fill="var(--accent-color)" opacity="0.75"/>
      <circle cx={isLeft?11.5:8.5} cy="5"   r="1.6" fill="var(--accent-color)" opacity="0.75"/>
      <circle cx={isLeft?15.5:4.5} cy="6.5" r="1.3" fill="var(--accent-color)" opacity="0.75"/>
      <circle cx={isLeft?18.5:1.5} cy="9"   r="1"   fill="var(--accent-color)" opacity="0.75"/>
    </svg>
  </div>
);

// ── Supabase upload ─────────────────────────────────────────────────────────
async function uploadToSupabaseStorage(file) {
  const extension = file.name ? file.name.substring(file.name.lastIndexOf('.')) : '.jpg';
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}${extension}`;
  const filePath = `milestones/${fileName}`;

  const { data, error } = await supabase.storage
    .from('baby-journal')
    .upload(filePath, file, {
      contentType: file.type || 'image/jpeg',
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data: publicUrlData } = supabase.storage
    .from('baby-journal')
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}

// ── Map helpers ───────────────────────────────────────────────────────────────
function buildPath(pts) {
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i-1], c = pts[i];
    const cy = (c.y - p.y) * 0.52;
    d += ` C ${p.x} ${p.y+cy}, ${c.x} ${c.y-cy}, ${c.x} ${c.y}`;
  }
  return d;
}
function buildFootprints(pts, upToIdx) {
  const steps = [];
  for (let i = 1; i <= upToIdx; i++) {
    const p0=pts[i-1], p3=pts[i], cy=(p3.y-p0.y)*0.52;
    const p1={x:p0.x,y:p0.y+cy}, p2={x:p3.x,y:p3.y-cy};
    const N=9;
    for (let s=1;s<=N;s++) {
      const t=s/(N+1),mt=1-t;
      const x=mt**3*p0.x+3*mt**2*t*p1.x+3*mt*t**2*p2.x+t**3*p3.x;
      const y=mt**3*p0.y+3*mt**2*t*p1.y+3*mt*t**2*p2.y+t**3*p3.y;
      const dx=3*mt**2*(p1.x-p0.x)+6*mt*t*(p2.x-p1.x)+3*t**2*(p3.x-p2.x);
      const dy=3*mt**2*(p1.y-p0.y)+6*mt*t*(p2.y-p1.y)+3*t**2*(p3.y-p2.y);
      steps.push({x,y,angle:Math.atan2(dy,dx)*180/Math.PI+90,isLeft:(i*N+s)%2===0,key:`f${i}-${s}`});
    }
  }
  return steps;
}

const CheckIcon  = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const EditIcon   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const UploadIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>;
const TrashIcon  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>;

const pathD = buildPath(MAP_POINTS);

// ════════════════════════════════════════════════════════════════════════════
export default function Milestones({ milestonesState, onMilestoneUpdate, isLoggedIn }) {
  const [modalId,   setModalId]   = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState('');
  const [activePhotoIndices, setActivePhotoIndices] = useState({});
  const [lightbox, setLightbox] = useState(null); // { msId: string, idx: number }

  const milestones = DEFAULT_MILESTONES.map(dm => {
    const msState = milestonesState[dm.id] || { completed: false, date: '', photoUrls: [] };
    // Backwards compatibility migration
    const photoUrls = msState.photoUrls || (msState.photoUrl ? [msState.photoUrl] : []);
    return {
      ...dm,
      ...msState,
      photoUrls
    };
  });

  React.useEffect(() => {
    if (!lightbox) return;
    const handleKeyDown = (e) => {
      const lbMs = milestones.find(m => m.id === lightbox.msId);
      if (!lbMs) return;
      const len = lbMs.photoUrls.length;
      if (e.key === 'ArrowRight' && len > 1) {
        setLightbox(prev => ({ ...prev, idx: (prev.idx + 1) % len }));
      } else if (e.key === 'ArrowLeft' && len > 1) {
        setLightbox(prev => ({ ...prev, idx: (prev.idx - 1 + len) % len }));
      } else if (e.key === 'Escape') {
        setLightbox(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightbox, milestones]);

  const furthestIdx = milestones.reduce((m, ms, i) => ms.completed ? Math.max(m, i) : m, 0);

  function patch(id, updates) {
    const cur = milestonesState[id] || { completed: false, date: '', photoUrls: [] };
    onMilestoneUpdate(id, { ...cur, ...updates });
  }

  function toggleComplete(id) {
    if (!isLoggedIn) return; // Restrict guests
    const cur = milestonesState[id] || { completed: false, date: '', photoUrls: [] };
    patch(id, {
      completed: !cur.completed,
      date: !cur.completed ? new Date().toISOString().slice(0, 10) : ''
    });
  }

  async function handleFileChange(e, id) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    setUploadErr('');
    try {
      // Upload all files to Supabase Storage in parallel
      const urls = await Promise.all(files.map(f => uploadToSupabaseStorage(f)));
      const curState = milestonesState[id] || { completed: false, date: '', photoUrls: [] };
      const currentUrls = curState.photoUrls || (curState.photoUrl ? [curState.photoUrl] : []);
      const updatedUrls = [...currentUrls, ...urls];

      patch(id, {
        photoUrls: updatedUrls,
        photoUrl: updatedUrls[0] || null, // Keep photoUrl synced as the first element for safety
        completed: true,
        date: curState.date || new Date().toISOString().slice(0, 10)
      });
    } catch {
      setUploadErr('Tải ảnh thất bại, vui lòng thử lại.');
    } finally {
      setUploading(false);
    }
  }

  function removePhoto(id, indexToRemove) {
    const curState = milestonesState[id] || { completed: false, date: '', photoUrls: [] };
    const currentUrls = curState.photoUrls || (curState.photoUrl ? [curState.photoUrl] : []);
    const updatedUrls = currentUrls.filter((_, idx) => idx !== indexToRemove);

    patch(id, {
      photoUrls: updatedUrls,
      photoUrl: updatedUrls[0] || null
    });

    // Reset active index if it exceeds the new length
    setActivePhotoIndices(prev => {
      const activeIdx = prev[id] || 0;
      if (activeIdx >= updatedUrls.length) {
        return { ...prev, [id]: Math.max(0, updatedUrls.length - 1) };
      }
      return prev;
    });
  }

  const footprints = furthestIdx > 0 ? buildFootprints(MAP_POINTS, furthestIdx) : [];
  const modalMs    = milestones.find(m => m.id === modalId);

  return (
    <section className="milestones-section scrapbook-milestones-theme full-bleed-container">
      <div className="scrapbook-map-container" style={{ height: `${TOTAL_HEIGHT}px` }}>

        {/* ── Title ──────────────────────────────────────────────────── */}
        <div className="scrapbook-map-header-plate">
          <div className="washi-tape left" /><div className="washi-tape right" />
          <h2 className="plate-title">Cột Mốc Vàng Phát Triển</h2>
          <p className="plate-subtitle">
            Theo dõi và ghi dấu những chặng đường phát triển thiêng liêng của bé yêu qua vết dấu chân khôn lớn.
          </p>
        </div>

        {/* ── Cute animal watermark decorations ─────────────────────── */}
        {DECORATIONS.map((d, i) => {
          const AnimalFn = ANIMAL_SVGS[d.type] || ANIMAL_SVGS.bear;
          const sz = Math.round(d.size);
          return (
            <span
              key={i}
              className={d.anim ? `map-deco ${d.anim}` : 'map-deco'}
              style={{
                top: `${d.top}px`,
                ...(d.left  !== undefined ? { left: `${d.left.toFixed(2)}%`  } : {}),
                ...(d.right !== undefined ? { right: `${d.right.toFixed(2)}%` } : {}),
                transform: `rotate(${d.rotate.toFixed(1)}deg)`,
                lineHeight: 1,
                '--dur':  d.dur,
                '--delay': d.delay,
              }}
            >
              {AnimalFn(sz, d.opacity)}
            </span>
          );
        })}

        {/* ── Winding path (base track only, no center lines) ──────────────── */}
        <svg className="scrapbook-road-svg" width="100%" height={`${TOTAL_HEIGHT}px`}
          viewBox={`0 0 100 ${TOTAL_HEIGHT}`} preserveAspectRatio="none">
          <path d={pathD} className="scrapbook-road-underlay" fill="none" />
        </svg>

        {/* ── Footprints ────────────────────────────────────────────── */}
        {footprints.map(f => <BabyFootprint key={f.key} isLeft={f.isLeft} angle={f.angle} x={f.x} y={f.y} />)}

        {/* ── Milestone nodes + cards ──────────────────────────────── */}
        {milestones.map((ms, idx) => {
          const pt      = MAP_POINTS[idx];
          const isRight = pt.x > 50;
          const cardLeft = isRight ? `calc(${pt.x}% - 555px)` : `calc(${pt.x}% + 65px)`;

          const activeIdx = activePhotoIndices[ms.id] || 0;
          const len       = ms.photoUrls.length;
          const hasPhotos = len > 0;

          const showPrev = (e) => {
            e.preventDefault(); e.stopPropagation();
            setActivePhotoIndices(prev => ({
              ...prev,
              [ms.id]: (activeIdx - 1 + len) % len
            }));
          };

          const showNext = (e) => {
            e.preventDefault(); e.stopPropagation();
            setActivePhotoIndices(prev => ({
              ...prev,
              [ms.id]: (activeIdx + 1) % len
            }));
          };

          return (
            <React.Fragment key={ms.id}>
              <button type="button"
                className={`scrapbook-node-point ${ms.completed ? 'completed' : ''}`}
                style={{ left: `${pt.x}%`, top: `${pt.y}px` }}
                onClick={() => toggleComplete(ms.id)}
                title={ms.completed ? 'Bỏ đánh dấu' : 'Đánh dấu hoàn thành'}>
                <span className="node-number">{idx + 1}</span>
                {ms.completed && <span className="node-check"><CheckIcon /></span>}
              </button>

              <div className={`scrapbook-milestone-card ${ms.completed ? 'completed' : ''}`}
                style={{ top: `${pt.y}px`, left: cardLeft }}>

                {/* ── Polaroid card area (supports single or multi-stacked) ── */}
                {len > 1 ? (
                  <div className="milestone-polaroid-stack">
                    <div className="milestone-polaroid-bg-1" />
                    <div className="milestone-polaroid-bg-2" />
                    <div className="card-photo-polaroid milestone-polaroid-main"
                      title="Xem ảnh phóng to">
                      <div className="polaroid-tape" />
                      <div className="polaroid-inner" onClick={() => setLightbox({ msId: ms.id, idx: activeIdx })}>
                        <img src={ms.photoUrls[activeIdx]} alt={ms.title} />
                      </div>
                      
                      {/* Nav Chevrons */}
                      <button type="button" className="polaroid-nav-btn prev" onClick={showPrev}>&lt;</button>
                      <button type="button" className="polaroid-nav-btn next" onClick={showNext}>&gt;</button>
                      
                      {/* Photo counter */}
                      <span className="polaroid-counter">{activeIdx + 1}/{len}</span>
                    </div>
                  </div>
                ) : hasPhotos ? (
                  <div className="card-photo-polaroid"
                    title="Xem ảnh phóng to"
                    onClick={() => setLightbox({ msId: ms.id, idx: 0 })}>
                    <div className="polaroid-tape" />
                    <div className="polaroid-inner">
                      <img src={ms.photoUrls[0]} alt={ms.title} />
                    </div>
                  </div>
                ) : isLoggedIn ? (
                  <label className="card-photo-polaroid empty"
                    title="Tải ảnh lên"
                    style={{ cursor: uploading ? 'wait' : 'pointer' }}>
                    <input type="file" accept="image/*" style={{ display: 'none' }}
                      onChange={e => handleFileChange(e, ms.id)} disabled={uploading} multiple />
                    <div className="polaroid-tape" />
                    <div className="polaroid-inner-empty">
                      {uploading
                        ? <span style={{ fontSize: '.72rem', color: 'var(--accent-color)' }}>Đang tải…</span>
                        : <><UploadIcon /><span>Tải ảnh lên</span></>}
                    </div>
                  </label>
                ) : (
                  <div className="card-photo-polaroid empty"
                    title="Chưa kích hoạt cột mốc này">
                    <div className="polaroid-tape" />
                    <div className="polaroid-inner-empty">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '1.8rem', height: '1.8rem', opacity: 0.5, color: 'var(--accent-color)' }}>
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      <span style={{ fontSize: '.75rem', opacity: 0.6, marginTop: '6px', color: 'var(--text-color)' }}>Chưa có kỷ niệm</span>
                    </div>
                  </div>
                )}

                <div className="card-info-pane">
                  <div className="card-header-row">
                    <span className="card-age-tag">{ms.targetAge}</span>
                    {ms.completed && isLoggedIn && (
                      <button type="button" className="card-edit-cog" onClick={() => setModalId(ms.id)}>
                        <EditIcon />
                      </button>
                    )}
                  </div>
                  <h3 className="card-title" onClick={() => toggleComplete(ms.id)}>{ms.title}</h3>
                  <p className="card-desc">{ms.desc}</p>
                  {ms.completed && ms.date && (
                    <span className="card-completed-date">
                      Đạt mốc: {new Date(ms.date).toLocaleDateString('vi-VN')}
                    </span>
                  )}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* ── Settings modal ──────────────────────────────────────────── */}
      {modalId && modalMs && (
        <div className="ms-modal-backdrop" onClick={() => { setModalId(null); setUploadErr(''); }}>
          <div className="ms-modal-panel" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <h4>Cài đặt — {modalMs.title}</h4>
              <button type="button" className="popup-close"
                onClick={() => { setModalId(null); setUploadErr(''); }}>&times;</button>
            </div>
            <div className="popup-body">
              <div className="popup-field">
                <label>Ngày hoàn thành:</label>
                <input type="date" value={modalMs.date}
                  onChange={e => patch(modalMs.id, { date: e.target.value })} className="form-control" />
              </div>
              
              <div className="popup-field">
                <label>Tải thêm ảnh kỷ niệm:</label>
                <label className="ms-upload-label" style={{ cursor: uploading ? 'wait' : 'pointer' }}>
                  <input type="file" accept="image/*" multiple
                    onChange={e => handleFileChange(e, modalMs.id)} disabled={uploading} />
                  <UploadIcon />
                  {uploading ? 'Đang tải lên…' : 'Chọn ảnh mới (có thể chọn nhiều)'}
                </label>
                {uploadErr && <p style={{ fontSize: '.72rem', color: '#EF4444', margin: 0 }}>{uploadErr}</p>}
              </div>

              {modalMs.photoUrls && modalMs.photoUrls.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>
                    Danh sách ảnh kỷ niệm ({modalMs.photoUrls.length}):
                  </label>
                  <div className="modal-photos-grid">
                    {modalMs.photoUrls.map((url, idx) => (
                      <div key={idx} className="modal-photo-item">
                        <img src={url} alt={`preview-${idx}`} />
                        <button type="button" className="modal-photo-delete-btn"
                          onClick={() => removePhoto(modalMs.id, idx)} title="Xóa ảnh này">
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Lightbox preview modal ────────────────────────────────────── */}
      {lightbox && (() => {
        const lbMs = milestones.find(m => m.id === lightbox.msId);
        if (!lbMs || lbMs.photoUrls.length === 0) return null;
        const urls = lbMs.photoUrls;
        const activeIdx = lightbox.idx;

        const showPrevLb = (e) => {
          e.stopPropagation();
          setLightbox(prev => ({ ...prev, idx: (activeIdx - 1 + urls.length) % urls.length }));
        };

        const showNextLb = (e) => {
          e.stopPropagation();
          setLightbox(prev => ({ ...prev, idx: (activeIdx + 1) % urls.length }));
        };

        const closeIcon = (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '1.2rem', height: '1.2rem' }}>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        );

        const handleEditClick = () => {
          setModalId(lbMs.id);
          setLightbox(null);
        };

        const formattedDate = lbMs.date
          ? new Date(lbMs.date).toLocaleDateString('vi-VN')
          : 'Chưa đạt mốc';

        return (
          <div className="modal-backdrop" onClick={() => setLightbox(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close-btn" onClick={() => setLightbox(null)} aria-label="Đóng">
                {closeIcon}
              </button>

              {/* Left Side: Media Pane (Giant Polaroid Card) */}
              <div className="modal-media-pane" style={{ position: 'relative' }}>
                <div className="modal-giant-polaroid">
                  {/* Pink Sticky Tape */}
                  <div className="polaroid-pin" style={{ width: '70px', height: '28px', top: '-14px', zIndex: 12, transform: 'translateX(-50%) rotate(-3deg)' }} />
                  
                  {/* Photo Container */}
                  <div className="polaroid-image-container" style={{ width: '100%', paddingBottom: '86%', borderRadius: '2px', position: 'relative' }}>
                    <img 
                      src={urls[activeIdx]} 
                      alt={`${lbMs.title} - Ảnh ${activeIdx + 1}`} 
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                    />

                    {/* Navigation Arrows */}
                    {urls.length > 1 && (
                      <>
                        <button 
                          type="button" 
                          className="carousel-arrow left"
                          onClick={showPrevLb}
                          aria-label="Hình trước"
                        >
                          &lt;
                        </button>
                        
                        <button 
                          type="button" 
                          className="carousel-arrow right"
                          onClick={showNextLb}
                          aria-label="Hình sau"
                        >
                          &gt;
                        </button>

                        {/* Dot Indicators */}
                        <div className="carousel-dots">
                          {urls.map((_, idx) => (
                            <button
                              key={idx}
                              type="button"
                              className={`carousel-dot ${idx === activeIdx ? 'active' : ''}`}
                              onClick={(e) => { e.stopPropagation(); setLightbox(prev => ({ ...prev, idx })); }}
                              aria-label={`Ảnh ${idx + 1}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Polaroid caption & date written inside the polaroid */}
                  <div className="polaroid-caption" style={{ fontSize: '1.35rem', marginTop: '1.2rem', whiteSpace: 'normal', height: 'auto', padding: '0 0.5rem', textOverflow: 'unset', overflow: 'visible', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                    {lbMs.title}
                  </div>
                  <div className="polaroid-date" style={{ fontSize: '0.82rem', marginTop: '0.4rem', fontWeight: '500' }}>
                    {formattedDate} {lbMs.targetAge ? `• ${lbMs.targetAge}` : ''}
                  </div>
                </div>
              </div>

              {/* Right Side: Details Pane */}
              <div className="modal-details-pane">
                <div className="modal-header">
                  <h2 className="modal-title">{lbMs.title}</h2>
                  <div className="modal-meta-row" style={{ marginTop: '0.5rem' }}>
                    <span className="modal-meta-tag">{formattedDate}</span>
                    {lbMs.targetAge && <span className="modal-meta-tag">{lbMs.targetAge}</span>}
                    <span className="modal-meta-tag">Cột Mốc Vàng</span>
                  </div>
                </div>

                <div className="modal-body" style={{ flex: 1 }}>
                  <p className="modal-desc">
                    {lbMs.desc || 'Không có mô tả cho cột mốc này.'}
                  </p>
                </div>

                {isLoggedIn && (
                  <div className="form-actions" style={{ borderTop: '1px dashed var(--accent-light)', paddingTop: '1rem', marginTop: 'auto' }}>
                    <button 
                      className="btn btn-secondary" 
                      onClick={handleEditClick}
                      style={{ padding: '0.5rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      Chỉnh Sửa
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </section>
  );
}
