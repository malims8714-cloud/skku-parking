import { useState } from 'react';
import ParkingSlot from './ParkingSlot.jsx';
import { ZONES } from '../data/parkingLots.js';
import { getCongestionLabel } from '../utils/congestionPredictor.js';

// ─────────────────────────────────────────────────────────────
// 항공사진 이미지 import
// 파일을 src/assets/ 에 넣으면 자동으로 사용됩니다.
// 파일이 없으면 그라데이션 배경으로 대체됩니다.
// ─────────────────────────────────────────────────────────────
let zoneAImage = null;
try {
  // 사용자가 src/assets/zone_a_aerial.jpg 를 저장하면 아래 줄의 주석을 해제하세요:
  // zoneAImage = (await import('../assets/zone_a_aerial.jpg')).default;
  // 또는 이미 파일이 있다면 아래처럼 static import 사용:
} catch {}

// 구역별 항공사진 매핑 (파일을 assets에 저장 후 여기서 import)
// 예: import zoneAPhoto from '../assets/zone_a_aerial.jpg';
// AERIAL_IMAGES['A'] = zoneAPhoto;
const AERIAL_IMAGES = {
  // A: zoneAPhoto,  ← 사진 저장 후 이 줄을 활성화하세요
};

// 사진이 없을 때 구역별 배경색
const ZONE_GRADIENTS = {
  A: 'linear-gradient(135deg, #e8f4fd 0%, #c8e6f9 100%)',
  B: 'linear-gradient(135deg, #e8fdf0 0%, #c8f0dc 100%)',
  C: 'linear-gradient(135deg, #fdf8e8 0%, #f0ecc8 100%)',
  D: 'linear-gradient(135deg, #f0e8fd 0%, #dcc8f0 100%)',
};

export default function ParkingMap({ slots, congestion, onSlotClick, interactive = false }) {
  const [expandedZone, setExpandedZone] = useState(null);
  const getZoneSlots = (zoneId) => slots.filter(s => s.zoneId === zoneId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* 범례 */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', padding: '0 4px' }}>
        {[
          { color: '#34C759', bg: '#D1FAE5', label: '빈자리' },
          { color: '#FF3B30', bg: '#FEE2E2', label: '사용중' },
          { color: '#0057A8', bg: '#DBEAFE', label: '추천' },
          { color: '#D1D5DB', bg: '#F3F4F6', label: '불가' },
        ].map(({ color, bg, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 14, height: 14, background: bg, border: `2px solid ${color}`, borderRadius: 3 }} />
            <span style={{ fontSize: 12, color: 'var(--gray-500)' }}>{label}</span>
          </div>
        ))}
      </div>

      {ZONES.map(zone => {
        const zoneSlots = getZoneSlots(zone.id);
        const emptyCount = zoneSlots.filter(s => s.status === 'empty').length;
        const occupiedCount = zoneSlots.filter(s => s.status === 'occupied').length;
        const cong = congestion?.[zone.id] ?? 0;
        const { label: congLabel, color: congColor, bg: congBg } = getCongestionLabel(cong);
        const aerialPhoto = AERIAL_IMAGES[zone.id] ?? null;
        const isExpanded = expandedZone === zone.id;

        return (
          <div key={zone.id} style={{
            background: '#fff',
            borderRadius: 'var(--card-radius)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--gray-100)',
          }}>
            {/* 구역 헤더 */}
            <div
              style={{ padding: '14px 16px', cursor: 'pointer' }}
              onClick={() => setExpandedZone(isExpanded ? null : zone.id)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--primary)' }}>{zone.name}</span>
                  <span style={{ fontSize: 12, color: 'var(--gray-400)', marginLeft: 6 }}>{zone.label}</span>
                  {aerialPhoto && (
                    <span style={{
                      fontSize: 10, fontWeight: 600, marginLeft: 6,
                      background: '#EFF6FF', color: '#0057A8',
                      padding: '1px 6px', borderRadius: 8,
                    }}>📷 항공사진</span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: '#34C759', fontWeight: 600 }}>빈 {emptyCount}</span>
                  <span style={{ fontSize: 12, color: '#FF3B30', fontWeight: 600 }}>사용 {occupiedCount}</span>
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: '2px 8px',
                    background: congBg, color: congColor, borderRadius: 20,
                  }}>{congLabel}</span>
                  <span style={{ fontSize: 14, color: 'var(--gray-400)', marginLeft: 2 }}>
                    {isExpanded ? '▲' : '▼'}
                  </span>
                </div>
              </div>

              {/* 미니 점유율 바 */}
              <div style={{ marginTop: 8, background: 'var(--gray-100)', borderRadius: 4, height: 5, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${Math.round((occupiedCount / zoneSlots.length) * 100)}%`,
                  background: congColor,
                  borderRadius: 4,
                  transition: 'width 0.4s ease',
                }} />
              </div>
            </div>

            {/* 펼쳐진 상태: 항공사진 + 주차면 오버레이 */}
            {isExpanded && (
              <div style={{ borderTop: '1px solid var(--gray-100)' }}>
                {aerialPhoto ? (
                  /* ── 항공사진 배경 + 슬롯 오버레이 ── */
                  <div style={{ position: 'relative' }}>
                    <img
                      src={aerialPhoto}
                      alt={`${zone.name} 항공사진`}
                      style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        objectFit: 'cover',
                      }}
                    />
                    {/* 반투명 오버레이: 주차면 그리드 */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'grid',
                      gridTemplateColumns: `repeat(${zone.gridCols}, 1fr)`,
                      gap: 3,
                      padding: 10,
                      background: 'rgba(0,0,0,0.25)',
                      backdropFilter: 'blur(1px)',
                    }}>
                      {zoneSlots.map(slot => (
                        <div key={slot.id} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          <ParkingSlot
                            slot={slot}
                            onClick={interactive ? onSlotClick : undefined}
                            small={true}
                          />
                        </div>
                      ))}
                    </div>
                    <div style={{
                      position: 'absolute', bottom: 8, right: 8,
                      fontSize: 10, color: 'rgba(255,255,255,0.8)',
                      background: 'rgba(0,0,0,0.4)', padding: '2px 6px', borderRadius: 4,
                    }}>
                      주차면 위치는 추후 정밀 조정 예정
                    </div>
                  </div>
                ) : (
                  /* ── 항공사진 없을 때: 그라데이션 배경 + 그리드 ── */
                  <div>
                    {zone.aerialImage && (
                      <div style={{
                        background: '#FEF3C7', padding: '8px 14px',
                        fontSize: 12, color: '#92400E', borderBottom: '1px solid #FDE68A',
                        display: 'flex', alignItems: 'center', gap: 6,
                      }}>
                        📷 <strong>항공사진 준비중</strong> — <code>src/assets/{zone.aerialImage}</code> 파일을 넣으면 표시됩니다
                      </div>
                    )}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: `repeat(${zone.gridCols}, 1fr)`,
                      gap: 5,
                      background: ZONE_GRADIENTS[zone.id] || '#F8FAFC',
                      padding: 12,
                    }}>
                      {zoneSlots.map(slot => (
                        <div key={slot.id} style={{ display: 'flex', justifyContent: 'center' }}>
                          <ParkingSlot
                            slot={slot}
                            onClick={interactive ? onSlotClick : undefined}
                            small={zone.gridCols >= 5}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
