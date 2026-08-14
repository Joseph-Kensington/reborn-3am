import { useGameEngine } from './engine/useGameEngine';
import { script } from './data/script';
import { TitleScreen } from './components/TitleScreen';
import { NarrativeScreen } from './components/NarrativeScreen';

export default function App() {
  const { state, dispatch } = useGameEngine();

  if (state.nodeId === null) {
    return <TitleScreen onStart={() => dispatch({ type: 'START' })} />;
  }

  const node = script[state.nodeId];
  if (!node) return null;

  if (node.type === 'qte') {
    // Task 6 替换为 QTEOverlay
    return (
      <NarrativeScreen
        node={{ ...node, type: 'narration' }}
        stats={state.stats}
        feedback={null}
        onAdvance={() => dispatch({ type: 'QTE_RESULT', success: false })}
        onChoose={() => undefined}
      />
    );
  }

  return (
    <NarrativeScreen
      node={node}
      stats={state.stats}
      feedback={state.feedback}
      onAdvance={() => dispatch({ type: 'ADVANCE' })}
      onChoose={(i) => dispatch({ type: 'CHOOSE', choiceIndex: i })}
    />
  );
}
