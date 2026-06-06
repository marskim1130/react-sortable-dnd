import type { DndItem, DragSource } from './types';

export interface ExternalHoverDecisionOptions<T extends DndItem = DndItem> {
  source: DragSource<T>;
  accepts?: string[];
  insertIndex: number | null;
}

export type ExternalHoverDecision =
  | {
      status: 'accepted';
      dropEffect: 'copy';
      insertIndex: number | null;
    }
  | {
      status: 'rejected';
      reason: 'source-not-accepted';
      dropEffect: 'none';
      insertIndex: null;
    };

export interface ExternalDropDecisionOptions<T extends DndItem = DndItem> {
  source: DragSource<T>;
  accepts?: string[];
  insertIndex: number;
  onDrop?: (source: DragSource<T>, index: number) => T;
}

export type ExternalDropDecision<T extends DndItem = DndItem> =
  | {
      status: 'accepted';
      item: T;
      insertIndex: number;
    }
  | {
      status: 'rejected';
      reason: 'source-not-accepted';
      insertIndex: null;
    };

export function decideExternalHover<T extends DndItem>({
  source,
  accepts,
  insertIndex,
}: ExternalHoverDecisionOptions<T>): ExternalHoverDecision {
  if (accepts && !accepts.includes(source.type)) {
    return {
      status: 'rejected',
      reason: 'source-not-accepted',
      dropEffect: 'none',
      insertIndex: null,
    };
  }

  return {
    status: 'accepted',
    dropEffect: 'copy',
    insertIndex,
  };
}

export function decideExternalDrop<T extends DndItem>({
  source,
  accepts,
  insertIndex,
  onDrop,
}: ExternalDropDecisionOptions<T>): ExternalDropDecision<T> {
  if (accepts && !accepts.includes(source.type)) {
    return {
      status: 'rejected',
      reason: 'source-not-accepted',
      insertIndex: null,
    };
  }

  const item = onDrop ? onDrop(source, insertIndex) : source.data;

  if (!item || typeof item.id !== 'string') {
    throw new Error(
      'DndSortable external drop requires onDrop or source.data.id'
    );
  }

  return {
    status: 'accepted',
    item: item as T,
    insertIndex,
  };
}
