// ─────────────────────────────────────────────────────────────
// CampusMap.jsx — 캠퍼스 지도 렌더러
//
// 이 파일은 데이터를 그리는 역할만 합니다.
// 내용 수정은 아래 두 파일에서 하세요:
//   구역 색상·위치  → src/data/parkingLots.js
//   건물·도로·관리실 → src/data/campusMapConfig.js
// ─────────────────────────────────────────────────────────────
import { useState, useMemo } from 'react';
import { ZONES } from '../data/parkingLots.js';
import {
  CAMPUS_BOUNDARY,
  ROADS,
  SPORTS_AREAS,
  BUILDINGS,
  PARKING_OFFICE,
} from '../data/campusMapConfig.js';
import '../styles/campusMap.css';

// SVG 고정 색상 (지도 외관용, 구역 색은 parkingLots.js에서)
const C = {
  bldFill:    '#8AAEC8',
  bldStroke:  '#6090B0',
  sptFill:    '#96C87A',
  sptStroke:  '#6AAE4A',
  innerFill:  '#DCE8F2', // 트랙 내부
  roadFill:   '#F0F4F8',
  mapFill:    '#D2DDE8',
  textMain:   '#192A40',
  textMuted:  '#5A7898',
};

function congColor(p) { return p<40?'#34C759':p<60?'#FFCC00':p<80?'#FF9500':'#FF3B30'; }
function congLabel(p) { return p<40?'여유'   :p<60?'보통'   :p<80?'혼잡'   :'만석'; }

// ── SVG 렌더 헬퍼들 ─────────────────────────────────────────

function RenderRoad({ road }) {
  const base = { stroke: C.roadFill, strokeWidth: road.w, opacity: road.opacity, fill: 'none' };
  if (road.type === 'line')
    return <line x1={road.x1} y1={road.y1} x2={road.x2} y2={road.y2} {...base}/>;
  return <path d={road.d} {...base}/>;
}

function RenderSportsArea({ area }) {
  return (
    <g>
      {area.shapes.map((s, i) => {
        const isInner = s.inner;
        const fill    = isInner ? (s.innerFill ?? C.innerFill) : C.sptFill;
        const common  = {
          fill,
          stroke:      C.sptStroke,
          strokeWidth: s.sw ?? 1.5,
          opacity:     s.opacity ?? 1,
        };
        if (s.type === 'ellipse')
          return <ellipse key={i} cx={s.cx} cy={s.cy} rx={s.rx} ry={s.ry} {...common}/>;
        if (s.type === 'rect') {
          const props = isInner
            ? { fill: s.innerFill ?? 'none', stroke: C.sptStroke, strokeWidth: s.sw, opacity: s.innerOpacity ?? 1 }
            : common;
          return <rect key={i} x={s.x} y={s.y} width={s.w} height={s.h} rx={s.rx ?? 0} {...props}/>;
        }
        if (s.type === 'path')
          return <path key={i} d={s.d} {...common}/>;
        return null;
      })}
      {area.label && (
        <text
          x={area.labelX} y={area.labelY}
          textAnchor="middle"
          fontSize={area.labelSize ?? 8}
          fontWeight={area.labelWeight ?? 400}
          fill={area.muted ? C.textMuted : C.textMain}
        >
          {area.label}
        </text>
      )}
    </g>
  );
}

function RenderBuilding({ bld }) {
  const filter = bld.shadow ? 'url(#cmap-bs)' : undefined;
  const { shape, labels = [] } = bld;
  const base = { fill: C.bldFill, stroke: C.bldStroke, strokeWidth: shape.sw ?? 1, filter };

  return (
    <g>
      {shape.type === 'rect' && (
        <rect x={shape.x} y={shape.y} width={shape.w} height={shape.h} rx={shape.rx ?? 3} {...base}/>
      )}
      {shape.type === 'ellipse' && (
        <ellipse cx={shape.cx} cy={shape.cy} rx={shape.rx} ry={shape.ry} {...base}/>
      )}
      {labels.map((lbl, i) => (
        <text key={i}
          x={lbl.x} y={lbl.y}
          textAnchor="middle"
          fontSize={lbl.size ?? 7}
          fontWeight={lbl.weight ?? 400}
          fill={lbl.muted ? C.textMuted : C.textMain}
        >
          {lbl.text}
        </text>
      ))}
    </g>
  );
}

function RenderZoneArea({ zone }) {
  const { mapArea: a, color, mapAreaDashed } = zone;
  if (!a) return null;
  const dash = mapAreaDashed ? '5 2.5' : undefined;
  if (a.type === 'rect') return (
    <g>
      <rect x={a.x} y={a.y} width={a.w} height={a.h} rx={a.rx ?? 4} fill={color} opacity="0.20"/>
      <rect x={a.x} y={a.y} width={a.w} height={a.h} rx={a.rx ?? 4}
        fill="none" stroke={color} strokeWidth="1.5" strokeDasharray={dash} opacity="0.45"/>
    </g>
  );
  if (a.type === 'ellipse') return (
    <g>
      <ellipse cx={a.cx} cy={a.cy} rx={a.rx} ry={a.ry} fill={color} opacity="0.20"/>
      <ellipse cx={a.cx} cy={a.cy} rx={a.rx} ry={a.ry}
        fill="none" stroke={color} strokeWidth="1.5" strokeDasharray={dash} opacity="0.55"/>
    </g>
  );
  return null;
}

function RenderZoneMarker({ zone, stat, isActive, onToggle }) {
  const { id, name, color, labelColor, mapX: x, mapY: y, mapAreaDashed } = zone;
  return (
    <g className="cmap-zm" style={{ cursor: 'pointer' }}
      onClick={() => onToggle(id)}
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onToggle(id); }}
      role="button"
      aria-label={`${name} 상세 보기`}
    >
      <circle className="cmap-pulse" cx={x} cy={y} r="18" fill={color}/>
      <circle className="cmap-circle" cx={x} cy={y} r="20"
        fill={color}
        stroke={isActive ? '#FFD700' : '#fff'}
        strokeWidth={isActive ? 3.5 : 2.5}
        strokeDasharray={mapAreaDashed ? '5 2.5' : undefined}
        filter="url(#cmap-bsm)"
      />
      <text x={x} y={y + 6} textAnchor="middle" fontSize="15" fontWeight="900" fill="#fff" pointerEvents="none">
        {id}
      </text>
      <rect x={x - 32} y={y + 23} width="64" height="14" rx="7" fill="rgba(255,255,255,0.92)" pointerEvents="none"/>
      <text x={x} y={y + 33} textAnchor="middle" fontSize="9" fontWeight="700" fill={labelColor} pointerEvents="none">
        빈자리 {stat?.empty ?? 0}
      </text>
    </g>
  );
}

function RenderParkingOffice({ office }) {
  const { label, subLabel, phone, x, y, w, h, rx, textX, pointerPoints } = office;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={rx} fill="#EA580C" filter="url(#cmap-bsm)"/>
      <polygon points={pointerPoints} fill="#EA580C"/>
      <text x={textX} y={y + 17} textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#fff">{label}</text>
      <text x={textX} y={y + 30} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.85)">{subLabel}</text>
      <text x={textX} y={y + 42} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.85)">{phone}</text>
    </g>
  );
}

// ── 메인 컴포넌트 ────────────────────────────────────────────

export default function CampusMap({ slots }) {
  const [activeZone, setActiveZone] = useState(null);

  const zoneStats = useMemo(() => {
    const stats = {};
    ZONES.forEach(zone => {
      const zSlots   = slots.filter(s => s.zoneId === zone.id);
      const empty    = zSlots.filter(s => s.status === 'empty').length;
      const occupied = zSlots.filter(s => s.status === 'occupied').length;
      const disabled = zSlots.filter(s => s.status === 'disabled').length;
      const pct      = zSlots.length ? Math.round(occupied / zSlots.length * 100) : 0;
      stats[zone.id] = { total: zSlots.length, empty, occupied, disabled, pct };
    });
    return stats;
  }, [slots]);

  const totals = useMemo(() => {
    const vals     = Object.values(zoneStats);
    const total    = vals.reduce((s, z) => s + z.total,    0);
    const empty    = vals.reduce((s, z) => s + z.empty,    0);
    const occupied = vals.reduce((s, z) => s + z.occupied, 0);
    return { total, empty, occupied, pct: total ? Math.round(occupied / total * 100) : 0 };
  }, [zoneStats]);

  const toggle  = id => setActiveZone(prev => prev === id ? null : id);
  const az      = activeZone;
  const azZone  = az ? ZONES.find(z => z.id === az) : null;
  const azStat  = az ? zoneStats[az] : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* ── 전체 통계 바 ── */}
      <div style={{ display: 'flex', background: '#fff', borderRadius: 14, overflow: 'hidden', border: '1px solid #F0F0F5' }}>
        {[
          { label: '전체',   value: totals.total,      color: '#0057A8' },
          { label: '빈자리', value: totals.empty,       color: '#34C759' },
          { label: '사용중', value: totals.occupied,    color: '#FF9500' },
          { label: '혼잡도', value: totals.pct + '%',   color: congColor(totals.pct) },
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

      {/* ── SVG 캠퍼스 지도 ── */}
      <div style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', border: '1px solid #F0F0F5', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
        <svg viewBox="0 0 900 660" style={{ width: '100%', height: 'auto', display: 'block' }}
          xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="cmap-bs" x="-15%" y="-15%" width="130%" height="130%">
              <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="rgba(0,30,70,0.18)"/>
            </filter>
            <filter id="cmap-bsm" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3.5" floodColor="rgba(0,0,0,0.22)"/>
            </filter>
          </defs>

          {/* 캠퍼스 외곽 */}
          <path d={CAMPUS_BOUNDARY} fill={C.mapFill} stroke={C.bldStroke} strokeWidth="1.5"/>

          {/* 도로 */}
          {ROADS.map((road, i) => <RenderRoad key={i} road={road}/>)}

          {/* 구역 색상 영역 (마커 뒤에 그려야 마커가 위로 옴) */}
          {ZONES.map(zone => <RenderZoneArea key={zone.id} zone={zone}/>)}

          {/* 운동장·녹지 */}
          {SPORTS_AREAS.map(area => <RenderSportsArea key={area.id} area={area}/>)}

          {/* 건물 */}
          {BUILDINGS.map(bld => <RenderBuilding key={bld.id} bld={bld}/>)}

          {/* 주차관리실 말풍선 */}
          <RenderParkingOffice office={PARKING_OFFICE}/>

          {/* 구역 마커 (가장 위에 렌더) */}
          {ZONES.map(zone => (
            <RenderZoneMarker
              key={zone.id}
              zone={zone}
              stat={zoneStats[zone.id]}
              isActive={az === zone.id}
              onToggle={toggle}
            />
          ))}

          {/* 나침반 */}
          <g transform="translate(854,54)">
            <circle cx="0" cy="0" r="18" fill="white" stroke="#D0D5DB" strokeWidth="1.5"/>
            <path d="M0,-14 L3,-4 L0,2 L-3,-4Z" fill="#003878"/>
            <path d="M0,2 L3,10 L0,14 L-3,10Z" fill="#9CA3AF"/>
            <text x="0" y="-5" textAnchor="middle" fontSize="8.5" fontWeight="800" fill="#003878">N</text>
          </g>
        </svg>
      </div>

      {/* ── 구역 상세 카드 ── */}
      {az && azZone && azStat && (
        <div style={{
          background: '#fff', borderRadius: 16, overflow: 'hidden',
          border: `2px solid ${azZone.color}`,
          boxShadow: '0 4px 20px rgba(0,0,0,0.11)',
        }}>
          {/* 헤더 */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px',
            background: azZone.color + '14',
            borderBottom: `1px solid ${azZone.color}33`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 42, height: 42, borderRadius: '50%', background: azZone.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, fontWeight: 900, color: '#fff', flexShrink: 0,
              }}>{az}</div>
              <div>
                <div style={{ fontSize: 17, fontWeight: 800, color: '#1C1C1E' }}>{azZone.name}</div>
                <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{azZone.mapLocation}</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{
                fontSize: 13, fontWeight: 700, color: congColor(azStat.pct),
                background: congColor(azStat.pct) + '20',
                padding: '3px 10px', borderRadius: 20,
              }}>{congLabel(azStat.pct)}</span>
              <span style={{ fontSize: 11, color: '#9CA3AF', marginTop: 3 }}>{azStat.pct}% 점유</span>
            </div>
          </div>

          {/* 통계 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', padding: '14px 12px', gap: 8 }}>
            {[
              { label: '빈자리', value: azStat.empty,    color: '#34C759' },
              { label: '사용중', value: azStat.occupied,  color: '#FF9500' },
              { label: '전체',   value: azStat.total,    color: '#0057A8' },
              { label: '장애인', value: azStat.disabled, color: '#007AFF' },
            ].map(s => (
              <div key={s.label} style={{ background: '#F8FAFC', borderRadius: 10, padding: '10px 4px', textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: s.color, fontVariantNumeric: 'tabular-nums' }}>{s.value}</div>
                <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* 점유율 바 */}
          <div style={{ padding: '0 16px 14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#9CA3AF', marginBottom: 6 }}>
              <span>점유율</span>
              <span style={{ fontWeight: 700, color: congColor(azStat.pct) }}>{azStat.pct}%</span>
            </div>
            <div style={{ height: 8, borderRadius: 4, background: '#F0F0F5', overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${azStat.pct}%`,
                background: congColor(azStat.pct), borderRadius: 4, transition: 'width 0.4s ease',
              }}/>
            </div>
          </div>

          {/* 인근 건물 */}
          <div style={{ padding: '0 16px 16px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 8 }}>인근 건물</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {(azZone.nearBuildings ?? []).map(b => (
                <span key={b} style={{ background: '#F3F4F6', borderRadius: 20, padding: '4px 11px', fontSize: 12, color: '#374151' }}>{b}</span>
              ))}
            </div>
          </div>
        </div>
      )}

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
