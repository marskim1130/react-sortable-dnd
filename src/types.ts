import { ReactNode } from 'react';

/** 拖拽项的基础接口 */
export interface DndItem {
  /** 唯一标识 */
  id: string;
  /** 组件类型（用于外部拖入源） */
  type?: string;
  /** 允许任意额外属性 */
  [key: string]: unknown;
}

/** 拖拽源配置 */
export interface DragSource<T extends DndItem = DndItem> {
  /** 类型标识 */
  type: string;
  /** 显示标签 */
  label: string;
  /** 显示图标 */
  icon?: ReactNode;
  /** 自定义数据 */
  data?: Partial<T>;
}

/** 拖拽位置信息 */
export interface DragPosition {
  /** 目标索引 */
  index: number;
  /** 是否在目标之前 */
  isBefore: boolean;
}

/** DndSortable 组件属性 */
export interface DndSortableProps<T extends DndItem = DndItem> {
  /** 当前 items 列表 */
  items: T[];
  /** items 变化回调 */
  onItemsChange: (items: T[]) => void;
  /** 渲染单个 item */
  renderItem: (item: T, index: number) => ReactNode;
  /**
   * 外部拖入源配置
   * @deprecated 请使用 DndSource 或 DndSourceList 创建外部拖入源。
   */
  dragSources?: DragSource<T>[];
  /** 接收的外部拖入源类型 */
  accepts?: string[];
  /** 外部拖入回调，返回新 item */
  onDrop?: (source: DragSource<T>, index: number) => T;
  /** 是否禁用拖拽 */
  disabled?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
}

/** DndHandle 组件属性 */
export interface DndHandleProps {
  /** 子元素 */
  children: ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
}

/** DndSource 拖拽行为属性 */
export interface DndSourceDragProps {
  /** 是否可拖拽 */
  draggable: boolean;
  /** 拖拽开始事件 */
  onDragStart: (e: React.DragEvent) => void;
  /** 拖拽结束事件 */
  onDragEnd: (e: React.DragEvent) => void;
}

/** DndSource 组件属性 */
export interface DndSourceProps<T extends DndItem = DndItem> {
  /** 外部拖入源 */
  source: DragSource<T>;
  /** 是否禁用 */
  disabled?: boolean;
  /** 渲染自定义触发器 */
  children: (dragProps: DndSourceDragProps) => ReactNode;
}

/** DndSourceList 组件属性 */
export interface DndSourceListProps<T extends DndItem = DndItem> {
  /** 外部拖入源列表 */
  sources: DragSource<T>[];
  /** 是否禁用 */
  disabled?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 自定义渲染单个源 */
  renderSource?: (
    source: DragSource<T>,
    index: number,
    dragProps: DndSourceDragProps
  ) => ReactNode;
}

/** 拖拽状态 */
export interface DragState {
  /** 是否正在拖拽 */
  isDragging: boolean;
  /** 拖拽中的项索引（容器内拖拽） */
  draggingIndex: number | null;
  /** 拖拽源名称（外部拖入） */
  draggingSource: string | null;
  /** 插入位置索引 */
  insertIndex: number | null;
  /** 拖拽结束动画中的索引集合 */
  dragEndingIndices: Set<number>;
}
