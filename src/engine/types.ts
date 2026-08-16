import type { SfxId, SfxRef } from '../audio/sfx';

export type StatKey = 'fatigue' | 'pain';
export type Stats = Record<StatKey, number>;

export interface Choice {
  label: string;
  feedback?: string;
  effects?: Partial<Stats>;
  /** 选择该选项时触发：循环音成为当前底声，一次性音效立即播放，'stop' 停止当前循环 */
  sfx?: SfxRef;
  /** 反馈文案展示后延迟跟出的一次性音效（如泵声先起、哭声后跟） */
  feedbackSfx?: SfxId;
  next: string;
}

export type NodeType = 'narration' | 'choice' | 'qte' | 'datacard' | 'end';

export interface QTEDef {
  timeoutMs: number;
  buttonLabel: string;
  successNext: string;
  failNext: string;
}

export interface GameNode {
  id: string;
  scene: string;
  type: NodeType;
  text: string;
  speaker?: string;
  choices?: Choice[];
  qte?: QTEDef;
  cards?: string[];
  /** 节点进入时触发音效（语义同 Choice.sfx） */
  sfx?: SfxRef;
  next?: string;
}

export type Script = Record<string, GameNode>;

export const START_NODE = 'a1-n1';

export interface GameState {
  nodeId: string | null; // null = 标题页
  stats: Stats;
  feedback: string | null;
  pendingNext: string | null;
  flags: { linglingHungUp: boolean };
}

export type Action =
  | { type: 'START' }
  | { type: 'ADVANCE' }
  | { type: 'CHOOSE'; choiceIndex: number }
  | { type: 'QTE_RESULT'; success: boolean };
