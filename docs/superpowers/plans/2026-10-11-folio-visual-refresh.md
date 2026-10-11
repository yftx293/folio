# Folio「墨蓝研究室」视觉换皮实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在现有功能和操作流程保持原样的前提下，让 Folio 拥有统一、清楚、有辨识度的「墨蓝研究室」外观。

**Architecture:** 沿用现有 React 组件、Tailwind CSS 和主题变量，在样式与展示层实施换皮。调整 CSS、展示类名和纯装饰元素，保持组件的数据输入、事件处理、状态管理和 Electron 通信边界原样。按“视觉基础 → 应用外壳 → 代表页面 → 全页面覆盖 → 验收”顺序推进。

**Tech Stack:** 现有 Electron、React、TypeScript、Tailwind CSS v4、Radix UI、Lucide、Jotai、Bun；沿用现有依赖。

**Spec:** 本文“视觉设计约定”，依据本对话中用户已确认的「Folio · 墨蓝研究室」方案。

**当前状态:** 阶段 1 已完成实现与浏览器视觉验证（2026-10-11）；阶段 2–5 尚未开始。原生 Electron 桌面验收仍待可运行的桌面环境完成。

**工作目录:** `D:\folio-main\folio-main`。以下文件路径均相对此目录。

## Global Constraints：范围约束

- 只改视觉：配色、字体、间距、图标、圆角、边框、阴影、展示对齐和轻量动效。
- 保留所有现有页面、导航名称和顺序、页面内模块顺序、标签映射、按钮行为、快捷键及业务文案。
- 保留现有三栏结构、Allotment 拖动和尺寸持久化规则、响应式显示条件、AI 面板的展开与收起方式。
- 保留事件处理、hooks、请求、数据解析、缓存、计算、示例数据和真假数据判断。示例、错误与新鲜度标记保持可见。
- 保留组件 props、ref、ARIA、`data-testid` 和控件语义；新装饰不得截获点击或挡住焦点。
- 沿用已有浅色/深色/系统主题选择机制；为现有深色模式适配外观，不新增主题开关。
- 不修改 `packages/ui/src/atoms/`、`packages/ui/src/client/`、`packages/core/`、业务服务、Electron main/preload、IPC、技能解析、配置格式及依赖锁文件。
- 不将上一轮评审中的导航合并、数据状态统一、自动折叠助手、功能修复或新指标纳入本计划。
- 不更换操作系统应用图标、安装包资源或打包配置。品牌图形只用于应用内部展示。
- 默认由同一执行者顺序完成；每阶段形成独立可检查的差异。后续是否提交或推送按用户当时的指示处理。

## 视觉设计约定

### 品牌与布局

整体采用深墨蓝侧栏、冷白主内容、淡蓝灰助手区。辨识度集中在 Folio 字标、双页折叠图形和当前导航的折页标记；内容区通过文字层级与留白组织。

三栏的位置、比例规则及所有功能入口沿用现状。折页标记只是当前选中状态的装饰，来自既有 `active` 状态，使用 `pointer-events: none`。

### 配色与主题变量

| 用途 | 浅色目标值 | 深色适配值 |
| --- | --- | --- |
| 工作区背景 `--background` | `#EEF2F7` | `#101A2B` |
| 内容表面 `--surface` | `#FAFCFF` | `#18273C` |
| 次级表面 `--surface-muted` | `#E6ECF4` | `#132135` |
| 正文 `--foreground` | `#1B2B40` | `#E8EEF7` |
| 辅助文字 `--foreground-muted` | `#52637B` | `#B2C0D4` |
| 次要说明 `--foreground-subtle` | `#586980` | `#9AAEC8` |
| 主按钮 `--primary` / 焦点 `--accent` | `#5865D8` | `#A6ADFF` |
| 主按钮文字 `--primary-foreground` | `#FFFFFF` | `#101A2B` |
| 提示 `--warning` | `#B77920` | `#E6B86C` |
| 边界 `--border` | `#D8E1ED` | `#30425C` |
| 侧栏 `--folio-sidebar-background` | `#182B49` | `#121F34` |
| 侧栏文字 `--folio-sidebar-foreground` | `#F2F6FD` | `#F2F6FD` |
| 侧栏辅助文字 `--folio-sidebar-muted` | `#BBC8DD` | `#BBC8DD` |
| 助手背景 `--folio-agent-background` | `#E8EEF6` | `#142238` |

上述深色值是配套实施目标；最终以文本、图表和交互状态的可读性检查为准。保留现有红绿涨跌语义，不互换上涨与下跌颜色。同步映射 `--mac-*`、`--text-muted` 等兼容变量和对应 RGB 值，避免旧组件出现不同色系。

阶段 1 实测后，将浅色次要说明由 `#60718A` 加深为 `#586980`，使悬停表面的文字对比度达到 4.5:1。控件边界使用独立的 `--input`，错误提示使用 `--destructive`，链接使用 `--link-foreground`，保持涨跌配色的既有语义。

### 字体、尺寸和动效

- 正文沿用已有无衬线字体体系：`Inter` → 系统中文字体 → `system-ui`，不增加远程字体请求；标题沿用现有 `Geist`/`Inter` 及系统回退。
- 价格、百分比和数量启用 `tabular-nums`；沿用现有数字字体回退链，不把普通说明文字全面改成等宽字体。
- 页面标题 24–28px，区块标题 16–18px，正文及表单主要内容 14px，辅助说明 12px；品牌字标可独立设置。
- 主内容内边距通常 24px，区块间距 20–24px，卡片内边距 16–20px。窄窗口可缩减间距，保留全部现有内容和入口。
- 内容容器圆角 10px，控件圆角 6px，标签可用胶囊形；保留按钮既有尺寸变体，标准按钮高度 36px。
- 普通内容优先用留白和细边界；主区域可用轻微阴影，弹窗与浮层使用明确但克制的阴影。
- 交互动效 150–200ms，主要改变背景、边界与透明度。沿用减少动态效果设置；不新增循环装饰动画。
- 同一元素的样式应有清楚的归属。替换已触及的旧覆盖规则，避免继续在文件末尾追加一轮广泛 `!important`。

## Review Focus：五类必须检查的场景

| 场景 | 预期 | 负责阶段 |
| --- | --- | --- |
| 1024×768 窗口及现有窄屏布局 | 文字放大后控件仍可访问；折页装饰不影响拖动、点击和滚动 | 2、3、5 |
| 浅色、深色、系统主题 | 深色侧栏中的列表、菜单和表单可读；图表与主题协调 | 1、4、5 |
| 中英文、长股票代码、长会话名、长报告 | 内容可阅读或按现有方式截断，数值和按钮不会相互覆盖 | 3、4、5 |
| 空、加载、错误、示例和部分完成状态 | 原有解释、状态、来源和操作仍完整可见 | 3、4、5 |
| 键盘、弹窗、禁用控件和减少动态效果 | 焦点清楚，关闭及恢复焦点行为原样，装饰不改变事件 | 1、2、5 |

---

## 阶段 1：建立视觉基础与公共控件

**目标：** 给后续页面提供统一的配色、文字和控件样式。

**涉及文件：**

- 修改：`apps/electron/src/renderer/styles/index.css`、`packages/ui/src/styles/index.css`。
- 修改：`packages/ui/src/components/primitives/Button.tsx`、`Input.tsx`、`Dialog.tsx`、`DemoBadge.tsx`、`DataFreshness.tsx`。
- 修改：`packages/ui/src/components/ui/tabs.tsx`、`select.tsx`、`switch.tsx`、`dropdown-menu.tsx`、`tooltip.tsx`、`skeleton.tsx`、`status.tsx`。

**接口约定：** 保留公共组件的全部 props、变体名称和 Radix 事件行为；本阶段产出上述主题变量和一致的基础状态样式。

- [x] 记录实施前的首页、股票详情、助手与设置截图，并记录现有交互结果；截图放在 `output/visual-refresh/before/`。
- [x] 按本文配色表调整两个样式入口的默认变量、兼容别名、字体、圆角和动效值。检查 renderer 入口的覆盖关系，共享 UI 单独加载时也应有正确默认值。
- [x] 替换公共控件中的旧色值、圆角和局部字号，覆盖 default、hover、focus-visible、disabled、error 和 loading 状态。
- [x] 在已有页面中检查按钮、输入框、下拉、开关、弹窗和状态标签；检查浅深色、键盘焦点及减少动态效果。普通文本对比度达到 4.5:1，焦点和必要控件边界达到 3:1。

**交付与验收：** 公共控件样式和浅深色截图；操作及数据原样，状态标签仍清楚。验收后再开始外壳换皮。

### 阶段 1 实施结果（2026-10-11）

- 修改上述 14 个展示文件；组件接口、事件、数据逻辑、依赖及 Electron 通信没有改动。
- 两套样式入口各完成 18 项公共控件浏览器检查；抽测文本最低对比度 4.52:1，必要边界最低 3.12:1。此结果针对阶段 1 的公共控件，不代表所有页面已经完成视觉验收。
- 实际页面完成首页、股票选择、助手、设置及关于弹窗截图；浅色、深色和系统主题切换通过。1024×768 下设置主题控件可通过键盘操作；公共控件预览包含中英文。
- `bun run typecheck`、`apps/electron` 下 `bunx vite build`、`bun test --isolate packages/ui` 全部退出码 0；UI 测试 321 通过、0 失败。构建保留现有大体积 chunk 提示。
- 基线 `bun run test:ui` 存在异步测试清理期间 `window is not defined` 的未处理错误；隔离运行在修改前后均通过。既有 Dialog 关闭后焦点落到 BODY 的行为经原组件对照确认一致。
- 独立评审发现的两项问题（辅助文字工具类映射缺失、选中标签悬停文字对比度不足）均已修正，并重新验证。
- 浏览器缺少 Electron IPC，不能替代原生桌面验证；实际应用语言持久化及切换需桌面环境确认。阶段 2–5 继续保留待办。
- 截图：`output/visual-refresh/before/`、`output/visual-refresh/after/`；完整验证与执行取舍：`output/visual-refresh/acceptance.md`、`output/visual-refresh/progress.md`。这些本地证据沿用已有 `output/` 忽略规则，不进入代码仓库。

## 阶段 2：品牌、侧栏与助手外壳

**目标：** 建立“墨蓝侧栏 / 冷白主区 / 淡蓝灰助手”的第一印象。

**涉及文件：**

- 创建：`packages/ui/src/components/layout/FolioMark.tsx`，纯 SVG 双页折叠品牌图形。
- 修改：`packages/ui/src/components/layout/Sidebar.tsx`、`TitleBar.tsx`、`WorkspaceTopbar.tsx`、`AppShell.tsx`。
- 修改：`packages/ui/src/components/stock/Watchlist.tsx`、`StockCard.tsx`、`packages/ui/src/components/agent/AgentPanel.tsx`、`ModelSelector.tsx`、`ThinkingSelector.tsx`、`ContextChip.tsx`。
- 修改：`apps/electron/src/renderer/styles/index.css` 中对应外壳样式。
- 检查：`packages/ui/src/components/layout/WorkbenchShell.tsx`，保持其尺寸、断点和可见性逻辑原样。

**接口约定：** `FolioMark({ className }: { className?: string })` 只返回装饰 SVG，设置 `aria-hidden="true"`，不持有状态和事件。其他组件只消费阶段 1 的变量，保留已有接口。

- [ ] 制作双页折叠图形，在现有品牌展示位使用；沿用已有 Folio 名称和说明文字。
- [ ] 将侧栏改成墨蓝底色，适配导航、会话、关注列表、底部设置以及悬停/选中/禁用状态。为当前导航增加不截获点击的折页标记。
- [ ] 统一标题栏和顶栏的文字、图标、间距与边界；保留两套现有标签及其行为，不添加图标操作。
- [ ] 调整助手背景、空状态、头部选择器和输入区。保留现有开关、发送、停止和会话创建行为。
- [ ] 在 1440×900、1280×800、1024×768 和 800×900 下检查：导航、会话、关注列表、分栏拖动、已有助手显隐和弹窗焦点均与基线一致。保持现有窄屏的显示规则。

**交付与验收：** 应用外壳前后对照截图；品牌有辨识度，所有原有入口和三栏操作仍可访问。

## 阶段 3：打磨首页与股票详情两个代表页面

**目标：** 用两个常用页面确定内容区的视觉标准，再推广到其他页面。

**涉及文件：**

- 修改：`packages/ui/src/components/today/TodayView.tsx`、`TodaySection.tsx`、`DailyBriefSection.tsx`、`packages/ui/src/components/pulse/MarketPulse.tsx`。
- 修改：`packages/ui/src/components/portfolio/PortfolioCard.tsx`。
- 修改：`packages/ui/src/components/workspace/FinanceWorkspace.tsx`、`SecurityHeader.tsx`、`OverviewView.tsx`、`FinancialsView.tsx`、`NewsView.tsx`、`ChartView.tsx`。
- 修改：`apps/electron/src/renderer/styles/index.css` 中上述页面的展示规则。

**接口约定：** 页面消费阶段 1 的视觉变量、阶段 2 的外壳。字段、数值、格式化函数、模块顺序、标签名称、数据加载和状态分支保持原样。

- [ ] 首页调整标题、资产数字、卡片主次、行间距及日期对齐。对嵌套卡片弱化内层边界，保留原有标题、示例标记、涨跌内容和模块顺序。
- [ ] 股票详情统一身份信息、价格、指标、两套现有标签、新闻列表和财务数据的排版。原有空值继续显示空值，不增加目标价等字段。
- [ ] 适配未选择股票、数据不可用、示例、加载和长内容状态；已有错误文字可以换样式，内容与操作保持原样。
- [ ] 比较两个代表页面在 1440×900 和 1024×768 下的截图，复核中英文、长标题和浅深色。字号提升不能让主要操作被遮挡。
- [ ] 复核首页快捷入口、股票选择和标签切换的结果与实施前一致，沿用现有 `TodayView.test.tsx` 等测试验证受触及页面。

**交付与验收：** 首页与股票详情对照截图、公共页面排版规则；这两页检查通过后推广视觉规则。

## 阶段 4：覆盖其余页面、图表与浮层

**目标：** 将已确认的视觉规则应用到完整界面，减少风格断层。

**主要文件与职责：**

| 页面/内容 | 实施文件 |
| --- | --- |
| 发现 | `components/discover/DiscoverView.tsx`、`TaskCard.tsx`、`CandidateCard.tsx` |
| 研究 | `components/research/ResearchPanel.tsx`、`ResearchMarketWorkspace.tsx`、`ResearchReportView.tsx`、`EvidenceList.tsx`、`WhatChangedSection.tsx`、`StrategyPicker.tsx`、`OpinionBadge.tsx`、`ExportMenu.tsx` |
| 组合与比较 | `components/workspace/PortfolioSection.tsx`、`components/portfolio/PortfolioRiskPanel.tsx`、`HoldingRow.tsx`、`AssetPieChart.tsx`、`ImportDialog.tsx`、`ImportDraftReview.tsx`、`components/compare/CompareWorkspace.tsx`、`CompareTable.tsx` |
| 提醒、事件和投资理由 | `components/workspace/AlertsSection.tsx`、`components/alert/AlertCard.tsx`、`AlertForm.tsx`、`AlertList.tsx`、`components/events/EventsView.tsx`、`components/thesis/ThesisPanel.tsx`、`ThesisEditor.tsx`、`ThesisImpactList.tsx` |
| 设置、技能和个人界面 | `components/settings/SettingsView.tsx`、`GeneralTab.tsx`、`ModelsTab.tsx`、`ConnectionsCenter.tsx`、`ConnectionCard.tsx`、`DiagnosticsTab.tsx`、`EvaluationSettingsTab.tsx`、`SkillsView.tsx`、`SkillRow.tsx`、`SkillList.tsx`、`SkillReadinessBadge.tsx`、`SkillDetailDrawer.tsx`、`SkillToggle.tsx`、`components/profile/ProfileSecurityView.tsx` |
| 评估、表现和自动化 | `components/evaluation/EvaluationCenter.tsx`、`ExperimentDetail.tsx`、`CaseDetail.tsx`、`FailureModesTab.tsx`、`components/performance/PerformanceView.tsx`、`PerformanceCard.tsx`、`CalibrationCard.tsx`、`components/automation/AutomationRulesView.tsx`、`RuleCard.tsx` |
| 消息与结构化回答 | `components/chat/TurnCard.tsx`、`MessageList.tsx`、`MarkdownContent.tsx`、`CitationChip.tsx`、`SourceInspector.tsx`、`AnswerContent.tsx`、`blocks/AnswerBlockFrame.tsx`、`AnswerBlockView.tsx`、`MetricGridBlockView.tsx`、`DataTableBlockView.tsx`、`ComparisonTableBlockView.tsx`、`TimeSeriesChartBlockView.tsx`、`components/agent/structured/QuoteCard.tsx`、`PortfolioRiskCard.tsx`、`MetricGrid.tsx`、`components/agent/ToolActivity.tsx` |
| 图表 | `components/chart/FinancialKLineChart.tsx`、`components/stock/KLineChart.tsx` |
| 首次引导与辅助界面 | `components/onboarding/OnboardingOverlay.tsx`、`OnboardingWizard.tsx`、`WelcomeStep.tsx`、`EnvironmentStep.tsx`、`ProviderConnectStep.tsx`、`ConnectAiStep.tsx`、`components/about/AboutView.tsx`、`components/command/CommandPalette.tsx`、`components/trace/TraceInspector.tsx` |

表中路径均以 `packages/ui/src/` 为前缀；同一格中省略目录的文件位于该格最近一个完整文件路径的目录中。这是覆盖检查清单，已有样式能通过公共变量完成适配的文件无需强行修改。

**接口约定：** 仅调整展示类名、局部样式和图表颜色配置。报告、消息、技能、图表数据及导出内容的结构和处理原样。

- [ ] 为发现卡片、研究标题、报告段落和证据区域应用代表页面的文字层级与间距；保留内容顺序、折叠机制和现有操作。
- [ ] 统一组合、比较和其他已有表格的表头、行边界、数字对齐；不把现有卡片重做成新交互表格，不增加排序或筛选。
- [ ] 覆盖提醒、事件、投资理由、设置、技能、评估、个人界面、表现及自动化中的表单、列表和状态，保留其业务文案。
- [ ] 统一消息、代码块、引用、结构化回答、导入确认、首次引导、关于、命令面板和追踪浮层的外观；检查长内容、错误、禁用和部分完成状态。
- [ ] 对已有图表只调整颜色、背景、轴文字和网格等展示配置。保持数据转换、生命周期、指标和周期切换原样；验证已有主题切换后颜色不会混用。不修改图表数据适配器。
- [ ] 全页面截图巡检，逐项记录已覆盖页面和状态；有真实数据的检查使用用户已配置的环境，公开截图使用明确的示例或现有测试数据。

**交付与验收：** 全页面覆盖表与截图；各页面属于同一视觉体系，原有内容与功能行为一致。

## 阶段 5：视觉验收与功能回归

**目标：** 确认全局换皮完整，样式没有干扰现有功能。

**涉及文件：**

- 复核阶段 1–4 的全部差异。
- 仅在发现具体样式冲突时，修正 `apps/electron/src/renderer/styles/index.css`、`packages/ui/src/styles/index.css` 和对应展示组件。
- 验收截图及结果存放：`output/visual-refresh/after/`、`output/visual-refresh/acceptance.md`。

**接口约定：** 不扩展业务范围；既有缺陷记录为基线问题。换皮造成的新增问题必须修复，不能以“之前也有问题”跳过。

- [ ] 检查差异：确认没有改动数据请求、状态逻辑、数据结构、导航映射、事件处理、业务文案、依赖及 Electron 通信。
- [ ] 对照截图检查浅深色、中英文、长内容、四档窗口尺寸，以及空/加载/错误/示例/部分完成状态。逐项完成 Review Focus 检查。
- [ ] 运行 `bun run typecheck`，预期退出码 0，无新增 TypeScript 错误。
- [ ] 在 `apps/electron` 目录运行 `bunx vite build`，预期退出码 0，renderer 构建成功；不借此修改 main/preload 或打包配置。
- [ ] 在项目根目录运行 `bun run test:ui`，预期既有 UI 测试通过；失败时与基线比较，识别换皮回归。纯 CSS 调整无需新增只断言 className 或颜色值的单元测试。
- [ ] 用实际界面复核导航、股票选择、会话、输入/发送/停止、表单、标签、弹窗、主题和分栏拖动。调用 AI 或外部数据的操作在已配置环境或现有测试环境执行，浏览器降级预览不能代替 Electron 验证。
- [ ] 清理本次触及区域中已被替代的重复样式，保留仍被其他页面使用的规则；不开展整份样式表的架构重写。
- [ ] 写入验收结果：截图、检查命令、结果、与基线一致的已有问题及尚未验证的环境。只在必要检查完成后标记换皮完成。

**环境说明：** `apps/electron/e2e/visual.mjs` 和 `interactions.mjs` 当前含 macOS Electron 路径及 Unix 命令，不能直接作为 Windows 的验收命令。优先使用浏览器截图验证样式；桌面交互使用已能运行的 Electron 环境。若需要移植测试脚本或安装运行时，将其作为单独任务确认，不混入换皮。此前使用过跳过 Electron 二进制下载的依赖安装方式，实施时需重新确认桌面运行环境。

**完成标准：** 五个阶段的交付物齐全；对比截图体现「墨蓝研究室」风格；现有页面、数据和操作行为保持原样；类型、renderer 构建、UI 回归与必要桌面交互验证通过。仅浏览器检查通过时，应标记“视觉预览通过，桌面验收待完成”。

## 执行与回退

依赖顺序为 **1 → 2 → 3 → 4 → 5**。每阶段结束先检查差异与截图，修复该阶段引入的问题，再继续下一阶段。阶段 3 的两个代表页面用于确认整体视觉，避免全页面铺开后再大范围返工。

若后续采用 Git 提交，建议按阶段保留独立提交，便于单独回退；提交中只包含当阶段的文档、视觉组件和样式。开始实施前检查并保留用户已有修改。

**当前交付：** 此计划文件及阶段 1 的公共视觉基础；阶段 2–5 分阶段执行。第一阶段在 `feat/visual-refresh-stage-1` 分支独立提交；外部推送按后续指示处理。
