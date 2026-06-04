import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BasicExample } from './basic';
import { WithExternalSourceExample } from './with-external-source';

type ExampleKey = 'basic' | 'external';

const examples: Record<ExampleKey, { title: string; component: React.FC }> = {
  basic: { title: '基础拖拽排序', component: BasicExample },
  external: { title: '外部拖入源', component: WithExternalSourceExample },
};

function App() {
  const [activeExample, setActiveExample] = useState<ExampleKey>('basic');

  const ActiveComponent = examples[activeExample].component;

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      {/* 顶部导航 */}
      <nav
        style={{
          background: '#fff',
          padding: '16px 24px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: 24,
        }}
      >
        <h1 style={{ fontSize: 20, fontWeight: 600, marginRight: 24 }}>
          react-sortable-dnd
        </h1>
        {(Object.keys(examples) as ExampleKey[]).map((key) => (
          <button
            key={key}
            onClick={() => setActiveExample(key)}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: 6,
              background: activeExample === key ? '#1890ff' : '#f0f0f0',
              color: activeExample === key ? '#fff' : '#333',
              cursor: 'pointer',
              fontSize: 14,
              transition: 'all 0.2s',
            }}
          >
            {examples[key].title}
          </button>
        ))}
      </nav>

      {/* 内容区域 */}
      <main style={{ padding: 24 }}>
        <ActiveComponent />
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
