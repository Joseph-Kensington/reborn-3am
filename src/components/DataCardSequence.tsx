import { useState } from 'react';
import type { GameNode } from '../engine/types';

interface Props {
  node: GameNode;
  onDone: () => void;
}

export function DataCardSequence({ node, onDone }: Props) {
  const cards = node.cards ?? [];
  const [index, setIndex] = useState(0);
  const isLast = index === cards.length - 1;

  const handleNext = () => {
    if (isLast) {
      onDone();
    } else {
      setIndex((i) => i + 1);
    }
  };

  return (
    <div className="flex h-full flex-col items-center justify-center bg-black px-6">
      <div
        className={`max-w-2xl whitespace-pre-line text-center leading-loose ${
          isLast ? 'text-2xl md:text-4xl' : 'text-lg opacity-90 md:text-2xl'
        }`}
      >
        {cards[index]}
      </div>
      <button
        type="button"
        onClick={handleNext}
        className="mt-16 rounded-full border border-white/20 px-10 py-3 text-sm opacity-60 transition-opacity hover:opacity-100"
      >
        继续
      </button>
      <div className="mt-6 text-xs opacity-30">
        {index + 1} / {cards.length}
      </div>
    </div>
  );
}
