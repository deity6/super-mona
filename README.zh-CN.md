# Super Mona

[English](README.md) · [中文](README.zh-CN.md)

githubuniverse.com hero 区 `WebGLSuperMona` 的**完整复刻**（工程级，非单文件 demo）。

待机时是一个会跟着鼠标转头的 3D Mona；点 Play 后切换成一款 94×26 方块网格上的横版平台跑酷游戏。

## 快速开始

```bash
npm install
npm run dev        # http://127.0.0.1:5178
```

构建与预览：

```bash
npm run build
npm run preview    # http://127.0.0.1:4173
```

> ⚠️ 必须用 http 打开。`mona2.glb` 与精灵图走 `fetch`，`file://` 协议下会被 CORS 拦掉。

## 操作

| 键 | 行为 |
|---|---|
| `←` `→` / `A` `D` | 左右移动 |
| `Space` | 跳跃（二段跳）；上升时顶到方块会把它撞碎 |
| HUD 右下角喇叭 | 开关音效（偏好写入 localStorage） |

## 工程结构

```
src/
├─ game/
│  ├─ constants.js       全部数值常量（调色板 / 关卡参数 / 物理 / 10 组音效预设 / 像素字模）
│  ├─ shaders.js         7 套 GLSL：网格渐隐、Mona 精灵、残影、虫子图集、脸部、瞳孔、转场
│  ├─ rng.js             Lehmer PRNG（原 MINSTD）+ Fisher–Yates
│  ├─ utils.js           格子坐标↔世界坐标换算、AABB 相交、隐藏矩阵
│  ├─ Gradient.js        拾取物的三停渐变材质（见下文「配色」）
│  ├─ Grid.js            网格线（InstancedMesh，随 scrollX 循环平移）
│  ├─ BlockField.js      地形方块（2048 实例 = 512 方块 × 4 图块，含破坏飞散动画）
│  ├─ Bug.js             虫子图集 + 虫子实体（巡逻 / 站台 / 踩扁 / 击飞）
│  ├─ MonaSheet.js       Mona 精灵动画状态机 + 残影材质
│  ├─ Mona.js            玩家角色（物理 / 残影历史插值 / 无敌闪烁）
│  ├─ Ducky.js           鸭子（等待 / 跟随 / 离开 / 拾取物磁吸）
│  ├─ Pickup.js          拾取物（mega 4×4 / 普通 3×3 + 贡献图标自动裁边）
│  ├─ ScorePopups.js     分数飘字（3×5 像素字模，mega 走闪烁 shader）
│  ├─ GameOver.js        结算板（Mona 在框内无限跑跳）+ GAME OVER 像素字
│  ├─ LevelGenerator.js  关卡生成（flat / raised / stairs / bridge + bag shuffle）
│  ├─ Sfx.js             WebAudio 实时合成音效（振荡器 + 噪声 + 卷积混响）
│  ├─ OpeningScene.js    待机场景（GLB Mona + 程序化材质 + 鼠标跟随）
│  ├─ Transition.js      转场彩条（6 层，uOffsetY -2 → 0 → 2）
│  ├─ Engine.js          引擎（双场景 / 正交相机 / 尺寸与可见性同步）
│  ├─ DemoRunner.js      SOFT LAB 首页卡片上那段循环演示
│  └─ Game.js            游戏主循环
└─ ui/
   ├─ SuperMona.jsx      React 顶层组件（HUD / 按钮状态机 / 高分 / 降级）
   ├─ SuperMona.module.css  原站 chunk 4963 的样式逐条翻译
   └─ page.css           demo 页面外壳
public/assets/           全部为原站文件
```

## 资源

`public/assets/` 下 11 个文件全部下载自 githubuniverse.com 原始路径，未做任何修改：

| 文件 | 用途 |
|---|---|
| `mona2.glb` | 待机场景的 3D Mona（9 mesh / 264 KB） |
| `UniverseGameSet_01.png` | Mona 游戏精灵表（130×135，5×5 帧，每帧 26×27） |
| `UniverseBug_02.png` | 虫子精灵表（78×81，9 帧，Aseprite 元数据已内联） |
| `DuckGame_02.png` | 鸭子（16×15） |
| `HeartGame.png` | 生命图标（16×15） |
| `ContributionIcon_1..5.png` | 拾取物中心图标 |
| `super-mona-fallback.webp` | WebGL 不可用时的降级图 |
| `fonts/MonaSansVF-opsz-wght.woff2` | Mona Sans 可变字体（weight 200–900），眉标与正文 |
| `fonts/MonaSansMonoVF-wght.woff2` | Mona Sans Mono 可变字体，眉标与 `kbd` 提示 |

## 还原度对照

### 渲染管线

| 原站 | 本实现 |
|---|---|
| Three.js r182 + WebGL2 | Three.js 0.186 + WebGL2 ✓ |
| 正交相机（游戏世界，frustum 随画布尺寸变） | `Engine.js` 中的 `worldCamera` ✓ |
| PerspectiveCamera **fov=10**（待机场景） | `OpeningScene.js` ✓ |
| 网格线 InstancedMesh + 左侧渐隐 shader | `Grid.js` + `GRID_FADE_*` ✓ |
| 方块 InstancedMesh（2048 实例） | `BlockField.js` ✓ |
| 虫子 InstancedMesh（128）+ 自定义 instance 属性传 UV | `Bug.js` ✓ |
| Mona 精灵用 ShaderMaterial，Super 态彩虹流动 | `MonaSheet.js` + `applySuperMona()` ✓ |
| 残影用 6 色循环 + HSL 偏移 | `Mona.js` `updateTrails()` ✓ |
| 待机 Mona 的 9 个部件重建：Face 四色渐变 / Pupil 噪点+高光 / 眼睛整组镜像 / 对称部件几何合并 | `OpeningScene.js` ✓ |
| 转场 6 层彩条扫屏 | `Transition.js` ✓ |

### 玩法与数值

| 项 | 原站值 | 本实现 |
|---|---|---|
| 网格 | 94 × 26（窄屏 67 × 26） | 同 ✓ |
| 角色宽 / 碰撞宽 | 3 格 / 2.6 格 | 同 ✓ |
| MOVE_SPEED / JUMP_SPEED | 21 / 30 | 同 ✓ |
| 重力 | 64 | 同 ✓ |
| 跳跃次数 | 2（二段跳） | 同 ✓ |
| 滚动速度 | 2 → 20 格/秒（+0.2/秒） | 同 ✓ |
| 道具时长衰减 | 最高缩短 25% | 同 ✓ |
| 关卡 pattern | flatLong / flatShort / raised / stairsUp / stairsDown / bridge | 同 ✓ |
| bag shuffle 权重 | 下排 7 张、上排 5 张 | 同 ✓ |
| 上下排高度范围 | 4–12 / 17–19 | 同 ✓ |
| 垂直最小间距 | 3 | 同 ✓ |
| 架桥概率 | 1/8 | 同 ✓ |
| 地面虫子间距 | 20 + rand(9) 格 | 同 ✓ |
| 平台虫子概率 | 25%（段长 > 2） | 同 ✓ |
| 拾取物概率 | 55%；mega 每 20 秒一次 | 同 ✓ |
| 顶破方块 | +10 分，10% 掉落拾取物 | 同 ✓ |
| 踩虫 | +25 分，弹跳 0.6 × JUMP_SPEED | 同 ✓ |
| 普通 / mega 拾取物 | +50 / +100，mega 给 10 秒 Super | 同 ✓ |
| 普通拾取物配色 | 出场时每块随机色 → 收敛到**整个拾取物的统一色** | **已改**，见「配色」 |
| mega 拾取物配色 | 出场时每块随机色 → 收敛到**该块自己的象限色** | **已改**，见「配色」 |
| Super 效果 | 无敌、分数翻倍、音效升调 1.5×、彩虹色 | 同 ✓ |
| 受伤无敌 | 1.5 秒，12 Hz 闪烁 | 同 ✓ |
| 生命 | 3 条 | 同 ✓ |
| 鸭子 | 追随 12.5 秒，20 格磁吸半径 | 同 ✓ |
| 鸭子生成间隔 | 12 + 8 × rand | 同 ✓ |
| 分数飘字防重叠 | 0.75 秒窗口内最多上顶 4 次 × 1.2 格 | 同 ✓ |

### 配色

原站 `l` 是 6 个单色，拾取物的 3×3 / 4×4 堆在一起很平。本项目换成 **11 组三停渐变**：
用户点名的三组（`#FFCEE3 → #678EC9 → #262277`、`#F9D2E4 → #67C9B5 → #007E79`、
`#FFE28D → #21A7CF → #D4FEFA`），加八组按同一「亮 → 中 → 深」逻辑补齐的
—— 决定块面有没有体积感的是**同一组内部的明度跨度**，不是色相多不多。

块面共用同一组配色，每块只占整条渐变的一小截（`uT0` / `uT1`），拼起来才是一条完整过渡，
而不是九条小过渡。用自定义 `ShaderMaterial` 而非贴图，是因为颜色要在出场 / 消失动画里
连续变化，贴图做不到。`GradientColor` 暴露的接口与 `THREE.Color` 一致
（`getHSL` / `copy` / `setHSL`），所以 `Pickup.js` 里的动画代码一行都没改。

`PALETTE` 特意没动：`Mona.js` 的残影是按 `PALETTE.length` 生成的（原站 6 条），
扩它等于把 6 条残影变成 11 条。

### 音效

10 种音效全部为 **WebAudio 实时合成**（原站不发音频文件），参数逐条还原：
`jump` `collect` `collectMega` `catchDucky` `duckyLeave` `megaEnd` `breakBlock` `squashBug` `gameOver` `damage`。

包含 0.3 秒白噪声缓冲、0.45 秒指数衰减卷积混响、`(1-x)³` 混响包络、Super 态升调规则（jump 除外）、4 个音效的混响白名单、静音状态持久化、用户手势解锁。

### UI

HUD 三栏 grid（生命 / 控制提示 / 分数+音效）、控制提示在"移动过且跳过"后上滑隐藏、localStorage 高分、WebGL 能力检测与降级、`prefers-reduced-motion` 支持、结算面板用 `cqw` 做容器查询字号。

**眉标（`Eyebrow`）与文案表** —— 原 `module 2003` + `module 2283`：

| 项 | 原站 | 本实现 |
|---|---|---|
| 眉标组件 | 内部 `Eyebrow`（含乱码解码 + 光标） | `src/ui/Eyebrow.jsx` ✓ |
| 解码字符集 | `A-Z0-9.!@#$%^&*()_+-=[]{}|/;<>?` | 同 ✓ |
| 解码节奏 | 第 i 个字符从 `0.075×⌊i/2⌋ + 0.0375×(i mod 2)` 秒起，先染 accent 色 → 随机 2–3 次乱码 → 落定真实字符 → 恢复目标色 | 同 ✓ |
| 光标 | `Eyebrow_Cursor`：10×10 方块，`background: #08872b`；落定后停在 `translateX(1ch)` | 同 ✓ |
| 触发方式 | IntersectionObserver；`animateOnViewportEnter` 时 `rootMargin: 0px`，否则 `0px 0px -20% 0px` | 同 ✓ |
| 无障碍 | 根节点内 `<span class="sr-only">` 输出完整文案，可视层 `aria-hidden` | 同 ✓ |
| 文案 · 默认眉标 | `play_super-mona_while_you_wait/`（活动后切 `play_super-mona/`） | 同 ✓ |
| 文案 · 有高分 | `super-mona / your high score:` + accent 色分数 | 同 ✓ |
| 按钮文案 | `Play` / `Exit game` / `Play again` | 同 ✓ |
| 音效按钮 | `aria-label` = `Turn sound on` / `Turn sound off` | 同 ✓ |
| 埋点串 | `Content, Play game, ref_loc: SuperMona;`（与可见文案分开） | 同 ✓ |
| 字体 | 自托管可变字体 `Mona Sans` / `Mona Sans Mono`（weight 200–900） | `public/fonts/` 同源文件 ✓ |
| Play 按钮 | Primer Brand `Button variant="secondary"`：`rgba(0,0,0,.05)` 底 + `#b6bfb8` 边框 + `blur(20px)`，实测 66×56 | 同尺寸 ✓ |
| 眉标排版 | `font: 425 16px/1.5 "Mona Sans Mono"`、`letter-spacing .15px`、Labels 内 `gap: 4px` | 同 ✓ |

## 与原站的差异

| 项 | 说明 |
|---|---|
| 框架 | 原站 Next.js（pages router），本实现 Vite + React 19。游戏代码与框架无关，1:1 移植 |
| 依赖版本 | Three.js 0.186 / GSAP 3.15 / React 19，均比原站发布时更新 |
| 拾取物配色 | 应要求把 6 个单色换成了 11 组三停渐变，见上文「配色」 |
| 封面演示 | SOFT LAB 首页那张卡片跑的就是这个游戏本体，由一个脚本替玩家按键（`DemoRunner.js` + `Game.autoPlay`）。原站没有这张卡片；演示的取景竖直只取 20 格（而非全部 26 格），否则整幅 94 格塞进卡片，Mona 只有 9px，看不出那是个角色 |
| 画布宽度 | 本实现允许到 1524px，对齐原站满幅的 hero；原站没有明确上限 |
| 竖屏提示 | SOFT LAB 那份与本站都加了一层纯 CSS 的「把手机横过来」覆盖层。原站没有 |
| 3D Mona 瞳孔描边 | 原站 shader 引用了 `uOutlineTexture` 但未赋值，本实现给了一张全黑 1×1 贴图，等效于无描边 |
| 转场时序 | 原站揭开阶段的时间偏移疑似在压缩中失准，本实现按"完全盖住后再揭开"的合理时序还原 |
| Eyebrow 光标闪烁 | 原站 `styles.CursorBlink` 在它的 CSS module 里并没有导出（`classList.add(undefined)`，实际不生效），光标是**静态**方块；本实现照搬同一写法，行为一致 |
| 页面外壳 | 原站的 hero/nav/footer 属于站点框架，不属于 `WebGLSuperMona` 组件，未包含 |

## 来源

- 视觉与交互原始实现：<https://githubuniverse.com/>
- 设计系统参考：[`primer/brand`](https://github.com/primer/react-brand)（MIT）
- 底层库：[three.js](https://github.com/mrdoob/three.js)、[GSAP](https://gsap.com/)

本项目为**学习交流用途，非商业**。素材版权归 GitHub 所有。
