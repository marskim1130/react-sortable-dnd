// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DndSortable, DndSourceList, type DndItem, type DragSource } from '../src';

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

describe('DndSourceList', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders default drag source UI and drags source data into DndSortable', () => {
    const sources: DragSource<CanvasItem>[] = [
      {
        type: 'text',
        label: 'Text',
        data: {
          id: 'draft-text',
          label: 'Draft text',
          type: 'text',
        },
      },
    ];
    const onItemsChange = vi.fn();
    const dataTransfer = createDataTransfer();

    const { container } = render(
      <>
        <DndSourceList sources={sources} />
        <DndSortable
          items={[{ id: 'existing-image', label: 'Existing image', type: 'image' }]}
          onItemsChange={onItemsChange}
          renderItem={(item) => <div>{item.label}</div>}
        />
      </>
    );

    const source = screen.getByText('Text').closest('.dnd-drag-source');
    expect(source).toBeInTheDocument();

    fireEvent.dragStart(source as Element, { dataTransfer });
    fireEvent.drop(screen.getByText('Existing image'), { dataTransfer });

    expect(onItemsChange).toHaveBeenCalledWith([
      { id: 'existing-image', label: 'Existing image', type: 'image' },
      { id: 'draft-text', label: 'Draft text', type: 'text' },
    ]);
    expect(container.querySelectorAll('.dnd-drag-source')).toHaveLength(1);
  });

  it('lets renderSource provide custom source UI with drag behavior props', () => {
    const sources: DragSource<CanvasItem>[] = [
      {
        type: 'text',
        label: 'Text',
        data: {
          id: 'draft-text',
          label: 'Draft text',
          type: 'text',
        },
      },
    ];
    const onItemsChange = vi.fn();
    const dataTransfer = createDataTransfer();

    render(
      <>
        <DndSourceList
          sources={sources}
          renderSource={(source, index, dragProps) => (
            <button
              type="button"
              data-testid={`custom-source-${index}`}
              {...dragProps}
            >
              Custom {source.label}
            </button>
          )}
        />
        <DndSortable
          items={[{ id: 'existing-image', label: 'Existing image', type: 'image' }]}
          onItemsChange={onItemsChange}
          renderItem={(item) => <div>{item.label}</div>}
        />
      </>
    );

    const source = screen.getByTestId('custom-source-0');
    expect(source.tagName).toBe('BUTTON');
    expect(source).toHaveAttribute('draggable', 'true');

    fireEvent.dragStart(source, { dataTransfer });
    fireEvent.drop(screen.getByText('Existing image'), { dataTransfer });

    expect(onItemsChange).toHaveBeenCalledWith([
      { id: 'existing-image', label: 'Existing image', type: 'image' },
      { id: 'draft-text', label: 'Draft text', type: 'text' },
    ]);
  });
});
