import { useMemo } from 'react';

import c1Image from '../assets/parking/c1-parking-layout.png';
import c1Data from '../data/parking/c1Slots.json';

export default function C1ParkingMap({ onBack }) {

  // 테스트용 임시 점유 상태
  // 약 45% 정도를 occupied로 랜덤 생성
  const statusMap = useMemo(() => {
    const result = {};

    c1Data.slots.forEach(slot => {
      result[slot.id] =
        Math.random() < 0.45 ? 'occupied' : 'free';
    });

    return result;
  }, []);

  const occupiedCount = Object.values(statusMap)
    .filter(status => status === 'occupied')
    .length;

  const freeCount = c1Data.slotCount - occupiedCount;

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 14,
        }}
      >
        <button
          onClick={onBack}
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            border: 'none',
            background: '#F3F4F6',
            cursor: 'pointer',
          }}
        >
          ←
        </button>

        <div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 700,
            }}
          >
            C-1 주차장
          </div>

          <div
            style={{
              fontSize: 12,
              color: '#6B7280',
              marginTop: 2,
            }}
          >
            현재 주차 현황
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 8,
          marginBottom: 12,
        }}
      >
        <div
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 10,
            background: '#ECFDF3',
            color: '#15803D',
            fontWeight: 700,
            textAlign: 'center',
          }}
        >
          빈자리 {freeCount}
        </div>

        <div
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 10,
            background: '#FEF2F2',
            color: '#DC2626',
            fontWeight: 700,
            textAlign: 'center',
          }}
        >
          사용중 {occupiedCount}
        </div>
      </div>

      <div
        style={{
          borderRadius: 14,
          overflow: 'hidden',
          border: '1px solid #E5E7EB',
          background: '#fff',
        }}
      >
        <svg
          viewBox={`0 0 ${c1Data.image.width} ${c1Data.image.height}`}
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
          }}
        >
          <image
            href={c1Image}
            x="0"
            y="0"
            width={c1Data.image.width}
            height={c1Data.image.height}
          />

          {c1Data.slots.map(slot => {
            const status = statusMap[slot.id];

            const points = slot.polygon
              .map(([x, y]) => `${x},${y}`)
              .join(' ');

            const isOccupied = status === 'occupied';

            return (
              <polygon
                key={slot.id}
                points={points}
                fill={
                  isOccupied
                    ? 'rgba(220, 38, 38, 0.55)'
                    : 'rgba(22, 163, 74, 0.40)'
                }
                stroke={
                  isOccupied
                    ? '#DC2626'
                    : '#16A34A'
                }
                strokeWidth="1"
              >
                <title>
                  {slot.number}번 - {isOccupied ? '사용중' : '빈자리'}
                </title>
              </polygon>
            );
          })}
        </svg>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 16,
          fontSize: 12,
          marginTop: 10,
          color: '#6B7280',
        }}
      >
        <span>🟢 빈자리</span>
        <span>🔴 사용중</span>
      </div>
    </div>
  );
}