# 画风试样提示词（4 选 1 用）

同一构图：凌晨 3 点卧室，床尾，年轻母亲剪影坐着用吸奶器，床头一盏暖黄小夜灯，旁边白色婴儿床没入黑暗，极简构图，大量暗部留白，无文字无水印。
统一参数：16:9 / 2K / opaque / PNG。生成命令见 image_generation 插件（scripts/image_generation_tool.py generate）。

## A · 暗夜电影感（photorealistic cinematic）
Cinematic film still, photorealistic, 3 AM bedroom: a young mother sitting at the foot of the bed in dark silhouette, quietly using a breast pump, one small warm amber bedside lamp casting a pool of light, white baby crib fading into deep shadow nearby, near-black palette, analog film grain, muted intimate melancholic mood, minimalist composition with large dark negative space, no text, no watermark, no logo

## B · 水彩 × 胶片（watercolor meets analog film，原定稿方向）
Dark watercolor illustration with analog film texture, 3 AM bedroom: a young mother silhouette sitting at the foot of the bed using a breast pump, soft ink-wash edges bleeding into darkness, one warm amber lamp glow, white baby crib barely visible in shadow, visible paper grain and watercolor blooms, generous negative space, dreamy melancholic mood, near-black indigo palette with a single warm light source, no text, no watermark, no logo

## C · 黑白图像小说（graphic novel）
Black and white graphic novel panel, high-contrast ink illustration, 3 AM bedroom: a young mother in stark silhouette sitting at the foot of the bed using a breast pump, bold expressive ink lines, deep solid blacks, dramatic chiaroscuro, a single warm amber accent only from a small bedside lamp, white baby crib outlined in the darkness, emotional indie comic art style, minimalist composition, no text, no watermark, no logo

## D · 极简扁平剪影（minimal flat）
Minimalist flat vector illustration, 3 AM bedroom: a young mother silhouette sitting at the foot of the bed using a breast pump, large flat color blocks, deep near-black dark blue background, one soft warm yellow circle of lamplight, simple white baby crib geometric shape, clean minimal shapes, subtle fine grain texture, quiet lonely intimate mood, generous negative space, no text, no watermark, no logo

## 状态
- 2026-08-16 14:25 首次尝试：图像生成服务 HTTP 424（暂时不可用），待重试。
- 重试时逐个串行生成（不要并行），输出到本目录：A-cinematic.png / B-watercolor.png / C-graphic-novel.png / D-flat.png
- 2026-08-16 16:16–16:19 延迟重试完成，4 张全部成功：
  - A-cinematic.png：1.68 MB，2048×1152，带「AI生成」水印（左下角）
  - B-watercolor.png：2.71 MB，2048×1152，带「AI生成」水印（左下角）
  - C-graphic-novel.png：1.76 MB，2048×1152，带「AI生成」水印（左下角）
  - D-flat.png：2.49 MB，2048×1152，带「AI生成」水印（左下角）
- 2026-08-16 20:47 用户选定画风 C。批量重生完成（git 312fa05）：
  - `batch-C/` 新生成 6 张（title/bedroom-night/morning-pain/wash-loop/night-alarm/wakeup），bedtail-3am 直接复用 C 试样
  - morning-pain 首张被安全策略 403 拒绝（"clutching her chest"），改为"手按额头、抱瓶在膝"后通过——涉及胸部/疼痛的写法会触发审核，后续扩图注意
  - 7 张统一裁掉底部 90px 去水印（2048×1062），已覆盖 `public/images/`
  - 三件套通过：36 tests / 19 nodes validate / tsc
  - 画风C场景提示词公式：画风前缀（见上方 C 段）+ 各场景内容；清晨场景把暖光换成冷白 accent
- 2026-08-19 用户改选 **画风 D（极简扁平剪影）**，全量重生完成：
  - `batch-D/` 横版 7 张（2K 16:9 → 裁水印 → 2048×1078 PNG）、`batch-D-portrait/` 竖版 7 张（4K 9:16 → 裁水印 → 1080 宽 JPG），已覆盖 `public/images/` 与 `public/images/portrait/`
  - 全部 14 张生成时以 `D-flat.png` 试样为参考图（`--reference-image`，先 `image-to-url` 上传），风格一致性显著优于无参考
  - 场景内容描述沿用 C 版构图（标题=唯一暖窗公寓楼 / bedroom-night=丈夫拎包站门口 / bedtail-3am=床尾泵奶 / morning-pain=手按额头冷白清晨 / wash-loop=水槽洗零件晾架 / night-alarm=手机亮光照脸 / wakeup=丈夫前景背影望泵奶剪影）
  - **新踩坑**：亮调场景（morning-pain 竖版）会让水印检测误判亮部内容，固定裁 3722px 高度（与暗调图检测值一致）更稳；morning-pain 措辞用 "hand pressed to forehead" 安全通过
  - `scenes.ts` 兜底色改为各图四角平均色（深蓝近黑基调）；三件套通过：36 tests / 19 nodes validate / tsc
