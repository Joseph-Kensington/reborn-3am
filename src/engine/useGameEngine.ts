import { useReducer } from 'react';
import type { Action, GameState } from './types';
import { createInitialState, reduce } from './gameEngine';
import { script } from '../data/script';

export function useGameEngine(): { state: GameState; dispatch: React.Dispatch<Action> } {
  const [state, dispatch] = useReducer(
    (s: GameState, a: Action) => reduce(s, a, script),
    undefined,
    createInitialState,
  );
  return { state, dispatch };
}
