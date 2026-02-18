import type { Widget, LayoutItem } from '@/types';

const KEYS = {
  data: 'eeze_data',
  columns: 'eeze_columns',
  dashboard: 'eeze_dashboard',
} as const;

interface StoredDashboard {
  widgets: Widget[];
  layouts: LayoutItem[];
}

export function saveData(data: Record<string, unknown>[]): void {
  sessionStorage.setItem(KEYS.data, JSON.stringify(data));
}

export function loadData(): Record<string, unknown>[] | null {
  const raw = sessionStorage.getItem(KEYS.data);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveColumns(columns: string[]): void {
  sessionStorage.setItem(KEYS.columns, JSON.stringify(columns));
}

export function loadColumns(): string[] | null {
  const raw = sessionStorage.getItem(KEYS.columns);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveDashboard(widgets: Widget[], layouts: LayoutItem[]): void {
  const payload: StoredDashboard = { widgets, layouts };
  sessionStorage.setItem(KEYS.dashboard, JSON.stringify(payload));
}

export function loadDashboard(): StoredDashboard | null {
  const raw = sessionStorage.getItem(KEYS.dashboard);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);

    // Handle legacy format (old AngularJS app stored {widgets: [...]})
    if (parsed.widgets) {
      const widgets: Widget[] = parsed.widgets.map(
        (w: Record<string, unknown>) => {
          // Handle legacy typo 'disrceteBarChart' -> 'discreteBarChart'
          let type = w.type as string;
          if (type === 'disrceteBarChart') {
            type = 'discreteBarChart';
          }

          // Legacy format stored chart data inside widget.chart.data
          const chartObj = w.chart as Record<string, unknown> | undefined;
          const data = chartObj?.data ?? w.data;

          return {
            id: (w.id as string) ?? crypto.randomUUID(),
            name: w.name as string,
            type,
            data,
          };
        }
      );

      return {
        widgets,
        layouts: parsed.layouts ?? [],
      };
    }

    return parsed;
  } catch {
    return null;
  }
}

export function clearAll(): void {
  sessionStorage.removeItem(KEYS.data);
  sessionStorage.removeItem(KEYS.columns);
  sessionStorage.removeItem(KEYS.dashboard);
  // Also clear legacy keys from original app
  sessionStorage.removeItem('data');
  sessionStorage.removeItem('columns');
  sessionStorage.removeItem('dashboard');
}
