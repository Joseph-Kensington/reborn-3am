export type StatKey = 'fatigue' | 'pain';
export type Stats = Record<StatKey, number>;

export interface Choice {
  label: string;
  feedback?: string;
  effects?: Partial<Stats>;
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
