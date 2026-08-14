import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { QTEOverlay } from './QTEOverlay';
import type { GameNode } from '../engine/types';

const node: GameNode = {
  id: 'a1-n3',
  scene: 'bedroom-night',
  type: 'qte',
  text: '凌晨 1 点半，手机在床头柜上震动起来。\n屏幕亮着两个字：凌玲。',
  qte: { timeoutMs: 2500, buttonLabel: '挂断', successNext: 'a1-n3-s', failNext: 'a1-n3-f' },
};

afterEach(() => {
  vi.useRealTimers();
});

describe('QTEOverlay（凌玲彩蛋）', () => {
  it('渲染来电界面与挂断按钮', () => {
    render(<QTEOverlay node={node} onResult={() => undefined} />);
    // “凌玲”同时出现在叙事文案与来电头像中
    expect(screen.getAllByText(/凌玲/).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: '挂断' })).toBeInTheDocument();
  });

  it('限时内点击挂断 → onResult(true)', () => {
    vi.useFakeTimers();
    const onResult = vi.fn();
    render(<QTEOverlay node={node} onResult={onResult} />);
    act(() => {
      screen.getByRole('button', { name: '挂断' }).click();
    });
    expect(onResult).toHaveBeenCalledWith(true);
  });

  it('超时未点 → onResult(false)', () => {
    vi.useFakeTimers();
    const onResult = vi.fn();
    render(<QTEOverlay node={node} onResult={onResult} />);
    act(() => {
      vi.advanceTimersByTime(2600);
    });
    expect(onResult).toHaveBeenCalledWith(false);
  });

  it('结果只触发一次', () => {
    vi.useFakeTimers();
    const onResult = vi.fn();
    render(<QTEOverlay node={node} onResult={onResult} />);
    act(() => {
      screen.getByRole('button', { name: '挂断' }).click();
      vi.advanceTimersByTime(5000);
    });
    expect(onResult).toHaveBeenCalledTimes(1);
  });
});
