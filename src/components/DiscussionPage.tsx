import { DISCUSSION_QUESTIONS } from '../config';

export function DiscussionPage() {
  return (
    <div className="mt-16 w-full max-w-2xl border-t border-white/15 pt-10">
      <h2 className="mb-6 text-center text-base opacity-60">会议讨论</h2>
      <ol className="flex list-decimal flex-col gap-4 pl-6 text-left text-base leading-relaxed opacity-80">
        {DISCUSSION_QUESTIONS.map((q) => (
          <li key={q}>{q}</li>
        ))}
      </ol>
    </div>
  );
}
