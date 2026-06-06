# Changelog

本项目遵循面向用户的变更记录 [User-facing Changelog]。版本日期使用北京时间 [Asia/Shanghai]。

## Unreleased

- 补充开源协作文档 [Open-source Collaboration Docs]、Issue 模板 [Issue Templates] 和包元数据 [Package Metadata]。

## 0.2.0 - 2026-06-05

- 新增 `DndSource` 与 `DndSourceList`，用于组合式外部拖入源 [Composable External Drag Sources]。
- 为 `DndSortable` 增加 `accepts` 接收规则 [Accept Rule]，拒绝不匹配的外部拖入源。
- 保留 `dragSources` 过渡接口 [Transitional API]，并在文档中标记迁移方向。
- 补充外部拖入 [External Drop]、拒绝放置反馈 [Rejected Drop Feedback] 和同页面拖拽 [Same-page Drag] 测试。

## 0.1.0

- 初始发布：提供 `DndSortable`、`DndHandle`、基础排序 [Sorting]、主题变量 [Theme Variables] 和双格式构建 [Dual-format Build]。
