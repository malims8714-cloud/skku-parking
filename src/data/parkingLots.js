// ─────────────────────────────────────────────────────────────
// 실제 주차장 데이터로 교체할 때 이 파일만 수정하면 됩니다.
// zones: 주차 구역 목록
// slots: 주차면 목록 (각 구역에 속함)
//
// ✏️  캠퍼스 지도 수정 방법 (CampusMap 관련)
//   color        구역 마커 색상 (배경색)
//   labelColor   마커 위 "빈자리 N" 텍스트 색상
//   mapX / mapY  SVG 마커 중심 좌표 (viewBox: 0 0 900 660)
//   mapLocation  지도 상세 카드에 표시되는 위치 설명
//   nearBuildings 상세 카드 "인근 건물" 목록
//   mapArea      지도에 표시되는 구역 색상 영역
//     type 'rect'    → x, y, w, h, rx
//     type 'ellipse' → cx, cy, rx, ry
//   mapAreaDashed true = 점선 테두리 (지하주차장 표시용)
// ─────────────────────────────────────────────────────────────

export const ZONES = [
  {
    id: 'A',
    name: 'A구역',
    label: '정문 도로 (지상)',       // ParkingMap 구역별 뷰에 표시
    mapLocation: '정문 도로 · 기숙사 앞 (지상)', // CampusMap 상세 카드에 표시

    // 지도 마커
    color:      '#7C3AED', // 보라 — 실제 캠퍼스 맵 기준
    labelColor: '#4C1D95', // 마커 위 라벨 텍스트 (보라 계열 진한 색)
    mapX: 451, mapY: 115,  // SVG 좌표 (900×660 기준)

    // 지도 구역 표시 영역
    mapArea: { type: 'rect', x: 408, y: 30, w: 86, h: 135, rx: 4 },

    nearBuildings: ['기숙사 의관 92동', '기숙사 예관 93동', '정문'],
    totalSlots: 72,
    aerialImage: 'zone_a_aerial.jpg', // src/assets/ 에 사진 넣으면 ParkingMap에서 표시
    gridCols: 9, gridRows: 8,
  },
  {
    id: 'B',
    name: 'B구역',
    label: '중앙 (지상)',
    mapLocation: '학생회관 앞 · 중앙 (지상)',

    color:      '#16A34A', // 초록
    labelColor: '#14532D',
    mapX: 561, mapY: 366,

    mapArea: { type: 'rect', x: 530, y: 340, w: 62, h: 52, rx: 4 },

    nearBuildings: ['학생회관 3동', '삼성학술정보관 48동'],
    totalSlots: 20,
    gridCols: 5, gridRows: 4,
  },
  {
    id: 'C',
    name: 'C구역',
    label: '공과대학 앞 (지상)',
    mapLocation: '공과대학 앞 (지상)',

    color:      '#EA580C', // 주황
    labelColor: '#7C2D12',
    mapX: 690, mapY: 220,

    mapArea: { type: 'rect', x: 638, y: 165, w: 102, h: 110, rx: 4 },

    nearBuildings: ['제2공학관 27동', '공과대학 23동', 'N센터 86동'],
    totalSlots: 16,
    gridCols: 4, gridRows: 4,
  },
  {
    id: 'D',
    name: 'D구역',
    label: '지하주차장 (B1)',
    mapLocation: '삼성학술정보관 지하 (B1)',

    color:        '#0D9488', // 청록
    labelColor:   '#134E4A',
    mapX: 520, mapY: 460,

    mapArea:       { type: 'ellipse', cx: 520, cy: 460, rx: 54, ry: 38 },
    mapAreaDashed: true, // 지하주차장 = 점선 테두리

    nearBuildings: ['삼성학술정보관 48동', '글로벌광장'],
    totalSlots: 24,
    gridCols: 6, gridRows: 4,
  },
];

// 주차면 상태: 'empty' | 'occupied' | 'recommended' | 'disabled'
// 이 함수가 초기 mock 데이터를 생성합니다.
// 실제 센서 데이터 연동 시 이 함수를 API 호출로 교체하면 됩니다.
export function generateInitialSlots() {
  const slots = [];
  const occupiedPatterns = {
    A: [1,2,4,6,9,11,14,15,17,20,22,25,28,30,33,35,38,40,42,45,48,50,55,58,60,63,66,68],
    B: [1,3,5,7,8,12,13,16,18,19],
    C: [2,4,5,8,10,13],
    D: [1,2,3,5,7,9,11,12,15,17,18,20,22],
  };
  const disabledSlots = {
    // 장애인·전기차 구역은 위치 확인 후 추가 예정
    A: [71,72],
    B: [20],
    C: [15,16],
    D: [23,24],
  };

  ZONES.forEach(zone => {
    for (let i = 1; i <= zone.totalSlots; i++) {
      const id = `${zone.id}-${String(i).padStart(2, '0')}`;
      let status = 'empty';
      if (disabledSlots[zone.id]?.includes(i)) status = 'disabled';
      else if (occupiedPatterns[zone.id]?.includes(i)) status = 'occupied';

      slots.push({
        id,
        zoneId: zone.id,
        number: i,
        status,
        // 나중에 실제 좌표로 교체 (항공사진 오버레이용)
        // x: 0, y: 0, width: 0, height: 0
      });
    }
  });
  return slots;
}
