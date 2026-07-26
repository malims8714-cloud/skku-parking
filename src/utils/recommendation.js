// ─────────────────────────────────────────────────────────────
// 주차면 추천 로직
// 나중에 실제 AI 추천 모델로 교체할 때 recommend() 함수만 바꾸면 됩니다.
// ─────────────────────────────────────────────────────────────

import { BUILDINGS } from '../data/buildings.js';
import { WEATHER_MULTIPLIER } from '../data/weatherParkingData.js';

/**
 * 최적 주차면을 추천합니다.
 * @param {Object} params
 * @param {Array}  params.slots        - 현재 주차면 상태 배열
 * @param {string} params.buildingId   - 목적지 건물 ID
 * @param {string} params.vehicleType  - 차량 유형 (normal/electric/disabled)
 * @param {string} params.weatherType  - 날씨 타입
 * @param {Object} params.congestion   - 현재 구역별 혼잡도 { A, B, C, D }
 * @returns {Object|null} 추천 결과
 */
export function recommend({ slots, buildingId, vehicleType, weatherType, congestion }) {
  const building = BUILDINGS.find(b => b.id === buildingId);
  if (!building) return null;

  const available = slots.filter(s => {
    if (s.status !== 'empty') return false;
    if (vehicleType === 'disabled' && !s.id.includes('D')) return false; // D구역에 장애인 구역 설정
    return true;
  });

  if (available.length === 0) return null;

  const weatherWeight = weatherType === 'rainy' || weatherType === 'snowy' ? 3 : 1;

  const scored = available.map(slot => {
    const walkMin = building.walkTime[slot.zoneId] ?? 10;
    const cong = congestion[slot.zoneId] ?? 50;

    let score = 100;
    score -= walkMin * (5 * weatherWeight);  // 도보 시간 패널티 (비/눈이면 가중)
    score -= cong * 0.3;                      // 혼잡도 패널티

    // 전기차는 D구역 선호 (지하주차장에 충전기 설치 가정)
    if (vehicleType === 'electric' && slot.zoneId === 'D') score += 15;
    // 장애인 차량은 거리 가중
    if (vehicleType === 'disabled') score -= walkMin * 3;

    return { ...slot, score, walkMin, congestion: cong };
  });

  scored.sort((a, b) => b.score - a.score);
  const best = scored[0];

  return {
    slot: best,
    building,
    walkMin: best.walkMin,
    congestion: best.congestion,
    reason: buildReason(best, building, vehicleType, weatherType),
    alternatives: scored.slice(1, 3),
  };
}

function buildReason(slot, building, vehicleType, weatherType) {
  const parts = [];
  parts.push(`${building.name}까지 도보 약 ${slot.walkMin}분 거리`);

  if (weatherType === 'rainy') parts.push('비 오는 날 이동 거리 최소화');
  else if (weatherType === 'snowy') parts.push('눈길 이동 거리 최소화');

  if (slot.congestion < 40) parts.push('현재 여유 있는 구역');
  else if (slot.congestion < 70) parts.push('적정 혼잡도');

  if (vehicleType === 'electric' && slot.zoneId === 'D') parts.push('전기차 충전 가능 구역');
  if (vehicleType === 'disabled') parts.push('장애인 전용 구역 우선 배정');

  return parts.join(' · ') + '으로 추천합니다.';
}
