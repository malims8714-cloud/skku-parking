// ─────────────────────────────────────────────────────────────
// CampusMap.jsx — 캠퍼스 지도 렌더러
//
// 내용 수정:
//   구역 색상·마커 위치 → src/data/parkingLots.js  (mapX, mapY)
//   배경 이미지         → public/campus_map.png
// ─────────────────────────────────────────────────────────────
import { useMemo } from 'react';
import { ZONES } from '../data/parkingLots.js';
import '../styles/campusMap.css';

function congColor(p) { return p<40?'#34C759':p<60?'#FFCC00':p<80?'#FF9500':'#FF3B30'; }

export default function CampusMap({ slots }) {
  const totals = useMemo(() => {
    const total    = slots.length;
    const empty    = slots.filter(s => s.status === 'empty').length;
    const occupied = slots.filter(s => s.status === 'occupied').length;
    return { total, empty, occupied, pct: total ? Math.round(occupied / total * 100) : 0 };
  }, [slots]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* 전체 통계 바 */}
      <div style={{ display: 'flex', background: '#fff', borderRadius: 14, overflow: 'hidden', border: '1px solid #F0F0F5' }}>
        {[
          { label: '전체',   value: totals.total,    color: '#0057A8' },
          { label: '빈자리', value: totals.empty,     color: '#34C759' },
          { label: '사용중', value: totals.occupied,  color: '#FF9500' },
          { label: '혼잡도', value: totals.pct + '%', color: congColor(totals.pct) },
        ].map((s, i) => (
          <div key={s.label} style={{
            flex: 1, textAlign: 'center', padding: '10px 4px',
            borderRight: i < 3 ? '1px solid #F0F0F5' : 'none',
          }}>
            <div style={{ fontSize: 19, fontWeight: 800, color: s.color, fontVariantNumeric: 'tabular-nums' }}>{s.value}</div>
            <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* SVG 캠퍼스 지도 (viewBox: 900×446 = 이미지 비율 1784×882) */}
      <div style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', border: '1px solid #F0F0F5', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
        <svg viewBox="0 0 900 446" style={{ width: '100%', height: 'auto', display: 'block' }}
          xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="cmap-bsm" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3.5" floodColor="rgba(0,0,0,0.22)"/>
            </filter>
          </defs>

          {/* 배경 이미지 */}
          <image href="/campus_map.png" x="0" y="0" width="900" height="446"
            preserveAspectRatio="xMidYMid meet"/>
        </svg>
      </div>

      {/* 범례 */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', padding: '4px 2px' }}>
        {ZONES.map(z => (
          <div key={z.id} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#6B7280' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: z.color }}/>
            {z.name}
          </div>
        ))}
        <div style={{ width: 1, height: 14, background: '#E5E7EB', margin: '0 2px' }}/>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#6B7280' }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', border: '2px dashed #9CA3AF' }}/>
          지하주차장
        </div>
      </div>
    </div>
  );
}
