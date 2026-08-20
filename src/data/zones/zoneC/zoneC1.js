export const zoneC1 = {
  id: 'C-1',
  name: 'C-1구역',
  label: '공과대학 앞 (지상)',
  mapLocation: '공과대학 앞 (지상) — C-1',

  color:      '#EA580C',
  labelColor: '#7C2D12',
  mapX: 514, mapY: 148,

  mapArea: { type: 'rect', x: 470, y: 110, w: 130, h: 90, rx: 4 },

  nearBuildings: ['제2공학관 27동', '공과대학 23동', 'N센터 86동'],
  totalSlots: 8,
  gridCols: 4, gridRows: 2,

  occupiedSlots: [2,4,5,8],
  disabledSlots: [7,8],
};
