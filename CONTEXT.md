# react-sortable-dnd Context

这个上下文记录 `react-sortable-dnd` 的领域语言 [Domain Language]，用于保持拖拽排序接口 [Interface]、实现 [Implementation] 与文档中的命名一致。

## Language

**外部拖入源 [External Drag Source]**:
只能发起拖拽、不能接收放置 [Drop] 的源模块 [Module]。
_Avoid_: 用空的 **可排序容器 [Sortable Container]** 伪装成拖拽源。

**放置目标 [Drop Target]**:
可以接收放置并决定是否改变 items 的目标模块 [Module]。
_Avoid_: 让 **外部拖入源 [External Drag Source]** 改变 items。

**接收规则 [Accept Rule]**:
由 **放置目标 [Drop Target]** 声明的外部拖入过滤规则，默认接受所有 **外部拖入源 [External Drag Source]**。
_Avoid_: 让 **外部拖入源 [External Drag Source]** 自己决定能放到哪里。

**拖拽源呈现 [Drag Source Presentation]**:
把一个或多个 **外部拖入源 [External Drag Source]** 渲染为可拖拽 UI 的模块 [Module]。
_Avoid_: 只支持源列表，迫使调用方为了单个拖拽入口创建额外容器。

**源数据草稿 [Source Data Draft]**:
`source.data` 中携带的待创建 item 初始数据，不拥有最终决定权 [Final Authority]。
_Avoid_: 把 `source.data` 当成一定合法、完整的 item。

**拖入工厂函数 [Drop Factory Function]**:
`onDrop(source, index)` 形式的调用方函数，拥有创建新 item 的最终决定权 [Final Authority]。
_Avoid_: Silent failure when neither the factory nor source data can produce a valid item.

## Relationships

- **外部拖入源 [External Drag Source]** 只能被拖到 **放置目标 [Drop Target]**。
- **放置目标 [Drop Target]** 负责把外部拖入转换为 items 变化。
- **放置目标 [Drop Target]** 通过 **接收规则 [Accept Rule]** 决定接受哪些 **外部拖入源 [External Drag Source]**，没有规则时默认接受全部。
- **拖拽源呈现 [Drag Source Presentation]** 必须支持单个源和一组源两种形态。
- 当 **源数据草稿 [Source Data Draft]** 和 **拖入工厂函数 [Drop Factory Function]** 同时存在时，最终 item 以 **拖入工厂函数 [Drop Factory Function]** 返回值为准。

## Example dialogue

> **Dev:** "左侧组件库需要用一个空的 DndSortable 渲染吗？"
> **Domain expert:** "不需要。它是 **外部拖入源 [External Drag Source]**，只能发起拖拽，不能接收放置。"

## Flagged ambiguities

- 已解决：`source.data` 和 `onDrop(source, index)` 同时存在时，`source.data` 是 **源数据草稿 [Source Data Draft]**，`onDrop` 是 **拖入工厂函数 [Drop Factory Function]** 并拥有最终决定权 [Final Authority]。
- 已解决：没有 `onDrop` 且 `source.data` 不能构造合法 item 时，应在开发环境报错 [Throw Error]，避免静默失败 [Silent Failure]。
- 已解决：是否接受外部拖入由 **放置目标 [Drop Target]** 的 **接收规则 [Accept Rule]** 决定；没有规则时默认接受所有源。
- 已解决：**拖拽源呈现 [Drag Source Presentation]** 同时支持单个源和一组源。
