# react-sortable-dnd Context

这个上下文记录 `react-sortable-dnd` 的领域语言 [Domain Language]，用于保持拖拽排序接口 [Interface]、实现 [Implementation] 与文档中的命名一致。

## Language

**外部拖入源 [External Drag Source]**:
只能发起拖拽、不能接收放置 [Drop] 的源模块 [Module]。
_Avoid_: 用空的 **可排序容器 [Sortable Container]** 伪装成拖拽源。

**放置目标 [Drop Target]**:
可以接收放置并决定是否改变 items 的目标模块 [Module]。
_Avoid_: 让 **外部拖入源 [External Drag Source]** 改变 items。

**放置目标决策 [Drop Target Decision]**:
**放置目标 [Drop Target]** 中只负责外部拖入 [External Drop] 的纯决策模块 [Pure Decision Module]，拥有 **接收规则 [Accept Rule]**、悬停反馈 [Hover Feedback]、**拖入工厂函数 [Drop Factory Function]** 优先级、**源数据草稿 [Source Data Draft]** 回退和创建失败 [Creation Failure] 规则；它区分悬停决策 [Hover Decision] 与放下创建决策 [Drop Creation Decision]，悬停路径绝不触发 item 创建；拒绝结果 [Rejected Result] 可以携带内部原因码 [Internal Reason Code] 以服务测试 [Tests] 与调试 [Debugging]，但原因码不属于公开接口 [Public Interface]；它是内部模块 [Internal Module]，不得从 `src/index.ts` 导出，但模块测试 [Module Tests] 可以从源码路径导入；不拥有容器内排序 [Internal Reorder]，也不直接执行 `DataTransfer`、React 事件 [React Event]、`setDragState` 或 `onItemsChange` 等副作用 [Side Effects]。
_Avoid_: 让 React 事件处理器 [Event Handler] 重复判断 `accepts`、拼装创建规则，让该模块返回完整 items 并接管机械执行 [Mechanical Execution]，或把内部决策结果 [Internal Decision Result] 变成调用方需要学习的公开接口 [Public Interface]。

**接收规则 [Accept Rule]**:
由 **放置目标 [Drop Target]** 通过 `accepts` 声明的外部拖入过滤规则，默认接受所有 **外部拖入源 [External Drag Source]**，当前只按 `source.type` 判断。
_Avoid_: 让 **外部拖入源 [External Drag Source]** 自己决定能放到哪里，或让目标为了过滤而理解 `source.data` 的完整结构。

**拒绝放置反馈 [Rejected Drop Feedback]**:
当 **接收规则 [Accept Rule]** 拒绝某个 **外部拖入源 [External Drag Source]** 时，目标不显示插入占位符 [Placeholder]、不触发 `onDrop`、不改变 items。
_Avoid_: 对不可接收的源显示可放置反馈，或放下后静默改变 items。

**拖拽源呈现 [Drag Source Presentation]**:
把一个或多个 **外部拖入源 [External Drag Source]** 渲染为可拖拽 UI 的模块 [Module]。
_Avoid_: 只支持源列表，迫使调用方为了单个拖拽入口创建额外容器。

**源列表 [Source List]**:
命名为 `DndSourceList`，是带默认 UI 的一组 **外部拖入源 [External Drag Source]** 便利模块 [Convenience Module]，允许调用方通过 `renderSource` 覆盖每个源的呈现。
_Avoid_: 只提供固定 UI，放弃当前 `.dnd-drag-source` 视觉兼容性 [Visual Compatibility]，或要求调用方为了常见源列表场景从零拼装行为。

**过渡拖拽源接口 [Transitional Drag Source Interface]**:
`DndSortable.dragSources` 形式的旧接口 [Interface]，在新 **外部拖入源 [External Drag Source]** 模块 [Module] 可用后保留但标记弃用 [Deprecated]。
_Avoid_: 直接破坏现有调用方，运行时刷 `console.warn`，或长期保留两个同等推荐的拖拽源入口。

**源触发器 [Source Trigger]**:
命名为 `DndSource`，调用方提供自定义 UI、库只附加拖拽行为属性 [Behavior Props] 的单个 **外部拖入源 [External Drag Source]** 入口。
_Avoid_: 把单个源强制渲染成库内置按钮、卡片或列表项样式，或替调用方包一层额外 DOM。

**拖拽源数据模型 [Drag Source Data Model]**:
`DragSource` 数据结构，供新 **拖拽源呈现 [Drag Source Presentation]** 模块 [Module] 与 **过渡拖拽源接口 [Transitional Drag Source Interface]** 共同使用。
_Avoid_: 迁移时同时要求调用方更换数据模型 [Data Model] 和渲染模块 [Rendering Module]。

**源数据草稿 [Source Data Draft]**:
`source.data` 中携带的待创建 item 初始数据，不拥有最终决定权 [Final Authority]。
_Avoid_: 把 `source.data` 当成一定合法、完整的 item。

**拖入工厂函数 [Drop Factory Function]**:
`onDrop(source, index)` 形式的调用方函数，拥有创建新 item 的最终决定权 [Final Authority]。
_Avoid_: 当工厂函数或源数据都不能产出合法 item 时静默失败 [Silent Failure]。

**支持范围 [Supported Scope]**:
第一版只承诺本库创建的 `DndSource` / `DndSourceList` 到 `DndSortable` 的同页面拖入。
_Avoid_: 承诺跨浏览器标签、其他应用、文件拖入等外部原生拖拽 [Native Drag] 场景。

**关键测试顺序 [Critical Test Order]**:
外部拖入源重构的测试优先级 [Test Priority]，先覆盖会破坏 items 或迁移行为的关键路径 [Critical Paths]。
_Avoid_: 第一轮测试铺满所有边缘场景 [Edge Cases]，却漏掉拒绝拖入、创建优先级和旧接口一致性。

## Relationships

- **外部拖入源 [External Drag Source]** 只能被拖到 **放置目标 [Drop Target]**。
- **放置目标 [Drop Target]** 负责把外部拖入转换为 items 变化。
- **放置目标决策 [Drop Target Decision]** 只覆盖外部拖入 [External Drop]，不覆盖容器内排序 [Internal Reorder]。
- **放置目标决策 [Drop Target Decision]** 是纯决策模块 [Pure Decision Module]，返回接受/拒绝、插入位置 [Insert Position] 和新 item 等决策结果 [Decision Result]，由外壳 [Shell] 执行 `splice`、`setDragState`、`onItemsChange` 和拖拽会话清理 [Drag Session Cleanup]。
- **放置目标决策 [Drop Target Decision]** 将悬停决策 [Hover Decision] 与放下创建决策 [Drop Creation Decision] 分开，避免 `dragEnter` / `dragOver` 路径触发 **拖入工厂函数 [Drop Factory Function]** 或读取 **源数据草稿 [Source Data Draft]** 创建 item。
- **放置目标决策 [Drop Target Decision]** 的拒绝结果 [Rejected Result] 可以暴露内部原因码 [Internal Reason Code] 给模块测试 [Module Tests]，但不得通过包入口成为公开接口 [Public Interface]。
- **放置目标决策 [Drop Target Decision]** 是内部模块 [Internal Module]；公开接口 [Public Interface] 仍是 `DndSortable`、`DndSource`、`DndSourceList`、`accepts` 和 `onDrop`。
- **放置目标决策 [Drop Target Decision]** 的模块测试 [Module Tests] 可以从源码路径导入内部模块 [Internal Module]，直接覆盖 **接收规则 [Accept Rule]**、悬停决策 [Hover Decision]、创建优先级 [Creation Priority] 和失败规则 [Failure Rule]；DOM 测试 [DOM Tests] 只保留关键路径 [Critical Paths]。
- **放置目标 [Drop Target]** 通过名为 `accepts` 的 **接收规则 [Accept Rule]** 决定接受哪些 **外部拖入源 [External Drag Source]**，没有规则时默认接受全部。
- **接收规则 [Accept Rule]** 只依据 `source.type` 判断外部拖入是否可接受。
- 被 **接收规则 [Accept Rule]** 拒绝的 **外部拖入源 [External Drag Source]** 应触发 **拒绝放置反馈 [Rejected Drop Feedback]**。
- **拖拽源呈现 [Drag Source Presentation]** 必须支持单个源和一组源两种形态。
- **源列表 [Source List]** 提供默认 UI，默认沿用 `.dnd-drag-source` 样式，同时允许 `renderSource` 覆盖源呈现。
- **过渡拖拽源接口 [Transitional Drag Source Interface]** 保持兼容性 [Backward Compatibility]，通过 TypeScript JSDoc `@deprecated` 与 README 迁移说明提醒调用方，但不使用运行时 `console.warn`。
- **过渡拖拽源接口 [Transitional Drag Source Interface]** 必须遵守新的 **接收规则 [Accept Rule]** 与 **拒绝放置反馈 [Rejected Drop Feedback]**。
- **源触发器 [Source Trigger]** 通过组合式接口 [Composable Interface] 暴露拖拽行为属性 [Behavior Props]，允许调用方完全控制单个源的 UI 与 DOM 结构。
- 新 **拖拽源呈现 [Drag Source Presentation]** 模块 [Module] 复用现有 **拖拽源数据模型 [Drag Source Data Model]**。
- 当 **源数据草稿 [Source Data Draft]** 和 **拖入工厂函数 [Drop Factory Function]** 同时存在时，最终 item 以 **拖入工厂函数 [Drop Factory Function]** 返回值为准。
- 第一版 **支持范围 [Supported Scope]** 只覆盖库内同页面拖入，不覆盖外部原生拖拽 [Native Drag]。
- **关键测试顺序 [Critical Test Order]** 为：`accepts` 拒绝不改 items → `onDrop` 优先于 `source.data` → 无 `onDrop` 时用 `source.data` 创建 → 缺合法 item 开发环境报错 → 旧 `dragSources` 与新源模块行为一致。

## Example dialogue

> **Dev:** "左侧组件库需要用一个空的 DndSortable 渲染吗？"
> **Domain expert:** "不需要。它是 **外部拖入源 [External Drag Source]**，只能发起拖拽，不能接收放置。"

## Flagged ambiguities

- 已解决：`source.data` 和 `onDrop(source, index)` 同时存在时，`source.data` 是 **源数据草稿 [Source Data Draft]**，`onDrop` 是 **拖入工厂函数 [Drop Factory Function]** 并拥有最终决定权 [Final Authority]。
- 已解决：没有 `onDrop` 且 `source.data` 不能构造合法 item 时，应在开发环境报错 [Throw Error]，避免静默失败 [Silent Failure]。
- 已解决：是否接受外部拖入由 **放置目标 [Drop Target]** 的 **接收规则 [Accept Rule]** 决定；没有规则时默认接受所有源。
- 已解决：**拖拽源呈现 [Drag Source Presentation]** 同时支持单个源和一组源。
- 已解决：**接收规则 [Accept Rule]** 先只支持 `source.type` 粒度，不读取完整 `source.data`。
- 已解决：单个 **外部拖入源 [External Drag Source]** 必须支持调用方完全自定义 UI。
- 已解决：不被 **接收规则 [Accept Rule]** 接受的源拖到目标上时，不显示插入占位符 [Placeholder]，`dropEffect` 应为 `none`，放下后不触发 `onDrop`，也不改变 items。
- 已解决：保留 `DndSortable.dragSources` 作为 **过渡拖拽源接口 [Transitional Drag Source Interface]** 并标记弃用 [Deprecated]，不做直接破坏性变更 [Breaking Change]。
- 已解决：弃用提醒采用 TypeScript JSDoc `@deprecated` 与 README 迁移说明，不做运行时 `console.warn`。
- 已解决：过渡期的 `DndSortable.dragSources` 也必须遵守新的 **接收规则 [Accept Rule]** 与 **拒绝放置反馈 [Rejected Drop Feedback]**。
- 已解决：**源列表 [Source List]** 是带默认 UI 的便利模块 [Convenience Module]，但必须允许 `renderSource` 覆盖每个源的呈现。
- 已解决：新模块复用现有 `DragSource` 作为 **拖拽源数据模型 [Drag Source Data Model]**，避免迁移时同时修改数据结构与渲染方式。
- 已解决：**源触发器 [Source Trigger]** 采用组合式接口 [Composable Interface]，暴露拖拽行为属性 [Behavior Props]，不替调用方包额外 DOM。
- 已解决：**源列表 [Source List]** 默认 UI 继承当前 `.dnd-drag-source` 样式；使用 `renderSource` 覆盖时，调用方自行负责样式。
- 已解决：**接收规则 [Accept Rule]** 的公开命名采用 `accepts`，表达目标接受哪些 `source.type` 的集合语义。
- 已解决：单个 **源触发器 [Source Trigger]** 命名为 `DndSource`，一组 **源列表 [Source List]** 命名为 `DndSourceList`。
- 已解决：第一版只保证本库 `DndSource` / `DndSourceList` 到 `DndSortable` 的同页面拖入，不承诺跨浏览器标签、其他应用、文件拖入等外部原生拖拽 [Native Drag] 场景。
- 已解决：测试优先级 [Test Priority] 为 `accepts` 拒绝不改 items → `onDrop` 优先于 `source.data` → 无 `onDrop` 时用 `source.data` 创建 → 缺合法 item 开发环境报错 → 旧 `dragSources` 与新源模块行为一致。
- 已解决：**放置目标决策 [Drop Target Decision]** 第一轮深化只覆盖外部拖入 [External Drop]，不纳入容器内排序 [Internal Reorder]。
- 已解决：**放置目标决策 [Drop Target Decision]** 拥有创建失败 [Creation Failure] 规则，缺少 `onDrop` 且 `source.data.id` 不合法时由模块抛出清晰错误 [Clear Error]。
- 已解决：**放置目标决策 [Drop Target Decision]** 拥有悬停反馈 [Hover Feedback] 决策；被拒绝的 **外部拖入源 [External Drag Source]** 不应显示插入位置 [Insert Position]，`dropEffect` 应为 `none`。
- 已解决：**放置目标决策 [Drop Target Decision]** 保持纯函数 [Pure Function]，不直接接触 `DataTransfer`、React 事件 [React Event]、`setDragState` 或 `onItemsChange`。
- 已解决：**放置目标决策 [Drop Target Decision]** 不返回完整 items；它只返回决策结果 [Decision Result]，外壳 [Shell] 负责机械执行 [Mechanical Execution]。
- 已解决：**放置目标决策 [Drop Target Decision]** 拆分悬停决策 [Hover Decision] 与放下创建决策 [Drop Creation Decision]；悬停路径只决定接受/拒绝、`dropEffect` 和插入位置 [Insert Position]，不会触发 **拖入工厂函数 [Drop Factory Function]**。
- 已解决：**放置目标决策 [Drop Target Decision]** 的拒绝结果 [Rejected Result] 可以带内部原因码 [Internal Reason Code]，用于内部测试 [Internal Tests] 与调试 [Debugging]，但不进入公开接口 [Public Interface]。
- 已解决：**放置目标决策 [Drop Target Decision]** 是内部模块 [Internal Module]，不得从 `src/index.ts` 导出；本次深化不新增用户能力 [User-facing Capability]。
- 已解决：模块测试 [Module Tests] 可以直接从源码路径导入 **放置目标决策 [Drop Target Decision]**，用于覆盖分支；`DndSortable` 的 DOM 测试 [DOM Tests] 保留少量关键路径 [Critical Paths]，不承担全部分支覆盖 [Branch Coverage]。
