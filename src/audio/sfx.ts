/**
 * 音效登记表：key 即 SfxId，供剧本节点/选项的 sfx 字段引用。
 * loop=true  为循环底声（同时只播一条，新循环顶替旧循环）；
 * loop=false 为一次性音效（可叠加在循环之上）。
 * 特殊引用 'stop'：停止当前循环（本身不是登记音效）。
 * src 前缀随部署 base 自适应（子路径部署如 GitHub Pages 也能命中）。
 */
const BASE = import.meta.env.BASE_URL;

export const SFX = {
  'night-ambience': { src: `${BASE}audio/night-ambience.mp3`, loop: true, volume: 0.35 },
  'pump-standard': { src: `${BASE}audio/pump-standard.mp3`, loop: true, volume: 0.6 },
  'pump-silent': { src: `${BASE}audio/pump-silent.mp3`, loop: true, volume: 0.25 },
  alarm: { src: `${BASE}audio/alarm.mp3`, loop: false, volume: 0.7 },
  'baby-cry': { src: `${BASE}audio/baby-cry.mp3`, loop: false, volume: 0.6 },
  'phone-vibrate': { src: `${BASE}audio/phone-vibrate.mp3`, loop: false, volume: 0.7 },
} as const;

export type SfxId = keyof typeof SFX;

/** 剧本 sfx 字段的合法值：登记音效 id，或 'stop'（停止当前循环） */
export type SfxRef = SfxId | 'stop';
