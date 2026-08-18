import { useState, useMemo } from 'react';
import { ZONES } from '../data/parkingLots.js';
import '../styles/campusMap.css';

const ZONE_COLORS = {
  A: '#7C3AED',
  B: '#16A34A',
  C: '#EA580C',
  D: '#0D9488',
};

const ZONE_LABEL_COLORS = {
  A: '#4C1D95',
  B: '#14532D',
  C: '#7C2D12',
  D: '#134E4A',
};

const ZONE_POSITIONS = {
  A: { x: 451, y: 115 },
  B: { x: 561, y: 366 },
  C: { x: 690, y: 220 },
  D: { x: 520, y: 460 },
};

const ZONE_LOC = {
  A: '정문 도로 · 기숙사 앞 (지상)',
  B: '학생회관 앞 · 중앙 (지상)',
  C: '공과대학 앞 (지상)',
  D: '삼성학술정보관 지하 (B1)',
};

const ZONE_NEAR = {
  A: ['기숙사 의관 92동', '기숙사 예관 93동', '정문'],
  B: ['학생회관 3동', '삼성학술정보관 48동'],
  C: ['제2공학관 27동', '공과대학 23동', 'N센터 86동'],
  D: ['삼성학술정보관 48동', '글로벌광장'],
};

function congColor(p) {
  return p < 40 ? '#34C759' : p < 60 ? '#FFCC00' : p < 80 ? '#FF9500' : '#FF3B30';
}
function congLabel(p) {
  return p < 40 ? '여유' : p < 60 ? '보통' : p < 80 ? '혼잡' : '만석';
}

export default function CampusMap({ slots }) {
  const [activeZone, setActiveZone] = useState(null);

  const zoneStats = useMemo(() => {
    const stats = {};
    ZONES.forEach(zone => {
      const zSlots = slots.filter(s => s.zoneId === zone.id);
      const empty    = zSlots.filter(s => s.status === 'empty').length;
      const occupied = zSlots.filter(s => s.status === 'occupied').length;
      const disabled = zSlots.filter(s => s.status === 'disabled').length;
      const pct      = zSlots.length ? Math.round(occupied / zSlots.length * 100) : 0;
      stats[zone.id] = { total: zSlots.length, empty, occupied, disabled, pct };
    });
    return stats;
  }, [slots]);

  const totals = useMemo(() => {
    const vals = Object.values(zoneStats);
    const total    = vals.reduce((s, z) => s + z.total,    0);
    const empty    = vals.reduce((s, z) => s + z.empty,    0);
    const occupied = vals.reduce((s, z) => s + z.occupied, 0);
    return { total, empty, occupied, pct: total ? Math.round(occupied / total * 100) : 0 };
  }, [zoneStats]);

  const toggle = (id) => setActiveZone(prev => prev === id ? null : id);
  const az     = activeZone;
  const azData = az ? ZONES.find(z => z.id === az) : null;
  const azStat = az ? zoneStats[az] : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* ── 전체 통계 바 ── */}
      <div style={{ display: 'flex', background: '#fff', borderRadius: 14, overflow: 'hidden', border: '1px solid #F0F0F5' }}>
        {[
          { label: '전체',   value: totals.total,           color: '#0057A8' },
          { label: '빈자리', value: totals.empty,            color: '#34C759' },
          { label: '사용중', value: totals.occupied,         color: '#FF9500' },
          { label: '혼잡도', value: totals.pct + '%',        color: congColor(totals.pct) },
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
          <path d="M 90,112 L 114,68 L 218,37 L 368,20 L 520,28 L 640,46 L 720,90 L 798,158 L 844,270 L 857,384 L 843,476 L 818,557 L 776,618 L 708,650 L 580,660 L 452,658 L 343,644 L 254,628 L 190,600 L 152,564 L 114,510 L 78,446 L 66,370 L 68,280 L 78,196 Z"
            fill="#D2DDE8" stroke="#6090B0" strokeWidth="1.5"/>

          {/* 도로 */}
          <line x1="452" y1="25" x2="452" y2="655" stroke="#F0F4F8" strokeWidth="11" opacity="0.85"/>
          <line x1="68" y1="415" x2="855" y2="415" stroke="#F0F4F8" strokeWidth="9" opacity="0.75"/>
          <line x1="68" y1="278" x2="760" y2="278" stroke="#F0F4F8" strokeWidth="8" opacity="0.65"/>
          <line x1="102" y1="553" x2="778" y2="553" stroke="#F0F4F8" strokeWidth="8" opacity="0.65"/>
          <path d="M 640,48 Q 748,100 800,200 Q 852,348 843,475" fill="none" stroke="#F0F4F8" strokeWidth="9" opacity="0.7"/>
          <path d="M 90,130 Q 76,280 68,378 Q 70,460 112,512" fill="none" stroke="#F0F4F8" strokeWidth="8" opacity="0.6"/>
          <line x1="250" y1="415" x2="250" y2="278" stroke="#F0F4F8" strokeWidth="7" opacity="0.55"/>
          <line x1="660" y1="278" x2="660" y2="553" stroke="#F0F4F8" strokeWidth="7" opacity="0.55"/>

          {/* 구역 색상 표시 영역 */}
          {/* A구역 (보라) */}
          <rect x="408" y="30" width="86" height="135" rx="4" fill="#7C3AED" opacity="0.18"/>
          <rect x="408" y="30" width="86" height="135" rx="4" fill="none" stroke="#7C3AED" strokeWidth="1.5" opacity="0.40"/>
          {/* C구역 (주황) */}
          <rect x="638" y="165" width="102" height="110" rx="4" fill="#EA580C" opacity="0.22"/>
          <rect x="638" y="165" width="102" height="110" rx="4" fill="none" stroke="#EA580C" strokeWidth="1.5" opacity="0.45"/>
          {/* B구역 (초록) */}
          <rect x="530" y="340" width="62" height="52" rx="4" fill="#16A34A" opacity="0.22"/>
          <rect x="530" y="340" width="62" height="52" rx="4" fill="none" stroke="#16A34A" strokeWidth="1.5" opacity="0.45"/>
          {/* D구역 (청록, 지하 = 점선) */}
          <ellipse cx="520" cy="460" rx="54" ry="38" fill="#0D9488" opacity="0.20"/>
          <ellipse cx="520" cy="460" rx="54" ry="38" fill="none" stroke="#0D9488" strokeWidth="1.5" strokeDasharray="5 2.5" opacity="0.55"/>

          {/* 운동장 */}
          <ellipse cx="120" cy="244" rx="63" ry="56" fill="#96C87A" stroke="#6AAE4A" strokeWidth="1.5"/>
          <ellipse cx="120" cy="244" rx="44" ry="38" fill="#DCE8F2" stroke="#6AAE4A" strokeWidth="1"/>
          <rect x="77" y="396" width="88" height="71" rx="4" fill="#96C87A" stroke="#6AAE4A" strokeWidth="1.5"/>
          <rect x="83" y="401" width="76" height="61" rx="2" fill="none" stroke="#6AAE4A" strokeWidth="0.8" opacity="0.6"/>
          <path d="M 130,536 Q 168,536 186,558 Q 198,580 188,605 Q 175,622 150,628 Q 128,630 106,620 Q 82,606 78,582 Q 74,558 92,543 Z" fill="#96C87A" stroke="#6AAE4A" strokeWidth="1.5"/>

          {/* 건물 */}
          <rect x="340" y="36" width="228" height="28" rx="3" fill="#8AAEC8" stroke="#6090B0" strokeWidth="1" filter="url(#cmap-bs)"/>
          <rect x="138" y="96" width="66" height="30" rx="3" fill="#8AAEC8" stroke="#6090B0" strokeWidth="1"/>
          <rect x="242" y="140" width="76" height="30" rx="3" fill="#8AAEC8" stroke="#6090B0" strokeWidth="1"/>
          <rect x="175" y="312" width="65" height="34" rx="3" fill="#8AAEC8" stroke="#6090B0" strokeWidth="1"/>
          <rect x="282" y="382" width="78" height="38" rx="3" fill="#8AAEC8" stroke="#6090B0" strokeWidth="1" filter="url(#cmap-bs)"/>
          <rect x="210" y="430" width="65" height="38" rx="3" fill="#8AAEC8" stroke="#6090B0" strokeWidth="1"/>
          <rect x="84"  y="456" width="65" height="34" rx="3" fill="#8AAEC8" stroke="#6090B0" strokeWidth="1"/>
          <rect x="388" y="162" width="74" height="40" rx="3" fill="#8AAEC8" stroke="#6090B0" strokeWidth="1" filter="url(#cmap-bs)"/>
          <rect x="370" y="242" width="80" height="34" rx="3" fill="#8AAEC8" stroke="#6090B0" strokeWidth="1" filter="url(#cmap-bs)"/>
          <rect x="390" y="292" width="76" height="33" rx="3" fill="#8AAEC8" stroke="#6090B0" strokeWidth="1" filter="url(#cmap-bs)"/>
          <rect x="390" y="341" width="76" height="33" rx="3" fill="#8AAEC8" stroke="#6090B0" strokeWidth="1" filter="url(#cmap-bs)"/>
          <ellipse cx="448" cy="428" rx="60" ry="52" fill="#8AAEC8" stroke="#6090B0" strokeWidth="1.8" filter="url(#cmap-bs)"/>
          <ellipse cx="464" cy="495" rx="36" ry="19" fill="#96C87A" stroke="#6AAE4A" strokeWidth="1" opacity="0.75"/>
          <rect x="558" y="194" width="82" height="42" rx="3" fill="#8AAEC8" stroke="#6090B0" strokeWidth="1" filter="url(#cmap-bs)"/>
          <rect x="558" y="252" width="82" height="42" rx="3" fill="#8AAEC8" stroke="#6090B0" strokeWidth="1" filter="url(#cmap-bs)"/>
          <rect x="558" y="320" width="86" height="54" rx="3" fill="#8AAEC8" stroke="#6090B0" strokeWidth="1.5" filter="url(#cmap-bs)"/>
          <rect x="666" y="308" width="64" height="36" rx="3" fill="#8AAEC8" stroke="#6090B0" strokeWidth="1"/>
          <rect x="668" y="360" width="62" height="33" rx="3" fill="#8AAEC8" stroke="#6090B0" strokeWidth="1"/>
          <rect x="665" y="428" width="66" height="52" rx="3" fill="#8AAEC8" stroke="#6090B0" strokeWidth="1"/>
          <rect x="665" y="496" width="66" height="52" rx="3" fill="#8AAEC8" stroke="#6090B0" strokeWidth="1"/>
          <rect x="608" y="568" width="64" height="38" rx="3" fill="#8AAEC8" stroke="#6090B0" strokeWidth="1" filter="url(#cmap-bs)"/>
          <rect x="540" y="568" width="62" height="38" rx="3" fill="#8AAEC8" stroke="#6090B0" strokeWidth="1" filter="url(#cmap-bs)"/>
          <rect x="452" y="568" width="65" height="38" rx="3" fill="#8AAEC8" stroke="#6090B0" strokeWidth="1" filter="url(#cmap-bs)"/>
          <rect x="400" y="625" width="68" height="26" rx="3" fill="#8AAEC8" stroke="#6090B0" strokeWidth="1"/>
          <rect x="317" y="556" width="68" height="38" rx="3" fill="#8AAEC8" stroke="#6090B0" strokeWidth="1" filter="url(#cmap-bs)"/>
          <rect x="226" y="540" width="68" height="38" rx="3" fill="#8AAEC8" stroke="#6090B0" strokeWidth="1"/>
          <rect x="183" y="598" width="72" height="33" rx="3" fill="#8AAEC8" stroke="#6090B0" strokeWidth="1"/>

          {/* 건물 라벨 */}
          <text x="455" y="25" textAnchor="middle" fontSize="7.5" fill="#5A7898" fontWeight="600">기숙사 의관 92동 · 예관 93동</text>
          <text x="120"  y="250" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#192A40">대운동장</text>
          <text x="121"  y="432" textAnchor="middle" fontSize="8"   fill="#5A7898">축구장</text>
          <text x="321"  y="405" textAnchor="middle" fontSize="7"   fill="#192A40">학생회관 3동</text>
          <text x="243"  y="453" textAnchor="middle" fontSize="7"   fill="#192A40">수성관 5동</text>
          <text x="117"  y="476" textAnchor="middle" fontSize="7"   fill="#192A40">체육관 72동</text>
          <text x="426"  y="186" textAnchor="middle" fontSize="7"   fill="#192A40">생명공학대학 62동</text>
          <text x="410"  y="263" textAnchor="middle" fontSize="7"   fill="#192A40">기초학문관 51동</text>
          <text x="428"  y="313" textAnchor="middle" fontSize="7"   fill="#192A40">제2과학관 32동</text>
          <text x="428"  y="362" textAnchor="middle" fontSize="7"   fill="#192A40">제1과학관 31동</text>
          <text x="448"  y="424" textAnchor="middle" fontSize="7.5" fontWeight="800" fill="#192A40">삼성학술</text>
          <text x="448"  y="434" textAnchor="middle" fontSize="7.5" fontWeight="800" fill="#192A40">정보관 48동</text>
          <text x="464"  y="497" textAnchor="middle" fontSize="7"   fill="#5A7898">글로벌광장</text>
          <text x="599"  y="220" textAnchor="middle" fontSize="7"   fill="#192A40">제2공학관 27동</text>
          <text x="599"  y="278" textAnchor="middle" fontSize="7"   fill="#192A40">제2공학관 26동</text>
          <text x="601"  y="352" textAnchor="middle" fontSize="7.5" fontWeight="800" fill="#192A40">공과대학 23동</text>
          <text x="698"  y="458" textAnchor="middle" fontSize="7"   fill="#192A40">제2종합 83동</text>
          <text x="698"  y="526" textAnchor="middle" fontSize="7"   fill="#192A40">제1종합 81동</text>
          <text x="640"  y="591" textAnchor="middle" fontSize="7"   fill="#192A40">화학관 33동</text>
          <text x="571"  y="591" textAnchor="middle" fontSize="7"   fill="#192A40">약학대학</text>
          <text x="485"  y="591" textAnchor="middle" fontSize="7"   fill="#192A40">N센터 86동</text>
          <text x="351"  y="579" textAnchor="middle" fontSize="7"   fill="#192A40">의학관 71동</text>
          <text x="219"  y="618" textAnchor="middle" fontSize="7"   fill="#192A40">의과대학</text>

          {/* 주차관리실 */}
          <g style={{ cursor: 'default' }}>
            <rect x="646" y="590" width="120" height="46" rx="8" fill="#EA580C" filter="url(#cmap-bsm)"/>
            <polygon points="686,636 696,636 691,647" fill="#EA580C"/>
            <text x="706" y="607" textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#fff">주차관리실</text>
            <text x="706" y="620" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.85)">N센터86109호</text>
            <text x="706" y="632" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.85)">031-290-5471</text>
          </g>

          {/* 구역 마커 */}
          {ZONES.map(zone => {
            const pos   = ZONE_POSITIONS[zone.id];
            const col   = ZONE_COLORS[zone.id];
            const lCol  = ZONE_LABEL_COLORS[zone.id];
            const stat  = zoneStats[zone.id];
            const isActive = az === zone.id;
            const isDashed = zone.id === 'D';

            return (
              <g key={zone.id} className="cmap-zm"
                style={{ cursor: 'pointer' }}
                onClick={() => toggle(zone.id)}
                tabIndex={0}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') toggle(zone.id); }}
                role="button"
                aria-label={`${zone.name} 상세 보기`}
              >
                <circle className="cmap-pulse" cx={pos.x} cy={pos.y} r="18" fill={col}/>
                <circle className="cmap-circle" cx={pos.x} cy={pos.y} r="20"
                  fill={col}
                  stroke={isActive ? '#FFD700' : '#fff'}
                  strokeWidth={isActive ? 3.5 : 2.5}
                  strokeDasharray={isDashed ? '5 2.5' : undefined}
                  filter="url(#cmap-bsm)"
                />
                <text x={pos.x} y={pos.y + 6} textAnchor="middle" fontSize="15" fontWeight="900" fill="#fff" pointerEvents="none">
                  {zone.id}
                </text>
                <rect x={pos.x - 32} y={pos.y + 23} width="64" height="14" rx="7" fill="rgba(255,255,255,0.92)" pointerEvents="none"/>
                <text x={pos.x} y={pos.y + 33} textAnchor="middle" fontSize="9" fontWeight="700" fill={lCol} pointerEvents="none">
                  빈자리 {stat?.empty ?? 0}
                </text>
              </g>
            );
          })}

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
      {az && azData && azStat && (
        <div style={{
          background: '#fff',
          borderRadius: 16,
          border: `2px solid ${ZONE_COLORS[az]}`,
          boxShadow: '0 4px 20px rgba(0,0,0,0.11)',
          overflow: 'hidden',
        }}>
          {/* 헤더 */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px',
            background: ZONE_COLORS[az] + '14',
            borderBottom: `1px solid ${ZONE_COLORS[az]}33`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 42, height: 42, borderRadius: '50%',
                background: ZONE_COLORS[az],
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, fontWeight: 900, color: '#fff', flexShrink: 0,
              }}>{az}</div>
              <div>
                <div style={{ fontSize: 17, fontWeight: 800, color: '#1C1C1E' }}>{azData.name}</div>
                <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{ZONE_LOC[az]}</div>
              </div>
            </div>
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
            }}>
              <span style={{
                fontSize: 13, fontWeight: 700, color: congColor(azStat.pct),
                background: congColor(azStat.pct) + '20',
                padding: '3px 10px', borderRadius: 20,
              }}>{congLabel(azStat.pct)}</span>
              <span style={{ fontSize: 11, color: '#9CA3AF', marginTop: 3 }}>{azStat.pct}% 점유</span>
            </div>
          </div>

          {/* 통계 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', padding: '14px 12px', gap: 8 }}>
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
                background: congColor(azStat.pct),
                borderRadius: 4, transition: 'width 0.4s ease',
              }}/>
            </div>
          </div>

          {/* 인근 건물 */}
          <div style={{ padding: '0 16px 16px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 8 }}>인근 건물</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {ZONE_NEAR[az].map(b => (
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
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: ZONE_COLORS[z.id] }}/>
            {z.name}
          </div>
        ))}
        <div style={{ width: 1, height: 14, background: '#E5E7EB', margin: '0 2px' }}/>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#6B7280' }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', border: '2px dashed #9CA3AF', background: 'transparent' }}/>
          지하주차장
        </div>
      </div>
    </div>
  );
}
