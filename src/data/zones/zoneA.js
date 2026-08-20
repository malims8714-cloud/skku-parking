export const zoneA = {
  id: 'A',
  name: 'A구역',
  label: '정문 도로 (지상)',
  mapLocation: '정문 도로 · 기숙사 앞 (지상)',

  color:      '#7C3AED',
  labelColor: '#4C1D95',
  mapX: 353, mapY: 82,

  mapArea: { type: 'rect', x: 270, y: 30, w: 165, h: 65, rx: 4 },

  nearBuildings: ['기숙사 의관 92동', '기숙사 예관 93동', '정문'],
  totalSlots: 72,
  gridCols: 9, gridRows: 8,

  occupiedSlots: [1,2,4,6,9,11,14,15,17,20,22,25,28,30,33,35,38,40,42,45,48,50,55,58,60,63,66,68],
  disabledSlots: [71,72],
};
