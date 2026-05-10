# Design B: "方块拼图美学" — Block Puzzle Aesthetic

## 设计目标

让网站看起来像 **Block Out! 游戏本身的延展**，而不是一个通用模板。
页面的视觉语言直接取材自游戏：六色方块作为结构元素，而非装饰。

---

## 1. globals.css — 新增动画 + 增强 block-tile

### 新增 @keyframes
- `slide-up`: 方块从下方滑入（模仿游戏中方块滑动的感觉）
- `block-bounce`: 方块弹跳入场（spring 缓动）
- `block-shimmer`: 方块上细微的光影划过（游戏内方块的高光效果）
- `color-cycle`: 方块颜色缓慢循环（用于 hover 状态）

### 增强 .block-tile
```css
.block-tile {
  border-radius: 16px;
  /* 第一层：底部的暗部投影 */
  box-shadow: 
    inset 0 -3px 0 rgba(0,0,0,0.15),
    inset 0 1px 0 hsla(0,0%,100%,0.35),
    0 4px 12px -4px currentColor;
  /* currentColor 会根据游戏颜色变化 */
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 0.25s ease;
}

.block-tile:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 
    inset 0 -3px 0 rgba(0,0,0,0.15),
    inset 0 1px 0 hsla(0,0%,100%,0.35),
    0 8px 24px -6px currentColor;
}
```

### 新增 CSS 动画类
- `animate-slide-up`: 用于 section 入场
- `animate-block-bounce`: 用于方块元素出现
- `animate-block-shimmer`: 用于方块上的高光效果

---

## 2. Header — 改成"拼图导航"

当前 header 是标准 logo + nav 布局。改为游戏 UI 风格：

### Logo 区域
- 当前是一个蓝色方块 + "Block Out!" 文字
- 改为：**6 个小色块并排排列**（红/橙/黄/绿/蓝/紫），呈阶梯状
- 文字 "Block Out!" 保持，但用 font-black + tracking-tight

### Nav 链接
- 当前是文本链接 + 蓝色下划线
- 改为：每个 nav item 是一个 **mini 方块**，hover 时方块 pop 出来
- 当前页面的方块有填充色（根据页面自动分配颜色），其他页面是轮廓
- 类似游戏里关卡选择界面的"已解锁/未解锁"样式

### 滚动效果
- 未滚动时：透明背景，方块漂浮
- 滚动后：毛玻璃背景，方块颜色更鲜艳

---

## 3. Hero Section — 方块棋盘为主视觉

### 背景
- **删除** 当前的三色模糊圆点（blur-3xl color blobs）
- **删除** 点阵纹理（radial-gradient dots）
- 替换为：**棋盘格图案**，使用游戏颜色的极淡版本（opacity 0.03-0.05）
- 棋盘格大小 32px，模拟游戏棋盘

### 左侧文案区域保持不变，但：
- H1 用更大的字重（保持 font-black）
- 搜索框和按钮做成"方块样式"：圆角 16px，内阴影效果

### 右侧 BlockTower（核心视觉）
目前已经有一个 BlockTower 组件，但增强：
- 每个方块入场增加 **slide-up** 动画，依次从底部滑入
- 方块上的数字用超大字号
- 增加微弱的 **shimmer** 高光动效
- hover 时会微微浮起

### Stats 行
- 当前是三个数字：Levels / Videos / Languages
- 改为：每个数据用一个小方块作为图标背景
- 文字保持，但数字用更醒目的 game color

---

## 4. Header + Hero 之间的"色条"

- 在 header 和 hero 之间，添加一条 4px 高的渐变条
- 从左到右依次：红色→橙色→黄色→绿色→蓝色→紫色
- 这条色条也表示"已滚动到页面顶部"的状态指示

---

## 5. Level Highlights — 游戏关卡选择风格

### 布局
- 当前是 6 个 1:1 大卡片
- 改为：**3 行 × 2 列** 或保持 6 列，但每个卡片变得更像游戏里的"关卡方块"
- 卡片尺寸建议 3:2（横版）而不是 1:1

### 卡片设计
- 每个关卡卡片是一个**大色块**，颜色根据难度分配
- 上面的数字超大（80-100px），斜体或加粗
- 右上角一个小标签显示难度（easy/medium/hard）
- 如果有视频缩略图：以 16:9 方式显示，覆盖在色块上方
- hover 时整块方块略微旋转 + 浮起

### "Browse all levels" 链接
- 做成一个和关卡卡片一样大小的方块
- 颜色用紫色渐变
- 内容：箭头 + "View all"

---

## 6. Features — 方块功能卡片

### 当前问题
- 4 列网格，标准卡片样式
- 缺少"游戏感"

### 改为
- 4 列保持不变，但每张卡片更像一个游戏"道具"
- 卡片左侧或顶部有一个大色块作为标识（类似游戏里的 boosters）
- 图标放在色块中间
- 标题用更大的字体
- 卡片底部加一个微妙的色条

---

## 7. HowToPlay — 玩法步骤

### 改为
- 3 列布局不变
- 每张卡片更突出"步骤编号"——用超大数字（120px）作为背景
- 每个步骤卡片的背景色极淡地取对应颜色
- 步骤之间用一条**虚线**连接，模拟游戏里的路径

---

## 8. Footer — 保持色条，微调

- 顶部的六色色条保留（这是好设计）
- 底部 logo 改成新的 6 色块版本
- 增加一行："Block Out! — Sort it out." 小字 tagline

---

## 9. Section dividers

- 当前用 `border-b` 分隔 section
- 改为：每个 section 之间有一个 **2px 高的游戏色虚线**（类似游戏里的分隔线）
- 或者用极淡的棋盘格图案作为 section 之间的视觉分隔

---

## 执行顺序

1. `app/globals.css` — 新动画 + 增强 block-tile
2. `components/sections/header/index.tsx` — 拼图导航
3. `components/sections/hero/index.tsx` — 增强 BlockTower
4. `components/sections/level-highlights.tsx` — 关卡方块
5. `components/sections/features/index.tsx` — 道具风格卡片
6. `components/sections/how-to-play.tsx` — 路径步骤
7. `components/sections/footer.tsx` — 微调
8. `components/ui/section.tsx` — 新分隔线样式

---

**原则：**
- 所有颜色 = 游戏六色（红 #FF3B30 / 蓝 #007AFF / 绿 #34C759 / 橙 #FF9500 / 黄 #FFCC00 / 紫 #AF52DE）
- 所有圆角 = rounded-2xl（16px）
- 所有入场动画 = spring 缓动（cubic-bezier(0.34, 1.56, 0.64, 1)）
- 没有模糊彩色圆点、没有点阵纹理、没有 glassmorphism
