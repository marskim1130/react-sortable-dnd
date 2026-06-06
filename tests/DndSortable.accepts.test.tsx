// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
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

describe('DndSortable accepts', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  it('does not change items when a legacy drag source is rejected by accepts', () => {
    const textSource: DragSource<CanvasItem> = {
      type: 'text',
      label: 'Text',
    };
    const onDrop = vi.fn(() => ({
      id: 'new-text',
      label: 'New text',
      type: 'text',
    }));
    const onItemsChange = vi.fn();
    const dataTransfer = createDataTransfer();

    render(
      <DndSortable
        items={[{ id: 'existing-image', label: 'Existing image', type: 'image' }]}
        onItemsChange={onItemsChange}
        renderItem={(item) => <div>{item.label}</div>}
        dragSources={[textSource]}
        accepts={['image']}
        onDrop={onDrop}
      />
    );

    fireEvent.dragStart(screen.getByText('Text'), { dataTransfer });
    fireEvent.dragOver(screen.getByText('Existing image'), {
      dataTransfer,
      clientY: 0,
    });
    fireEvent.drop(screen.getByText('Existing image'), { dataTransfer });

    expect(onDrop).not.toHaveBeenCalled();
    expect(onItemsChange).not.toHaveBeenCalled();
  });

  it('does not show a placeholder when a legacy drag source is rejected by accepts', () => {
    const textSource: DragSource<CanvasItem> = {
      type: 'text',
      label: 'Text',
    };
    const dataTransfer = createDataTransfer();
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      callback(0);
      return 0;
    });

    const { container } = render(
      <DndSortable
        items={[{ id: 'existing-image', label: 'Existing image', type: 'image' }]}
        onItemsChange={vi.fn()}
        renderItem={(item) => <div>{item.label}</div>}
        dragSources={[textSource]}
        accepts={['image']}
        onDrop={vi.fn()}
      />
    );

    fireEvent.dragStart(screen.getByText('Text'), { dataTransfer });
    fireEvent.dragOver(screen.getByText('Existing image'), {
      dataTransfer,
      clientY: 0,
    });

    expect(
      container.querySelector('.dnd-sortable-placeholder--visible')
    ).not.toBeInTheDocument();
  });

  it('does not show a placeholder when a rejected legacy drag source enters the target', () => {
    const textSource: DragSource<CanvasItem> = {
      type: 'text',
      label: 'Text',
    };
    const dataTransfer = createDataTransfer();
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      callback(0);
      return 0;
    });

    const { container } = render(
      <DndSortable
        items={[{ id: 'existing-image', label: 'Existing image', type: 'image' }]}
        onItemsChange={vi.fn()}
        renderItem={(item) => <div>{item.label}</div>}
        dragSources={[textSource]}
        accepts={['image']}
        onDrop={vi.fn()}
      />
    );

    fireEvent.dragStart(screen.getByText('Text'), { dataTransfer });
    fireEvent.dragEnter(screen.getByText('Existing image'), { dataTransfer });

    expect(
      container.querySelector('.dnd-sortable-placeholder--visible')
    ).not.toBeInTheDocument();
  });
});
