import { AUDIO_ENABLED } from '../config';
import { SFX, type SfxId, type SfxRef } from './sfx';

const FADE_MS = 600;
const FADE_STEPS = 6;

/**
 * 全局音效管理器（单例）。
 * - 浏览器自动播放限制：首次用户点击（标题页「开始」）调用 unlock() 后才允许出声
 * - AUDIO_ENABLED=false 或播放失败时静默降级：游戏可完整无声通关（spec 非目标条款）
 * - 循环底声同时只播一条；切换时旧循环以约 600ms 淡出
 */
class AudioManager {
  private unlocked = false;
  private els = new Map<SfxId, HTMLAudioElement>();
  private fadeTimers = new Map<SfxId, ReturnType<typeof setInterval>>();
  private currentLoop: SfxId | null = null;
  private pendingTimer: ReturnType<typeof setTimeout> | null = null;

  /** 首次用户手势时调用，解除浏览器自动播放限制 */
  unlock(): void {
    if (!AUDIO_ENABLED) return;
    this.unlocked = true;
  }

  /** 节点进入 / 选项选择的统一入口；undefined = 该处无音效标注（仅清理待发音效） */
  handle(ref: SfxRef | undefined): void {
    if (this.pendingTimer) {
      clearTimeout(this.pendingTimer);
      this.pendingTimer = null;
    }
    if (!AUDIO_ENABLED || !this.unlocked || !ref) return;
    if (ref === 'stop') {
      this.stopLoop();
      return;
    }
    if (SFX[ref].loop) this.switchLoop(ref);
    else this.playOnce(ref);
  }

  /** 延迟跟出一次性音效（如泵声先起、哭声稍后跟进） */
  handleLater(id: SfxId, delayMs: number): void {
    if (!AUDIO_ENABLED || !this.unlocked) return;
    if (this.pendingTimer) clearTimeout(this.pendingTimer);
    this.pendingTimer = setTimeout(() => {
      this.pendingTimer = null;
      this.playOnce(id);
    }, delayMs);
  }

  private el(id: SfxId): HTMLAudioElement {
    let e = this.els.get(id);
    if (!e) {
      e = new Audio(SFX[id].src);
      e.preload = 'auto';
      this.els.set(id, e);
    }
    return e;
  }

  /** jsdom 等环境下 play() 可能不返回 Promise 甚至抛错；播放失败一律静默降级 */
  private safePlay(e: HTMLAudioElement, onFail?: () => void): void {
    try {
      const p = e.play() as Promise<void> | undefined;
      if (p && typeof p.catch === 'function') {
        void p.catch(() => onFail?.());
      }
    } catch {
      onFail?.();
    }
  }

  private cancelFade(id: SfxId): void {
    const t = this.fadeTimers.get(id);
    if (t) {
      clearInterval(t);
      this.fadeTimers.delete(id);
    }
  }

  private switchLoop(id: SfxId): void {
    if (this.currentLoop === id) return;
    this.stopLoop();
    this.cancelFade(id);
    this.currentLoop = id;
    const e = this.el(id);
    e.loop = true;
    e.volume = SFX[id].volume;
    e.currentTime = 0;
    this.safePlay(e, () => {
      if (this.currentLoop === id) this.currentLoop = null;
    });
  }

  private stopLoop(): void {
    const id = this.currentLoop;
    this.currentLoop = null;
    if (!id) return;
    this.cancelFade(id);
    const e = this.els.get(id);
    if (!e) return;
    const from = e.volume;
    let step = 0;
    const timer = setInterval(() => {
      step += 1;
      e.volume = Math.max(0, from * (1 - step / FADE_STEPS));
      if (step >= FADE_STEPS) {
        clearInterval(timer);
        this.fadeTimers.delete(id);
        e.pause();
        e.currentTime = 0;
      }
    }, FADE_MS / FADE_STEPS);
    this.fadeTimers.set(id, timer);
  }

  private playOnce(id: SfxId): void {
    this.cancelFade(id);
    const e = this.el(id);
    e.loop = false;
    e.volume = SFX[id].volume;
    e.currentTime = 0;
    this.safePlay(e);
  }
}

export const audioManager = new AudioManager();
