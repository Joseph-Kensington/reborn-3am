import type { GameNode, Stats } from './types';

/**
 * 状态值的"无形化"可视化：
 * - vignette 暗角强度：疲惫值越高，画面四周越暗（0 ~ 0.45）
 * - tremor 文字微颤：疼痛值 ≥2 且正处于疼痛场景时触发
 */
export function computeAtmosphere(stats: Stats, node: GameNode): { vignette: number; tremor: boolean } {
  return {
    vignette: Math.min(stats.fatigue * 0.08, 0.45),
    tremor: stats.pain >= 2 && node.scene === 'morning-pain',
  };
}
