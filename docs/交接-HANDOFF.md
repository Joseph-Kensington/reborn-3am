# 交接文档 · reborn-3am（新对话开场让我读我）

> 给新对话的 AI：读这份文档即可恢复全部上下文。本项目所有事实以**本文件 + git 历史 + 代码**为准。
> 给用户：新对话里直接发——「继续 reborn-3am 项目，先读 `reborn-3am/docs/交接-HANDOFF.md`」

## 项目是什么

网页互动剧情游戏 demo：**《重生之我在凌晨三点奶娃娃》**（副标题：—— 工程师竟与妻子"灵魂互换"）。
目的：让 momcozy 吸奶器产品线的男性工程师代入女性用户痛点。全中文，单次 5–6 分钟。
叙事结构：丈夫陈俊生旁观 → 凌晨 3 点梦境灵魂互换成为妻子罗子君 → 经历四个痛点场景（噪音/喇叭罩尺寸/拆洗循环/凌晨孤独）→ 惊醒 → 数据卡结局。彩蛋：第一幕"凌玲"深夜来电，2.5 秒限时挂断（只出现一次、不解释、不进结局）。

## 位置与运行

- 项目根：`/Users/miriam/Documents/kimi/workspace/reborn-3am`（独立 git 仓库）
- 启动：`npm run dev`（vite，支持 `--port` 透传）；交付预览链接约定为 `http://localhost:7100/`
- **铁律：任何临时 dev server 用完必须 kill，不留后台进程**
- 三件套验证：`npm test`（36 个用例）+ `npm run validate`（剧情图校验：19 节点）+ `npx tsc --noEmit`

## 架构速览（剧本即数据）

```
src/
├── config.ts                 # DISCUSSION_ENABLED（讨论页开关，默认 false）、DISCUSSION_QUESTIONS
├── data/script.ts            # 全部剧情：19 节点的结构化数据（改文案只动这里）
├── data/scenes.ts            # 7 个场景 id + 平涂底色（近黑 #0a0a00 系，无渐变）
├── engine/
│   ├── types.ts              # GameNode/Choice/Script/GameState/Action；START_NODE='a1-n1'
│   ├── gameEngine.ts         # 纯函数 reduce：START/ADVANCE/CHOOSE/QTE_RESULT
│   ├── validateScript.ts     # 校验器：悬空指针/死路/可达性/场景登记/cards 非空
│   ├── atmosphere.ts         # computeAtmosphere：疲惫→暗角 vignette、疼痛→文字微颤 tremor
│   └── useGameEngine.ts      # useReducer 封装
└── components/               # TitleScreen / NarrativeScreen / ChoiceButtons / QTEOverlay / DataCardSequence / EndScreen / DiscussionPage
scripts/validate-script.ts    # npm run validate 入口
public/images/                # 7 张 2K 插画：title/bedroom-night/bedtail-3am/morning-pain/wash-loop/night-alarm/wakeup
docs/文案稿.md                # 文案唯一事实源（用户可编辑版）
docs/superpowers/specs/       # 设计文档
docs/superpowers/plans/       # 实施计划（11 任务，已全部完成）
```

## 已定稿的关键决策（不要推翻，除非用户明说）

- 视觉 token：近黑平涂 `#0a0a00/#0f0f0f` + 纯白文字 + 唯一交互强调色 `#3898ec`；全屏胶片颗粒层（.film-grain，CSS SVG 噪点 + steps 抖动）；**三声部字体**：叙事宋体(.font-narrative) / UI 黑体 / 数据等宽(.font-data)；中文禁斜体；动效只用透明度交叉淡化
- 状态值无形化：不显示数值条，疲惫值越高暗角越重，疼痛值 ≥2 且 morning-pain 场景触发微颤
- 插画风格：watercolor meets analog film texture、暗调、极简构图、no text；场景图按 `url(/images/{scene}.png)` 接入，平涂底色兜底
- 结局数据卡 5 张文案与"罗子君/陈俊生"点题句为定稿（有测试锚点锁定）
- 用户改文案工作流：用户编辑 `docs/文案稿.md` → AI 同步进 `script.ts`/`TitleScreen.tsx`/`config.ts` → 同步更新测试锚点 → 跑三件套 → 提交

## 待办：用户接下来要做的事

**补充游戏的画面与声音**（用户原话）。现状与接入点：

- 画面：7 张插画已生成并接入。可扩展方向：更多场景/过场图、结束页配图、手机竖屏专用裁切
- 声音：**尚未实现**。要点：
  - 用 `audio_generation` 插件（中文 TTS 音色 + 自定义音效）
  - 浏览器自动播放限制：必须在首次用户点击后才能出声；默认无声可完整通关（spec 非目标条款）
  - 建议音效清单：凌晨闹钟、婴儿啼哭、泵奶器低鸣（标准档大/静音档小）、深夜环境底噪
  - 建议接入：`config.ts` 加 `AUDIO_ENABLED` 开关；`GameNode` 可扩展 `sfx?: string` 字段；App 层做 AudioManager 按场景切换
- 注意 `spec` 非目标：无存档、无多结局、无后端、无英文版

## 会话约束（新对话同样适用）

- 不使用 Agent/subagent，除非用户明确要求
- 生成物一律放 `/Users/miriam/Documents/kimi/workspace` 内
- 用户偏好：简体中文、结构化编号/表格、轻量化可迭代工具、落地细节要求高
