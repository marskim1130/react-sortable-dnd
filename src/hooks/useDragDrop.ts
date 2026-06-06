import { useState, useRef, useCallback, useEffect } from 'react';
import { DndItem, DragSource, DragState } from '../types';
import {
  clearExternalDragSource,
  parseDragData,
  setExternalDragData,
  setInternalDragData,
} from '../dragData';
import {
  decideExternalDrop,
  decideExternalHover,
} from '../dropTargetDecision';

export interface UseDragDropOptions<T extends DndItem> {
  /** 当前 items */
  items: T[];
  /** items 变化回调 */
  onItemsChange: (items: T[]) => void;
  /** 接收的外部拖入源类型 */
  accepts?: string[];
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

export function useDragDrop<T extends DndItem>({
  items,
  onItemsChange,
  accepts,
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
  const externalDragSourceIdRef = useRef<string | null>(null);

  // 清理 RAF
  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      clearExternalDragSource(externalDragSourceIdRef.current);
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
  const updateInsertIndex = useCallback((index: number | null) => {
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
  }, []);

  const showExternalDragFeedback = useCallback((sourceType: string) => {
    setDragState((prev) => {
      if (
        prev.isDragging &&
        prev.draggingIndex === null &&
        prev.draggingSource === sourceType
      ) {
        return prev;
      }

      return {
        ...prev,
        isDragging: true,
        draggingIndex: null,
        draggingSource: sourceType,
      };
    });
  }, []);

  const hideExternalDragFeedback = useCallback(() => {
    setDragState((prev) => {
      if (prev.draggingIndex !== null || prev.draggingSource === null) {
        return prev;
      }

      return {
        ...prev,
        isDragging: false,
        draggingSource: null,
        insertIndex: null,
      };
    });
  }, []);

  const resetDragInteraction = useCallback(() => {
    isDraggingRef.current = false;
    dragEnterCounterRef.current = 0;
    lastValidInsertIndexRef.current = null;
    pendingInsertIndexRef.current = null;
    domCacheRef.current.clear();

    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    setDragState((prev) => ({
      ...prev,
      isDragging: false,
      draggingIndex: null,
      draggingSource: null,
      insertIndex: null,
    }));
  }, []);

  // 拖拽开始 - item
  const handleItemDragStart = useCallback(
    (index: number) => (e: React.DragEvent) => {
      if (disabled) return;

      e.stopPropagation();

      setInternalDragData(e.dataTransfer, index);
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
      pendingInsertIndexRef.current = null;

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

      clearExternalDragSource(externalDragSourceIdRef.current);
      externalDragSourceIdRef.current = setExternalDragData(
        e.dataTransfer,
        source
      );
      e.dataTransfer.effectAllowed = 'copy';

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
    clearExternalDragSource(externalDragSourceIdRef.current);
    externalDragSourceIdRef.current = null;
    resetDragInteraction();
  }, [resetDragInteraction]);

  // 容器 - dragEnter
  const handleContainerDragEnter = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();

      const dragData = parseDragData<T>(e.dataTransfer);

      if (dragData?.type === 'external') {
        const hoverDecision = decideExternalHover({
          source: dragData.source,
          accepts,
          insertIndex: items.length,
        });

        if (hoverDecision.status === 'rejected') {
          updateInsertIndex(hoverDecision.insertIndex);
          hideExternalDragFeedback();
          return;
        }

        showExternalDragFeedback(dragData.source.type);
      }

      dragEnterCounterRef.current++;

      if (dragEnterCounterRef.current === 1) {
        // 首次进入，设置默认插入位置
        updateInsertIndex(items.length);
      }
    },
    [
      accepts,
      hideExternalDragFeedback,
      items.length,
      showExternalDragFeedback,
      updateInsertIndex,
    ]
  );

  // 容器 - dragLeave
  const handleContainerDragLeave = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      dragEnterCounterRef.current--;

      if (dragEnterCounterRef.current <= 0) {
        dragEnterCounterRef.current = 0;
        updateInsertIndex(null);

        if (!isDraggingRef.current) {
          hideExternalDragFeedback();
        }
      }
    },
    [hideExternalDragFeedback, updateInsertIndex]
  );

  // 容器 - dragOver
  const handleContainerDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();

      const dragData = parseDragData<T>(e.dataTransfer);

      if (dragData?.type === 'external') {
        const hoverDecision = decideExternalHover({
          source: dragData.source,
          accepts,
          insertIndex: null,
        });

        if (hoverDecision.status === 'rejected') {
          e.dataTransfer.dropEffect = hoverDecision.dropEffect;
          updateInsertIndex(hoverDecision.insertIndex);
          hideExternalDragFeedback();
          return;
        }

        e.dataTransfer.dropEffect = hoverDecision.dropEffect;
        showExternalDragFeedback(dragData.source.type);

        const insertIndex = calculateInsertIndex(e);
        updateInsertIndex(insertIndex);
        return;
      } else {
        e.dataTransfer.dropEffect = isDraggingRef.current ? 'move' : 'copy';
      }

      const insertIndex = calculateInsertIndex(e);
      updateInsertIndex(insertIndex);
    },
    [
      accepts,
      calculateInsertIndex,
      hideExternalDragFeedback,
      showExternalDragFeedback,
      updateInsertIndex,
    ]
  );

  // 容器 - drop
  const handleContainerDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      dragEnterCounterRef.current = 0;

      const dragData = parseDragData<T>(e.dataTransfer);
      const externalSourceId =
        dragData?.type === 'external' ? dragData.sourceId : null;
      const insertIndex = pendingInsertIndexRef.current ?? items.length;

      try {
        if (!dragData) {
          resetDragInteraction();
          return;
        }

        if (dragData.type === 'internal') {
          // 容器内重排序
          const fromIndex = dragData.index;
          if (fromIndex === insertIndex || fromIndex === insertIndex - 1) {
            // 位置没变
            resetDragInteraction();
            return;
          }

          const newItems = [...items];
          const [movedItem] = newItems.splice(fromIndex, 1);
          const toIndex = insertIndex > fromIndex ? insertIndex - 1 : insertIndex;
          newItems.splice(toIndex, 0, movedItem);

          onItemsChange(newItems);
        } else if (dragData.type === 'external') {
          const dropDecision = decideExternalDrop({
            source: dragData.source as DragSource<T>,
            accepts,
            insertIndex,
            onDrop,
          });

          if (dropDecision.status === 'rejected') {
            resetDragInteraction();
            return;
          }

          const newItems = [...items];
          newItems.splice(dropDecision.insertIndex, 0, dropDecision.item);

          onItemsChange(newItems);
        }
      } finally {
        clearExternalDragSource(externalSourceId);
        if (externalDragSourceIdRef.current === externalSourceId) {
          externalDragSourceIdRef.current = null;
        }
        resetDragInteraction();
      }
    },
    [accepts, items, onItemsChange, onDrop, resetDragInteraction]
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
