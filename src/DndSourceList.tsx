import { DndSource } from './DndSource';
import { DndItem, DndSourceListProps } from './types';

export function DndSourceList<T extends DndItem>({
  sources,
  disabled = false,
  className,
  style,
  renderSource,
}: DndSourceListProps<T>) {
  return (
    <div className={`dnd-sortable-sources ${className || ''}`} style={style}>
      {sources.map((source, index) => (
        <DndSource key={source.type} source={source} disabled={disabled}>
          {(dragProps) =>
            renderSource ? (
              renderSource(source, index, dragProps)
            ) : (
              <div className="dnd-drag-source" {...dragProps}>
                {source.icon && (
                  <span className="dnd-drag-source-icon">{source.icon}</span>
                )}
                <span className="dnd-drag-source-label">{source.label}</span>
              </div>
            )
          }
        </DndSource>
      ))}
    </div>
  );
}

DndSourceList.displayName = 'DndSourceList';
