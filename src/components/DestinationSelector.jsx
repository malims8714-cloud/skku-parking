import { BUILDINGS, VEHICLE_TYPES } from '../data/buildings.js';

export default function DestinationSelector({ selected, vehicle, onSelectBuilding, onSelectVehicle, onRecommend }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* 목적지 */}
      <div>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--gray-700)', marginBottom: 10 }}>
          목적지 선택
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {BUILDINGS.map(b => (
            <button
              key={b.id}
              onClick={() => onSelectBuilding(b.id)}
              style={{
                padding: '14px 10px',
                borderRadius: 12,
                background: selected === b.id ? 'var(--primary)' : '#fff',
                border: `2px solid ${selected === b.id ? 'var(--primary)' : 'var(--gray-200)'}`,
                color: selected === b.id ? '#fff' : 'var(--gray-700)',
                fontSize: 13,
                fontWeight: selected === b.id ? 600 : 400,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.15s',
                boxShadow: selected === b.id ? '0 4px 12px rgba(0,87,168,0.3)' : 'var(--shadow-sm)',
              }}
            >
              <span style={{ fontSize: 24 }}>{b.icon}</span>
              <span>{b.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 차량 유형 */}
      <div>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--gray-700)', marginBottom: 10 }}>
          차량 유형
        </h3>
        <div style={{ display: 'flex', gap: 10 }}>
          {VEHICLE_TYPES.map(v => (
            <button
              key={v.id}
              onClick={() => onSelectVehicle(v.id)}
              style={{
                flex: 1, padding: '12px 8px',
                borderRadius: 12,
                background: vehicle === v.id ? 'var(--primary)' : '#fff',
                border: `2px solid ${vehicle === v.id ? 'var(--primary)' : 'var(--gray-200)'}`,
                color: vehicle === v.id ? '#fff' : 'var(--gray-700)',
                fontSize: 12, fontWeight: vehicle === v.id ? 600 : 400,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                transition: 'all 0.15s',
              }}
            >
              <span style={{ fontSize: 22 }}>{v.icon}</span>
              <span>{v.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 추천받기 버튼 */}
      <button
        onClick={onRecommend}
        disabled={!selected}
        style={{
          padding: '16px',
          background: selected ? 'var(--primary)' : 'var(--gray-200)',
          color: selected ? '#fff' : 'var(--gray-400)',
          borderRadius: 14,
          fontSize: 16, fontWeight: 700,
          boxShadow: selected ? '0 4px 16px rgba(0,87,168,0.4)' : 'none',
          transition: 'all 0.15s',
        }}
      >
        {selected ? '🚗 최적 주차 공간 추천받기' : '목적지를 선택해 주세요'}
      </button>
    </div>
  );
}
