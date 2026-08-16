import { usePortrait } from '../hooks/usePortrait';
import { sceneImage } from '../data/scenes';

interface Props {
  onStart: () => void;
}

export function TitleScreen({ onStart }: Props) {
  const portrait = usePortrait();
  return (
    <div
      className="relative flex h-full flex-col items-center justify-center gap-8 bg-[#0b0b10] px-6 text-center"
      style={{
        backgroundImage: `url(${sceneImage('title', portrait)}), linear-gradient(180deg,#0b0b10,#000)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <h1
        className="font-narrative text-3xl leading-relaxed md:text-5xl"
        style={{ textShadow: '0 2px 24px rgba(0,0,0,0.95), 0 0 8px rgba(0,0,0,0.9)' }}
      >
        重生之我在凌晨三点奶娃娃
      </h1>
      <p className="text-base opacity-70 md:text-lg">—— 工程师竟与妻子“灵魂互换”</p>
      <button
        type="button"
        onClick={onStart}
        className="mt-8 rounded-full border border-current px-10 py-3 text-lg transition-colors hover:border-[#3898ec] hover:bg-white/10"
      >
        开始
      </button>
      <p className="absolute bottom-8 text-xs opacity-40">建议佩戴耳机 · 全程约 5–6 分钟</p>
    </div>
  );
}
