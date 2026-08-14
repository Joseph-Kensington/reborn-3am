import type { GameNode } from '../engine/types';
import { DISCUSSION_ENABLED } from '../config';
import { DiscussionPage } from './DiscussionPage';

interface Props {
  node: GameNode;
}

export function EndScreen({ node }: Props) {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-black px-6">
      <div className="max-w-2xl whitespace-pre-line text-center text-xl leading-loose md:text-2xl">
        {node.text}
      </div>
      {DISCUSSION_ENABLED ? <DiscussionPage /> : null}
    </div>
  );
}
