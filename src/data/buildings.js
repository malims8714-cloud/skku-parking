// ─────────────────────────────────────────────────────────────
// 실제 건물 정보로 교체할 때 이 파일만 수정하면 됩니다.
// walkTime: 해당 구역에서 건물까지 예상 도보 시간 (분)
// ─────────────────────────────────────────────────────────────

export const BUILDINGS = [
  {
    id: 'eng1',
    name: '제1공학관',
    shortName: '1공학관',
    icon: '🏛️',
    walkTime: { A: 2, B: 4, C: 8, D: 5 },
  },
  {
    id: 'eng2',
    name: '제2공학관',
    shortName: '2공학관',
    icon: '🏗️',
    walkTime: { A: 4, B: 2, C: 7, D: 4 },
  },
  {
    id: 'pharmacy',
    name: '약학관',
    shortName: '약학관',
    icon: '🧪',
    walkTime: { A: 7, B: 5, C: 2, D: 6 },
  },
  {
    id: 'semiconductor',
    name: '반도체관',
    shortName: '반도체관',
    icon: '💡',
    walkTime: { A: 6, B: 4, C: 5, D: 2 },
  },
  {
    id: 'liberal',
    name: '기초학문관',
    shortName: '기초학문관',
    icon: '📚',
    walkTime: { A: 5, B: 2, C: 6, D: 5 },
  },
  {
    id: 'science',
    name: '자연과학관',
    shortName: '자연과학관',
    icon: '🔬',
    walkTime: { A: 8, B: 6, C: 2, D: 7 },
  },
  {
    id: 'library',
    name: '삼성학술정보관',
    shortName: '학술정보관',
    icon: '📖',
    walkTime: { A: 3, B: 5, C: 9, D: 3 },
  },
];

export const VEHICLE_TYPES = [
  { id: 'normal', name: '일반 차량', icon: '🚗' },
  { id: 'electric', name: '전기차', icon: '⚡' },
  { id: 'disabled', name: '장애인 차량', icon: '♿' },
];
