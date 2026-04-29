# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).



️ 技术栈要求
前端框架：Vue 3.4+ (Composition API + <script setup>)
构建工具：Vite 5+
状态管理：Pinia
路由：Vue Router 4
UI方案：原生CSS + TailwindCSS（优先轻量，避免重型组件库）
响应式适配：使用 viewport + rem 或 CSS媒体查询 实现PC/移动端自适应
交互事件：PC端用 mouse 事件，移动端用 touch 事件，封装统一拖拽Hook
可选工具：lodash-es（防抖/深拷贝）、color（颜色校验）、canvas（导出图片）## ️项目结构规划 src/ views/ Home.vue # 首页：4个功能入口卡片 DailyChallenge.vue # 每日挑战 LevelGame.vue # 关卡挑战（新游戏/继续游戏） FreeCreate.vue # 自由创作（历史列表+新建画布） Leaderboard.vue # 排行榜 GameBoard.vue # 【核心】拼豆游戏画布组件（复用） components/ BeadBox.vue # 豆子选择盒（颜色面板） GridCanvas.vue # 网格画布（支持拖拽放置） PatternOverlay.vue # 目标图案半透明参考层 ScoreResult.vue # 结算弹窗（准确率/完成度/积分） ResponsiveWrapper.vue # 响应式布局容器 composables/ useDragBead.js # 统一拖拽逻辑（兼容mouse/touch） useGridLogic.js # 网格坐标计算/放置/消除 useScoreCalc.js # 评分算法：准确率+完成度积分 useResponsive.js # 设备检测 + 适配参数 useStorage.js # localStorage持久化（历史记录/进度） stores/ userStore.js # 用户信息/积分/成就 gameStore.js # 当前游戏状态（关卡/网格数据/目标图案） dailyStore.js # 每日挑战数据（日期校验/完成状态） utils/ patternGenerator.js # 图案生成/解析（支持导入导出） imageExporter.js # Canvas导出PNG功能 eventAdapter.js # mouse/touch事件标准化 assets/ colors.js # 预设豆子颜色配置 patterns/ # 关卡图案模板（JSON格式） styles/ # 全局样式/变量 router/index.js # 路由配置（含关卡进度守卫）
核心功能模块说明
1️⃣ 首页（Home.vue）
响应式布局：PC端4卡片横排，移动端22网格
4个入口：
每日挑战：显示今日倒计时 + 完成状态
新游戏/继续游戏：显示当前关卡进度（如 3/50）
自由创作：显示最近3个历史作品缩略图
排行榜：显示用户当前排名（点击跳转）
2️⃣ 每日挑战（DailyChallenge.vue）
逻辑：
根据当前日期 YYYY-MM-DD 从后端/本地配置获取今日图案ID
用户完成挑战后，标记 dailyStore.completedDates 防止重复领取奖励
奖励规则：100%完成=50积分，80%=30积分，60%=10积分
防作弊：图案数据不直接暴露前端，仅传输网格坐标哈希校验
3️ 关卡挑战（LevelGame.vue）
数据结构：
// levels.json 示例
{
"level": 1,
"gridSize": { "rows": 16, "cols": 16 },
"targetPattern": [[0,1,1,0], [1,2,2,1], ...], // 0=空, 1+=颜色ID
"requiredColors": [1,2,3], // 本关可用颜色ID
"timeLimit": null, // 可选：限时挑战（秒）
"reward": { "base": 20, "perfect": 50 }
}
进度管理：
完成关卡后解锁下一关（userStore.unlockedLevels）
支持中途退出，自动保存当前网格状态到 localStorage
4️⃣ 自由创作（FreeCreate.vue）
功能：
历史列表：展示用户创建的所有自由作品（缩略图+创建时间+操作：编辑/删除/导出）
新建画布：弹窗设置 行数(8~64)  列数(8~64) + 选择初始颜色面板
编辑模式：无限撤销/重做 + 一键清空 + 导出PNG
数据存储：// 作品数据结构
{
"id": "uuid",
"name": "我的小猫",
"gridSize": { "rows": 32, "cols": 32 },
"gridData": [[0,0,1,2], [0,1,2,3], ...], // 0=空, 1+=颜色ID
"createdAt": "2024-01-15T10:30:00Z",
"thumbnail": "image/png;base64,..." // 可选：缩略图base64
}
排行榜（Leaderboard.vue）
展示字段：排名 | 用户名 | 总积分 | 最高关卡 | 完成挑战数
排序规则：积分降序  完成挑战数降序  创建时间升序
前端模拟数据（后期可对接后端API）
核心组件：GameBoard.vue 详细需求
网格画布
动态生成 x*y 网格，每个格子为正方形，自适应容器宽度
支持两种模式：
challenge 模式：显示半透明目标图案参考层（opacity: 0.3）
free 模式：纯白画布，无参考
格子状态：empty / filled(colorId) / highlight（拖拽悬停时）
豆子盒（BeadBox.vue）
横向滚动容器（移动端）/ 网格排列（PC端）
每个颜色块显示：颜色预览 + 剩余数量（挑战模式限制用量）
选中状态：高亮边框 + 阴影
拖拽交互（useDragBead.js）
// 统一拖拽Hook，自动适配设备
export function useDragBead({ onPlace, onErase }) {
// PC端：mousedown  mousemove  mouseup
// 移动端：touchstart  touchmove  touchend
// 核心逻辑：
// 1. 从豆子盒选中颜色，创建「虚拟拖拽元素」
// 2. 跟随指针移动，实时计算落入的网格坐标
// 3. 释放时：调用 onPlace(row, col, colorId)
// 4. 支持「擦除模式」：选中橡皮擦图标后，拖拽到格子执行 onErase(row, col)
}
评分算法（useScoreCalc.js）
// 输入：用户网格数据 + 目标图案数据
// 输出：{ accuracy, completion, score }
export function calculateScore(userGrid, targetGrid) {
let totalCells = 0, correctCells = 0, filledCells = 0;

targetGrid.forEach((row, r) => {
row.forEach((targetColor, c) => {
totalCells++;
const userColor = userGrid[r]?.[c] || 0;

      if (targetColor !== 0) { // 目标位置需要豆子
        filledCells++;
        if (userColor === targetColor) correctCells++;
      } else if (userColor === 0) { // 目标为空，用户也未放
        correctCells++;
      }
    });
});

const accuracy = filledCells > 0 ? correctCells / totalCells : 1;
const completion = filledCells > 0 ? correctCells / filledCells : 0;

// 积分公式：基础分  准确率系数  完成度系数
const baseScore = 20;
const score = Math.round(baseScore * accuracy * (0.5 + 0.5 * completion));

return {
accuracy: Math.round(accuracy * 100),
completion: Math.round(completion * 100),
score
};
}
// 输入：用户网格数据 + 目标图案数据
// 输出：{ accuracy, completion, score }
export function calculateScore(userGrid, targetGrid) {
let totalCells = 0, correctCells = 0, filledCells = 0;

targetGrid.forEach((row, r) => {
row.forEach((targetColor, c) => {
totalCells++;
const userColor = userGrid[r]?.[c] || 0;

      if (targetColor !== 0) { // 目标位置需要豆子
        filledCells++;
        if (userColor === targetColor) correctCells++;
      } else if (userColor === 0) { // 目标为空，用户也未放
        correctCells++;
      }
    });
});

const accuracy = filledCells > 0 ? correctCells / totalCells : 1;
const completion = filledCells > 0 ? correctCells / filledCells : 0;

// 积分公式：基础分  准确率系数  完成度系数
const baseScore = 20;
const score = Math.round(baseScore * accuracy * (0.5 + 0.5 * completion));

return {
accuracy: Math.round(accuracy * 100),
completion: Math.round(completion * 100),
score
};
}
响应式适配方案
CSS媒体查询断点
/* 全局变量 */
:root {
--bead-size-pc: 24px;
--bead-size-mobile: 16px;
--grid-gap: 2px;
}

/* 移动端适配 */
@media (max-width: 768px) {
.grid-cell {
width: var(--bead-size-mobile);
height: var(--bead-size-mobile);
}
.bead-box {
flex-wrap: wrap; /* 颜色盒换行 */
}
}
事件兼容处理（eventAdapter.js）
// 标准化指针事件
export function normalizeEvent(e) {
const isTouch = e.type.startsWith('touch');
return {
x: isTouch ? e.touches[0].clientX : e.clientX,
y: isTouch ? e.touches[0].clientY : e.clientY,
preventDefault: () => e.preventDefault?.()
};
}
数据持久化策略
数据类型
存储方案
说明
用户积分/进度
localStorage + 后端同步
优先本地，联网时上报
自由创作作品
localStorage
单用户离线可用
每日挑战记录
localStorage + 日期校验
防止修改本地时间作弊
关卡解锁状态
localStorage
关键节点可加密存储
UI/UX 细节要求
视觉风格：清新可爱风，主色 #FF6B9D（豆沙粉）+ #4ECDC4（薄荷绿）
动效：
豆子放置时：轻微缩放 + 阴影弹跳
挑战成功：彩带动画 + 积分飞入用户头像
反馈：
拖拽时：目标格子高亮 + 半透明豆子跟随
放置错误（挑战模式颜色不对）：格子红色闪烁0.3s
无障碍：
所有按钮添加 aria-label
颜色选择支持文字标签（色盲友好）
交付验收标准
PC端（19201080）和移动端（375667）布局正常，无横向滚动
拖拽交互流畅，60fps，无卡顿
评分算法准确：100%匹配得满分，空放/错放扣分合理
刷新页面后，游戏进度/自由作品不丢失
控制台无Vue warning/error，Lighthouse性能85
额外建议
AI辅助：「帮我生成一个爱心图案」 调用Qwen API返回坐标数据
音效：放置豆子/挑战成功添加轻微音效（可开关）

