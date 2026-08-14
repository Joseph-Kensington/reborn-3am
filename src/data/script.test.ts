import { describe, it, expect } from 'vitest';
import { script } from './script';
import { validateScript } from '../engine/validateScript';
import { START_NODE } from '../engine/types';

describe('正式剧本', () => {
  it('通过剧情图校验', () => {
    expect(validateScript(script)).toEqual([]);
  });

  it('包含 19 个节点（含凌玲彩蛋 QTE 的两个结果节点），起点为 a1-n1', () => {
    expect(Object.keys(script)).toHaveLength(19);
    expect(script[START_NODE].type).toBe('narration');
  });

  it('凌玲彩蛋只在第一幕出现一次，且为 qte 节点', () => {
    const qteNodes = Object.values(script).filter((n) => n.type === 'qte');
    expect(qteNodes).toHaveLength(1);
    expect(qteNodes[0].id).toBe('a1-n3');
    expect(qteNodes[0].text).toContain('凌玲');
  });

  it('结局数据卡与 spec §3.1 逐字一致', () => {
    expect(script['a3-n3'].cards).toEqual([
      '哺乳期妈妈平均每 2–3 小时泵一次奶，每天 6–8 次',
      '一次拆洗 6 个零件 × 每天 6 次 = 36 次',
      '53% 的用户把静音列为购买吸奶器的第一指标',
      '喇叭罩尺寸不合适是疼痛的首要原因，多数妈妈不知道需要测量',
      '她经历的每一天，对他只是一场梦。',
    ]);
  });

  it('拆洗循环恰好三轮，第三轮点题', () => {
    expect(script['a2-s3-n3'].choices?.[0].feedback).toContain('她每天要重复 6 次');
  });

  it('终点节点 a3-n4 类型为 end', () => {
    expect(script['a3-n4'].type).toBe('end');
  });
});
