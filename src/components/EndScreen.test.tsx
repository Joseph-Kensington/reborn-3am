import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { GameNode } from '../engine/types';

const node: GameNode = {
  id: 'a3-n4',
  scene: 'datacard',
  type: 'end',
  text: '愿每一个她，都被看见。',
};

describe('EndScreen', () => {
  it('展示结束语', async () => {
    vi.resetModules();
    vi.doMock('../config', () => ({ DISCUSSION_ENABLED: false, DISCUSSION_QUESTIONS: [] }));
    const { EndScreen } = await import('./EndScreen');
    render(<EndScreen node={node} />);
    expect(screen.getByText(/愿每一个她，都被看见/)).toBeInTheDocument();
  });

  it('DISCUSSION_ENABLED 为 true 时展示讨论题', async () => {
    vi.resetModules();
    vi.doMock('../config', () => ({
      DISCUSSION_ENABLED: true,
      DISCUSSION_QUESTIONS: ['问题甲', '问题乙', '问题丙'],
    }));
    const { EndScreen } = await import('./EndScreen');
    render(<EndScreen node={node} />);
    expect(screen.getByText('问题甲')).toBeInTheDocument();
  });

  it('DISCUSSION_ENABLED 为 false 时不展示讨论题', async () => {
    vi.resetModules();
    vi.doMock('../config', () => ({
      DISCUSSION_ENABLED: false,
      DISCUSSION_QUESTIONS: ['问题甲'],
    }));
    const { EndScreen } = await import('./EndScreen');
    render(<EndScreen node={node} />);
    expect(screen.queryByText('问题甲')).not.toBeInTheDocument();
  });
});
