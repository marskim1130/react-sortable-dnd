import { describe, expect, it, vi } from 'vitest';
import {
  decideExternalDrop,
  decideExternalHover,
} from '../src/dropTargetDecision';
import type { DndItem, DragSource } from '../src/types';

interface CanvasItem extends DndItem {
  label: string;
}

describe('drop target decision', () => {
  it('rejects hover feedback when accepts does not include the external source type', () => {
    const source: DragSource<CanvasItem> = {
      type: 'text',
      label: 'Text',
    };

    const decision = decideExternalHover({
      source,
      accepts: ['image'],
      insertIndex: 0,
    });

    expect(decision).toEqual({
      status: 'rejected',
      reason: 'source-not-accepted',
      dropEffect: 'none',
      insertIndex: null,
    });
  });

  it('uses the drop factory return value instead of source data when creating an external item', () => {
    const source: DragSource<CanvasItem> = {
      type: 'text',
      label: 'Text',
      data: {
        id: 'draft-text',
        label: 'Draft text',
      },
    };
    const factoryItem: CanvasItem = {
      id: 'factory-text',
      label: 'Factory text',
      type: 'text',
    };
    const onDrop = () => factoryItem;

    const decision = decideExternalDrop({
      source,
      insertIndex: 2,
      onDrop,
    });

    expect(decision).toEqual({
      status: 'accepted',
      item: factoryItem,
      insertIndex: 2,
    });
  });

  it('uses source data when creating an external item without a drop factory', () => {
    const draftItem: CanvasItem = {
      id: 'draft-text',
      label: 'Draft text',
      type: 'text',
    };
    const source: DragSource<CanvasItem> = {
      type: 'text',
      label: 'Text',
      data: draftItem,
    };

    const decision = decideExternalDrop({
      source,
      insertIndex: 1,
    });

    expect(decision).toEqual({
      status: 'accepted',
      item: draftItem,
      insertIndex: 1,
    });
  });

  it('throws a clear error when no drop factory or valid source data can create an external item', () => {
    const source: DragSource<CanvasItem> = {
      type: 'text',
      label: 'Text',
      data: {
        label: 'Draft text',
      },
    };

    expect(() =>
      decideExternalDrop({
        source,
        insertIndex: 1,
      })
    ).toThrow(/onDrop or source\.data\.id/);
  });

  it('rejects external drop without calling the drop factory when accepts does not include the source type', () => {
    const source: DragSource<CanvasItem> = {
      type: 'text',
      label: 'Text',
      data: {
        id: 'draft-text',
        label: 'Draft text',
      },
    };
    const onDrop = vi.fn(() => ({
      id: 'factory-text',
      label: 'Factory text',
      type: 'text',
    }));

    const decision = decideExternalDrop({
      source,
      accepts: ['image'],
      insertIndex: 1,
      onDrop,
    });

    expect(onDrop).not.toHaveBeenCalled();
    expect(decision).toEqual({
      status: 'rejected',
      reason: 'source-not-accepted',
      insertIndex: null,
    });
  });
});
