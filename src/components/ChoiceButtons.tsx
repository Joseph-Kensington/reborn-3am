import { useState } from 'react';
import type { Choice } from '../engine/types';

interface Props {
  choices: Choice[];
  onChoose: (index: number) => void;
}

export function ChoiceButtons({ choices, onChoose }: Props) {
  const [locked, setLocked] = useState(false);

  const handleClick = (index: number) => {
    if (locked) return;
    setLocked(true);
    onChoose(index);
    window.setTimeout(() => setLocked(false), 600);
  };

  return (
    <div className="flex w-full max-w-xl flex-col gap-4">
      {choices.map((choice, i) => (
        <button
          key={`${choice.label}-${i}`}
          type="button"
          disabled={locked}
          onClick={() => handleClick(i)}
          className="rounded-lg border border-white/25 px-6 py-4 text-left text-base leading-relaxed transition-colors hover:border-white/60 hover:bg-white/5 disabled:opacity-50 md:text-lg"
        >
          {choice.label}
        </button>
      ))}
    </div>
  );
}
