import { describe, it, expect } from 'vitest';
import { createInitialState, reduce, START_NODE } from './gameEngine';
import type { Script } from './types';

const mini: Script = {
  'a1-n1': { id: 'a1-n1', scene: 'bedroom-night', type: 'narration', text: '开场', next: 'a1-n2' },
  'a1-n2': {
    id: 'a1-n2', scene: 'bedroom-night', type: 'choice', text: '选？',
    choices: [
      { label: 'A', feedback: '你选了A', effects: { fatigue: 2 }, next: 'a1-n3' },
      { label: 'B', next: 'a1-n3' },
    ],
  },
  'a1-n3': {
    id: 'a1-n3', scene: 'bedroom-night', type: 'qte', text: '来电',
    qte: { timeoutMs: 2500, buttonLabel: '挂断', successNext: 'ok', failNext: 'no' },
  },
  ok: { id: 'ok', scene: 'bedroom-night', type: 'narration', text: '挂断了', next: 'cards' },
  no: { id: 'no', scene: 'bedroom-night', type: 'narration', text: '没挂断', next: 'cards' },
  cards: { id: 'cards', scene: 'datacard', type: 'datacard', text: '', cards: ['卡1', '卡2'], next: 'fin' },
  fin: { id: 'fin', scene: 'datacard', type: 'end', text: '完' },
};

describe('gameEngine', () => {
  it('初始状态在标题页（nodeId 为 null）', () => {
    expect(createInitialState().nodeId).toBeNull();
    expect(createInitialState().stats).toEqual({ fatigue: 0, pain: 0 });
  });

  it('START 进入起始节点', () => {
    const s = reduce(createInitialState(), { type: 'START' }, mini);
    expect(s.nodeId).toBe(START_NODE);
  });

  it('narration 节点 ADVANCE 推进到 next', () => {
    let s = reduce(createInitialState(), { type: 'START' }, mini);
    s = reduce(s, { type: 'ADVANCE' }, mini);
    expect(s.nodeId).toBe('a1-n2');
  });

  it('CHOOSE 有 feedback 时先挂起反馈并累积状态值，再次 ADVANCE 才跳转', () => {
    let s = reduce(createInitialState(), { type: 'START' }, mini);
    s = reduce(s, { type: 'ADVANCE' }, mini);
    s = reduce(s, { type: 'CHOOSE', choiceIndex: 0 }, mini);
    expect(s.feedback).toBe('你选了A');
    expect(s.stats.fatigue).toBe(2);
    expect(s.nodeId).toBe('a1-n2'); // 仍在原节点展示反馈
    s = reduce(s, { type: 'ADVANCE' }, mini);
    expect(s.nodeId).toBe('a1-n3');
    expect(s.feedback).toBeNull();
  });

  it('CHOOSE 无 feedback 时直接跳转', () => {
    let s = reduce(createInitialState(), { type: 'START' }, mini);
    s = reduce(s, { type: 'ADVANCE' }, mini);
    s = reduce(s, { type: 'CHOOSE', choiceIndex: 1 }, mini);
    expect(s.nodeId).toBe('a1-n3');
    expect(s.feedback).toBeNull();
  });

  it('QTE_RESULT 成功/失败走向不同分支，成功置 linglingHungUp 标记', () => {
    let s = reduce(createInitialState(), { type: 'START' }, mini);
    s = reduce(s, { type: 'ADVANCE' }, mini);
    s = reduce(s, { type: 'CHOOSE', choiceIndex: 1 }, mini);
    const ok = reduce(s, { type: 'QTE_RESULT', success: true }, mini);
    expect(ok.nodeId).toBe('ok');
    expect(ok.flags.linglingHungUp).toBe(true);
    const no = reduce(s, { type: 'QTE_RESULT', success: false }, mini);
    expect(no.nodeId).toBe('no');
    expect(no.flags.linglingHungUp).toBe(false);
  });

  it('datacard 节点 ADVANCE 进入 next（卡片轮播由组件本地驱动）', () => {
    let s = reduce(createInitialState(), { type: 'START' }, mini);
    s = reduce(s, { type: 'ADVANCE' }, mini);
    s = reduce(s, { type: 'CHOOSE', choiceIndex: 1 }, mini);
    s = reduce(s, { type: 'QTE_RESULT', success: true }, mini);
    s = reduce(s, { type: 'ADVANCE' }, mini);
    expect(s.nodeId).toBe('cards');
    s = reduce(s, { type: 'ADVANCE' }, mini);
    expect(s.nodeId).toBe('fin');
  });

  it('end 节点上 ADVANCE/CHOOSE 均为空操作', () => {
    let s = reduce(createInitialState(), { type: 'START' }, mini);
    for (const a of [
      { type: 'ADVANCE' }, { type: 'CHOOSE', choiceIndex: 1 },
      { type: 'QTE_RESULT', success: true }, { type: 'ADVANCE' }, { type: 'ADVANCE' },
    ] as const) s = reduce(s, a, mini);
    expect(s.nodeId).toBe('fin');
    const before = s;
    s = reduce(s, { type: 'ADVANCE' }, mini);
    s = reduce(s, { type: 'CHOOSE', choiceIndex: 0 }, mini);
    expect(s).toEqual(before);
  });
});
