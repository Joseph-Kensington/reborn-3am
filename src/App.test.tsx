import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App 主链路', () => {
  it('从标题页点击进入第一幕第一节点', async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(screen.getByText('重生之我在凌晨三点奶娃娃')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '开始' }));
    expect(screen.getByText(/晚上 11 点，陈俊生加班回到家/)).toBeInTheDocument();
  });

  it('narration 节点点击"继续"推进到选项节点', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: '开始' }));
    await user.click(screen.getByRole('button', { name: '继续' }));
    expect(screen.getByText('他看着那盆零件。')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /假装没看见/ })).toBeInTheDocument();
  });

  it('选项先展示反馈文案，再点"继续"跳转', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: '开始' }));
    await user.click(screen.getByRole('button', { name: '继续' }));
    await user.click(screen.getByRole('button', { name: /假装没看见/ }));
    expect(screen.getByText(/像推开一件和自己无关的事/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '继续' }));
    // 进入凌玲 QTE 节点：叙事文案与来电头像两处含“凌玲”
    expect(screen.getAllByText(/凌玲/).length).toBeGreaterThan(0);
  });
});
