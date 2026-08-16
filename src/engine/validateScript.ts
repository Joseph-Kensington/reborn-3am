import { SCENES } from '../data/scenes';
import { SFX } from '../audio/sfx';
import type { Script } from './types';
import { START_NODE } from './types';

const SCENE_SET = new Set<string>(SCENES);
const SFX_REFS = new Set<string>([...Object.keys(SFX), 'stop']);
const SFX_IDS = new Set<string>(Object.keys(SFX));

function exitsOf(node: Script[string]): string[] {
  const exits: string[] = [];
  if (node.next) exits.push(node.next);
  for (const c of node.choices ?? []) exits.push(c.next);
  if (node.qte) exits.push(node.qte.successNext, node.qte.failNext);
  return exits;
}

export function validateScript(script: Script, startId: string = START_NODE): string[] {
  const errors: string[] = [];
  const ids = new Set(Object.keys(script));

  if (!ids.has(startId)) errors.push(`起始节点不存在: ${startId}`);

  for (const node of Object.values(script)) {
    if (!SCENE_SET.has(node.scene)) {
      errors.push(`节点 ${node.id} 使用未登记场景: ${node.scene}（合法值: ${(SCENES as readonly string[]).join(', ')}）`);
    }
    if (node.sfx && !SFX_REFS.has(node.sfx)) {
      errors.push(`节点 ${node.id} 使用未登记音效: ${node.sfx}（合法值: ${[...SFX_REFS].join(', ')}）`);
    }
    for (const c of node.choices ?? []) {
      if (c.sfx && !SFX_REFS.has(c.sfx)) {
        errors.push(`节点 ${node.id} 的选项「${c.label}」使用未登记音效: ${c.sfx}`);
      }
      if (c.feedbackSfx && !SFX_IDS.has(c.feedbackSfx)) {
        errors.push(`节点 ${node.id} 的选项「${c.label}」使用未登记 feedbackSfx: ${c.feedbackSfx}（须为已登记音效，不能用 'stop'）`);
      }
    }
    if (node.type === 'datacard' && (!node.cards || node.cards.length === 0)) {
      errors.push(`datacard 节点 ${node.id} 缺少非空 cards`);
    }
    if (node.type === 'choice' && (!node.choices || node.choices.length === 0)) {
      errors.push(`choice 节点 ${node.id} 缺少 choices`);
    }
    if (node.type === 'qte' && !node.qte) {
      errors.push(`qte 节点 ${node.id} 缺少 qte 定义`);
    }
    for (const target of exitsOf(node)) {
      if (!ids.has(target)) errors.push(`节点 ${node.id} 指向不存在的节点: ${target}`);
    }
    if (node.type !== 'end' && exitsOf(node).length === 0) {
      errors.push(`节点 ${node.id} 是死路（非 end 类型但无出口）`);
    }
  }

  // 可达性（DFS）
  const reachable = new Set<string>();
  const stack = ids.has(startId) ? [startId] : [];
  while (stack.length > 0) {
    const id = stack.pop()!;
    if (reachable.has(id)) continue;
    reachable.add(id);
    for (const t of exitsOf(script[id])) if (ids.has(t)) stack.push(t);
  }
  for (const id of ids) {
    if (!reachable.has(id)) errors.push(`节点不可达: ${id}`);
  }
  if (ids.size > 0 && ![...reachable].some((id) => script[id].type === 'end')) {
    errors.push('从起点出发无法到达任何 end 节点');
  }

  return errors;
}
