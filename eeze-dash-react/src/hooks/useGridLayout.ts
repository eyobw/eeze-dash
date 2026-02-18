import { useCallback } from 'react';
import type { LayoutItem } from '@/types';

const COLS = 4;
const DEFAULT_W = 2;
const DEFAULT_H = 2;

/**
 * Compute position for a new widget, placing it in the next available spot.
 */
export function getNextPosition(existingLayouts: LayoutItem[]): { x: number; y: number } {
  if (existingLayouts.length === 0) {
    return { x: 0, y: 0 };
  }

  // Find the maximum y + h to place at bottom
  const maxBottom = Math.max(...existingLayouts.map((l) => l.y + l.h));

  // Try to find space in the last row
  const lastRowLayouts = existingLayouts.filter(
    (l) => l.y + l.h === maxBottom
  );
  const occupiedRight = Math.max(
    ...lastRowLayouts.map((l) => l.x + l.w),
    0
  );

  if (occupiedRight + DEFAULT_W <= COLS) {
    return { x: occupiedRight, y: maxBottom - DEFAULT_H };
  }

  // Otherwise place on a new row
  return { x: 0, y: maxBottom };
}

export function useGridLayout() {
  const createLayoutItem = useCallback(
    (id: string, existingLayouts: LayoutItem[]): LayoutItem => {
      const pos = getNextPosition(existingLayouts);
      return {
        i: id,
        x: pos.x,
        y: pos.y,
        w: DEFAULT_W,
        h: DEFAULT_H,
      };
    },
    []
  );

  return { createLayoutItem, cols: COLS };
}
