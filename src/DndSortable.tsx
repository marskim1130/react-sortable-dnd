import React, { useCallback, useEffect, useRef } from 'react';
import { DndSortableProps, DndItem, DragSource } from './types';
import { useDragDrop } from './hooks/useDragDrop';
import { useSelection } from './hooks/useSelection';
import './styles/index.css';

export function DndSortable<T extends DndItem>({
  items,
  onItemsChange,
  renderItem,
  dragSources,
  onDrop,
  disabled = false,
  className,
  style,
}: DndSortableProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);

  // 拖拽逻辑
  const {
    dragState,
    containerHandlers,
    getItemHandlers,
    getSourceHandlers,
  } = useDragDrop({
    items,
    onItemsChange,
    onDrop,
    disabled,
  });

  // 选中逻辑
  const {
    selectedIndex,
    getSelectionHandlers,
    notifyDragEnd,
    notifyDragStart,
  } = useSelection();

  // 同步拖拽状态到选中逻辑
  useEffect(() => {
    if (dragState.isDragging) {
      notifyDragStart();
    } else if (dragState.draggingIndex !== null) {
      notifyDragEnd();
    }
  }, [dragState.isDragging, dragState.draggingIndex, notifyDragStart, notifyDragEnd]);

  // 渲染占位符
  const renderPlaceholder = useCallback(
    (index: number) => {
      const isVisible =
        dragState.insertIndex === index && dragState.isDragging;

      return (
        <div
          key={`placeholder-${index}`}
          className={`dnd-sortable-placeholder ${
            isVisible ? 'dnd-sortable-placeholder--visible' : ''
          }`}
        >
          <div className="dnd-sortable-placeholder-inner" />
        </div>
      );
    },
    [dragState.insertIndex, dragState.isDragging]
  );

  // 渲染单个 item
  const renderDraggableItem = useCallback(
    (item: T, index: number) => {
      const isDragging = dragState.draggingIndex === index;
      const isBouncing = dragState.dragEndingIndices.has(index);

      const itemHandlers = getItemHandlers(index);
      const selectionHandlers = getSelectionHandlers(index);

      // 判断是否有 DndHandle 子组件
      const hasHandle = React.Children.toArray(
        renderItem(item, index)
      ).some(
        (child) =>
          React.isValidElement(child) &&
          (child.type as any)?.displayName === 'DndHandle'
      );

      // 如果没有 DndHandle，整个 item 可拖拽
      // 如果有 DndHandle，只有 handle 可拖拽
      const draggableProps = hasHandle
        ? { draggable: false }
        : itemHandlers;

      const clickHandlers = selectionHandlers;

      return (
        <div
          key={item.id}
          data-index={index}
          className={`dnd-sortable-item ${
            isDragging ? 'dnd-sortable-item--dragging' : ''
          } ${isBouncing ? 'dnd-sortable-item--bouncing' : ''}`}
          {...draggableProps}
          {...clickHandlers}
        >
          {/* 如果有 DndHandle，需要包装并给 handle 添加拖拽事件 */}
          {hasHandle ? (
            <div className="dnd-sortable-item-content" {...itemHandlers}>
              {renderItem(item, index)}
            </div>
          ) : (
            renderItem(item, index)
          )}

          {/* 拖拽遮罩 */}
          {isDragging && <div className="dnd-sortable-mask" />}
        </div>
      );
    },
    [
      dragState.draggingIndex,
      dragState.dragEndingIndices,
      selectedIndex,
      getItemHandlers,
      getSelectionHandlers,
      renderItem,
    ]
  );

  // 渲染拖拽源
  const renderDragSource = useCallback(
    (source: DragSource<T>) => {
      const sourceHandlers = getSourceHandlers(source);

      return (
        <div
          key={source.type}
          className="dnd-drag-source"
          {...sourceHandlers}
        >
          {source.icon && (
            <span className="dnd-drag-source-icon">{source.icon}</span>
          )}
          <span className="dnd-drag-source-label">{source.label}</span>
        </div>
      );
    },
    [getSourceHandlers]
  );

  return (
    <div
      ref={containerRef}
      className={`dnd-sortable ${className || ''}`}
      style={style}
      {...containerHandlers}
    >
      {/* 拖拽源区域 */}
      {dragSources && dragSources.length > 0 && (
        <div className="dnd-sortable-sources">
          {dragSources.map(renderDragSource)}
        </div>
      )}

      {/* 拖拽目标区域 */}
      <div className="dnd-sortable-items">
        {renderPlaceholder(0)}
        {items.map((item, index) => (
          <React.Fragment key={item.id}>
            {renderDraggableItem(item, index)}
            {renderPlaceholder(index + 1)}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

DndSortable.displayName = 'DndSortable';
