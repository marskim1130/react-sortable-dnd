import React, { useState } from 'react';
import { DndSortable, DndItem, DragSource } from '../src';

// 定义 item 类型
interface ComponentItem extends DndItem {
  type: string;
  label: string;
  icon: string;
}

// 拖拽源配置
const dragSources: DragSource<ComponentItem>[] = [
  { type: 'text', label: '文本框', icon: '📝' },
  { type: 'image', label: '图片', icon: '🖼️' },
  { type: 'button', label: '按钮', icon: '🔘' },
  { type: 'divider', label: '分割线', icon: '➖' },
];

// 生成唯一 ID
let idCounter = 0;
const generateId = () => `item-${++idCounter}`;

export function WithExternalSourceExample() {
  const [items, setItems] = useState<ComponentItem[]>([
    { id: generateId(), type: 'text', label: '文本框', icon: '📝' },
    { id: generateId(), type: 'image', label: '图片', icon: '🖼️' },
  ]);

  // 处理外部拖入
  const handleDrop = (source: DragSource<ComponentItem>, index: number): ComponentItem => {
    return {
      id: generateId(),
      type: source.type,
      label: source.label,
      icon: source.icon || '📦',
    };
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>外部拖入源示例</h2>
      <p>从左侧拖拽组件到右侧画布</p>

      <div style={{ display: 'flex', gap: 24 }}>
        {/* 左侧：拖拽源 */}
        <div style={{ width: 200 }}>
          <h3>组件库</h3>
          <DndSortable
            items={[]}
            onItemsChange={() => {}}
            renderItem={() => null}
            dragSources={dragSources}
            onDrop={handleDrop}
          />
        </div>

        {/* 右侧：画布 */}
        <div style={{ flex: 1 }}>
          <h3>画布</h3>
          <DndSortable
            items={items}
            onItemsChange={setItems}
            renderItem={(item) => (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px 20px',
                  marginBottom: 8,
                  background: '#fff',
                  borderRadius: 8,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                  cursor: 'grab',
                }}
              >
                <span style={{ fontSize: 24, marginRight: 12 }}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            )}
            onDrop={handleDrop}
          />
        </div>
      </div>

      <div style={{ marginTop: 24, padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
        <h3>画布中的组件：</h3>
        <pre>{JSON.stringify(items, null, 2)}</pre>
      </div>
    </div>
  );
}

export default WithExternalSourceExample;
