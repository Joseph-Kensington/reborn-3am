import { useEffect, useState } from 'react';

/** 是否竖屏（手机竖持）；jsdom 等无 matchMedia 的环境一律按横屏处理 */
export function usePortrait(): boolean {
  const query = '(orientation: portrait)';
  const [portrait, setPortrait] = useState<boolean>(() =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia(query).matches
      : false,
  );
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia(query);
    const onChange = (e: MediaQueryListEvent) => setPortrait(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return portrait;
}
