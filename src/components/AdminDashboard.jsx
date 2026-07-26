import ParkingMap from './ParkingMap.jsx';
import { ZONES } from '../data/parkingLots.js';
import { getCongestionLabel } from '../utils/congestionPredictor.js';

export default function AdminDashboard({ slots, congestion, onToggleSlot }) {
  const totalSlots = slots.length;
  const occupiedSlots = slots.filter(s => s.status === 'occupied').length;
  const emptySlots = slots.filter(s => s.status === 'empty').length;
  const occupancyRate = Math.round((occupiedSlots / totalSlots) * 100);

  const handleSlotClick = (slot) => {
    if (slot.status === 'disabled') return;
    onToggleSlot(slot.id);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* 관리자 배지 */}
      <div style={{
        background: 'linear-gradient(135deg, #1F2937, #374151)',
        borderRadius: 'var(--card-radius)',
        padding: '16px 20px',
        color: '#fff',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <div style={{ fontSize: 12, opacity: 0.7 }}>관리자 모드</div>
          <div style={{ fontSize: 18, fontWeight: 700, marginTop: 2 }}>주차장 현황 관리</div>
          <div style={{ fontSize: 12, opacity: 0.7, marginTop: 2 }}>주차면 클릭 → 상태 변경</div>
        </div>
        <div style={{ fontSize: 36 }}>🔧</div>
      </div>

      {/* 전체 통계 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {[
          { label: '전체', value: totalSlots, color: 'var(--primary)', icon: '🅿️' },
          { label: '사용중', value: occupiedSlots, color: '#FF3B30', icon: '🔴' },
          { label: '빈자리', value: emptySlots, color: '#34C759', icon: '🟢' },
        ].map(({ label, value, color, icon }) => (
          <div key={label} style={{
            background: '#fff', borderRadius: 12, padding: '14px 10px',
            textAlign: 'center', boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--gray-100)',
          }}>
            <div style={{ fontSize: 20 }}>{icon}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color, marginTop: 4 }}>{value}</div>
            <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* 점유율 바 */}
      <div style={{
        background: '#fff', borderRadius: 12, padding: 16,
        boxShadow: 'var(--shadow-sm)', border: '1px solid var(--gray-100)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>전체 점유율</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: occupancyRate > 70 ? '#FF3B30' : '#34C759' }}>
            {occupancyRate}%
          </span>
        </div>
        <div style={{ background: 'var(--gray-100)', borderRadius: 6, height: 10, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${occupancyRate}%`,
            background: occupancyRate > 70 ? '#FF3B30' : occupancyRate > 40 ? '#FF9500' : '#34C759',
            borderRadius: 6,
            transition: 'width 0.5s ease',
          }} />
        </div>
      </div>

      {/* 구역별 점유율 */}
      <div style={{ background: '#fff', borderRadius: 'var(--card-radius)', padding: 16, boxShadow: 'var(--shadow-sm)', border: '1px solid var(--gray-100)' }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>구역별 점유율</div>
        {ZONES.map(zone => {
          const zoneSlots = slots.filter(s => s.zoneId === zone.id);
          const zoneCong = congestion?.[zone.id] ?? 0;
          const zoneOcc = Math.round((zoneSlots.filter(s => s.status === 'occupied').length / zoneSlots.length) * 100);
          const { label, color } = getCongestionLabel(zoneCong);
          return (
            <div key={zone.id} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 13, color: 'var(--gray-700)' }}>{zone.name}</span>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 11, padding: '1px 7px', background: '#F3F4F6', borderRadius: 10, color: 'var(--gray-500)' }}>{label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color }}>{zoneOcc}%</span>
                </div>
              </div>
              <div style={{ background: 'var(--gray-100)', borderRadius: 4, height: 6 }}>
                <div style={{
                  height: '100%', width: `${zoneOcc}%`,
                  background: color, borderRadius: 4, transition: 'width 0.5s',
                }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* 대화형 주차 지도 */}
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 10, color: 'var(--gray-700)' }}>
          주차면 상태 변경 (클릭하여 토글)
        </div>
        <ParkingMap
          slots={slots}
          congestion={congestion}
          onSlotClick={handleSlotClick}
          interactive={true}
        />
      </div>
    </div>
  );
}
