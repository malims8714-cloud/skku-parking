// ─────────────────────────────────────────────────────────────
// 실제 주차장 데이터로 교체할 때 이 파일만 수정하면 됩니다.
// zones: 주차 구역 목록
// slots: 주차면 목록 (각 구역에 속함)
// ─────────────────────────────────────────────────────────────

export const ZONES = [
  {
    id: 'A',
    name: 'A구역',
    label: '제1공학관 앞 (지상)',
    nearBuildings: ['제1공학관', '삼성학술정보관'],
    totalSlots: 72,
    // 항공사진 배경: src/assets/zone_a_aerial.jpg
    aerialImage: 'zone_a_aerial.jpg',
    gridCols: 9,
    gridRows: 8,
  },
  {
    id: 'B',
    name: 'B구역',
    label: '중앙 (지상)',
    nearBuildings: ['제2공학관', '기초학문관'],
    totalSlots: 20,
    gridCols: 5,
    gridRows: 4,
  },
  {
    id: 'C',
    name: 'C구역',
    label: '후문 (지상)',
    nearBuildings: ['약학관', '자연과학관'],
    totalSlots: 16,
    gridCols: 4,
    gridRows: 4,
  },
  {
    id: 'D',
    name: 'D구역',
    label: '지하주차장',
    nearBuildings: ['반도체관', '삼성학술정보관'],
    totalSlots: 24,
    // 나중에 지하주차장 사진으로 교체: src/assets/zone_d_underground.jpg
    gridCols: 6,
    gridRows: 4,
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
