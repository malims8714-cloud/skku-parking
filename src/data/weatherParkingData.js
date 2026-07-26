// ─────────────────────────────────────────────────────────────
// 날씨 mock 데이터 & 날씨별 혼잡도 패턴
// 실제 날씨 API 연동 시 getCurrentWeather() 함수만 교체하면 됩니다.
// 예: OpenWeatherMap API / 기상청 API
// ─────────────────────────────────────────────────────────────

export const WEATHER_TYPES = {
  sunny: { label: '맑음', icon: '☀️', color: '#FF9500', bg: 'linear-gradient(135deg, #FFD700, #FF9500)' },
  cloudy: { label: '흐림', icon: '☁️', color: '#6B7280', bg: 'linear-gradient(135deg, #9CA3AF, #6B7280)' },
  rainy: { label: '비', icon: '🌧️', color: '#3B82F6', bg: 'linear-gradient(135deg, #60A5FA, #2563EB)' },
  snowy: { label: '눈', icon: '❄️', color: '#60A5FA', bg: 'linear-gradient(135deg, #BAE6FD, #60A5FA)' },
  hot: { label: '폭염', icon: '🌡️', color: '#EF4444', bg: 'linear-gradient(135deg, #FCA5A5, #EF4444)' },
};

// 실제 날씨 API 연동 시 이 함수를 교체하세요
export function getCurrentWeather() {
  return {
    type: 'cloudy',
    temperature: 23,
    humidity: 68,
    windSpeed: 3.2,
    description: '흐리고 오후에 비 예보',
    location: '경기도 수원시',
  };
}

// 시간대별 혼잡도 패턴 (0~100%)
// 실제 데이터로 교체 시 이 객체만 수정하세요
export const HOURLY_CONGESTION = {
  A: [10,8,5,3,2,5,15,40,65,70,60,55,70,65,55,60,75,80,60,40,25,15,10,8],
  B: [8,5,3,2,2,4,12,35,60,68,58,52,68,62,52,58,72,78,58,38,22,12,8,6],
  C: [5,3,2,1,1,3,8,25,45,55,48,42,55,50,42,48,60,65,48,30,18,10,6,4],
  D: [12,10,8,5,3,6,18,45,70,75,65,60,72,68,60,65,78,82,65,45,28,18,12,10],
};

// 날씨에 따른 혼잡도 배율
export const WEATHER_MULTIPLIER = {
  sunny:  1.0,
  cloudy: 0.9,
  rainy:  1.3,  // 비 오는 날 실내 주차장 선호
  snowy:  1.4,
  hot:    0.85,
};

// 요일별 혼잡도 배율 (0=일, 1=월 ... 6=토)
export const DAY_MULTIPLIER = [0.3, 0.9, 1.0, 1.0, 1.0, 0.95, 0.2];
