import { DndItem, DragSource } from './types';

export const DRAG_DATA_KEY = 'application/json';

export interface InternalDragData {
  type: 'internal';
  index: number;
}

export interface ExternalDragData<T extends DndItem = DndItem> {
  type: 'external';
  source: DragSource<T>;
  sourceId?: string;
}

export type DragData<T extends DndItem = DndItem> =
  | InternalDragData
  | ExternalDragData<T>;

interface SerializedExternalDragData {
  type: 'external';
  sourceId?: string;
  sourceType?: string;
  source?: DragSource;
}

let nextSourceId = 0;
const externalSources = new Map<string, DragSource>();

function hasDragData(dataTransfer: DataTransfer): boolean {
  return Array.prototype.includes.call(dataTransfer.types, DRAG_DATA_KEY);
}

export function setInternalDragData(
  dataTransfer: DataTransfer,
  index: number
): void {
  const dragData: InternalDragData = { type: 'internal', index };
  dataTransfer.setData(DRAG_DATA_KEY, JSON.stringify(dragData));
}

export function setExternalDragData<T extends DndItem>(
  dataTransfer: DataTransfer,
  source: DragSource<T>
): string {
  const sourceId = `dnd-source-${++nextSourceId}`;
  externalSources.set(sourceId, source);

  const dragData: SerializedExternalDragData = {
    type: 'external',
    sourceId,
    sourceType: source.type,
  };

  dataTransfer.setData(DRAG_DATA_KEY, JSON.stringify(dragData));
  return sourceId;
}

export function clearExternalDragSource(sourceId?: string | null): void {
  if (!sourceId) return;
  externalSources.delete(sourceId);
}

export function parseDragData<T extends DndItem>(
  dataTransfer: DataTransfer
): DragData<T> | null {
  if (!hasDragData(dataTransfer)) {
    return null;
  }

  try {
    const data = JSON.parse(dataTransfer.getData(DRAG_DATA_KEY));

    if (data?.type === 'internal' && typeof data.index === 'number') {
      return { type: 'internal', index: data.index };
    }

    if (data?.type === 'external') {
      const source = data.sourceId
        ? externalSources.get(data.sourceId)
        : data.source;

      if (!source) {
        return null;
      }

      return {
        type: 'external',
        source: source as DragSource<T>,
        sourceId: data.sourceId,
      };
    }
  } catch {
    return null;
  }

  return null;
}
