# Work Log

2026-06-04 14:55 --- 发现 Vite 开发服务器配置了 `cors: true`，会允许任意来源访问本地开发服务器并增加源码暴露风险 --- 移除开放 CORS 配置，恢复 Vite 默认的本地来源限制 --- 修改了 `vite.config.ts`、`work.md`。撤回方式：恢复 `vite.config.ts` 中 `server.cors` 配置为 `true` 并删除本条 `work.md` 记录。

2026-06-04 15:43:27 +08:00 --- 发现外部拖入源 [External Drag Source] 与可排序容器 [Sortable Container] 的领域边界尚未记录，容易继续沿用空 `DndSortable` 伪装源列表的接口形状 --- 新建 `CONTEXT.md` 记录已确认的领域词汇、关系、优先级与失败模式 --- 修改了 `CONTEXT.md`、`work.md`。撤回方式：删除 `CONTEXT.md`，并删除本条 `work.md` 记录。

2026-06-04 15:48:08 +08:00 --- 发现接收规则 [Accept Rule] 与拖拽源呈现 [Drag Source Presentation] 的责任归属尚未记录，可能导致源模块 [Module] 与目标模块 [Module] 再次耦合 --- 在 `CONTEXT.md` 中补充默认接收策略、目标侧过滤规则，以及单个源/源列表都必须支持的领域约定 --- 修改了 `CONTEXT.md`、`work.md`。撤回方式：从 `CONTEXT.md` 删除本次新增的 `接收规则`、`拖拽源呈现`、相关关系与歧义条目，并删除本条 `work.md` 记录。

2026-06-04 16:01:00 +08:00 --- 发现包名被占用且本地未登录 npm，无法直接发布 --- 将 package.json 中的包名改为作用域包 @qiliangjin/react-sortable-dnd 并配置公开发布 publishConfig（含 registry 为官方源，解决国内镜像源无法发布的问题） --- 修改了 package.json、work.md。撤回方式：恢复 package.json 中包名为 "react-sortable-dnd" 并移除 publishConfig，最后删除本条 work.md 记录。

2026-06-04 16:10:00 +08:00 --- 准备开源到 GitHub 并同步当前所有修改 --- 本地暂存并提交所有更改，重命名分支为 main，并使用 gh cli 一键在远程创建公开仓库 react-sortable-dnd 自动完成关联与推送 --- 修改了 Git 本地与远程状态、work.md。撤回方式：本地执行 git branch -M master 恢复旧分支，并在 GitHub 上删除创建的仓库。
