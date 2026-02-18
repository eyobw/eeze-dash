import { useEffect, useCallback } from 'react';
import type { Widget, LayoutItem } from '@/types';
import {
  saveData,
  loadData,
  saveDashboard,
  loadDashboard,
  clearAll,
} from '@/utils/sessionStorageHelper';

interface PersistenceResult {
  restoreSession: () => {
    data: Record<string, unknown>[] | null;
    widgets: Widget[];
    layouts: LayoutItem[];
  };
  persistWidgets: (widgets: Widget[], layouts: LayoutItem[]) => void;
  persistData: (data: Record<string, unknown>[]) => void;
  clearSession: () => void;
}

export function useDashboardPersistence(): PersistenceResult {
  const restoreSession = useCallback(() => {
    const data = loadData();
    const dashboard = loadDashboard();
    return {
      data,
      widgets: dashboard?.widgets ?? [],
      layouts: dashboard?.layouts ?? [],
    };
  }, []);

  const persistWidgets = useCallback(
    (widgets: Widget[], layouts: LayoutItem[]) => {
      saveDashboard(widgets, layouts);
    },
    []
  );

  const persistData = useCallback((data: Record<string, unknown>[]) => {
    saveData(data);
  }, []);

  const clearSession = useCallback(() => {
    clearAll();
  }, []);

  return { restoreSession, persistWidgets, persistData, clearSession };
}

/**
 * Auto-save effect: call this inside the provider.
 */
export function useAutoSave(
  widgets: Widget[],
  layouts: LayoutItem[],
  hasData: boolean
): void {
  useEffect(() => {
    if (hasData) {
      saveDashboard(widgets, layouts);
    }
  }, [widgets, layouts, hasData]);
}
