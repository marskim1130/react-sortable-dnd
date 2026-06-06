// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DndSortable, DndSource, type DndItem, type DragSource } from '../src';

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

describe('DndSource', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  it('turns caller-provided UI into a same-page drag source without wrapping DOM', () => {
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

    const { container } = render(
      <>
        <DndSource source={textSource}>
          {(dragProps) => (
            <button type="button" data-testid="custom-source" {...dragProps}>
              Custom source
            </button>
          )}
        </DndSource>
        <DndSortable
          items={[{ id: 'existing-image', label: 'Existing image', type: 'image' }]}
          onItemsChange={onItemsChange}
          renderItem={(item) => <div>{item.label}</div>}
        />
      </>
    );

    const sourceButton = screen.getByTestId('custom-source');
    expect(container.querySelectorAll('[data-testid="custom-source"]')).toHaveLength(1);
    expect(sourceButton.tagName).toBe('BUTTON');

    fireEvent.dragStart(sourceButton, { dataTransfer });
    fireEvent.drop(screen.getByText('Existing image'), { dataTransfer });

    expect(onItemsChange).toHaveBeenCalledWith([
      { id: 'existing-image', label: 'Existing image', type: 'image' },
      { id: 'draft-text', label: 'Draft text', type: 'text' },
    ]);
  });

  it('shows the insertion placeholder while an accepted source hovers over DndSortable', () => {
    const textSource: DragSource<CanvasItem> = {
      type: 'text',
      label: 'Text',
      data: {
        id: 'draft-text',
        label: 'Draft text',
        type: 'text',
      },
    };
    const dataTransfer = createDataTransfer();
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      callback(0);
      return 0;
    });

    const { container } = render(
      <>
        <DndSource source={textSource}>
          {(dragProps) => (
            <button type="button" data-testid="custom-source" {...dragProps}>
              Custom source
            </button>
          )}
        </DndSource>
        <DndSortable
          items={[{ id: 'existing-image', label: 'Existing image', type: 'image' }]}
          onItemsChange={vi.fn()}
          renderItem={(item) => <div>{item.label}</div>}
        />
      </>
    );

    fireEvent.dragStart(screen.getByTestId('custom-source'), { dataTransfer });
    fireEvent.dragOver(screen.getByText('Existing image'), {
      dataTransfer,
      clientY: 0,
    });

    expect(
      container.querySelector('.dnd-sortable-placeholder--visible')
    ).toBeInTheDocument();
  });

  it('preserves source data objects for same-page drops', () => {
    const createdAt = new Date('2026-06-05T00:00:00.000Z');
    const textSource: DragSource<CanvasItem & { createdAt: Date }> = {
      type: 'text',
      label: 'Text',
      data: {
        id: 'draft-text',
        label: 'Draft text',
        type: 'text',
        createdAt,
      },
    };
    const onItemsChange = vi.fn();
    const onDrop = vi.fn((source: DragSource<CanvasItem & { createdAt: Date }>) => ({
      id: 'factory-text',
      label: source.data?.createdAt === createdAt ? 'Preserved date' : 'Lost date',
      type: source.type,
    }));
    const dataTransfer = createDataTransfer();

    render(
      <>
        <DndSource source={textSource}>
          {(dragProps) => (
            <button type="button" data-testid="custom-source" {...dragProps}>
              Custom source
            </button>
          )}
        </DndSource>
        <DndSortable
          items={[{ id: 'existing-image', label: 'Existing image', type: 'image' }]}
          onItemsChange={onItemsChange}
          renderItem={(item) => <div>{item.label}</div>}
          onDrop={onDrop}
        />
      </>
    );

    fireEvent.dragStart(screen.getByTestId('custom-source'), { dataTransfer });
    fireEvent.drop(screen.getByText('Existing image'), { dataTransfer });

    expect(onItemsChange).toHaveBeenCalledWith([
      { id: 'existing-image', label: 'Existing image', type: 'image' },
      { id: 'factory-text', label: 'Preserved date', type: 'text' },
    ]);
  });
});
