export const zoneC2 = {
  id: 'C-2',
  name: 'C-2구역',
  label: '하단 주차장 (지상)',
  mapLocation: '하단 주차장 (지상) — C-2',

  color:      '#EA580C',
  labelColor: '#7C2D12',
  mapX: 192, mapY: 345,

  mapArea: { type: 'rect', x: 150, y: 318, w: 85, h: 54, rx: 4 },

  nearBuildings: ['체육관 72동', '의과대학'],
  totalSlots: 8,
  gridCols: 4, gridRows: 2,

  occupiedSlots: [1,3,6],
  disabledSlots: [7,8],
};
