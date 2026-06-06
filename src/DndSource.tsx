import { useCallback, useRef } from 'react';
import { clearExternalDragSource, setExternalDragData } from './dragData';
import { DndItem, DndSourceProps } from './types';

export function DndSource<T extends DndItem>({
  source,
  disabled = false,
  children,
}: DndSourceProps<T>) {
  const sourceIdRef = useRef<string | null>(null);

  const handleDragStart = useCallback(
    (e: React.DragEvent) => {
      if (disabled) return;

      clearExternalDragSource(sourceIdRef.current);
      sourceIdRef.current = setExternalDragData(e.dataTransfer, source);
      e.dataTransfer.effectAllowed = 'copy';
    },
    [disabled, source]
  );

  const handleDragEnd = useCallback(() => {
    clearExternalDragSource(sourceIdRef.current);
    sourceIdRef.current = null;
  }, []);

  return (
    <>
      {children({
        draggable: !disabled,
        onDragStart: handleDragStart,
        onDragEnd: handleDragEnd,
      })}
    </>
  );
}

DndSource.displayName = 'DndSource';
