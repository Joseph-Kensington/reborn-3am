interface Props {
  onStart: () => void;
}

export function TitleScreen({ onStart }: Props) {
  return (
    <div className="relative flex h-full flex-col items-center justify-center gap-8 bg-[#0b0b10] px-6 text-center">
      <h1 className="font-narrative text-3xl leading-relaxed md:text-5xl">重生之我在凌晨三点奶娃娃</h1>
      <p className="text-base opacity-70 md:text-lg">—— 一位工程师的梦</p>
      <button
        type="button"
        onClick={onStart}
        className="mt-8 rounded-full border border-current px-10 py-3 text-lg transition-colors hover:border-[#3898ec] hover:bg-white/10"
      >
        开始
      </button>
      <p className="absolute bottom-8 text-xs opacity-40">建议佩戴耳机 · 全程约 6–8 分钟</p>
    </div>
  );
}
