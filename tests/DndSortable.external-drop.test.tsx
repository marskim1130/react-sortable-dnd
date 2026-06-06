// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DndSortable, type DndItem, type DragSource } from '../src';

interface CanvasItem extends DndItem {
  label: string;
}

function createDataTransfer(): DataTransfer {
  const data = new Map<string, string>();
  const dataTransfer = {
    dropEffect: 'none',
    effectAllowed: 'all',
    files: [],
    items: [],
    types: [] as string[],
    clearData(format?: string) {
      if (format) {
        data.delete(format);
        this.types = this.types.filter((type) => type !== format);
        return;
      }

      data.clear();
      this.types = [];
    },
    getData(format: string) {
      return data.get(format) ?? '';
    },
    setData(format: string, value: string) {
      data.set(format, value);
      if (!this.types.includes(format)) {
        this.types.push(format);
      }
    },
    setDragImage() {},
  };

  return dataTransfer as unknown as DataTransfer;
}

describe('DndSortable external drop item creation', () => {
  afterEach(() => {
    cleanup();
  });

  it('lets onDrop read source data and use its return value as the inserted item', () => {
    const textSource: DragSource<CanvasItem> = {
      type: 'text',
      label: 'Text',
      data: {
        label: 'Draft text',
      },
    };
    const onItemsChange = vi.fn();
    const onDrop = vi.fn((source: DragSource<CanvasItem>) => ({
      id: 'factory-text',
      label: `${source.data?.label} from factory`,
      type: source.type,
    }));
    const dataTransfer = createDataTransfer();

    render(
      <DndSortable
        items={[{ id: 'existing-image', label: 'Existing image', type: 'image' }]}
        onItemsChange={onItemsChange}
        renderItem={(item) => <div>{item.label}</div>}
        dragSources={[textSource]}
        onDrop={onDrop}
      />
    );

    fireEvent.dragStart(screen.getByText('Text'), { dataTransfer });
    fireEvent.drop(screen.getByText('Existing image'), { dataTransfer });

    expect(onItemsChange).toHaveBeenCalledWith([
      { id: 'existing-image', label: 'Existing image', type: 'image' },
      { id: 'factory-text', label: 'Draft text from factory', type: 'text' },
    ]);
  });

  it('inserts source data when onDrop is not provided', () => {
    const textSource: DragSource<CanvasItem> = {
      type: 'text',
      label: 'Text',
      data: {
        id: 'draft-text',
        label: 'Draft text',
        type: 'text',
      },
    };
    const onItemsChange = vi.fn();
    const dataTransfer = createDataTransfer();

    render(
      <DndSortable
        items={[{ id: 'existing-image', label: 'Existing image', type: 'image' }]}
        onItemsChange={onItemsChange}
        renderItem={(item) => <div>{item.label}</div>}
        dragSources={[textSource]}
      />
    );

    fireEvent.dragStart(screen.getByText('Text'), { dataTransfer });
    fireEvent.drop(screen.getByText('Existing image'), { dataTransfer });

    expect(onItemsChange).toHaveBeenCalledWith([
      { id: 'existing-image', label: 'Existing image', type: 'image' },
      { id: 'draft-text', label: 'Draft text', type: 'text' },
    ]);
  });

  it('throws when neither onDrop nor source data can create an item', () => {
    const textSource: DragSource<CanvasItem> = {
      type: 'text',
      label: 'Text',
      data: {
        label: 'Draft text',
      },
    };
    const onItemsChange = vi.fn();
    const dataTransfer = createDataTransfer();
    const errors: Error[] = [];
    const handleError = (event: ErrorEvent) => {
      event.preventDefault();
      errors.push(event.error);
    };
    window.addEventListener('error', handleError);

    render(
      <DndSortable
        items={[{ id: 'existing-image', label: 'Existing image', type: 'image' }]}
        onItemsChange={onItemsChange}
        renderItem={(item) => <div>{item.label}</div>}
        dragSources={[textSource]}
      />
    );

    fireEvent.dragStart(screen.getByText('Text'), { dataTransfer });
    fireEvent.drop(screen.getByText('Existing image'), { dataTransfer });

    window.removeEventListener('error', handleError);
    expect(errors[0]?.message).toMatch(/onDrop or source\.data\.id/);
    expect(onItemsChange).not.toHaveBeenCalled();
  });
});
