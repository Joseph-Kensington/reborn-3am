# 交接文档 · reborn-3am（新对话开场让我读我）

> 给新对话的 AI：读这份文档即可恢复全部上下文。本项目所有事实以**本文件 + git 历史 + 代码**为准。
> 给用户：新对话里直接发——「继续 reborn-3am 项目，先读 `reborn-3am/docs/交接-HANDOFF.md`」

## 当前状态（2026-08-19）

**核心工作全部完成，游戏已上线公网，可直接发给同事玩。**
画面（画风 C，横版 7 张 + 竖版 7 张）、声音（6 个音效）、手机竖屏适配、GitHub Pages 部署均已闭环；三件套（测试/校验/类型检查）长期全绿。剩余项均为可选扩展，见文末「待办」。

## 项目是什么

网页互动剧情游戏 demo：**《重生之我在凌晨三点奶娃娃》**（副标题：—— 工程师竟与妻子"灵魂互换"）。
目的：让 momcozy 吸奶器产品线的男性工程师代入女性用户痛点。全中文，单次 5–6 分钟。
叙事结构：丈夫陈俊生旁观 → 凌晨 3 点梦境灵魂互换成为妻子罗子君 → 经历四个痛点场景（噪音/喇叭罩尺寸/拆洗循环/凌晨孤独）→ 惊醒 → 数据卡结局。彩蛋：第一幕"凌玲"深夜来电，2.5 秒限时挂断（只出现一次、不解释、不进结局）。

## 线上与本地

- 线上地址：**https://joseph-kensington.github.io/reborn-3am/**（公开仓库，任何人可玩；手机打开自动切竖版画面）
- 仓库：https://github.com/Joseph-Kensington/reborn-3am（main = 源码，gh-pages = 构建产物）
- 项目根：`/Users/miriam/Documents/kimi/workspace/reborn-3am`（独立 git 仓库）
- 本地启动：`npm run dev`（vite，支持 `--port` 透传）；交付预览链接约定为 `http://localhost:7100/`
- **铁律：任何临时 dev server 用完必须 kill，不留后台进程**
- 三件套验证：`npm test`（36 个用例）+ `npm run validate`（剧情图校验：19 节点）+ `npx tsc --noEmit`
- 局域网分享（同 Wi-Fi 临时玩，免部署）：`npx vite preview --host 0.0.0.0 --port 4173`，同事访问 `http://<本机IP>:4173`；本机 IP 用 `ipconfig getifaddr en0` 查（曾用 192.168.0.102）。注意终端窗口不能关、电脑不能合盖、公司网络有 AP 隔离时会拦。

## 重新部署流程（GitHub Pages）

1. 改完代码跑三件套 → 提交并 `git push origin main`
2. `npm run build`
3. `cd dist && git init -q -b gh-pages && git add -A && git commit -q -m "deploy" && git push -f https://github.com/Joseph-Kensington/reborn-3am.git gh-pages`
4. gh-pages 推送后 Pages 自动重新构建，约 1 分钟生效

- 部署适配（已完成）：vite 构建 base 为 `./`，图片/音频路径经 `import.meta.env.BASE_URL` 自适应子路径
- `npx gh-pages` 在本机超时不可用，用上面的手工 dist 推送法
- gh CLI：独立二进制在 `workspace/.tools/gh`（本机无 brew），已登录账号 **Joseph-Kensington**（凭证存系统 keyring，换电脑需重新授权）
- 公开可见提示：仓库公开——结束页文案含 "Momcozy" 字样；提交历史作者为自动生成的 `Miriam <miriam@MiriamdeMacBook-Air.local>`。要下线：GitHub 仓库 Settings → Delete

## 架构速览（剧本即数据）

```
src/
├── config.ts                 # DISCUSSION_ENABLED（讨论页开关，默认 false）、AUDIO_ENABLED（音效开关，默认 true）
├── data/script.ts            # 全部剧情：19 节点的结构化数据（改文案只动这里）；节点/选项可标 sfx/feedbackSfx
├── data/scenes.ts            # 7 个场景 id + 平涂底色 + sceneImage()（竖屏切 portrait/*.jpg）
├── audio/
│   ├── sfx.ts                # 音效登记表（6 个：loop/音量/src，src 前缀随部署 base 自适应）
│   └── AudioManager.ts       # 单例：首击解锁、循环底声 600ms 淡出切换、失败静默降级（无声可通关）
├── hooks/usePortrait.ts      # matchMedia(orientation: portrait)；jsdom 无 matchMedia 时降级横屏
├── engine/
│   ├── types.ts              # GameNode/Choice/Script/GameState/Action；START_NODE='a1-n1'
│   ├── gameEngine.ts         # 纯函数 reduce：START/ADVANCE/CHOOSE/QTE_RESULT
│   ├── validateScript.ts     # 校验器：悬空指针/死路/可达性/场景登记/cards 非空/音效登记
│   ├── atmosphere.ts         # computeAtmosphere：疲惫→暗角 vignette、疼痛→文字微颤 tremor
│   └── useGameEngine.ts      # useReducer 封装
└── components/               # TitleScreen / NarrativeScreen / ChoiceButtons / QTEOverlay / DataCardSequence / EndScreen / DiscussionPage
scripts/validate-script.ts    # npm run validate 入口
public/images/                # 横版 7 张 PNG（2048×1062）：title/bedroom-night/bedtail-3am/morning-pain/wash-loop/night-alarm/wakeup
public/images/portrait/       # 竖版 7 张 JPG（1080×1855），同名
public/audio/                 # 6 个 mp3：night-ambience/alarm/baby-cry/pump-standard/pump-silent/phone-vibrate
docs/文案稿.md                # 文案唯一事实源（用户可编辑版）
docs/style-samples/           # 画风试样、4 组画风提示词（prompts.md）、横竖版生成存档
docs/superpowers/             # 设计文档 + 实施计划（11 任务，已全部完成）
```

## 已定稿的关键决策（不要推翻，除非用户明说）

- 视觉 token：近黑平涂 `#0a0a00/#0f0f0f` + 纯白文字 + 唯一交互强调色 `#3898ec`；全屏胶片颗粒层（.film-grain，CSS SVG 噪点 + steps 抖动）；**三声部字体**：叙事宋体(.font-narrative) / UI 黑体 / 数据等宽(.font-data)；中文禁斜体；动效只用透明度交叉淡化
- 状态值无形化：不显示数值条，疲惫值越高暗角越重，疼痛值 ≥2 且 morning-pain 场景触发微颤
- 插画风格（2026-08-16 用户重选定稿，取代早期"水彩×胶片"）：**画风 C · 黑白图像小说**——高对比黑白线条 + 唯一暖色光、暗调、极简构图、no text；横版 `url(...png)` + 竖版 `portrait/*.jpg` 经 `sceneImage()` 接入，平涂底色用 `backgroundColor` 兜底
- 结局数据卡 5 张文案与"罗子君/陈俊生"点题句为定稿（有测试锚点锁定）
- 用户改文案工作流：用户编辑 `docs/文案稿.md` → AI 同步进 `script.ts`/`TitleScreen.tsx`/`config.ts` → 同步更新测试锚点 → 跑三件套 → 提交

## 已完成大事记

### 画面（2026-08-16，git 312fa05 / 72b9576）

- 用户从 4 个画风试样中选定 **C（黑白图像小说）**；7 张横版重生并接入，2048×1062（裁底部 90px 去"AI生成"水印）
- 手机竖屏：7 张 9:16 竖版重排构图（4K 生成→裁水印→1080 宽 JPG），`usePortrait` + `sceneImage` 自动切换
- **踩坑 1**：曾全部场景黑屏——`SCENE_GRADIENT` 纯色被拼进 `background-image` 致整条声明被浏览器丢弃（修复 7b17c71：url 与底色分离）
- **踩坑 2**：图像生成服务自动叠水印，提示词写 no watermark 无效，只能裁掉；**必须串行生成**（并行触发 HTTP 424）；胸部/疼痛措辞触发 403（改用"手按额头"类间接表达）
- 试样与提示词公式存档 `docs/style-samples/`（prompts.md 是复用入口）

### 声音（2026-08-16，git 1ad9126 / 3e1ce3d）

- 6 个 AI 生成音效接入：night-ambience（循环底噪）/ alarm / baby-cry / pump-standard / pump-silent / phone-vibrate
- 剧本标注：a1-n1 底噪起 / a1-n3 凌玲来电震动 / a1-n4 闹钟 / 标准档→泵声+哭声延迟 1.8s 跟出 / 静音档→轻泵声 / 拆洗停泵声 / 深夜回底噪 / 数据卡淡出
- 浏览器自动播放限制：标题页点「开始」才 unlock；`AUDIO_ENABLED=false` 全局无声
- **踩坑**：jsdom 里 `HTMLMediaElement.play()` 不返回 Promise，必须经 AudioManager 的 `safePlay` 包装

### 公网部署（2026-08-18，git ea17e45 / 2ac2a1a）

见上方「重新部署流程」。设备码授权登录 gh（账号 Joseph-Kensington）→ 建公开仓库 → 相对路径构建 → 手工 dist 推 gh-pages。

## 待办（均为可选扩展，非必须）

- 更多场景/过场图、结束页配图、讨论页配乐
- 扩图/扩音效一律先读 `docs/style-samples/prompts.md` 的画风 C 提示词公式（竖版加 "vertical portrait composition"），并遵守上面的踩坑清单
- `spec` 非目标（不要做）：无存档、无多结局、无后端、无英文版

## 会话约束（新对话同样适用）

- 不使用 Agent/subagent，除非用户明确要求
- 生成物一律放 `/Users/miriam/Documents/kimi/workspace` 内
- 用户偏好：简体中文、结构化编号/表格、轻量化可迭代工具、落地细节要求高
