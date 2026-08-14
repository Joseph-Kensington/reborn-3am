import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DataCardSequence } from './DataCardSequence';
import type { GameNode } from '../engine/types';

const node: GameNode = {
  id: 'a3-n3',
  scene: 'datacard',
  type: 'datacard',
  text: '',
  cards: ['卡一', '卡二', '卡三'],
  next: 'a3-n4',
};

describe('DataCardSequence', () => {
  it('首屏只展示第一张卡片', () => {
    render(<DataCardSequence node={node} onDone={() => undefined} />);
    expect(screen.getByText('卡一')).toBeInTheDocument();
    expect(screen.queryByText('卡二')).not.toBeInTheDocument();
  });

  it('点击逐张推进，最后一张再点击触发 onDone', async () => {
    const user = userEvent.setup();
    const onDone = vi.fn();
    render(<DataCardSequence node={node} onDone={onDone} />);
    await user.click(screen.getByRole('button', { name: '继续' }));
    expect(screen.getByText('卡二')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '继续' }));
    expect(screen.getByText('卡三')).toBeInTheDocument();
    expect(onDone).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: '继续' }));
    expect(onDone).toHaveBeenCalledTimes(1);
  });
});
