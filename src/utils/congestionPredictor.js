// ─────────────────────────────────────────────────────────────
// 혼잡도 예측 로직
// 나중에 실제 AI 모델(TensorFlow.js, API 호출 등)로 교체할 때
// predict() 함수의 내부만 바꾸면 됩니다.
// ─────────────────────────────────────────────────────────────

import { HOURLY_CONGESTION, WEATHER_MULTIPLIER, DAY_MULTIPLIER } from '../data/weatherParkingData.js';

/**
 * 특정 구역의 특정 시간대 혼잡도를 예측합니다.
 * @param {string} zoneId - 구역 ID (A/B/C/D)
 * @param {number} hour - 시간 (0~23)
 * @param {string} weatherType - 날씨 타입
 * @param {number} dayOfWeek - 요일 (0=일~6=토)
 * @returns {number} 혼잡도 (0~100)
 */
export function predict(zoneId, hour, weatherType, dayOfWeek) {
  const base = HOURLY_CONGESTION[zoneId]?.[hour] ?? 50;
  const wMult = WEATHER_MULTIPLIER[weatherType] ?? 1.0;
  const dMult = DAY_MULTIPLIER[dayOfWeek] ?? 1.0;
  return Math.min(100, Math.round(base * wMult * dMult));
}

/**
 * 현재 시각 기준 모든 구역의 혼잡도를 계산합니다.
 * @param {string} weatherType
 * @returns {{ A: number, B: number, C: number, D: number }}
 */
export function getCurrentCongestion(weatherType) {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay();
  return {
    A: predict('A', hour, weatherType, day),
    B: predict('B', hour, weatherType, day),
    C: predict('C', hour, weatherType, day),
    D: predict('D', hour, weatherType, day),
  };
}

/**
 * 오늘 24시간 혼잡도 예측 데이터를 반환합니다 (차트용).
 * @param {string} zoneId
 * @param {string} weatherType
 * @returns {Array<{ hour: string, congestion: number }>}
 */
export function getDailyPrediction(zoneId, weatherType) {
  const day = new Date().getDay();
  return Array.from({ length: 24 }, (_, h) => ({
    hour: `${String(h).padStart(2, '0')}:00`,
    congestion: predict(zoneId, h, weatherType, day),
  }));
}

export function getCongestionLabel(value) {
  if (value >= 80) return { label: '매우혼잡', color: '#FF3B30', bg: '#FEE2E2' };
  if (value >= 60) return { label: '혼잡', color: '#FF9500', bg: '#FEF3C7' };
  if (value >= 40) return { label: '보통', color: '#FFCC00', bg: '#FEFCE8' };
  if (value >= 20) return { label: '여유', color: '#34C759', bg: '#D1FAE5' };
  return { label: '한산', color: '#0057A8', bg: '#DBEAFE' };
}
