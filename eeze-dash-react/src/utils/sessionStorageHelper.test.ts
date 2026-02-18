import { describe, it, expect, beforeEach } from 'vitest';
import {
  saveData,
  loadData,
  saveDashboard,
  loadDashboard,
  clearAll,
} from './sessionStorageHelper';

beforeEach(() => {
  sessionStorage.clear();
});

describe('sessionStorageHelper', () => {
  it('saves and loads data', () => {
    const data = [{ name: 'Alice', age: 30 }];
    saveData(data);
    const loaded = loadData();
    expect(loaded).toEqual(data);
  });

  it('returns null when no data stored', () => {
    expect(loadData()).toBeNull();
  });

  it('saves and loads dashboard', () => {
    const widgets = [
      { id: '1', name: 'Test', type: 'pieChart' as const, data: [] },
    ];
    const layouts = [{ i: '1', x: 0, y: 0, w: 2, h: 2 }];
    saveDashboard(widgets, layouts);
    const loaded = loadDashboard();
    expect(loaded?.widgets).toEqual(widgets);
    expect(loaded?.layouts).toEqual(layouts);
  });

  it('handles legacy disrceteBarChart typo', () => {
    const legacy = {
      widgets: [
        {
          name: 'Bar Chart',
          type: 'disrceteBarChart',
          chart: { data: [{ key: 'A', value: 1 }] },
        },
      ],
    };
    sessionStorage.setItem('eeze_dashboard', JSON.stringify(legacy));
    const loaded = loadDashboard();
    expect(loaded?.widgets[0].type).toBe('discreteBarChart');
    expect(loaded?.widgets[0].data).toEqual([{ key: 'A', value: 1 }]);
  });

  it('clears all storage', () => {
    saveData([{ a: 1 }]);
    saveDashboard([], []);
    clearAll();
    expect(loadData()).toBeNull();
    expect(loadDashboard()).toBeNull();
  });
});
