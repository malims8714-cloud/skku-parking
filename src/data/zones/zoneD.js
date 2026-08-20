export const zoneD = {
  id: 'D',
  name: 'D구역',
  label: '지하주차장 (B1)',
  mapLocation: '삼성학술정보관 지하 (B1)',

  color:        '#0D9488',
  labelColor:   '#134E4A',
  mapX: 562, mapY: 242,

  mapArea:       { type: 'ellipse', cx: 562, cy: 248, rx: 52, ry: 30 },
  mapAreaDashed: true,

  nearBuildings: ['삼성학술정보관 48동', '글로벌광장'],
  totalSlots: 24,
  gridCols: 6, gridRows: 4,

  occupiedSlots: [1,2,3,5,7,9,11,12,15,17,18,20,22],
  disabledSlots: [23,24],
};
