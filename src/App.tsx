import { useGameEngine } from './engine/useGameEngine';
import { script } from './data/script';
import { TitleScreen } from './components/TitleScreen';
import { NarrativeScreen } from './components/NarrativeScreen';
import { QTEOverlay } from './components/QTEOverlay';
import { DataCardSequence } from './components/DataCardSequence';
import { EndScreen } from './components/EndScreen';

export default function App() {
  const { state, dispatch } = useGameEngine();

  if (state.nodeId === null) {
    return <TitleScreen onStart={() => dispatch({ type: 'START' })} />;
  }

  const node = script[state.nodeId];
  if (!node) return null;

  switch (node.type) {
    case 'qte':
      return <QTEOverlay node={node} onResult={(success) => dispatch({ type: 'QTE_RESULT', success })} />;
    case 'datacard':
      return <DataCardSequence node={node} onDone={() => dispatch({ type: 'ADVANCE' })} />;
    case 'end':
      return <EndScreen node={node} />;
    default:
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
}
