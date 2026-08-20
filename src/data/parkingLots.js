// ─────────────────────────────────────────────────────────────
// 구역별 파일은 src/data/zones/ 폴더에 있습니다.
//   A구역   → zones/zoneA.js
//   B구역   → zones/zoneB.js
//   C-1구역 → zones/zoneC/zoneC1.js
//   C-2구역 → zones/zoneC/zoneC2.js
//   D구역   → zones/zoneD.js
//
// 구역 추가 시 파일 만들고 아래 ZONES 배열에 추가하면 됩니다.
// ─────────────────────────────────────────────────────────────

import { zoneA  } from './zones/zoneA.js';
import { zoneB  } from './zones/zoneB.js';
import { zoneC1 } from './zones/zoneC/zoneC1.js';
import { zoneC2 } from './zones/zoneC/zoneC2.js';
import { zoneD  } from './zones/zoneD.js';

export const ZONES = [zoneA, zoneB, zoneC1, zoneC2, zoneD];

// 주차면 상태: 'empty' | 'occupied' | 'recommended' | 'disabled'
export function generateInitialSlots() {
  const slots = [];

  ZONES.forEach(zone => {
    for (let i = 1; i <= zone.totalSlots; i++) {
      let status = 'empty';
      if (zone.disabledSlots?.includes(i))      status = 'disabled';
      else if (zone.occupiedSlots?.includes(i)) status = 'occupied';

      slots.push({
        id:     `${zone.id}-${String(i).padStart(2, '0')}`,
        zoneId: zone.id,
        number: i,
        status,
      });
    }
  });

  return slots;
}
