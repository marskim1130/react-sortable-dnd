# 零依赖、高性能！从零实现 React 拖拽排序组件（基于 HTML5 Drag and Drop API）

在现代网页开发中，拖拽排序 [Drag and Drop Sorting] 是一种非常直观且常见的交互方式。虽然市面上已经有许多优秀的第三方拖拽库，但它们往往体积庞大且引入了额外的依赖。今天，我们将采用一种保姆级教程 [Step-by-Step Tutorial] 的方式，带你深入了解如何基于原生的 HTML5 拖放接口 [Drag and Drop API]，从零开始封装一个轻量、高性能且零外部依赖 [Zero External Dependencies] 的 React 拖拽排序库。

---

## 1. 拖拽功能是如何实现的？

HTML5 提供了原生的拖拽支持。实现一个基本的拖放功能，核心在于理解**拖拽源 [Drag Source]**（被拖动的元素）与**放置目标 [Drop Target]**（接收拖动的区域）之间的关系，以及它们在整个拖放生命周期 [Lifecycle] 中触发的事件。

### 1.1 拖拽事件流 [Drag Event Flow]
拖放交互过程由一系列事件驱动，我们可以将其分为拖拽源事件和放置目标事件：

| 事件触发阶段 | 事件名称 | 触发主体 | 说明 |
| :--- | :--- | :--- | :--- |
| **开始拖拽** | `dragstart` | 拖拽源 [Drag Source] | 当用户开始拖动元素时触发。必须在此事件中设置数据载荷 [Data Payload]。 |
| **拖动中** | `drag` | 拖拽源 [Drag Source] | 元素被拖动时持续触发。 |
| **拖拽结束** | `dragend` | 拖拽源 [Drag Source] | 拖动操作结束时触发（无论放置是成功还是被取消）。 |
| **进入目标** | `dragenter` | 放置目标 [Drop Target] | 拖动元素进入放置目标范围时触发，可用于显示视觉反馈。 |
| **悬停目标** | `dragover` | 放置目标 [Drop Target] | 拖动元素在放置目标上方移动时持续触发。**必须调用 `e.preventDefault()` 才能允许放置**。 |
| **离开目标** | `dragleave` | 放置目标 [Drop Target] | 拖动元素离开放置目标范围时触发。 |
| **执行放置** | `drop` | 放置目标 [Drop Target] | 拖动元素在放置目标上释放时触发。在此获取数据并更新状态。 |

### 1.2 原生 HTML 极简示例 [Minimal HTML Demo]
在原生 HTML 中，任何元素只要设置了 `draggable="true"` 属性 [Attribute]，就可以变成可拖拽的元素。以下是一个极其精简的拖放示例：

```html
<!-- 拖拽源 -->
<div id="source" draggable="true">拖拽我</div>

<!-- 放置目标 -->
<div id="target">放置到这里</div>

<script>
  const source = document.getElementById('source');
  const target = document.getElementById('target');

  // 1. 开始拖拽时，存入数据
  source.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', '来自源元素的数据');
    e.dataTransfer.effectAllowed = 'move';
  });

  // 2. 目标区域必须阻止默认行为，否则浏览器默认禁止放置
  target.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  });

  // 3. 释放时取出数据
  target.addEventListener('drop', (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    target.textContent = `放置成功！获取数据: ${data}`;
  });
</script>
```

---

## 2. 如何写一个 React 钩子 [React Hook]？

在 React 中，我们习惯于通过状态 [State] 和单向数据流 [One-way Data Flow] 来驱动 UI 变化。如果直接操作 DOM，会违背 React 的声明式渲染 [Declarative Rendering] 原则。因此，我们需要将原生拖拽事件封装成 React 钩子 [React Hooks]。

通过封装自定义钩子 [Custom Hooks]，我们可以：
1. 隐藏繁琐的原生事件绑定逻辑。
2. 保持拖拽状态的局域化与响应式更新。
3. 方便在多个组件之间复用拖放逻辑。

下面我们来编写一个简易的、能处理列表排序的自定义钩子 `useSimpleDragDrop`：

```tsx
import { useState, useCallback } from 'react';

export function useSimpleDragDrop<T>(initialItems: T[]) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  // 拖拽开始：记录当前拖拽项的索引
  const handleDragStart = useCallback((index: number) => (e: React.DragEvent) => {
    setDraggingIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  // 允许在列表上方放置
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  // 执行放置：更新列表数据
  const handleDrop = useCallback((targetIndex: number) => (e: React.DragEvent) => {
    e.preventDefault();
    if (draggingIndex === null || draggingIndex === targetIndex) return;

    const newItems = [...items];
    // 移除拖拽项
    const [draggedItem] = newItems.splice(draggingIndex, 1);
    // 插入到目标位置
    newItems.splice(targetIndex, 0, draggedItem);

    setItems(newItems);
    setDraggingIndex(null);
  }, [items, draggingIndex]);

  const handleDragEnd = useCallback(() => {
    setDraggingIndex(null);
  }, []);

  return {
    items,
    draggingIndex,
    getItemHandlers: (index: number) => ({
      draggable: true,
      onDragStart: handleDragStart(index),
      onDragEnd: handleDragEnd,
      onDragOver: handleDragOver,
      onDrop: handleDrop(index),
    }),
  };
}
```

使用时，只需要把 `getItemHandlers(index)` 返回的属性绑定到对应的 React 节点上，即可快速实现拖拽排序。

---

## 3. 该项目的 Hooks 设计思路

在学习了基础封装后，我们来看看开源库 `@qiliangjin/react-sortable-dnd` 是如何进行企业级重构与高阶设计的。为了实现高性能、零依赖以及强大的扩展性，该项目在钩子 [Hooks] 的架构上采取了以下精妙的思路：

### 3.1 双钩子配合与状态同步 [Dual-Hook Collaboration & State Synchronization]
该项目没有选择把所有功能塞进一个庞大的 Hook 中，而是采用单一职责原则 [Single Responsibility Principle] 将其拆分为两个专门的钩子：
1. **`useDragDrop`**：核心拖拽钩子，负责底层事件的绑定、位置计算、插入占位符 [Placeholder] 渲染以及外部源的接收规则 [Accept Rule] 校验。
2. **`useSelection`**：选择与点击状态钩子，负责处理列表项的鼠标点击选中交互，防止拖拽操作与点击事件冲突。

在主容器组件 `DndSortable` 中，通过 React 的副作用钩子 `useEffect` 建立了这两个钩子之间的状态同步机制：当检测到拖拽开始时，通知 `useSelection` 锁定点击；拖拽结束后，通过时间窗口 [Time Window] 过滤器，避免拖拽释放时的点击穿透。

### 3.2 拖拽源呈现与放置目标分离 [Decoupling of Drag Source & Drop Target]
在早期的版本中，外部拖拽源是由 `DndSortable.dragSources` 属性直接配置在目标容器上的。这种设计导致容器组件过于重，且限制了拖拽源的 UI 自定义。

新版本实现了完全的解耦：
- **放置目标 [Drop Target]**：由 `DndSortable` 组件担任，负责定义接收规则 `accepts`（通过 `source.type` 过滤）与拖放回调 `onDrop`。
- **拖拽源呈现 [Drag Source Presentation]**：由 `DndSource` 与 `DndSourceList` 组件担任。
  - `DndSource` 采用了**组合式接口 [Composable Interface]** 设计，它不渲染任何额外的 DOM 包裹层，而是通过子组件函数 [Render Props] 模式向调用方暴露 `getSourceHandlers`：
    ```tsx
    <DndSource source={sourceItem}>
      {(dragProps) => <button {...dragProps}>自定义按钮</button>}
    </DndSource>
    ```
  这样的设计赋予了开发者 100% 的 UI 控制权。

### 3.3 高性能优化：requestAnimationFrame 与缓存 [High Performance Optimization]
当在列表中拖拽时，拖动元素不断触发 `dragover` 事件，其频率极其高（通常为每秒 60 次以上）。如果在每次事件中都触发 React 的 `setState` 重新渲染组件，会导致严重的卡顿。

为了彻底解决高频重绘 [High Frequency Repaint] 问题，该项目引入了以下优化手段：
1. **渲染更新限频**：使用浏览器原生的 `requestAnimationFrame`（简称 RAF）将插入位置 `insertIndex` 的状态更新进行节流 [Throttling]，确保每次浏览器重绘前只执行一次状态变更。
2. **DOM 祖先缓存 [DOM Ancestor Cache]**：在拖拽寻找目标索引时，需要通过递归查找带有 `data-index` 属性的父级 DOM 节点。项目在内存中维护了一个 Map 缓存，大幅减少了拖动时频繁的 DOM 查询开销。

### 3.4 回弹动画 [Bounce Animation] 的边缘情况 [Edge Case] 处理
当用户在非可放置区域松开鼠标，或者排序结束时，列表项需要有一个平滑的“回弹”视觉效果。
该项目在 `handleItemDragEnd` 内部，将当前的拖拽索引加入到 `dragEndingIndices` 集合中触发回弹类名绑定，并通过 `setTimeout` 延迟 400 毫秒（动画执行时长）清空该回弹标识。这保证了在 React 组件重新渲染和过渡状态下，回弹动画可以流畅平滑地播放，避免了瞬间跳变导致的闪烁。

### 3.5 完美的向后兼容性 [Backward Compatibility]
在进行底层重构时，项目保留了原先的 `DndSortable.dragSources` 接口作为过渡拖拽源接口 [Transitional Drag Source Interface]。通过 TypeScript JSDoc 注释将其标记为 `@deprecated`，引导开发者使用新的 `DndSource`，但在运行时不仅不破坏现有业务，而且新旧方案共享同一套底层注册表与过滤机制，完美做到了“渐进式迁移”。

---

## 4. 开源仓库与 NPM 推广

`@qiliangjin/react-sortable-dnd` 已经正式开源并在 NPM 上发布。它完美契合了现代 React 应用对轻量化、高性能和自主控制样式的极致追求。

### 4.1 安装命令 [Installation]
你可以根据你所使用的包管理器 [Package Manager]，选择以下任一命令进行快速安装：

```bash
# npm
npm install @qiliangjin/react-sortable-dnd

# yarn
yarn add @qiliangjin/react-sortable-dnd

# pnpm
pnpm add @qiliangjin/react-sortable-dnd
```

### 4.2 核心优势总结 [Core Strengths]
- 📦 **零外部依赖 [Zero External Dependencies]**：极简打包体积，无需担心拖拽库引起项目依赖膨胀。
- ⚡ **高性能 [High Performance]**：原生 HTML5 拖拽 API + RAF 帧渲染优化，拖动体验顺滑无比。
- 🛠️ **完整 TS 支持 [TypeScript Support]**：全量类型声明文件，为你提供丝滑的编码提示与强类型约束。
- 🎨 **主题样式高度自定义 [Style Customization]**：通过 CSS 变量自由控制占位符颜色、手柄图标、拖拽缩放与过渡时间等视觉要素。

---

欢迎访问我们的开源仓库，阅读详细的 API 说明与交互用例。如果你觉得这个项目对你有帮助，欢迎为我们点上一个珍贵的 **Star** ⭐️，也十分欢迎提交 **Pull Request** 贡献你的力量！

- **GitHub 官方仓库 [GitHub Repository]**: [https://github.com/CodeApeKQ/react-sortable-dnd](https://github.com/CodeApeKQ/react-sortable-dnd)
- **NPM 包主页 [NPM Package Page]**: [https://www.npmjs.com/package/@qiliangjin/react-sortable-dnd](https://www.npmjs.com/package/@qiliangjin/react-sortable-dnd)
- **问题反馈与建议 [Issue Tracker]**: [https://github.com/CodeApeKQ/react-sortable-dnd/issues](https://github.com/CodeApeKQ/react-sortable-dnd/issues)
