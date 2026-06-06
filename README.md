# @qiliangjin/react-sortable-dnd

> 零依赖、高性能的 React 拖拽排序组件库，支持容器内排序和外部拖入

[![npm version](https://img.shields.io/npm/v/%40qiliangjin%2Freact-sortable-dnd.svg)](https://www.npmjs.com/package/@qiliangjin/react-sortable-dnd)
[![npm downloads](https://img.shields.io/npm/dm/%40qiliangjin%2Freact-sortable-dnd.svg)](https://www.npmjs.com/package/@qiliangjin/react-sortable-dnd)
[![license](https://img.shields.io/npm/l/%40qiliangjin%2Freact-sortable-dnd.svg)](https://github.com/CodeApeKQ/react-sortable-dnd/blob/main/LICENSE)

## ✨ 特性

- 🎯 **零依赖** - 基于 HTML5 原生拖拽 API，无需第三方拖拽库
- 🚀 **高性能** - 使用 `requestAnimationFrame` 优化，避免高频重绘
- 🎨 **内置动画** - 流畅的拖拽动画、占位符、回弹效果
- 🎛️ **主题定制** - 通过 CSS 变量轻松自定义样式
- 📦 **双格式输出** - 支持 ESM 和 CJS，兼容所有构建工具
- 🔧 **TypeScript** - 完整的类型定义，提供良好的开发体验
- 🖱️ **拖拽手柄** - 支持自定义拖拽手柄，精确控制拖拽区域
- 📥 **外部拖入** - 支持从外部拖入新元素到容器中

## 📦 安装

```bash
# npm
npm install @qiliangjin/react-sortable-dnd

# yarn
yarn add @qiliangjin/react-sortable-dnd

# pnpm
pnpm add @qiliangjin/react-sortable-dnd
```

## 🚀 快速开始

### 基础用法

```tsx
import { useState } from 'react';
import { DndSortable, DndHandle } from '@qiliangjin/react-sortable-dnd';

function App() {
  const [items, setItems] = useState([
    { id: '1', title: '项目 1' },
    { id: '2', title: '项目 2' },
    { id: '3', title: '项目 3' },
  ]);

  return (
    <DndSortable
      items={items}
      onItemsChange={setItems}
      renderItem={(item) => (
        <div className="item">
          <DndHandle>⠿</DndHandle>
          <span>{item.title}</span>
        </div>
      )}
    />
  );
}
```

### 外部拖入源

```tsx
import { useState } from 'react';
import { DndSortable, DndSourceList, DragSource } from '@qiliangjin/react-sortable-dnd';

const dragSources: DragSource[] = [
  {
    type: 'text',
    label: '文本框',
    icon: '📝',
    data: { id: 'text', type: 'text', label: '文本框' },
  },
  {
    type: 'image',
    label: '图片',
    icon: '🖼️',
    data: { id: 'image', type: 'image', label: '图片' },
  },
  {
    type: 'button',
    label: '按钮',
    icon: '🔘',
    data: { id: 'button', type: 'button', label: '按钮' },
  },
];

function App() {
  const [items, setItems] = useState([]);

  const handleDrop = (source, index) => ({
    ...source.data,
    id: `${source.type}-${Date.now()}`,
  });

  return (
    <>
      <DndSourceList sources={dragSources} />

      <DndSortable
        items={items}
        onItemsChange={setItems}
        accepts={['text', 'image', 'button']}
        onDrop={handleDrop}
        renderItem={(item) => (
          <div className="item">{item.label}</div>
        )}
      />
    </>
  );
}
```

## 📖 API

### DndSortable

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `items` | `DndItem[]` | - | 当前 items 列表 |
| `onItemsChange` | `(items: DndItem[]) => void` | - | items 变化回调 |
| `renderItem` | `(item: DndItem, index: number) => ReactNode` | - | 渲染单个 item |
| `accepts` | `string[]` | - | 接收的外部拖入源类型；未设置时接受全部 |
| `onDrop` | `(source: DragSource, index: number) => DndItem` | - | 外部拖入回调 |
| `dragSources` | `DragSource[]` | - | 过渡接口，已弃用；请使用 `DndSource` 或 `DndSourceList` |
| `disabled` | `boolean` | `false` | 是否禁用拖拽 |
| `className` | `string` | - | 自定义类名 |
| `style` | `React.CSSProperties` | - | 自定义样式 |

### DndSource

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `source` | `DragSource` | - | 单个外部拖入源 |
| `children` | `(dragProps: DndSourceDragProps) => ReactNode` | - | 自定义源触发器，需把 `dragProps` 附加到自己的 UI |
| `disabled` | `boolean` | `false` | 是否禁用拖拽 |

### DndSourceList

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `sources` | `DragSource[]` | - | 外部拖入源列表 |
| `renderSource` | `(source, index, dragProps) => ReactNode` | - | 自定义渲染单个源；未设置时使用 `.dnd-drag-source` 默认 UI |
| `disabled` | `boolean` | `false` | 是否禁用拖拽 |
| `className` | `string` | - | 自定义类名 |
| `style` | `React.CSSProperties` | - | 自定义样式 |

### 迁移 dragSources

`DndSortable.dragSources` 仍保留兼容，但它是过渡接口。新代码应使用 `DndSourceList` 或 `DndSource` 创建外部拖入源，让 **外部拖入源** 只负责发起拖拽，让 `DndSortable` 作为 **放置目标** 通过 `accepts` 决定接收哪些 `source.type`。

旧 `dragSources` 会遵守同样的 `accepts` 与拒绝放置反馈：不被接收的源不会显示插入占位符，不会触发 `onDrop`，也不会改变 items。

### DndHandle

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `children` | `ReactNode` | - | 子元素 |
| `className` | `string` | - | 自定义类名 |
| `style` | `React.CSSProperties` | - | 自定义样式 |

### DndItem

```typescript
interface DndItem {
  id: string;          // 唯一标识
  type?: string;       // 组件类型（用于外部拖入源）
  [key: string]: any;  // 允许任意额外属性
}
```

### DragSource

```typescript
interface DragSource {
  type: string;        // 类型标识
  label: string;       // 显示标签
  icon?: ReactNode;    // 显示图标
  data?: Partial<DndItem>; // 自定义数据
}
```

## 🎨 主题定制

通过 CSS 变量自定义样式：

```css
:root {
  /* 主题色 */
  --dnd-primary-color: #1890ff;
  --dnd-primary-color-light: rgba(24, 144, 255, 0.1);

  /* 占位符 */
  --dnd-placeholder-height: 4px;
  --dnd-placeholder-border: var(--dnd-primary-color);

  /* 拖拽手柄 */
  --dnd-handle-cursor: grab;
  --dnd-handle-color: #999;

  /* 拖拽动画 */
  --dnd-transition-duration: 200ms;
  --dnd-transition-easing: cubic-bezier(0.2, 0, 0, 1);

  /* 拖拽中的项 */
  --dnd-dragging-opacity: 0.8;
  --dnd-dragging-scale: 1.02;
  --dnd-dragging-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

## 🔧 开发

```bash
# 克隆项目
git clone https://github.com/CodeApeKQ/react-sortable-dnd.git

# 安装依赖
cd react-sortable-dnd
npm install

# 启动开发服务器
npm run dev

# 构建
npm run build

# 代码检查
npm run lint

# 代码格式化
npm run format
```

## 📄 许可证

[MIT](LICENSE)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request。开始前请阅读 [贡献指南](CONTRIBUTING.md)；重要变更会记录在 [CHANGELOG](CHANGELOG.md)。

## 📧 联系方式

- 作者：金琦亮
- 问题反馈：[GitHub Issues](https://github.com/CodeApeKQ/react-sortable-dnd/issues)
