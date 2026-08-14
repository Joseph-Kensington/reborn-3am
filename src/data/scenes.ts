export const SCENES = [
  'bedroom-night',
  'bedtail-3am',
  'morning-pain',
  'wash-loop',
  'night-alarm',
  'datacard',
] as const;

export type SceneId = (typeof SCENES)[number];

/** 插画缺失时的 CSS 渐变兜底（Task 10 接入插画后作为底层） */
export const SCENE_GRADIENT: Record<SceneId, string> = {
  'bedroom-night': 'linear-gradient(180deg, #14121d 0%, #0b0b10 100%)',
  'bedtail-3am': 'linear-gradient(180deg, #0d1020 0%, #05060c 100%)',
  'morning-pain': 'linear-gradient(180deg, #1d1a17 0%, #0e0c0a 100%)',
  'wash-loop': 'linear-gradient(180deg, #12161a 0%, #0a0c0e 100%)',
  'night-alarm': 'linear-gradient(180deg, #100e16 0%, #060509 100%)',
  datacard: 'linear-gradient(180deg, #000000 0%, #000000 100%)',
};
