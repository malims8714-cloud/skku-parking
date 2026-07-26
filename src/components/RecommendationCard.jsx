import { getCongestionLabel } from '../utils/congestionPredictor.js';
import { WEATHER_TYPES } from '../data/weatherParkingData.js';

export default function RecommendationCard({ result, weather, onNavigate }) {
  if (!result) return null;

  const { slot, building, walkMin, congestion, reason, alternatives } = result;
  const { label: congLabel, color: congColor, bg: congBg } = getCongestionLabel(congestion);
  const wt = WEATHER_TYPES[weather?.type] || WEATHER_TYPES.sunny;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 메인 추천 카드 */}
      <div style={{
        background: 'linear-gradient(135deg, #0057A8, #1a6fc4)',
        borderRadius: 'var(--card-radius)',
        padding: 24,
        color: '#fff',
        boxShadow: '0 8px 24px rgba(0,87,168,0.35)',
      }}>
        <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 6 }}>추천 주차 공간</div>
        <div style={{ fontSize: 42, fontWeight: 800, letterSpacing: 2 }}>{slot.id}</div>
        <div style={{ fontSize: 15, opacity: 0.9, marginTop: 4 }}>
          {slot.zoneId === 'D' ? '지하주차장' : `${slot.zoneId}구역`} ·{' '}
          {['A','B','C','D'].findIndex(z => z === slot.zoneId) >= 0
            ? ['정문 앞','중앙','후문','지하'][['A','B','C','D'].indexOf(slot.zoneId)]
            : ''}
        </div>

        <div style={{ display: 'flex', gap: 16, marginTop: 20 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24 }}>🚶</div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{walkMin}분</div>
            <div style={{ fontSize: 11, opacity: 0.8 }}>도보</div>
          </div>
          <div style={{ width: 1, background: 'rgba(255,255,255,0.3)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24 }}>{wt.icon}</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{wt.label}</div>
            <div style={{ fontSize: 11, opacity: 0.8 }}>현재 날씨</div>
          </div>
          <div style={{ width: 1, background: 'rgba(255,255,255,0.3)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 600, padding: '4px 10px', background: 'rgba(255,255,255,0.2)', borderRadius: 20, marginTop: 2 }}>{congLabel}</div>
            <div style={{ fontSize: 16, fontWeight: 700, marginTop: 4 }}>{congestion}%</div>
            <div style={{ fontSize: 11, opacity: 0.8 }}>혼잡도</div>
          </div>
        </div>
      </div>

      {/* 목적지 정보 */}
      <div style={{
        background: '#fff', borderRadius: 'var(--card-radius)', padding: 16,
        boxShadow: 'var(--shadow-sm)', border: '1px solid var(--gray-100)',
      }}>
        <div style={{ fontSize: 13, color: 'var(--gray-400)', marginBottom: 4 }}>목적지</div>
        <div style={{ fontSize: 18, fontWeight: 700 }}>
          {building.icon} {building.name}
        </div>
        <div style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 4 }}>
          {slot.id}에서 도보 약 {walkMin}분
        </div>
      </div>

      {/* 추천 이유 */}
      <div style={{
        background: '#EFF6FF', borderRadius: 'var(--card-radius)', padding: 16,
        border: '1px solid #BFDBFE',
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary)', marginBottom: 6 }}>
          💡 추천 이유
        </div>
        <div style={{ fontSize: 14, color: 'var(--gray-700)', lineHeight: 1.6 }}>
          {reason}
        </div>
      </div>

      {/* 대안 */}
      {alternatives?.length > 0 && (
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-700)', marginBottom: 8 }}>
            대안 주차 공간
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {alternatives.map((alt, i) => (
              <div key={alt.id} style={{
                flex: 1, background: '#fff', borderRadius: 12,
                padding: 12, border: '1px solid var(--gray-200)',
                textAlign: 'center', boxShadow: 'var(--shadow-sm)',
              }}>
                <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>대안 {i + 1}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--gray-700)' }}>{alt.id}</div>
                <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>도보 {alt.walkMin}분</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
