import type { GameNode, Stats } from '../engine/types';
import { SCENE_GRADIENT, type SceneId } from '../data/scenes';
import { ChoiceButtons } from './ChoiceButtons';
import { computeAtmosphere } from '../engine/atmosphere';

interface Props {
  node: GameNode;
  stats: Stats;
  feedback: string | null;
  onAdvance: () => void;
  onChoose: (index: number) => void;
}

export function NarrativeScreen({ node, stats, feedback, onAdvance, onChoose }: Props) {
  const gradient = SCENE_GRADIENT[node.scene as SceneId] ?? SCENE_GRADIENT['bedroom-night'];
  const { vignette, tremor } = computeAtmosphere(stats, node);
  const shownText = feedback ?? node.text;

  return (
    <div className="relative flex h-full flex-col items-center justify-center px-6" style={{ background: gradient }}>
      {/* 疲惫暗角：疲惫值越高越重 */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-1000"
        style={{ boxShadow: 'inset 0 0 120px 60px rgba(0,0,0,0.9)', opacity: vignette }}
      />
      <div className={`max-w-2xl whitespace-pre-line text-center text-lg leading-loose md:text-2xl md:leading-loose ${tremor ? 'animate-pulse' : ''}`}>
        {shownText}
      </div>
      <div className="mt-12 flex justify-center">
        {feedback !== null ? (
          <button
            type="button"
            onClick={onAdvance}
            className="rounded-full border border-current px-10 py-3 text-base transition-colors hover:bg-white/10"
          >
            继续
          </button>
        ) : node.type === 'choice' && node.choices ? (
          <ChoiceButtons choices={node.choices} onChoose={onChoose} />
        ) : node.type === 'narration' ? (
          <button
            type="button"
            onClick={onAdvance}
            className="rounded-full border border-current px-10 py-3 text-base transition-colors hover:bg-white/10"
          >
            继续
          </button>
        ) : null}
      </div>
    </div>
  );
}
