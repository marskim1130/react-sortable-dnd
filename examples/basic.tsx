import React, { useState } from 'react';
import { DndSortable, DndHandle, DndItem } from '../src';

// 定义 item 类型
interface TodoItem extends DndItem {
  title: string;
  completed: boolean;
}

// 初始数据
const initialItems: TodoItem[] = [
  { id: '1', title: '学习 React', completed: true },
  { id: '2', title: '学习 TypeScript', completed: false },
  { id: '3', title: '开发拖拽组件', completed: false },
  { id: '4', title: '发布 npm 包', completed: false },
  { id: '5', title: '写简历', completed: false },
];

export function BasicExample() {
  const [items, setItems] = useState<TodoItem[]>(initialItems);

  return (
    <div style={{ padding: 24 }}>
      <h2>基础拖拽排序示例</h2>
      <p>拖拽下面的项目来调整顺序</p>

      <DndSortable
        items={items}
        onItemsChange={setItems}
        renderItem={(item) => (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 16px',
              marginBottom: 8,
              background: '#fff',
              borderRadius: 8,
              boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
            }}
          >
            <DndHandle>
              <span style={{ marginRight: 12, fontSize: 18 }}>⠿</span>
            </DndHandle>
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => {
                setItems((prev) =>
                  prev.map((i) =>
                    i.id === item.id
                      ? { ...i, completed: !i.completed }
                      : i
                  )
                );
              }}
              style={{ marginRight: 12 }}
            />
            <span
              style={{
                textDecoration: item.completed ? 'line-through' : 'none',
                color: item.completed ? '#999' : '#333',
              }}
            >
              {item.title}
            </span>
          </div>
        )}
      />

      <div style={{ marginTop: 24, padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
        <h3>当前顺序：</h3>
        <ol>
          {items.map((item) => (
            <li key={item.id}>{item.title}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default BasicExample;
