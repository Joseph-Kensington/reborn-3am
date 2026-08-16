import { useEffect, useRef, useState } from 'react';
import type { GameNode } from '../engine/types';
import { SCENE_GRADIENT, sceneImage, type SceneId } from '../data/scenes';
import { usePortrait } from '../hooks/usePortrait';

interface Props {
  node: GameNode;
  onResult: (success: boolean) => void;
}

export function QTEOverlay({ node, onResult }: Props) {
  const qte = node.qte!;
  const firedRef = useRef(false);
  const [shaking, setShaking] = useState(true);
  const gradient = SCENE_GRADIENT[node.scene as SceneId] ?? SCENE_GRADIENT['bedroom-night'];
  const portrait = usePortrait();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!firedRef.current) {
        firedRef.current = true;
        onResult(false);
      }
    }, qte.timeoutMs);
    return () => window.clearTimeout(timer);
  }, [qte.timeoutMs, onResult]);

  const handleHangUp = () => {
    if (firedRef.current) return;
    firedRef.current = true;
    setShaking(false);
    onResult(true);
  };

  return (
    <div
      className="flex h-full flex-col items-center justify-center px-6"
      style={{
        backgroundImage: `url(${sceneImage(node.scene, portrait)})`,
        backgroundColor: gradient,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div
        className="max-w-2xl whitespace-pre-line text-center text-lg leading-loose opacity-80 md:text-xl"
        style={{ textShadow: '0 2px 24px rgba(0,0,0,0.95), 0 0 8px rgba(0,0,0,0.9)' }}
      >
        {node.text}
      </div>
      <div className={`mt-12 flex flex-col items-center gap-6 ${shaking ? 'animate-bounce' : ''}`}>
        <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/30 text-xl">
          凌玲
        </div>
        <button
          type="button"
          onClick={handleHangUp}
          className="rounded-full bg-red-900/80 px-12 py-4 text-lg transition-colors hover:bg-red-800"
        >
          {qte.buttonLabel}
        </button>
      </div>
      <div className="mt-8 h-1 w-48 overflow-hidden rounded bg-white/10">
        <div
          className="h-full bg-white/40"
          style={{ animation: `qte-countdown ${qte.timeoutMs}ms linear forwards` }}
        />
      </div>
      <style>{`@keyframes qte-countdown { from { width: 100%; } to { width: 0%; } }`}</style>
    </div>
  );
}
