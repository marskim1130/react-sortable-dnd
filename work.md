# Work Log

2026-06-04 14:55 --- 发现 Vite 开发服务器配置了 `cors: true`，会允许任意来源访问本地开发服务器并增加源码暴露风险 --- 移除开放 CORS 配置，恢复 Vite 默认的本地来源限制 --- 修改了 `vite.config.ts`、`work.md`。撤回方式：恢复 `vite.config.ts` 中 `server.cors` 配置为 `true` 并删除本条 `work.md` 记录。

2026-06-04 15:43:27 +08:00 --- 发现外部拖入源 [External Drag Source] 与可排序容器 [Sortable Container] 的领域边界尚未记录，容易继续沿用空 `DndSortable` 伪装源列表的接口形状 --- 新建 `CONTEXT.md` 记录已确认的领域词汇、关系、优先级与失败模式 --- 修改了 `CONTEXT.md`、`work.md`。撤回方式：删除 `CONTEXT.md`，并删除本条 `work.md` 记录。

2026-06-04 15:48:08 +08:00 --- 发现接收规则 [Accept Rule] 与拖拽源呈现 [Drag Source Presentation] 的责任归属尚未记录，可能导致源模块 [Module] 与目标模块 [Module] 再次耦合 --- 在 `CONTEXT.md` 中补充默认接收策略、目标侧过滤规则，以及单个源/源列表都必须支持的领域约定 --- 修改了 `CONTEXT.md`、`work.md`。撤回方式：从 `CONTEXT.md` 删除本次新增的 `接收规则`、`拖拽源呈现`、相关关系与歧义条目，并删除本条 `work.md` 记录。

2026-06-04 16:01:00 +08:00 --- 发现包名被占用且本地未登录 npm，无法直接发布 --- 将 package.json 中的包名改为作用域包 @qiliangjin/react-sortable-dnd 并配置公开发布 publishConfig（含 registry 为官方源，解决国内镜像源无法发布的问题） --- 修改了 package.json、work.md。撤回方式：恢复 package.json 中包名为 "react-sortable-dnd" 并移除 publishConfig，最后删除本条 work.md 记录。

2026-06-04 16:10:00 +08:00 --- 准备开源到 GitHub 并同步当前所有修改 --- 本地暂存并提交所有更改，重命名分支为 main，并使用 gh cli 一键在远程创建公开仓库 react-sortable-dnd 自动完成关联与推送 --- 修改了 Git 本地与远程状态、work.md。撤回方式：本地执行 git branch -M master 恢复旧分支，并在 GitHub 上删除创建的仓库。

2026-06-04 16:15:23 +08:00 --- 发现接收规则 [Accept Rule] 的判断粒度与单个拖拽源 [Single Drag Source] 的 UI 控制权尚未记录，后续可能把目标过滤逻辑和源数据结构耦合 --- 在 `CONTEXT.md` 中明确接收规则只按 `source.type` 判断，新增源触发器 [Source Trigger] 词汇，并记录单个源必须支持调用方完全自定义 UI --- 修改了 `CONTEXT.md`、`work.md`。撤回方式：从 `CONTEXT.md` 删除本次新增的源触发器 [Source Trigger]、`source.type` 接收粒度、自定义 UI 相关关系与歧义条目，并删除本条 `work.md` 记录。

2026-06-04 16:29:58 +08:00 --- 发现拒绝放置反馈 [Rejected Drop Feedback] 与 `DndSortable.dragSources` 的迁移策略尚未记录，后续实现可能出现不可接收源仍显示占位符或直接破坏现有调用方的问题 --- 在 `CONTEXT.md` 中补充拒绝放置时的 UI/事件行为，并记录 `DndSortable.dragSources` 作为过渡拖拽源接口 [Transitional Drag Source Interface] 保留且标记弃用 [Deprecated] --- 修改了 `CONTEXT.md`、`work.md`。撤回方式：从 `CONTEXT.md` 删除本次新增的拒绝放置反馈、过渡拖拽源接口、相关关系与歧义条目，并删除本条 `work.md` 记录。

2026-06-04 16:31:27 +08:00 --- 发现弃用提醒 [Deprecation Notice] 的强度与过渡接口 [Transitional Interface] 的行为一致性尚未记录，可能导致运行时警告噪音或新旧入口行为分裂 --- 在 `CONTEXT.md` 中明确弃用提醒只使用 TypeScript JSDoc `@deprecated` 与 README 迁移说明，并要求 `DndSortable.dragSources` 同样遵守接收规则 [Accept Rule] 与拒绝放置反馈 [Rejected Drop Feedback] --- 修改了 `CONTEXT.md`、`work.md`。撤回方式：从 `CONTEXT.md` 删除本次新增的弃用提醒方式、过渡接口一致性关系与歧义条目，并删除本条 `work.md` 记录。

2026-06-04 16:53:16 +08:00 --- 发现源列表 [Source List] 的 UI 覆盖能力与拖拽源数据模型 [Drag Source Data Model] 的迁移策略尚未记录，可能导致新模块要么样式过死，要么迁移成本过高 --- 在 `CONTEXT.md` 中明确源列表提供默认 UI 且支持 `renderSource` 覆盖，并要求新拖拽源呈现 [Drag Source Presentation] 模块复用现有 `DragSource` 数据结构 --- 修改了 `CONTEXT.md`、`work.md`。撤回方式：从 `CONTEXT.md` 删除本次新增的源列表、拖拽源数据模型、相关关系与歧义条目，并删除本条 `work.md` 记录。

2026-06-04 16:58:09 +08:00 --- 发现源触发器 [Source Trigger] 的组合方式与源列表 [Source List] 的视觉兼容性 [Visual Compatibility] 尚未记录，可能导致实现时额外包 DOM 或破坏现有 `.dnd-drag-source` 样式 --- 在 `CONTEXT.md` 中明确源触发器采用组合式接口 [Composable Interface] 暴露拖拽行为属性 [Behavior Props]，并要求源列表默认 UI 继承当前 `.dnd-drag-source` 样式 --- 修改了 `CONTEXT.md`、`work.md`。撤回方式：从 `CONTEXT.md` 删除本次新增的行为属性、组合式接口、`.dnd-drag-source` 视觉兼容性相关描述与歧义条目，并删除本条 `work.md` 记录。

2026-06-04 16:59:24 +08:00 --- 发现接收规则 [Accept Rule] 与外部拖入源模块 [External Drag Source Module] 的公开命名尚未记录，可能导致后续接口草案 [Interface Draft] 在 `accept`/`accepts`、源模块名称之间反复漂移 --- 在 `CONTEXT.md` 中明确接收规则命名为 `accepts`，单个源触发器 [Source Trigger] 命名为 `DndSource`，源列表 [Source List] 命名为 `DndSourceList` --- 修改了 `CONTEXT.md`、`work.md`。撤回方式：从 `CONTEXT.md` 删除本次新增的 `accepts`、`DndSource`、`DndSourceList` 命名约定与歧义条目，并删除本条 `work.md` 记录。

2026-06-04 17:02:55 +08:00 --- 发现外部拖入源重构的支持范围 [Supported Scope] 与测试优先级 [Test Priority] 尚未记录，可能导致第一版误承诺跨标签/文件拖入等外部原生拖拽 [Native Drag] 场景，或测试偏离关键路径 [Critical Paths] --- 在 `CONTEXT.md` 中明确第一版只保证库内同页面拖入，并记录 `accepts` 拒绝、`onDrop` 优先级、`source.data` 回退、开发环境报错和旧接口一致性的关键测试顺序 [Critical Test Order] --- 修改了 `CONTEXT.md`、`work.md`。撤回方式：从 `CONTEXT.md` 删除本次新增的支持范围、关键测试顺序、相关关系与歧义条目，并删除本条 `work.md` 记录。

2026-06-04 17:08:07 +08:00 --- 需要将外部拖入源重构共识发布为产品需求文档 [Product Requirements Document] 并交给问题跟踪器 [Issue Tracker] 管理 --- 在 GitHub 创建 `ready-for-agent` 标签，并发布 PRD Issue `#1`：`PRD: 拆分外部拖入源模块并新增接收规则`，标签为 `ready-for-agent` --- 修改了 GitHub 远程状态、`work.md`。撤回方式：关闭或删除 GitHub Issue `#1`，删除 `ready-for-agent` 标签（若不再需要），并删除本条 `work.md` 记录。

2026-06-04 17:16:14 +08:00 --- 需要将 PRD Issue `#1` 拆解为可独立交付的垂直切片 [Vertical Slices]，避免水平分层 [Horizontal Slicing] 导致任务不可单独验证 --- 按依赖顺序在 GitHub 发布 6 个 `ready-for-agent` Issues：`#2` 实现 `DndSortable.accepts` 拒绝拖入路径、`#3` 固化外部 item 创建优先级、`#4` 新增 `DndSource` 单源触发器、`#5` 新增 `DndSourceList` 源列表、`#6` 标记 `dragSources` 为过渡接口并补迁移文档、`#7` 更新外部拖入示例为推荐源模块 --- 修改了 GitHub 远程状态、`work.md`。撤回方式：关闭或删除 GitHub Issues `#2` 到 `#7`，并删除本条 `work.md` 记录。

2026-06-04 17:18:50 +08:00 --- 开始 Issue `#2` 的红 [RED] 阶段时发现仓库没有测试运行器 [Test Runner]，无法表达 `accepts` 拒绝拖入路径的失败测试 [Failing Test] --- 安装 Vitest、Testing Library 和 jsdom，新增 `npm test` 脚本，并添加一个通过公开接口 [Public Interface] 验证旧 `dragSources` 被 `accepts` 拒绝时不会调用 `onDrop` 或 `onItemsChange` 的测试 --- 修改了 `package.json`、`package-lock.json`、`tests/DndSortable.accepts.test.tsx`、`work.md`。撤回方式：删除 `tests/DndSortable.accepts.test.tsx`，从 `package.json` 移除 `test` 脚本和新增测试依赖，运行 `npm install` 刷新 `package-lock.json`，并删除本条 `work.md` 记录。

2026-06-04 17:28:03 +08:00 --- 红 [RED] 测试确认 `accepts={['image']}` 时旧 `dragSources` 的 `text` 源仍会触发 `onDrop`，说明放置目标 [Drop Target] 未执行接收规则 [Accept Rule] --- 在 `DndSortable` 公开接口 [Public Interface] 与 `useDragDrop` 选项中加入 `accepts`，并在外部 drop 路径中拒绝不匹配的 `source.type`，阻止调用 `onDrop` 和 items 变更 --- 修改了 `src/types.ts`、`src/DndSortable.tsx`、`src/hooks/useDragDrop.ts`、`work.md`。撤回方式：从上述源码文件移除本次新增的 `accepts` 字段、传参和 drop 拒绝分支，并删除本条 `work.md` 记录。

2026-06-04 17:29:30 +08:00 --- Issue `#2` 的下一条关键行为是拒绝放置反馈 [Rejected Drop Feedback]：被 `accepts` 拒绝的源不应在 dragOver 时显示插入占位符 [Placeholder] --- 新增一个通过公开接口 [Public Interface] 验证旧 `dragSources` 被拒绝时不存在 `.dnd-sortable-placeholder--visible` 的红 [RED] 测试 --- 修改了 `tests/DndSortable.accepts.test.tsx`、`work.md`。撤回方式：删除该测试用例，并删除本条 `work.md` 记录。

2026-06-04 17:29:24 +08:00 --- 运行第二个红 [RED] 测试时发现失败点落在测试隔离 [Test Isolation]：前一个 render 未清理导致查询到两个 `Text`，而不是占位符 [Placeholder] 行为 --- 为测试文件加入显式 `cleanup` 和 jest-dom matcher，确保每个测试只验证自己的公开行为 [External Behavior] --- 修改了 `tests/DndSortable.accepts.test.tsx`、`work.md`。撤回方式：移除本次新增的 `@testing-library/jest-dom/vitest` 导入、`cleanup`/`afterEach` 导入和 `afterEach(cleanup)` 块，并删除本条 `work.md` 记录。

2026-06-04 17:29:51 +08:00 --- 第二个红 [RED] 测试意外通过，发现测试没有推进 `requestAnimationFrame`，因此没有真正观察到 dragOver 后的占位符 [Placeholder] 更新 --- 在该测试中同步执行 `requestAnimationFrame`，并在 `afterEach` 中恢复 mock，确保测试能捕捉拒绝放置反馈 [Rejected Drop Feedback] 的真实行为 --- 修改了 `tests/DndSortable.accepts.test.tsx`、`work.md`。撤回方式：移除本次新增的 `requestAnimationFrame` mock 和 `vi.restoreAllMocks()`，并删除本条 `work.md` 记录。

2026-06-04 17:30:20 +08:00 --- 红 [RED] 测试确认被 `accepts` 拒绝的旧 `dragSources` 源在 dragOver 时仍显示 `.dnd-sortable-placeholder--visible`，拒绝放置反馈 [Rejected Drop Feedback] 不完整 --- 在容器 dragOver 路径解析外部拖拽数据，若 `source.type` 不被接收规则 [Accept Rule] 接受，则设置 `dropEffect` 为 `none` 并清空插入位置，阻止占位符 [Placeholder] 显示 --- 修改了 `src/hooks/useDragDrop.ts`、`work.md`。撤回方式：从 `handleContainerDragOver` 移除本次新增的外部源拒绝分支与依赖项，并删除本条 `work.md` 记录。

2026-06-04 17:31:20 +08:00 --- Issue `#2` 的拒绝放置反馈 [Rejected Drop Feedback] 还需要覆盖 dragEnter 入口，否则被拒绝源进入目标时仍可能设置默认插入位置 [Insert Index] --- 新增一个通过公开接口 [Public Interface] 验证被拒绝的旧 `dragSources` 源触发 dragEnter 时不显示占位符 [Placeholder] 的红 [RED] 测试 --- 修改了 `tests/DndSortable.accepts.test.tsx`、`work.md`。撤回方式：删除该测试用例，并删除本条 `work.md` 记录。

2026-06-04 17:31:27 +08:00 --- 红 [RED] 测试确认被拒绝的旧 `dragSources` 源在 dragEnter 时仍显示占位符 [Placeholder]，说明拒绝放置反馈 [Rejected Drop Feedback] 只覆盖了 dragOver/drop 路径 --- 在容器 dragEnter 路径解析外部拖拽数据，若 `source.type` 不被接收规则 [Accept Rule] 接受，则清空插入位置并返回 --- 修改了 `src/hooks/useDragDrop.ts`、`work.md`。撤回方式：从 `handleContainerDragEnter` 移除本次新增的外部源拒绝分支与依赖项，并删除本条 `work.md` 记录。

2026-06-04 17:32:07 +08:00 --- 完成 Issue `#2` 当前 TDD 追踪子弹 [Tracer Bullets] 后需要验证测试与类型编译状态 --- 运行 `npm test` 确认 3 个测试全部通过；运行 `npm run build` 时 Rollup 在写出 `dist` 后超时并残留构建进程，已仅终止本次 17:32 启动的构建进程；随后运行 `npx tsc --noEmit --pretty false` 确认类型校验 [Type Check] 通过 --- 修改了 `dist` 构建输出、进程状态、`work.md`。撤回方式：重新运行一次成功的 `npm run build` 刷新 `dist`，并删除本条 `work.md` 记录。

2026-06-04 17:35:30 +08:00 --- 开始 Issue `#3` 红 [RED] 阶段，需要验证拖入工厂函数 [Drop Factory Function] 能读取源数据草稿 [Source Data Draft] 并以返回值作为最终 item --- 新增一个通过公开接口 [Public Interface] 使用旧 `dragSources` 携带 `source.data`，并断言 `onDrop` 返回的 item 被插入的失败测试 [Failing Test] --- 修改了 `tests/DndSortable.external-drop.test.tsx`、`work.md`。撤回方式：删除 `tests/DndSortable.external-drop.test.tsx`，并删除本条 `work.md` 记录。

2026-06-04 17:36:08 +08:00 --- 红 [RED] 测试确认 `onDrop` 只能收到 `{ type }`，导致拖入工厂函数 [Drop Factory Function] 无法读取源数据草稿 [Source Data Draft] --- 将外部拖拽数据 [Drag Data] 从只编码 `sourceType` 改为编码完整 `DragSource`，并让接收规则 [Accept Rule] 与 drop 路径读取 `dragData.source.type` 和完整 `dragData.source` --- 修改了 `src/hooks/useDragDrop.ts`、`work.md`。撤回方式：将 `ExternalDragData` 恢复为 `sourceType`，恢复 dragStart/dragEnter/dragOver/drop 中对应读取逻辑，并删除本条 `work.md` 记录。

2026-06-04 17:37:10 +08:00 --- Issue `#3` 的下一条关键行为是没有拖入工厂函数 [Drop Factory Function] 时，合法源数据草稿 [Source Data Draft] 应能直接创建 item --- 新增一个通过公开接口 [Public Interface] 验证未提供 `onDrop` 时旧 `dragSources` 的 `source.data` 会被插入 items 的红 [RED] 测试 --- 修改了 `tests/DndSortable.external-drop.test.tsx`、`work.md`。撤回方式：删除该测试用例，并删除本条 `work.md` 记录。

2026-06-04 17:37:11 +08:00 --- 红 [RED] 测试确认未提供 `onDrop` 时，即使 `source.data` 已包含合法 `id`，外部 drop 也不会创建 item --- 在外部 drop 路径中加入最小回退：当没有拖入工厂函数 [Drop Factory Function] 且 `source.data.id` 是字符串时，将源数据草稿 [Source Data Draft] 作为新 item 插入 --- 修改了 `src/hooks/useDragDrop.ts`、`work.md`。撤回方式：从外部 drop 路径移除本次新增的 `source.data` 回退逻辑，并删除本条 `work.md` 记录。

2026-06-04 17:38:10 +08:00 --- Issue `#3` 还需要防止静默失败 [Silent Failure]：没有拖入工厂函数 [Drop Factory Function] 且源数据草稿 [Source Data Draft] 缺少合法 `id` 时应抛出清晰错误 [Clear Error] --- 新增一个通过公开接口 [Public Interface] 验证无 `onDrop` 且 `source.data.id` 缺失时 drop 会抛错且不改变 items 的红 [RED] 测试 --- 修改了 `tests/DndSortable.external-drop.test.tsx`、`work.md`。撤回方式：删除该测试用例，并删除本条 `work.md` 记录。

2026-06-04 17:38:10 +08:00 --- 红 [RED] 测试确认无 `onDrop` 且 `source.data.id` 缺失时外部 drop 会静默返回，没有暴露配置错误 [Configuration Error] --- 将外部 drop 创建失败路径改为抛出 `DndSortable external drop requires onDrop or source.data.id`，避免静默失败 [Silent Failure] --- 修改了 `src/hooks/useDragDrop.ts`、`work.md`。撤回方式：将该错误抛出恢复为静默返回，并删除本条 `work.md` 记录。

2026-06-04 17:38:33 +08:00 --- 运行绿 [GREEN] 测试时发现 React 事件系统 [React Event System] 将 drop 处理器中的错误作为 window 级错误上报，`toThrow` 无法捕获，导致测试断言方式不匹配真实事件传播 [Event Propagation] --- 将错误断言改为监听 `window.error` 并阻止默认上抛，再验证清晰错误 [Clear Error] 消息，同时继续断言 items 未变更 --- 修改了 `tests/DndSortable.external-drop.test.tsx`、`work.md`。撤回方式：恢复该测试中的 `toThrow` 断言写法，并删除本条 `work.md` 记录。

2026-06-04 17:39:06 +08:00 --- 运行绿 [GREEN] 测试时发现错误监听器 [Error Listener] 被误放到合法 `source.data` 测试中，导致非法 `source.data` 测试缺少 `handleError` 作用域 [Scope] --- 将 `window.error` 监听器移动到非法 `source.data` 测试内，恢复测试夹具 [Test Fixture] 的局部性 [Locality] --- 修改了 `tests/DndSortable.external-drop.test.tsx`、`work.md`。撤回方式：还原本次移动的错误监听器代码，并删除本条 `work.md` 记录。

2026-06-04 17:40:33 +08:00 --- 开始 Issue `#4` 红 [RED] 阶段，需要固定 `DndSource` 的公开接口 [Public Interface]：通过组合式接口 [Composable Interface] 暴露拖拽行为属性 [Behavior Props]，不包额外 DOM，并能同页面拖入 [Same-page Drag] 到 `DndSortable` --- 新增一个使用 `DndSource` 包装调用方自定义按钮并拖入 `DndSortable` 的失败测试 [Failing Test] --- 修改了 `tests/DndSource.test.tsx`、`work.md`。撤回方式：删除 `tests/DndSource.test.tsx`，并删除本条 `work.md` 记录。

2026-06-04 17:41:08 +08:00 --- 红 [RED] 测试确认 `DndSource` 尚未导出，无法作为源触发器 [Source Trigger] 使用 --- 新增 `DndSource`，通过组合式接口 [Composable Interface] 向调用方暴露拖拽行为属性 [Behavior Props]，复用 `DragSource` 数据模型 [Data Model] 编码同页面外部拖拽数据 [Drag Data]，并从包入口导出组件与类型 --- 修改了 `src/DndSource.tsx`、`src/index.ts`、`src/types.ts`、`work.md`。撤回方式：删除 `src/DndSource.tsx`，从 `src/index.ts` 和 `src/types.ts` 移除本次新增的导出与类型，并删除本条 `work.md` 记录。

2026-06-04 17:42:11 +08:00 --- 开始 Issue `#5` 红 [RED] 阶段，需要固定 `DndSourceList` 默认 UI 与同页面拖入 [Same-page Drag] 行为 --- 新增一个通过公开接口 [Public Interface] 验证 `DndSourceList` 渲染 `.dnd-drag-source` 默认源项，并能将 `source.data` 拖入 `DndSortable` 的失败测试 [Failing Test] --- 修改了 `tests/DndSourceList.test.tsx`、`work.md`。撤回方式：删除 `tests/DndSourceList.test.tsx`，并删除本条 `work.md` 记录。

2026-06-04 17:42:49 +08:00 --- 红 [RED] 测试确认 `DndSourceList` 尚未导出，无法作为源列表 [Source List] 使用 --- 新增 `DndSourceList`，通过复用 `DndSource` 渲染一组外部拖入源 [External Drag Source]，默认沿用 `.dnd-drag-source` UI，并从包入口导出组件与类型 --- 修改了 `src/DndSourceList.tsx`、`src/index.ts`、`src/types.ts`、`work.md`。撤回方式：删除 `src/DndSourceList.tsx`，从 `src/index.ts` 和 `src/types.ts` 移除本次新增的导出与类型，并删除本条 `work.md` 记录。

2026-06-04 17:43:31 +08:00 --- 运行 `DndSourceList` 绿 [GREEN] 测试时发现新测试文件缺少 jest-dom matcher，导致 `toBeInTheDocument` 不是有效断言 [Assertion] --- 为 `tests/DndSourceList.test.tsx` 导入 `@testing-library/jest-dom/vitest`，保持测试夹具 [Test Fixture] 与其他 DOM 测试一致 --- 修改了 `tests/DndSourceList.test.tsx`、`work.md`。撤回方式：移除该导入，并删除本条 `work.md` 记录。

2026-06-04 17:44:20 +08:00 --- Issue `#5` 的验收标准 [Acceptance Criteria] 要求 `renderSource` 覆盖路径有自动化测试 [Automated Test]，而前一步 `DndSourceList` 最小实现已包含该路径但尚未被测试固定 --- 新增一个验证 `renderSource` 能提供自定义按钮 UI、接收拖拽行为属性 [Behavior Props] 并拖入 `DndSortable` 的测试，作为已实现行为的覆盖测试 [Coverage Test] --- 修改了 `tests/DndSourceList.test.tsx`、`work.md`。撤回方式：删除该测试用例，并删除本条 `work.md` 记录。

2026-06-04 17:45:01 +08:00 --- 开始 Issue `#6` 时发现 README 仍把 `DndSortable.dragSources` 作为推荐外部拖入入口，且类型文档未标记弃用 [Deprecated] --- 在 `DndSortableProps.dragSources` 上添加 TypeScript JSDoc `@deprecated`，将 README 外部拖入示例迁移为 `DndSourceList`，新增 `DndSource`/`DndSourceList` API 说明，并记录旧 `dragSources` 仍遵守 `accepts` 与拒绝放置反馈 [Rejected Drop Feedback] --- 修改了 `src/types.ts`、`README.md`、`work.md`。撤回方式：移除 `dragSources` 的 `@deprecated` 注释，恢复 README 中旧 `dragSources` 示例与 API 表，并删除本条 `work.md` 记录。

2026-06-04 17:46:01 +08:00 --- 开始 Issue `#7` 时发现外部拖入示例仍使用空 `DndSortable` 伪装外部拖入源 [External Drag Source]，与推荐源模块 [Recommended Source Module] 不一致 --- 将示例左侧组件库迁移为 `DndSourceList`，新增一个 `DndSource` 自定义按钮示例，并让右侧 `DndSortable` 通过 `accepts` 明确接收类型 --- 修改了 `examples/with-external-source.tsx`、`work.md`。撤回方式：恢复示例中旧的空 `DndSortable` 源列表写法，移除 `DndSource`/`DndSourceList` 示例与 `accepts`，并删除本条 `work.md` 记录。

2026-06-04 17:46:46 +08:00 --- 单独校验外部拖入示例时发现 `DragSource.icon` 是 ReactNode，而示例的 `ComponentItem.icon` 要求字符串，直接回填会造成类型错误 [Type Error] --- 在示例 `handleDrop` 中将 `source.data.icon` / `source.icon` 归一化为字符串后再写入 item --- 修改了 `examples/with-external-source.tsx`、`work.md`。撤回方式：恢复 `handleDrop` 中原先直接使用 `source.data?.icon || source.icon || '📦'` 的写法，并删除本条 `work.md` 记录。

2026-06-05 11:25:33 +08:00 --- 代码审查 [Code Review] 发现两个问题：新 `DndSource` / `DndSourceList` 拖入 `DndSortable` 时不会显示已接受拖入的占位符 [Placeholder]，且完整 `DragSource` 经 `DataTransfer` JSON 序列化会丢失非 JSON 数据语义 --- 在 `tests/DndSource.test.tsx` 中新增两个红 [RED] 测试：验证已接受的 `DndSource` hover 时显示插入占位符，并验证同页面拖入 [Same-page Drag] 中 `source.data` 的 Date 对象能被 `onDrop` 原样读取 --- 修改了 `tests/DndSource.test.tsx`、`work.md`。撤回方式：删除这两个测试用例，移除该文件新增的 jest-dom 导入和 `vi.restoreAllMocks()`，并删除本条 `work.md` 记录。

2026-06-05 11:28:37 +08:00 --- 红测 [RED Test] 确认新源模块悬停占位符缺失，且同页拖拽数据经 JSON 序列化后丢失对象身份 --- 新增内部拖拽载荷模块 [Drag Payload Module]，用注册表 [Registry] 保存同页外部源原始对象；同时让可接受外部源悬停时在目标侧显示拖拽反馈 [Drop Feedback]，并在结束/放置后清理注册表 --- 修改了 `src/dragData.ts`、`src/DndSource.tsx`、`src/hooks/useDragDrop.ts`、`work.md`。撤回方式：删除 `src/dragData.ts`，恢复 `DndSource.tsx` 与 `useDragDrop.ts` 中原本直接 `JSON.stringify` 写入 `application/json` 的逻辑，并删除本条 `work.md` 记录。

2026-06-05 11:40:21 +08:00 --- 准备发布 npm 时发现当前 `@qiliangjin/react-sortable-dnd@0.1.0` 已存在于 npm，且本机 `npm whoami` 返回 `ENEEDAUTH`，无法完成远程发布 [Remote Publish] --- 执行发布预检 [Release Preflight]：`npm test`、`npx tsc --noEmit --pretty false`、`npm run build`、`npm pack --dry-run` 均通过，确认包内容包含 `dist` 声明文件 [Declaration Files] 与构建产物 [Build Artifacts]；暂不修改版本号 [Version] 以避免猜测发布策略 --- 修改了构建输出 `dist`（未出现在 Git 状态中）和 `work.md`。撤回方式：删除本条 `work.md` 记录；如需撤回本地构建输出，可删除 `dist` 后重新运行期望版本的构建命令生成。

2026-06-05 11:47:45 +08:00 --- 用户确认 npm 目标版本 [Target Version] 为 `0.2.0`，且 npm 登录状态 [Auth State] 已恢复，但远程发布 [Remote Publish] 被 npm 双因素认证 [Two-Factor Authentication] 阻塞 --- 使用 `npm version 0.2.0 --no-git-tag-version` 更新版本，执行 `npm test`、`npx tsc --noEmit --pretty false`、`npm run build`、`npm pack --dry-run` 均通过；执行 `npm publish --registry=https://registry.npmjs.org/` 时通过发布前构建 [Prepublish Build]，但 npm 返回 `EOTP` 要求一次性密码 [One-Time Password]；再次查询确认 `0.2.0` 尚未发布 --- 修改了 `package.json`、`package-lock.json`、构建输出 `dist`（未出现在 Git 状态中）和 `work.md`。撤回方式：若放弃 `0.2.0`，执行 `npm version 0.1.0 --no-git-tag-version` 或手动恢复 `package.json`/`package-lock.json` 版本字段，并删除本条 `work.md` 记录；如需继续发布，获取 npm OTP 后运行 `npm publish --otp=<OTP> --registry=https://registry.npmjs.org/`。

2026-06-06 09:52:50 +08:00 --- 整理仓库时发现 README 仍包含 npm/GitHub/邮箱占位符 [Placeholders]，`package.json` 缺少开源包常见仓库元数据 [Repository Metadata]，仓库也缺少贡献、安全、变更记录与 GitHub 协作模板 [Collaboration Templates] --- 按默认开源仓库整理范围补齐 `repository`/`bugs`/`homepage`，修正 README 的 scoped npm 包名与真实 GitHub 地址，新增贡献指南 [Contributing Guide]、变更记录 [Changelog]、安全政策 [Security Policy]、行为准则 [Code of Conduct]、EditorConfig、Issue 模板和 PR 模板，并将覆盖率目录 [Coverage Directory] 加入忽略列表；随后验证占位符搜索无命中，`npm test`、`npx tsc --noEmit --pretty false`、`npm pack --dry-run` 均通过 --- 修改了 `package.json`、`README.md`、`.gitignore`、`.editorconfig`、`CONTRIBUTING.md`、`CHANGELOG.md`、`SECURITY.md`、`CODE_OF_CONDUCT.md`、`.github/ISSUE_TEMPLATE/bug_report.yml`、`.github/ISSUE_TEMPLATE/feature_request.yml`、`.github/ISSUE_TEMPLATE/config.yml`、`.github/PULL_REQUEST_TEMPLATE.md`、`work.md`。撤回方式：从 `package.json` 移除本次新增的 `homepage`、`repository`、`bugs` 字段，恢复 README 中本次改动的包名/链接/贡献/联系方式文本，从 `.gitignore` 移除 `coverage/`，删除本次新增的 `.editorconfig`、`CONTRIBUTING.md`、`CHANGELOG.md`、`SECURITY.md`、`CODE_OF_CONDUCT.md` 和 `.github/` 下新增模板文件，并删除本条 `work.md` 记录。

2026-06-06 10:55:00 +08:00 --- 发现缺少关于原生拖拽功能、React Hooks 封装以及项目底层 Hook 设计思路的技术博客总结 --- 创建并编写 `blog.md`，从原生 HTML5 拖放事件流到简易 Hook 封装，系统性剖析了 `useDragDrop` 与 `useSelection` 组合模式、拖拽源与放置目标解耦、性能优化及回弹动画等架构细节，并附带 npm 包与 GitHub 推广链接 --- 修改了 `blog.md`、`work.md`。撤回方式：删除 `blog.md`，并在 `work.md` 中删除本条记录。

2026-06-06 --- 发现 npm 发布包的联系方式显示为占位符 `your-email@example.com`，`package.json` 的 `author` 字段只有姓名没有邮箱 --- 将 `author` 从纯字符串改为对象格式，新增 `email: "1146232464@qq.com"` --- 修改了 `package.json`、`work.md`。撤回方式：`git checkout -- package.json`，并删除本条 `work.md` 记录。

2026-06-06 17:13:00 +08:00 --- 用户触发架构改进技能 [Architecture Improvement Skill]，需要基于 `CONTEXT.md` 和现有源码找出深模块 [Deep Module] 候选项 --- 生成临时 HTML 架构审查报告，列出放置目标决策 [Drop Target Decision]、同页面拖拽会话 [Same-page Drag Session]、拖拽手柄 [Drag Handle] 和 DataTransfer 测试夹具 [Test Fixture] 四个候选方向 --- 修改了 `C:\Users\Qilia\AppData\Local\Temp\architecture-review-20260606-171300.html`、`work.md`。撤回方式：删除该临时 HTML 文件，并删除本条 `work.md` 记录。

2026-06-06 17:47:37 +08:00 --- 深化放置目标决策 [Drop Target Decision] 的拷问环节 [Grilling Loop] 已确认模块范围 [Module Scope]、纯函数 [Pure Function] 约束、创建失败 [Creation Failure] 和机械执行 [Mechanical Execution] 分工 --- 将 **放置目标决策 [Drop Target Decision]** 加入领域上下文 [Domain Context]，记录它只覆盖外部拖入 [External Drop]、拥有接收/悬停/创建规则、不返回完整 items 且不直接执行副作用 [Side Effects] --- 修改了 `CONTEXT.md`、`work.md`。撤回方式：从 `CONTEXT.md` 删除本次新增的 **放置目标决策 [Drop Target Decision]** 术语、关系和已解决歧义条目，并删除本条 `work.md` 记录。

2026-06-06 17:49:58 +08:00 --- 继续拷问放置目标决策 [Drop Target Decision] 时确认悬停反馈 [Hover Feedback] 与放下创建 [Drop Creation] 需要拆成两个决策入口 [Decision Entry Points] --- 更新 `CONTEXT.md`，记录悬停决策 [Hover Decision] 只决定接受/拒绝、`dropEffect` 和插入位置 [Insert Position]，不会触发拖入工厂函数 [Drop Factory Function] 或创建 item --- 修改了 `CONTEXT.md`、`work.md`。撤回方式：从 `CONTEXT.md` 删除本次新增的悬停决策 [Hover Decision] / 放下创建决策 [Drop Creation Decision] 分工描述，并删除本条 `work.md` 记录。

2026-06-06 17:53:31 +08:00 --- 继续拷问放置目标决策 [Drop Target Decision] 时确认拒绝结果 [Rejected Result] 需要原因码 [Reason Code]，但不能增加公开接口负担 [Public Interface Burden] --- 更新 `CONTEXT.md`，记录内部原因码 [Internal Reason Code] 只服务模块测试 [Module Tests] 与调试 [Debugging]，不得从包入口暴露为公开接口 [Public Interface] --- 修改了 `CONTEXT.md`、`work.md`。撤回方式：从 `CONTEXT.md` 删除本次新增的拒绝结果 [Rejected Result] / 内部原因码 [Internal Reason Code] 描述，并删除本条 `work.md` 记录。

2026-06-06 17:56:37 +08:00 --- 继续拷问放置目标决策 [Drop Target Decision] 时确认该深化是内部实现 [Internal Implementation]，不新增用户能力 [User-facing Capability] --- 更新 `CONTEXT.md`，记录 **放置目标决策 [Drop Target Decision]** 是内部模块 [Internal Module]，不得从 `src/index.ts` 导出，公开接口 [Public Interface] 仍是 `DndSortable`、`DndSource`、`DndSourceList`、`accepts` 和 `onDrop` --- 修改了 `CONTEXT.md`、`work.md`。撤回方式：从 `CONTEXT.md` 删除本次新增的内部模块 [Internal Module] / 不导出约束 [Export Constraint] 描述，并删除本条 `work.md` 记录。

2026-06-06 17:57:47 +08:00 --- 继续拷问放置目标决策 [Drop Target Decision] 时确认测试策略 [Test Strategy]：内部模块 [Internal Module] 不公开导出，但模块测试 [Module Tests] 可以从源码路径导入 --- 更新 `CONTEXT.md`，记录模块测试 [Module Tests] 直接覆盖接收规则 [Accept Rule]、悬停决策 [Hover Decision]、创建优先级 [Creation Priority] 与失败规则 [Failure Rule]，DOM 测试 [DOM Tests] 保留关键路径 [Critical Paths] --- 修改了 `CONTEXT.md`、`work.md`。撤回方式：从 `CONTEXT.md` 删除本次新增的模块测试 [Module Tests] / DOM 测试 [DOM Tests] 分工描述，并删除本条 `work.md` 记录。

2026-06-06 17:59:04 +08:00 --- 开始放置目标决策 [Drop Target Decision] 的 `/tdd` 红 [RED] 阶段，需要先固定被接收规则 [Accept Rule] 拒绝的外部拖入源 [External Drag Source] 悬停反馈 [Hover Feedback] --- 新增一个模块测试 [Module Test]，从源码路径导入尚未实现的内部模块 [Internal Module]，断言被拒绝时返回 `status: rejected`、内部原因码 [Internal Reason Code]、`dropEffect: none` 与空插入位置 [Insert Position] --- 修改了 `tests/dropTargetDecision.test.ts`、`work.md`。撤回方式：删除 `tests/dropTargetDecision.test.ts`，并删除本条 `work.md` 记录。

2026-06-06 18:00:08 +08:00 --- 红 [RED] 测试确认 `src/dropTargetDecision` 内部模块 [Internal Module] 尚不存在，无法导入悬停决策 [Hover Decision] --- 新增最小的 `decideExternalHover` 实现 [Minimal Implementation]，让被 `accepts` 拒绝的外部拖入源 [External Drag Source] 返回拒绝结果 [Rejected Result]、内部原因码 [Internal Reason Code]、`dropEffect: none` 和空插入位置 [Insert Position] --- 修改了 `src/dropTargetDecision.ts`、`work.md`。撤回方式：删除 `src/dropTargetDecision.ts`，并删除本条 `work.md` 记录。

2026-06-06 18:05:01 +08:00 --- 继续放置目标决策 [Drop Target Decision] 的 `/tdd` 红 [RED] 阶段，需要固定放下创建决策 [Drop Creation Decision] 中拖入工厂函数 [Drop Factory Function] 优先于源数据草稿 [Source Data Draft] --- 新增一个模块测试 [Module Test]，导入尚未实现的 `decideExternalDrop`，断言同时存在 `onDrop` 与 `source.data` 时决策结果 [Decision Result] 使用工厂函数返回的 item 并保留插入位置 [Insert Position] --- 修改了 `tests/dropTargetDecision.test.ts`、`work.md`。撤回方式：删除该测试用例，移除 `decideExternalDrop` 导入，并删除本条 `work.md` 记录。

2026-06-06 18:07:09 +08:00 --- 红 [RED] 测试确认 `decideExternalDrop` 尚未实现，无法执行放下创建决策 [Drop Creation Decision] --- 新增最小的 `decideExternalDrop` 实现 [Minimal Implementation]，调用拖入工厂函数 [Drop Factory Function] 并返回接受结果 [Accepted Result]、创建出的 item 与原插入位置 [Insert Position] --- 修改了 `src/dropTargetDecision.ts`、`work.md`。撤回方式：从 `src/dropTargetDecision.ts` 删除 `ExternalDropDecisionOptions`、`ExternalDropDecision` 与 `decideExternalDrop`，并删除本条 `work.md` 记录。

2026-06-06 18:09:19 +08:00 --- 继续放置目标决策 [Drop Target Decision] 的 `/tdd` 红 [RED] 阶段，需要固定没有拖入工厂函数 [Drop Factory Function] 时使用合法源数据草稿 [Source Data Draft] 创建 item --- 新增一个模块测试 [Module Test]，断言 `decideExternalDrop` 在没有 `onDrop` 且 `source.data.id` 合法时返回源数据草稿 [Source Data Draft] 和原插入位置 [Insert Position] --- 修改了 `tests/dropTargetDecision.test.ts`、`work.md`。撤回方式：删除该测试用例，并删除本条 `work.md` 记录。

2026-06-06 18:10:57 +08:00 --- 红 [RED] 测试确认 `decideExternalDrop` 强制调用拖入工厂函数 [Drop Factory Function]，无法在缺少 `onDrop` 时使用合法源数据草稿 [Source Data Draft] --- 将 `onDrop` 改为可选 [Optional]，并在缺少 `onDrop` 时返回 `source.data` 作为创建出的 item，保持插入位置 [Insert Position] 不变 --- 修改了 `src/dropTargetDecision.ts`、`work.md`。撤回方式：将 `ExternalDropDecisionOptions.onDrop` 恢复为必填，并恢复 `item: onDrop(source, insertIndex)`，再删除本条 `work.md` 记录。

2026-06-06 18:12:13 +08:00 --- 继续放置目标决策 [Drop Target Decision] 的 `/tdd` 红 [RED] 阶段，需要固定创建失败 [Creation Failure] 规则：缺少拖入工厂函数 [Drop Factory Function] 且源数据草稿 [Source Data Draft] 没有合法 `id` 时不能静默创建 --- 新增一个模块测试 [Module Test]，断言 `decideExternalDrop` 在无法创建 item 时抛出包含 `onDrop or source.data.id` 的清晰错误 [Clear Error] --- 修改了 `tests/dropTargetDecision.test.ts`、`work.md`。撤回方式：删除该测试用例，并删除本条 `work.md` 记录。

2026-06-06 18:14:07 +08:00 --- 红 [RED] 测试确认 `decideExternalDrop` 会把没有合法 `id` 的源数据草稿 [Source Data Draft] 当作 item 返回，导致创建失败 [Creation Failure] 静默通过 --- 在放下创建决策 [Drop Creation Decision] 中检查创建出的 item 是否存在且 `id` 为字符串，失败时抛出 `DndSortable external drop requires onDrop or source.data.id` 清晰错误 [Clear Error] --- 修改了 `src/dropTargetDecision.ts`、`work.md`。撤回方式：移除 `decideExternalDrop` 中的合法 `id` 检查和错误抛出，恢复直接返回 `item`，并删除本条 `work.md` 记录。

2026-06-06 18:15:44 +08:00 --- 继续放置目标决策 [Drop Target Decision] 的 `/tdd` 红 [RED] 阶段，需要固定放下创建决策 [Drop Creation Decision] 也遵守接收规则 [Accept Rule]，被拒绝时不能调用拖入工厂函数 [Drop Factory Function] --- 新增一个模块测试 [Module Test]，断言 `accepts` 不包含 `source.type` 时 `decideExternalDrop` 不调用 `onDrop`，并返回拒绝结果 [Rejected Result]、内部原因码 [Internal Reason Code] 与空插入位置 [Insert Position] --- 修改了 `tests/dropTargetDecision.test.ts`、`work.md`。撤回方式：删除该测试用例，移除 `vi` 导入，并删除本条 `work.md` 记录。

2026-06-06 18:17:04 +08:00 --- 红 [RED] 测试确认 `decideExternalDrop` 在判断接收规则 [Accept Rule] 前调用拖入工厂函数 [Drop Factory Function]，导致被拒绝的外部拖入源 [External Drag Source] 仍触发创建 --- 为放下创建决策 [Drop Creation Decision] 增加 `accepts` 输入，先按 `source.type` 返回拒绝结果 [Rejected Result] 与空插入位置 [Insert Position]，再进入 item 创建规则 [Creation Rule] --- 修改了 `src/dropTargetDecision.ts`、`work.md`。撤回方式：从 `ExternalDropDecisionOptions` 移除 `accepts`，将 `ExternalDropDecision` 恢复为仅接受结果 [Accepted Result]，删除 `decideExternalDrop` 中的接收规则 [Accept Rule] 判断，并删除本条 `work.md` 记录。

2026-06-06 18:18:08 +08:00 --- 放置目标决策 [Drop Target Decision] 模块测试 [Module Tests] 已覆盖外部拖入 [External Drop] 的接收规则 [Accept Rule]、悬停反馈 [Hover Feedback]、创建优先级 [Creation Priority] 和创建失败 [Creation Failure]，可以进入重构 [REFACTOR] 接入现有拖拽外壳 [Drag Shell] --- 将 `useDragDrop` 的外部 `dragEnter` / `dragOver` / `drop` 路径改为调用 `decideExternalHover` 与 `decideExternalDrop`，让 React 事件处理器 [React Event Handler] 只做机械执行 [Mechanical Execution]、状态反馈 [State Feedback] 和 items 插入 --- 修改了 `src/hooks/useDragDrop.ts`、`work.md`。撤回方式：移除 `useDragDrop` 对 `dropTargetDecision` 的导入，恢复本次替换前的 `acceptsExternalSource` 判断、`onDrop` / `source.data` 创建逻辑和错误抛出位置，并删除本条 `work.md` 记录。
