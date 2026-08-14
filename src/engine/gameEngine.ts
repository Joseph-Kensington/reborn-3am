import type { Action, GameState, Script, Stats } from './types';
import { START_NODE } from './types';

export { START_NODE };

export function createInitialState(): GameState {
  return {
    nodeId: null,
    stats: { fatigue: 0, pain: 0 },
    feedback: null,
    pendingNext: null,
    flags: { linglingHungUp: false },
  };
}

function applyEffects(stats: Stats, effects?: Partial<Stats>): Stats {
  if (!effects) return stats;
  return {
    fatigue: Math.max(0, stats.fatigue + (effects.fatigue ?? 0)),
    pain: Math.max(0, stats.pain + (effects.pain ?? 0)),
  };
}

export function reduce(state: GameState, action: Action, script: Script): GameState {
  switch (action.type) {
    case 'START':
      return { ...createInitialState(), nodeId: START_NODE };
    case 'ADVANCE': {
      if (state.nodeId === null) return state;
      if (state.feedback !== null && state.pendingNext !== null) {
        return { ...state, nodeId: state.pendingNext, feedback: null, pendingNext: null };
      }
      const node = script[state.nodeId];
      if (!node || node.type === 'end' || node.type === 'choice' || node.type === 'qte') return state;
      if (!node.next) return state;
      return { ...state, nodeId: node.next };
    }
    case 'CHOOSE': {
      if (state.nodeId === null) return state;
      const node = script[state.nodeId];
      if (!node || node.type !== 'choice' || !node.choices) return state;
      const choice = node.choices[action.choiceIndex];
      if (!choice) return state;
      const stats = applyEffects(state.stats, choice.effects);
      if (choice.feedback) {
        return { ...state, stats, feedback: choice.feedback, pendingNext: choice.next };
      }
      return { ...state, stats, nodeId: choice.next };
    }
    case 'QTE_RESULT': {
      if (state.nodeId === null) return state;
      const node = script[state.nodeId];
      if (!node || node.type !== 'qte' || !node.qte) return state;
      return {
        ...state,
        nodeId: action.success ? node.qte.successNext : node.qte.failNext,
        flags: { ...state.flags, linglingHungUp: action.success },
      };
    }
  }
}
