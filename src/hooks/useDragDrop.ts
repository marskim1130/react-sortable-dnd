import { useState, useRef, useCallback, useEffect } from 'react';
import { DndItem, DragSource, DragState } from '../types';

export interface UseDragDropOptions<T extends DndItem> {
  /** 当前 items */
  items: T[];
  /** items 变化回调 */
  onItemsChange: (items: T[]) => void;
  /** 外部拖入回调 */
  onDrop?: (source: DragSource<T>, index: number) => T;
  /** 是否禁用 */
  disabled?: boolean;
}

export interface UseDragDropReturn {
  /** 拖拽状态 */
  dragState: DragState;
  /** 容器拖拽事件 */
  containerHandlers: {
    onDragOver: (e: React.DragEvent) => void;
    onDragEnter: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
  };
  /** 获取 item 拖拽事件 */
  getItemHandlers: (index: number) => {
    onDragStart: (e: React.DragEvent) => void;
    onDragEnd: (e: React.DragEvent) => void;
    draggable: boolean;
  };
  /** 获取拖拽源事件 */
  getSourceHandlers: (source: DragSource) => {
    onDragStart: (e: React.DragEvent) => void;
    onDragEnd: (e: React.DragEvent) => void;
    draggable: boolean;
  };
}

/** 内部拖拽数据格式 */
interface InternalDragData {
  type: 'internal';
  index: number;
}

/** 外部拖拽数据格式 */
interface ExternalDragData {
  type: 'external';
  sourceType: string;
}

type DragData = InternalDragData | ExternalDragData;

const DRAG_DATA_KEY = 'application/json';

export function useDragDrop<T extends DndItem>({
  items,
  onItemsChange,
  onDrop,
  disabled = false,
}: UseDragDropOptions<T>): UseDragDropReturn {
  // 拖拽状态
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggingIndex: null,
    draggingSource: null,
    insertIndex: null,
    dragEndingIndices: new Set(),
  });

  // Refs
  const isDraggingRef = useRef(false);
  const dragEnterCounterRef = useRef(0);
  const lastValidInsertIndexRef = useRef<number | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const pendingInsertIndexRef = useRef<number | null>(null);
  const domCacheRef = useRef<Map<Element, Element | null>>(new Map());

  // 清理 RAF
  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  // 向上查找带 data-index 的祖先元素
  const findAncestorWithIndex = useCallback((element: Element): Element | null => {
    // 先查缓存
    if (domCacheRef.current.has(element)) {
      return domCacheRef.current.get(element) ?? null;
    }

    let current: Element | null = element;
    while (current) {
      if (current.hasAttribute('data-index')) {
        domCacheRef.current.set(element, current);
        return current;
      }
      current = current.parentElement;
    }

    domCacheRef.current.set(element, null);
    return null;
  }, []);

  // 计算插入位置
  const calculateInsertIndex = useCallback(
    (e: React.DragEvent): number | null => {
      const target = e.target as Element;
      const ancestor = findAncestorWithIndex(target);

      if (!ancestor) {
        return lastValidInsertIndexRef.current ?? items.length;
      }

      const index = parseInt(ancestor.getAttribute('data-index') || '-1', 10);
      if (index < 0) {
        return lastValidInsertIndexRef.current ?? items.length;
      }

      // 计算鼠标在目标元素的相对位置
      const rect = ancestor.getBoundingClientRect();
      const midY = rect.top + rect.height / 2;
      const insertIndex = e.clientY < midY ? index : index + 1;

      lastValidInsertIndexRef.current = insertIndex;
      return insertIndex;
    },
    [items.length, findAncestorWithIndex]
  );

  // 批量更新插入位置（使用 RAF 优化）
  const updateInsertIndex = useCallback(
    (index: number | null) => {
      pendingInsertIndexRef.current = index;

      if (rafIdRef.current !== null) {
        return;
      }

      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null;
        setDragState((prev) => ({
          ...prev,
          insertIndex: pendingInsertIndexRef.current,
        }));
      });
    },
    []
  );

  // 解析拖拽数据
  const parseDragData = useCallback((e: React.DragEvent): DragData | null => {
    try {
      const data = e.dataTransfer.types.includes(DRAG_DATA_KEY)
        ? JSON.parse(e.dataTransfer.getData(DRAG_DATA_KEY))
        : null;
      return data;
    } catch {
      return null;
    }
  }, []);

  // 拖拽开始 - item
  const handleItemDragStart = useCallback(
    (index: number) => (e: React.DragEvent) => {
      if (disabled) return;

      e.stopPropagation();

      const dragData: InternalDragData = { type: 'internal', index };
      e.dataTransfer.setData(DRAG_DATA_KEY, JSON.stringify(dragData));
      e.dataTransfer.effectAllowed = 'move';

      isDraggingRef.current = true;

      setDragState((prev) => ({
        ...prev,
        isDragging: true,
        draggingIndex: index,
        draggingSource: null,
      }));
    },
    [disabled]
  );

  // 拖拽结束 - item
  const handleItemDragEnd = useCallback(
    (index: number) => (e: React.DragEvent) => {
      e.stopPropagation();

      isDraggingRef.current = false;
      dragEnterCounterRef.current = 0;
      lastValidInsertIndexRef.current = null;

      // 触发回弹动画
      setDragState((prev) => {
        const newBouncingIndices = new Set(prev.dragEndingIndices);
        if (prev.draggingIndex !== null) {
          newBouncingIndices.add(prev.draggingIndex);
        }

        // 400ms 后清除回弹动画
        setTimeout(() => {
          setDragState((p) => {
            const updated = new Set(p.dragEndingIndices);
            updated.delete(index);
            return { ...p, dragEndingIndices: updated };
          });
        }, 400);

        return {
          ...prev,
          isDragging: false,
          draggingIndex: null,
          insertIndex: null,
          dragEndingIndices: newBouncingIndices,
        };
      });
    },
    []
  );

  // 拖拽开始 - 源
  const handleSourceDragStart = useCallback(
    (source: DragSource) => (e: React.DragEvent) => {
      if (disabled) return;

      const dragData: ExternalDragData = {
        type: 'external',
        sourceType: source.type,
      };
      e.dataTransfer.setData(DRAG_DATA_KEY, JSON.stringify(dragData));
      e.dataTransfer.effectAllowed = 'copy';

      isDraggingRef.current = true;

      setDragState((prev) => ({
        ...prev,
        isDragging: true,
        draggingIndex: null,
        draggingSource: source.type,
      }));
    },
    [disabled]
  );

  // 拖拽结束 - 源
  const handleSourceDragEnd = useCallback(() => {
    isDraggingRef.current = false;
    dragEnterCounterRef.current = 0;
    lastValidInsertIndexRef.current = null;

    setDragState((prev) => ({
      ...prev,
      isDragging: false,
      draggingSource: null,
      insertIndex: null,
    }));
  }, []);

  // 容器 - dragEnter
  const handleContainerDragEnter = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      dragEnterCounterRef.current++;

      if (dragEnterCounterRef.current === 1) {
        // 首次进入，设置默认插入位置
        updateInsertIndex(items.length);
      }
    },
    [items.length, updateInsertIndex]
  );

  // 容器 - dragLeave
  const handleContainerDragLeave = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      dragEnterCounterRef.current--;

      if (dragEnterCounterRef.current <= 0) {
        dragEnterCounterRef.current = 0;
        updateInsertIndex(null);
      }
    },
    [updateInsertIndex]
  );

  // 容器 - dragOver
  const handleContainerDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = isDraggingRef.current ? 'move' : 'copy';

      const insertIndex = calculateInsertIndex(e);
      updateInsertIndex(insertIndex);
    },
    [calculateInsertIndex, updateInsertIndex]
  );

  // 容器 - drop
  const handleContainerDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      dragEnterCounterRef.current = 0;

      const dragData = parseDragData(e);
      const insertIndex = pendingInsertIndexRef.current ?? items.length;

      if (!dragData) {
        setDragState((prev) => ({ ...prev, insertIndex: null }));
        return;
      }

      if (dragData.type === 'internal') {
        // 容器内重排序
        const fromIndex = dragData.index;
        if (fromIndex === insertIndex || fromIndex === insertIndex - 1) {
          // 位置没变
          setDragState((prev) => ({ ...prev, insertIndex: null }));
          return;
        }

        const newItems = [...items];
        const [movedItem] = newItems.splice(fromIndex, 1);
        const toIndex = insertIndex > fromIndex ? insertIndex - 1 : insertIndex;
        newItems.splice(toIndex, 0, movedItem);

        onItemsChange(newItems);
      } else if (dragData.type === 'external' && onDrop) {
        // 外部拖入
        const source = { type: dragData.sourceType } as DragSource<T>;
        const newItem = onDrop(source, insertIndex);

        const newItems = [...items];
        newItems.splice(insertIndex, 0, newItem);

        onItemsChange(newItems);
      }

      // 清理状态
      isDraggingRef.current = false;
      lastValidInsertIndexRef.current = null;
      domCacheRef.current.clear();

      setDragState((prev) => ({
        ...prev,
        isDragging: false,
        draggingIndex: null,
        draggingSource: null,
        insertIndex: null,
      }));
    },
    [items, onItemsChange, onDrop, parseDragData]
  );

  // 获取 item 事件处理器
  const getItemHandlers = useCallback(
    (index: number) => ({
      onDragStart: handleItemDragStart(index),
      onDragEnd: handleItemDragEnd(index),
      draggable: !disabled,
    }),
    [disabled, handleItemDragStart, handleItemDragEnd]
  );

  // 获取源事件处理器
  const getSourceHandlers = useCallback(
    (source: DragSource) => ({
      onDragStart: handleSourceDragStart(source),
      onDragEnd: handleSourceDragEnd,
      draggable: !disabled,
    }),
    [disabled, handleSourceDragStart, handleSourceDragEnd]
  );

  return {
    dragState,
    containerHandlers: {
      onDragOver: handleContainerDragOver,
      onDragEnter: handleContainerDragEnter,
      onDragLeave: handleContainerDragLeave,
      onDrop: handleContainerDrop,
    },
    getItemHandlers,
    getSourceHandlers,
  };
}
