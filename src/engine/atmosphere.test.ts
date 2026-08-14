import { describe, it, expect } from 'vitest';
import { computeAtmosphere } from './atmosphere';
import type { GameNode } from './types';

const painNode: GameNode = { id: 'x', scene: 'morning-pain', type: 'narration', text: '' };
const otherNode: GameNode = { id: 'y', scene: 'wash-loop', type: 'narration', text: '' };

describe('computeAtmosphere', () => {
  it('零状态：无暗角、无微颤', () => {
    expect(computeAtmosphere({ fatigue: 0, pain: 0 }, painNode)).toEqual({ vignette: 0, tremor: false });
  });

  it('疲惫值线性映射暗角并有上限 0.45', () => {
    expect(computeAtmosphere({ fatigue: 5, pain: 0 }, otherNode).vignette).toBeCloseTo(0.4);
    expect(computeAtmosphere({ fatigue: 99, pain: 0 }, otherNode).vignette).toBe(0.45);
  });

  it('疼痛值 ≥2 且处于疼痛场景时触发微颤', () => {
    expect(computeAtmosphere({ fatigue: 0, pain: 2 }, painNode).tremor).toBe(true);
    expect(computeAtmosphere({ fatigue: 0, pain: 1 }, painNode).tremor).toBe(false);
    expect(computeAtmosphere({ fatigue: 0, pain: 2 }, otherNode).tremor).toBe(false);
  });
});
