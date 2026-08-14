import type { GameNode, Stats } from './types';

/**
 * 状态值的"无形化"可视化（Task 8 正式实现，当前为最小占位版）。
 */
export function computeAtmosphere(_stats: Stats, _node: GameNode): { vignette: number; tremor: boolean } {
  return { vignette: 0, tremor: false };
}
