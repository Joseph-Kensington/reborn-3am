export const SCENES = [
  'bedroom-night',
  'bedtail-3am',
  'morning-pain',
  'wash-loop',
  'night-alarm',
  'wakeup',
  'datacard',
] as const;

export type SceneId = (typeof SCENES)[number];

/**
 * 场景底色（平涂，无渐变——电影感纪律）；
 * Task 10 接入插画后作为图片下层兜底。
 * 色阶来自参照palette的明暗梯：#060500 / #0a0a00 / #0f0f0f。
 */
export const SCENE_GRADIENT: Record<SceneId, string> = {
  'bedroom-night': '#0a0a00',
  'bedtail-3am': '#060500',
  'morning-pain': '#0f0f0f',
  'wash-loop': '#0a0a00',
  'night-alarm': '#060500',
  wakeup: '#060500',
  datacard: '#000000',
};

/** 场景插画路径：竖屏（手机竖持）用 9:16 竖版 JPG，其余用横版 PNG */
export function sceneImage(scene: string, portrait: boolean): string {
  return portrait ? `/images/portrait/${scene}.jpg` : `/images/${scene}.png`;
}
