import { useEffect } from 'react';
import { useGameEngine } from './engine/useGameEngine';
import { script } from './data/script';
import { audioManager } from './audio/AudioManager';
import { TitleScreen } from './components/TitleScreen';
import { NarrativeScreen } from './components/NarrativeScreen';
import { QTEOverlay } from './components/QTEOverlay';
import { DataCardSequence } from './components/DataCardSequence';
import { EndScreen } from './components/EndScreen';

export default function App() {
  const { state, dispatch } = useGameEngine();
  const node = state.nodeId === null ? null : (script[state.nodeId] ?? null);

  // 节点级音效：进入新节点时按剧本标注切换（无声也可完整通关）
  useEffect(() => {
    audioManager.handle(node?.sfx);
  }, [state.nodeId]); // 仅随节点变化触发；node 由 nodeId 派生

  const handleStart = () => {
    audioManager.unlock(); // 浏览器自动播放限制：首次点击「开始」后才允许出声
    dispatch({ type: 'START' });
  };

  const handleChoose = (i: number) => {
    const choice = node?.choices?.[i];
    if (choice?.sfx) audioManager.handle(choice.sfx);
    if (choice?.feedbackSfx) audioManager.handleLater(choice.feedbackSfx, 1800);
    dispatch({ type: 'CHOOSE', choiceIndex: i });
  };

  let content: React.ReactNode;
  if (state.nodeId === null || !node) {
    content = state.nodeId === null ? <TitleScreen onStart={handleStart} /> : null;
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
            onChoose={handleChoose}
          />
        );
    }
  }

  return (
    <>
      {content}
      <div className="film-grain" aria-hidden="true" />
    </>
  );
}
