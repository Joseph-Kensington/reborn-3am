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

## 公网部署（GitHub Pages，2026-08-18 上线）

- 线上地址：**https://joseph-kensington.github.io/reborn-3am/**（公开仓库，任何人可玩）
- 仓库：https://github.com/Joseph-Kensington/reborn-3am（main = 源码，gh-pages = 构建产物）
- 部署适配：vite 构建用相对 base（`./`），图片/音频路径经 `import.meta.env.BASE_URL` 自适应子路径
- 重新部署流程：改完代码跑三件套 → 提交推 main → `npm run build` → `cd dist && git init -q -b gh-pages && git add -A && git commit -q -m "deploy" && git push -f https://github.com/Joseph-Kensington/reborn-3am.git gh-pages`（gh-pages 分支推送后 Pages 自动重新构建，约 1 分钟生效）
- 注意：`npx gh-pages` 在本机超时不可用，用上面的手工 dist 推送法；gh 二进制在 `workspace/.tools/gh`

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

**补充游戏的画面与声音**（用户原话）。

### 画面（✅ 已完成 · 2026-08-16）

7 张插画已按用户选定的**画风 C（黑白图像小说：高对比黑白线条 + 唯一暖色光）**重生并接入（git 312fa05）：

- 7 张全换：title / bedroom-night / bedtail-3am / morning-pain / wash-loop / night-alarm / wakeup，统一 2048×1062（裁掉底部 90px 去除生成服务自动叠加的"AI生成"水印，CSS cover 背景不受影响）
- 试样图、4 组画风提示词、批量生成记录与安全策略踩坑（胸部/疼痛措辞触发 403）均存档于 `docs/style-samples/`（prompts.md + contact-sheet.jpg + batch-C/）
- 三件套已通过：36 tests / 19 nodes validate / tsc

- 手机竖屏 ✅（git 72b9576）：7 张 9:16 竖版重排构图存于 `public/images/portrait/*.jpg`（1080 宽），`scenes.ts` 的 `sceneImage()` 按 `usePortrait()`（matchMedia orientation，jsdom 降级横屏）自动切换；竖版源图与提示词在 `docs/style-samples/batch-C-portrait/`

可选扩展（未做）：更多场景/过场图、结束页配图、讨论页配乐。扩图时复用 `docs/style-samples/prompts.md` 里的画风C提示词公式（画风前缀 + 场景内容，竖版加"vertical portrait composition"），**必须串行生成**（并行触发 HTTP 424）；涉及胸部/疼痛的措辞会触发安全策略 403，用"手按额头"这类间接表达。

### 声音（✅ 已完成 · 2026-08-16，git 1ad9126）

- 5 个 AI 生成音效已接入 `public/audio/`：alarm / baby-cry / pump-standard / pump-silent / night-ambience
- 架构：`config.ts` 有 `AUDIO_ENABLED` 开关（默认 true）；`src/audio/sfx.ts` 为音效登记表；`AudioManager` 单例负责首击解锁（浏览器自动播放限制）、循环底声切换（600ms 淡出）、失败静默降级（无声可完整通关）
- 剧本标注规范：`GameNode.sfx` / `Choice.sfx`（取值见 sfx.ts，`'stop'` 停当前循环）/ `Choice.feedbackSfx`（延迟跟出）；校验器会检查音效合法性
- 当前标注：a1-n1 底噪起 / a1-n3 凌玲来电手机震动 / a1-n4 闹钟 / 标准档→泵声+哭声跟出 / 静音档→轻泵声 / 拆洗停泵声 / 深夜回底噪 / 数据卡淡出
- 踩坑：jsdom 里 `HTMLMediaElement.play()` 不返回 Promise，必须经 `safePlay` 包装（否则测试环境 TypeError）
- 可扩展：讨论页/结束页配乐（未做）

注意 `spec` 非目标：无存档、无多结局、无后端、无英文版

## 会话约束（新对话同样适用）

- 不使用 Agent/subagent，除非用户明确要求
- 生成物一律放 `/Users/miriam/Documents/kimi/workspace` 内
- 用户偏好：简体中文、结构化编号/表格、轻量化可迭代工具、落地细节要求高
