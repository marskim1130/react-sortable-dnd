import React from 'react';
import { DndHandleProps } from './types';

export const DndHandle: React.FC<DndHandleProps> = ({
  children,
  className,
  style,
}) => {
  return (
    <div
      className={`dnd-handle ${className || ''}`}
      style={style}
      data-dnd-handle="true"
    >
      {children}
    </div>
  );
};

DndHandle.displayName = 'DndHandle';
