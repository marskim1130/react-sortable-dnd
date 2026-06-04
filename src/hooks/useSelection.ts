import { useState, useRef, useCallback } from 'react';

export interface UseSelectionOptions {
  /** 拖拽结束后忽略点击的时间窗口（ms） */
  ignoreClickAfterDrag?: number;
  /** 长按判定时间（ms），超过此时间的 mousedown 不触发选中 */
  longPressThreshold?: number;
}

export interface UseSelectionReturn {
  /** 当前选中的索引 */
  selectedIndex: number | null;
  /** 获取 item 的选中事件处理器 */
  getSelectionHandlers: (index: number) => {
    onClick: (e: React.MouseEvent) => void;
    onMouseDown: (e: React.MouseEvent) => void;
    onMouseUp: (e: React.MouseEvent) => void;
  };
  /** 设置选中索引（外部调用） */
  setSelectedIndex: (index: number | null) => void;
  /** 通知拖拽结束（由 useDragDrop 调用） */
  notifyDragEnd: () => void;
  /** 通知拖拽开始 */
  notifyDragStart: () => void;
}

export function useSelection({
  ignoreClickAfterDrag = 100,
  longPressThreshold = 600,
}: UseSelectionOptions = {}): UseSelectionReturn {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Refs
  const isDraggingRef = useRef(false);
  const dragEndTimeRef = useRef(0);
  const mouseDownTimeRef = useRef(0);

  // 通知拖拽开始
  const notifyDragStart = useCallback(() => {
    isDraggingRef.current = true;
  }, []);

  // 通知拖拽结束
  const notifyDragEnd = useCallback(() => {
    isDraggingRef.current = false;
    dragEndTimeRef.current = Date.now();
  }, []);

  // 获取 item 事件处理器
  const getSelectionHandlers = useCallback(
    (index: number) => {
      const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();

        // 拖拽中不触发选中
        if (isDraggingRef.current) {
          return;
        }

        // 拖拽结束后短时间内不触发选中
        const timeSinceDragEnd = Date.now() - dragEndTimeRef.current;
        if (timeSinceDragEnd < ignoreClickAfterDrag) {
          return;
        }

        // 长按不触发选中（视为拖拽意图）
        const pressDuration = Date.now() - mouseDownTimeRef.current;
        if (pressDuration > longPressThreshold) {
          return;
        }

        setSelectedIndex(index);
      };

      const handleMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();
        mouseDownTimeRef.current = Date.now();
      };

      const handleMouseUp = (e: React.MouseEvent) => {
        e.stopPropagation();
      };

      return {
        onClick: handleClick,
        onMouseDown: handleMouseDown,
        onMouseUp: handleMouseUp,
      };
    },
    [ignoreClickAfterDrag, longPressThreshold]
  );

  return {
    selectedIndex,
    setSelectedIndex,
    getSelectionHandlers,
    notifyDragEnd,
    notifyDragStart,
  };
}
