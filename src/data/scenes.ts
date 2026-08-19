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
 * 2026-08-19 画风 D 批次：色值取自各图四角平均色（深蓝近黑基调）。
 */
export const SCENE_GRADIENT: Record<SceneId, string> = {
  'bedroom-night': '#050e1a',
  'bedtail-3am': '#030f1d',
  'morning-pain': '#6a788b',
  'wash-loop': '#382f27',
  'night-alarm': '#051223',
  wakeup: '#0b1520',
  datacard: '#000000',
};

/** 场景插画路径：竖屏（手机竖持）用 9:16 竖版 JPG，其余用横版 PNG；前缀随部署 base 自适应 */
export function sceneImage(scene: string, portrait: boolean): string {
  const base = import.meta.env.BASE_URL;
  return portrait ? `${base}images/portrait/${scene}.jpg` : `${base}images/${scene}.png`;
}
