import { useGameEngine } from './engine/useGameEngine';
import { script } from './data/script';
import { TitleScreen } from './components/TitleScreen';
import { NarrativeScreen } from './components/NarrativeScreen';
import { QTEOverlay } from './components/QTEOverlay';
import { DataCardSequence } from './components/DataCardSequence';
import { EndScreen } from './components/EndScreen';

export default function App() {
  const { state, dispatch } = useGameEngine();

  let content: React.ReactNode;
  if (state.nodeId === null) {
    content = <TitleScreen onStart={() => dispatch({ type: 'START' })} />;
  } else {
    const node = script[state.nodeId];
    if (!node) {
      content = null;
    } else {
      switch (node.type) {
        case 'qte':
          content = <QTEOverlay node={node} onResult={(success) => dispatch({ type: 'QTE_RESULT', success })} />;
          break;
        case 'datacard':
          content = <DataCardSequence node={node} onDone={() => dispatch({ type: 'ADVANCE' })} />;
          break;
        case 'end':
          content = <EndScreen node={node} />;
          break;
        default:
          content = (
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
  }

  return (
    <>
      {content}
      <div className="film-grain" aria-hidden="true" />
    </>
  );
}
