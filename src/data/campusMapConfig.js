// ─────────────────────────────────────────────────────────────
// 캠퍼스 지도 레이아웃 데이터
// SVG viewBox: 0 0 900 660 (가로 900, 세로 660 기준 좌표)
//
// ✏️  수정 방법
//   구역 위치·색상       → src/data/parkingLots.js  ZONES 배열
//   건물 추가·위치 이동  → 이 파일 BUILDINGS 배열
//   주차관리실 전화번호  → 이 파일 PARKING_OFFICE.phone
//   캠퍼스 외곽선        → 이 파일 CAMPUS_BOUNDARY
// ─────────────────────────────────────────────────────────────

// 캠퍼스 외곽 폴리곤 경로 (SVG path d 속성)
export const CAMPUS_BOUNDARY =
  'M 90,112 L 114,68 L 218,37 L 368,20 L 520,28 L 640,46 L 720,90 ' +
  'L 798,158 L 844,270 L 857,384 L 843,476 L 818,557 L 776,618 ' +
  'L 708,650 L 580,660 L 452,658 L 343,644 L 254,628 L 190,600 ' +
  'L 152,564 L 114,510 L 78,446 L 66,370 L 68,280 L 78,196 Z';

// ── 도로 ──────────────────────────────────────────────────────
// type: 'line' | 'path'
// w: 선 굵기, opacity: 투명도
export const ROADS = [
  { type: 'line', x1: 452, y1:  25, x2: 452, y2: 655, w: 11, opacity: 0.85 }, // 중앙 세로 도로
  { type: 'line', x1:  68, y1: 415, x2: 855, y2: 415, w:  9, opacity: 0.75 }, // 중간 가로 도로
  { type: 'line', x1:  68, y1: 278, x2: 760, y2: 278, w:  8, opacity: 0.65 }, // 상단 가로 도로
  { type: 'line', x1: 102, y1: 553, x2: 778, y2: 553, w:  8, opacity: 0.65 }, // 하단 가로 도로
  { type: 'path', d: 'M 640,48 Q 748,100 800,200 Q 852,348 843,475', w: 9, opacity: 0.70 }, // 우측 곡선 도로
  { type: 'path', d: 'M 90,130 Q 76,280 68,378 Q 70,460 112,512',    w: 8, opacity: 0.60 }, // 좌측 곡선 도로
  { type: 'line', x1: 250, y1: 415, x2: 250, y2: 278, w: 7, opacity: 0.55 }, // 좌측 보조 도로
  { type: 'line', x1: 660, y1: 278, x2: 660, y2: 553, w: 7, opacity: 0.55 }, // 우측 보조 도로
];

// ── 운동장·녹지 ────────────────────────────────────────────────
// shapes: SVG 도형 배열
//   inner: true → 내부 트랙·선 (campus 배경색 또는 투명 처리)
//   innerFill: 내부 채우기 색상 (생략 시 캠퍼스 배경색 사용)
// label, labelX, labelY: 라벨 텍스트 및 좌표
// muted: true → 회색 텍스트
export const SPORTS_AREAS = [
  {
    id: 'track',
    label: '대운동장', labelX: 120, labelY: 250, labelSize: 8.5, labelWeight: 700,
    shapes: [
      { type: 'ellipse', cx: 120, cy: 244, rx: 63, ry: 56, sw: 1.5 },
      { type: 'ellipse', cx: 120, cy: 244, rx: 44, ry: 38, sw: 1, inner: true }, // 트랙 내부
    ],
  },
  {
    id: 'soccer',
    label: '축구장', labelX: 121, labelY: 432, labelSize: 8, muted: true,
    shapes: [
      { type: 'rect', x:  77, y: 396, w: 88, h: 71, rx: 4, sw: 1.5 },
      { type: 'rect', x:  83, y: 401, w: 76, h: 61, rx: 2, sw: 0.8, inner: true, innerFill: 'none', innerOpacity: 0.6 },
    ],
  },
  {
    id: 'baseball',
    shapes: [
      { type: 'path', d: 'M 130,536 Q 168,536 186,558 Q 198,580 188,605 Q 175,622 150,628 Q 128,630 106,620 Q 82,606 78,582 Q 74,558 92,543 Z', sw: 1.5 },
    ],
  },
  {
    id: 'plaza',
    label: '글로벌광장', labelX: 464, labelY: 497, labelSize: 7, muted: true,
    shapes: [
      { type: 'ellipse', cx: 464, cy: 495, rx: 36, ry: 19, sw: 1, opacity: 0.75 },
    ],
  },
];

// ── 건물 ──────────────────────────────────────────────────────
// shape: 건물 도형 정보
//   type: 'rect' | 'ellipse'
//   rect  → x, y, w(width), h(height), rx(모서리 반경), sw(strokeWidth, 기본 1)
//   ellipse → cx, cy, rx, ry, sw
// shadow: true → 그림자 필터 적용
// labels: 라벨 배열 (여러 줄 이름 지원)
//   text, x, y, size(fontSize), weight(fontWeight), muted(회색 처리)
export const BUILDINGS = [
  {
    id: 'dorm',
    shape:  { type: 'rect', x: 340, y:  36, w: 228, h: 28, rx: 3 }, shadow: true,
    labels: [{ text: '기숙사 의관 92동 · 예관 93동', x: 455, y:  25, size: 7.5, weight: 600, muted: true }],
  },
  {
    id: 'new-a',
    shape:  { type: 'rect', x: 138, y:  96, w:  66, h: 30, rx: 3 },
    labels: [{ text: '신관A동', x: 171, y: 115, size: 7 }],
  },
  {
    id: 'new-b',
    shape:  { type: 'rect', x: 242, y: 140, w:  76, h: 30, rx: 3 },
    labels: [{ text: '신관B동', x: 280, y: 158, size: 7 }],
  },
  {
    id: 'unyong',
    shape:  { type: 'rect', x: 175, y: 312, w:  65, h: 34, rx: 3 },
    labels: [{ text: '운용재 49동', x: 207, y: 333, size: 7 }],
  },
  {
    id: 'student-union',
    shape:  { type: 'rect', x: 282, y: 382, w:  78, h: 38, rx: 3 }, shadow: true,
    labels: [{ text: '학생회관 3동', x: 321, y: 405, size: 7 }],
  },
  {
    id: 'suseong',
    shape:  { type: 'rect', x: 210, y: 430, w:  65, h: 38, rx: 3 },
    labels: [{ text: '수성관 5동', x: 243, y: 453, size: 7 }],
  },
  {
    id: 'gym',
    shape:  { type: 'rect', x:  84, y: 456, w:  65, h: 34, rx: 3 },
    labels: [{ text: '체육관 72동', x: 117, y: 476, size: 7 }],
  },
  {
    id: 'biotech',
    shape:  { type: 'rect', x: 388, y: 162, w:  74, h: 40, rx: 3 }, shadow: true,
    labels: [{ text: '생명공학대학 62동', x: 426, y: 186, size: 7 }],
  },
  {
    id: 'basic-sci',
    shape:  { type: 'rect', x: 370, y: 242, w:  80, h: 34, rx: 3 }, shadow: true,
    labels: [{ text: '기초학문관 51동', x: 410, y: 263, size: 7 }],
  },
  {
    id: 'sci2',
    shape:  { type: 'rect', x: 390, y: 292, w:  76, h: 33, rx: 3 }, shadow: true,
    labels: [{ text: '제2과학관 32동', x: 428, y: 313, size: 7 }],
  },
  {
    id: 'sci1',
    shape:  { type: 'rect', x: 390, y: 341, w:  76, h: 33, rx: 3 }, shadow: true,
    labels: [{ text: '제1과학관 31동', x: 428, y: 362, size: 7 }],
  },
  {
    id: 'library',
    shape:  { type: 'ellipse', cx: 448, cy: 428, rx: 60, ry: 52, sw: 1.8 }, shadow: true,
    labels: [
      { text: '삼성학술',    x: 448, y: 424, size: 7.5, weight: 800 },
      { text: '정보관 48동', x: 448, y: 434, size: 7.5, weight: 800 },
    ],
  },
  {
    id: 'eng27',
    shape:  { type: 'rect', x: 558, y: 194, w:  82, h: 42, rx: 3 }, shadow: true,
    labels: [{ text: '제2공학관 27동', x: 599, y: 220, size: 7 }],
  },
  {
    id: 'eng26',
    shape:  { type: 'rect', x: 558, y: 252, w:  82, h: 42, rx: 3 }, shadow: true,
    labels: [{ text: '제2공학관 26동', x: 599, y: 278, size: 7 }],
  },
  {
    id: 'eng23',
    shape:  { type: 'rect', x: 558, y: 320, w:  86, h: 54, rx: 3, sw: 1.5 }, shadow: true,
    labels: [{ text: '공과대학 23동', x: 601, y: 352, size: 7.5, weight: 800 }],
  },
  {
    id: 'cns',
    shape:  { type: 'rect', x: 666, y: 308, w:  64, h: 36, rx: 3 },
    labels: [{ text: 'CNS센터', x: 698, y: 330, size: 7 }],
  },
  {
    id: 'utility',
    shape:  { type: 'rect', x: 668, y: 360, w:  62, h: 33, rx: 3 },
    labels: [{ text: '유틸리티', x: 699, y: 380, size: 7 }],
  },
  {
    id: 'complex2',
    shape:  { type: 'rect', x: 665, y: 428, w:  66, h: 52, rx: 3 },
    labels: [{ text: '제2종합 83동', x: 698, y: 458, size: 7 }],
  },
  {
    id: 'complex1',
    shape:  { type: 'rect', x: 665, y: 496, w:  66, h: 52, rx: 3 },
    labels: [{ text: '제1종합 81동', x: 698, y: 526, size: 7 }],
  },
  {
    id: 'chem',
    shape:  { type: 'rect', x: 608, y: 568, w:  64, h: 38, rx: 3 }, shadow: true,
    labels: [{ text: '화학관 33동', x: 640, y: 591, size: 7 }],
  },
  {
    id: 'pharmacy',
    shape:  { type: 'rect', x: 540, y: 568, w:  62, h: 38, rx: 3 }, shadow: true,
    labels: [{ text: '약학대학', x: 571, y: 591, size: 7 }],
  },
  {
    id: 'n-center',
    shape:  { type: 'rect', x: 452, y: 568, w:  65, h: 38, rx: 3 }, shadow: true,
    labels: [{ text: 'N센터 86동', x: 485, y: 591, size: 7 }],
  },
  {
    id: 'env',
    shape:  { type: 'rect', x: 400, y: 625, w:  68, h: 26, rx: 3 },
    labels: [{ text: '환경플랜트 12동', x: 434, y: 643, size: 7 }],
  },
  {
    id: 'med71',
    shape:  { type: 'rect', x: 317, y: 556, w:  68, h: 38, rx: 3 }, shadow: true,
    labels: [{ text: '의학관 71동', x: 351, y: 579, size: 7 }],
  },
  {
    id: 'med70',
    shape:  { type: 'rect', x: 226, y: 540, w:  68, h: 38, rx: 3 },
    labels: [{ text: '의대강당 70동', x: 260, y: 562, size: 7 }],
  },
  {
    id: 'med-school',
    shape:  { type: 'rect', x: 183, y: 598, w:  72, h: 33, rx: 3 },
    labels: [{ text: '의과대학', x: 219, y: 618, size: 7 }],
  },
];

// ── 주차관리실 ─────────────────────────────────────────────────
// 말풍선 위치: x/y = 좌상단, w/h = 크기
// textX: 텍스트 중앙 x 좌표
// pointerPoints: 말풍선 꼭지 SVG polygon points
export const PARKING_OFFICE = {
  label:         '주차관리실',  // ← 이름 수정 가능
  subLabel:      'N센터86109호', // ← 호수 수정 가능
  phone:         '031-290-5471', // ← 전화번호 수정 가능
  x: 646, y: 590, w: 120, h: 46, rx: 8,
  textX: 706,
  pointerPoints: '686,636 696,636 691,647',
};
