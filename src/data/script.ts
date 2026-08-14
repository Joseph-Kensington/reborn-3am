import type { Script } from '../engine/types';

/**
 * 《重生之我在凌晨三点奶娃娃》全量剧本。
 * 改文案、调节点、换顺序只动本文件；改完跑 `npm run validate`。
 * 文案规范：全中文；不使用斜体；\n 为段落分隔。
 */
export const script: Script = {
  // ========== 第一幕 · 丈夫 ==========
  'a1-n1': {
    id: 'a1-n1',
    scene: 'bedroom-night',
    type: 'narration',
    text: '晚上 11 点，陈俊生加班回到家。\n妻子罗子君已经睡了。产后第四个月，她瘦了一圈。\n床头放着吸奶器。水盆里，泡着拆开的零件。',
    next: 'a1-n2',
  },
  'a1-n2': {
    id: 'a1-n2',
    scene: 'bedroom-night',
    type: 'choice',
    text: '他看着那盆零件。',
    choices: [
      {
        label: '假装没看见，躺床上直接睡觉',
        feedback: '他把水盆往桌子底下推了推，像推开一件和自己无关的事。',
        next: 'a1-n3',
      },
      {
        label: '帮妻子认认真真洗干净每个零件，到凌晨 1 点才睡',
        feedback: '他洗完 6 个零件，颇有成就感地睡了。\n他不知道，这只是她每天的六分之一。',
        next: 'a1-n3',
      },
    ],
  },
  'a1-n3': {
    id: 'a1-n3',
    scene: 'bedroom-night',
    type: 'qte',
    text: '凌晨 1 点半，手机在床头柜上震动起来。\n屏幕亮着两个字：凌玲。',
    qte: {
      timeoutMs: 2500,
      buttonLabel: '挂断',
      successNext: 'a1-n3-s',
      failNext: 'a1-n3-f',
    },
  },
  'a1-n3-s': {
    id: 'a1-n3-s',
    scene: 'bedroom-night',
    type: 'narration',
    text: '你赶在子君翻身前挂断了。\n呼——',
    next: 'a1-n4',
  },
  'a1-n3-f': {
    id: 'a1-n3-f',
    scene: 'bedroom-night',
    type: 'narration',
    text: '子君迷迷糊糊地问："谁啊，这么晚？"\n"……打错了。"\n她翻了个身，又睡了。你盯着天花板，很久。',
    next: 'a1-n4',
  },
  'a1-n4': {
    id: 'a1-n4',
    scene: 'bedroom-night',
    type: 'choice',
    text: '凌晨 3 点，闹钟响了。\n子君轻手轻脚地起床，摸黑拿起了吸奶器。',
    choices: [
      {
        label: '被惊醒，但太疲惫，说："你自己弄吧……"',
        feedback: '她"嗯"了一声，声音里听不出情绪。',
        next: 'a1-n5',
      },
      {
        label: '什么都不说，继续装睡',
        feedback: '她一个人走进了黑暗里。你听着她摸索的声音。',
        next: 'a1-n5',
      },
    ],
  },
  'a1-n5': {
    id: 'a1-n5',
    scene: 'bedroom-night',
    type: 'narration',
    text: '你沉沉睡去。\n然后，你做了一个梦。',
    next: 'a2-s1-n1',
  },

  // ========== 第二幕 · 梦中，你成为了她 ==========
  'a2-s1-n1': {
    id: 'a2-s1-n1',
    scene: 'bedtail-3am',
    type: 'narration',
    text: '凌晨 3 点。\n你是罗子君。\n你独自坐在床尾，台灯调到最暗。吸奶器冰凉的喇叭罩贴上胸口。\n三步外的小床上，宝宝睡得正香。身边，丈夫背对着你，睡得很沉。',
    next: 'a2-s1-n2',
  },
  'a2-s1-n2': {
    id: 'a2-s1-n2',
    scene: 'bedtail-3am',
    type: 'choice',
    text: '选哪个档位？',
    choices: [
      {
        label: '标准档——吸得干净，但声音大',
        feedback: '嗡嗡声在夜里格外清楚。十分钟后，宝宝哭了。\n你拔掉吸奶器去哄，奶洒了一点在衣服上。哄睡回来，一切重来。',
        effects: { fatigue: 2 },
        next: 'a2-s2-n1',
      },
      {
        label: '静音档——安静，但吸不干净',
        feedback: '你盯着天花板，坐了三十分钟。\nAPP 显示：60ml。昨天这个时候是 90ml。\n你盯着那个数字，心一点一点往下沉。',
        effects: { fatigue: 1 },
        next: 'a2-s2-n1',
      },
    ],
  },
  'a2-s2-n1': {
    id: 'a2-s2-n1',
    scene: 'morning-pain',
    type: 'narration',
    text: '清晨 7 点，第二次泵奶。\n喇叭罩贴上来的一瞬间，一阵针扎似的疼。\n你倒吸一口凉气。',
    next: 'a2-s2-n2',
  },
  'a2-s2-n2': {
    id: 'a2-s2-n2',
    scene: 'morning-pain',
    type: 'choice',
    text: '疼痛没有停。怎么办？',
    choices: [
      {
        label: '忍着继续——宝宝等着吃',
        feedback: '二十分钟，每一秒都像二十分钟那么长。\n疼痛让奶阵出不来，吸出来的比平时更少。',
        effects: { pain: 2, fatigue: 1 },
        next: 'a2-s3-n1',
      },
      {
        label: '停下来，翻说明书',
        feedback: '说明书第 14 页：喇叭罩需要按尺寸选择。\n你找来软尺量了——你需要的尺寸，家里没有。\n下单。配件到货要三天。\n这三天，只能继续疼。',
        effects: { pain: 1 },
        next: 'a2-s3-n1',
      },
    ],
  },
  'a2-s3-n1': {
    id: 'a2-s3-n1',
    scene: 'wash-loop',
    type: 'choice',
    text: '上午 10 点，泵完奶。\n法兰、阀门、隔膜、奶杯、导管、底座——6 个零件等着洗。',
    choices: [
      {
        label: '拆开，清洗，消毒，晾干',
        feedback: '第 1 遍。指尖被热水烫得发红。',
        effects: { fatigue: 1 },
        next: 'a2-s3-n2',
      },
    ],
  },
  'a2-s3-n2': {
    id: 'a2-s3-n2',
    scene: 'wash-loop',
    type: 'choice',
    text: '下午 1 点。又泵完了。\n还是那 6 个零件。',
    choices: [
      {
        label: '再洗一遍',
        feedback: '第 2 遍。晾架上密密麻麻，像一座小小的、永远晾不干的森林。',
        effects: { fatigue: 1 },
        next: 'a2-s3-n3',
      },
    ],
  },
  'a2-s3-n3': {
    id: 'a2-s3-n3',
    scene: 'wash-loop',
    type: 'choice',
    text: '下午 4 点。又泵完了。\n还是那 6 个零件。',
    choices: [
      {
        label: '……再洗一遍',
        feedback: '第 3 遍。\n这就烦了？\n她每天要重复 6 次。',
        effects: { fatigue: 1 },
        next: 'a2-s4-n1',
      },
    ],
  },
  'a2-s4-n1': {
    id: 'a2-s4-n1',
    scene: 'night-alarm',
    type: 'narration',
    text: '深夜 11 点，最后一次。\n你靠在床头，累到连抬手的力气都没有。\n你拿起手机，设好明天凌晨 3:00 的闹钟。\n屏幕的光照在脸上。\n明天，会和今天一模一样。',
    next: 'a3-n1',
  },

  // ========== 第三幕 · 惊醒 ==========
  'a3-n1': {
    id: 'a3-n1',
    scene: 'wakeup',
    type: 'narration',
    text: '你猛然惊醒。\n凌晨 3:04。\n台灯下，床尾坐着一个沉默的背影——是子君，正在泵奶。\n和梦里，一模一样。',
    next: 'a3-n2',
  },
  'a3-n2': {
    id: 'a3-n2',
    scene: 'wakeup',
    type: 'choice',
    text: '',
    choices: [
      {
        label: '轻轻走过去',
        feedback: '你走过去，在她身边坐下。\n没有说话。\n她也没有。',
        next: 'a3-n3',
      },
    ],
  },
  'a3-n3': {
    id: 'a3-n3',
    scene: 'datacard',
    type: 'datacard',
    text: '',
    cards: [
      '哺乳期妈妈平均每 2–3 小时泵一次奶，每天 6–8 次',
      '一次拆洗 6 个零件 × 每天 6 次 = 36 次',
      '53% 的用户把静音列为购买吸奶器的第一指标',
      '喇叭罩尺寸不合适是疼痛的首要原因，多数妈妈不知道需要测量',
      '她经历的每一天，对他只是一场梦。',
    ],
    next: 'a3-n4',
  },
  'a3-n4': {
    id: 'a3-n4',
    scene: 'datacard',
    type: 'end',
    text: '愿每一个她，都被看见。\n—— 谨以此 demo，献给我们产品的每一位用户',
  },
};
