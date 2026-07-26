import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { getDailyPrediction } from '../utils/congestionPredictor.js';
import { ZONES } from '../data/parkingLots.js';
import { useState } from 'react';

const ZONE_COLORS = { A: '#0057A8', B: '#34C759', C: '#FF9500', D: '#9333EA' };

export default function CongestionChart({ weatherType }) {
  const [selectedZone, setSelectedZone] = useState('A');
  const data = getDailyPrediction(selectedZone, weatherType);

  const now = new Date().getHours();
  const currentData = data.find((d, i) => i === now);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 구역 선택 탭 */}
      <div style={{ display: 'flex', gap: 8 }}>
        {ZONES.map(zone => (
          <button
            key={zone.id}
            onClick={() => setSelectedZone(zone.id)}
            style={{
              flex: 1, padding: '8px 4px',
              borderRadius: 10,
              background: selectedZone === zone.id ? ZONE_COLORS[zone.id] : '#fff',
              border: `2px solid ${selectedZone === zone.id ? ZONE_COLORS[zone.id] : 'var(--gray-200)'}`,
              color: selectedZone === zone.id ? '#fff' : 'var(--gray-500)',
              fontSize: 13, fontWeight: 600, transition: 'all 0.15s',
            }}
          >
            {zone.id}구역
          </button>
        ))}
      </div>

      {/* 현재 혼잡도 */}
      {currentData && (
        <div style={{
          background: '#fff', borderRadius: 12, padding: '12px 16px',
          border: '1px solid var(--gray-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontSize: 14, color: 'var(--gray-500)' }}>현재 ({currentData.hour})</span>
          <span style={{ fontSize: 20, fontWeight: 700, color: ZONE_COLORS[selectedZone] }}>
            {currentData.congestion}%
          </span>
        </div>
      )}

      {/* 차트 */}
      <div style={{
        background: '#fff', borderRadius: 'var(--card-radius)', padding: '16px 8px 8px',
        boxShadow: 'var(--shadow-sm)', border: '1px solid var(--gray-100)',
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-700)', paddingLeft: 8, marginBottom: 12 }}>
          오늘 {ZONES.find(z => z.id === selectedZone)?.name} 혼잡도 예측
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={data} margin={{ top: 0, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="congGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={ZONE_COLORS[selectedZone]} stopOpacity={0.3} />
                <stop offset="95%" stopColor={ZONE_COLORS[selectedZone]} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis
              dataKey="hour"
              tick={{ fontSize: 10, fill: '#9CA3AF' }}
              tickFormatter={(v) => v.split(':')[0]}
              interval={3}
            />
            <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} domain={[0, 100]} />
            <Tooltip
              formatter={(v) => [`${v}%`, '혼잡도']}
              contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 12 }}
            />
            <Area
              type="monotone"
              dataKey="congestion"
              stroke={ZONE_COLORS[selectedZone]}
              strokeWidth={2}
              fill="url(#congGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* 안내 */}
      <div style={{ fontSize: 12, color: 'var(--gray-400)', textAlign: 'center', padding: '0 8px' }}>
        * 날씨·요일 기반 예측값입니다. 실제와 다를 수 있습니다.
      </div>
    </div>
  );
}
