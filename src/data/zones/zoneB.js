export const zoneB = {
  id: 'B',
  name: 'B구역',
  label: '중앙 (지상)',
  mapLocation: '학생회관 앞 · 중앙 (지상)',

  color:      '#16A34A',
  labelColor: '#14532D',
  mapX: 547, mapY: 207,

  mapArea: { type: 'rect', x: 518, y: 188, w: 58, h: 42, rx: 4 },

  nearBuildings: ['학생회관 3동', '삼성학술정보관 48동'],
  totalSlots: 20,
  gridCols: 5, gridRows: 4,

  occupiedSlots: [1,3,5,7,8,12,13,16,18,19],
  disabledSlots: [20],
};
