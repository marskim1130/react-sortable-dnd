# 贡献指南

感谢你愿意改进 `@qiliangjin/react-sortable-dnd`。这个仓库优先保持 API 小、行为清晰、测试能覆盖关键路径 [Critical Paths]。

## 开始之前

- 先搜索现有 Issue，避免重复讨论。
- 新功能请先描述使用场景 [Use Case]、公开 API [Public API] 和兼容性影响 [Compatibility Impact]。
- Bug 报告请提供最小复现 [Minimal Reproduction]、期望行为 [Expected Behavior] 和实际行为 [Actual Behavior]。

## 本地开发

```bash
npm install
npm test
npx tsc --noEmit --pretty false
npm run build
```

## Pull Request

提交 PR 前请确认：

- 变更范围聚焦，避免混入无关重构 [Refactor]。
- 新行为通过公开接口 [Public Interface] 测试，而不是依赖内部实现。
- README、类型定义 [Type Definitions] 或示例在 API 变化时同步更新。
- `npm test` 和类型检查 [Type Check] 通过。

## 提交信息

建议使用简短、可读的提交信息，例如：

```text
feat: add external source list
fix: reject unsupported drag source
docs: update package metadata
```
