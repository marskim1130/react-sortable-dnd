# react-sortable-dnd

> 零依赖、高性能的 React 拖拽排序组件库，支持容器内排序和外部拖入

[![npm version](https://img.shields.io/npm/v/react-sortable-dnd.svg)](https://www.npmjs.com/package/react-sortable-dnd)
[![npm downloads](https://img.shields.io/npm/dm/react-sortable-dnd.svg)](https://www.npmjs.com/package/react-sortable-dnd)
[![license](https://img.shields.io/npm/l/react-sortable-dnd.svg)](https://github.com/your-username/react-sortable-dnd/blob/main/LICENSE)

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
npm install react-sortable-dnd

# yarn
yarn add react-sortable-dnd

# pnpm
pnpm add react-sortable-dnd
```

## 🚀 快速开始

### 基础用法

```tsx
import { useState } from 'react';
import { DndSortable, DndHandle } from 'react-sortable-dnd';

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
import { DndSortable, DragSource } from 'react-sortable-dnd';

const dragSources: DragSource[] = [
  { type: 'text', label: '文本框', icon: '📝' },
  { type: 'image', label: '图片', icon: '🖼️' },
  { type: 'button', label: '按钮', icon: '🔘' },
];

function App() {
  const [items, setItems] = useState([]);

  const handleDrop = (source, index) => ({
    id: Date.now().toString(),
    type: source.type,
    label: source.label,
  });

  return (
    <DndSortable
      items={items}
      onItemsChange={setItems}
      dragSources={dragSources}
      onDrop={handleDrop}
      renderItem={(item) => (
        <div className="item">{item.label}</div>
      )}
    />
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
| `dragSources` | `DragSource[]` | - | 外部拖入源配置 |
| `onDrop` | `(source: DragSource, index: number) => DndItem` | - | 外部拖入回调 |
| `disabled` | `boolean` | `false` | 是否禁用拖拽 |
| `className` | `string` | - | 自定义类名 |
| `style` | `React.CSSProperties` | - | 自定义样式 |

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
git clone https://github.com/your-username/react-sortable-dnd.git

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

欢迎提交 Issue 和 Pull Request！

## 📧 联系方式

- 作者：金琦亮
- 邮箱：your-email@example.com
