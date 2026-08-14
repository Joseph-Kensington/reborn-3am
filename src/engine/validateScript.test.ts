import { describe, it, expect } from 'vitest';
import { validateScript } from './validateScript';
import type { Script } from './types';

const good: Script = {
  'a1-n1': { id: 'a1-n1', scene: 'bedroom-night', type: 'narration', text: 'x', next: 'fin' },
  fin: { id: 'fin', scene: 'datacard', type: 'end', text: '完' },
};

describe('validateScript', () => {
  it('合法剧本返回空错误列表', () => {
    expect(validateScript(good)).toEqual([]);
  });

  it('检出悬空的 next 指针', () => {
    const bad: Script = { ...good, 'a1-n1': { ...good['a1-n1'], next: 'ghost' } };
    expect(validateScript(bad).some((e) => e.includes('ghost'))).toBe(true);
  });

  it('检出 choice/qte 内的悬空指针', () => {
    const bad: Script = {
      c: { id: 'c', scene: 'bedroom-night', type: 'choice', text: '', choices: [{ label: 'x', next: 'ghost' }] },
      q: { id: 'q', scene: 'bedroom-night', type: 'qte', text: '', qte: { timeoutMs: 100, buttonLabel: 'b', successNext: 'g1', failNext: 'fin' } },
      fin: good.fin,
    };
    const errors = validateScript(bad, 'c');
    expect(errors.some((e) => e.includes('ghost'))).toBe(true);
    expect(errors.some((e) => e.includes('g1'))).toBe(true);
  });

  it('检出从起点不可达的节点', () => {
    const bad: Script = { ...good, orphan: { id: 'orphan', scene: 'wash-loop', type: 'end', text: 'x' } };
    expect(validateScript(bad).some((e) => e.includes('orphan') && e.includes('不可达'))).toBe(true);
  });

  it('检出非 end 节点的死路', () => {
    const bad: Script = { 'a1-n1': { id: 'a1-n1', scene: 'bedroom-night', type: 'narration', text: 'x' } };
    expect(validateScript(bad).some((e) => e.includes('死路'))).toBe(true);
  });

  it('检出未登记的场景 id', () => {
    const bad: Script = { ...good, 'a1-n1': { ...good['a1-n1'], scene: 'nowhere' } };
    expect(validateScript(bad).some((e) => e.includes('nowhere'))).toBe(true);
  });

  it('datacard 节点必须有非空 cards', () => {
    const bad: Script = { 'a1-n1': { id: 'a1-n1', scene: 'datacard', type: 'datacard', text: '', next: 'fin' }, fin: good.fin };
    expect(validateScript(bad).some((e) => e.includes('cards'))).toBe(true);
  });
});
