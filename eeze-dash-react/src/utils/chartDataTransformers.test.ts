import { describe, it, expect } from 'vitest';
import {
  toRechartsBar,
  toRechartsPie,
  toRechartsMultiBar,
  toRechartsLine,
  toRechartsBoxPlot,
  toRechartsArea,
  toRechartsScatter,
  toRechartsHorizontalBar,
  toRechartsRadar,
  toRechartsStackedBar,
} from './chartDataTransformers';
import type { BoxPlotDatum } from '@/types';

describe('toRechartsBar', () => {
  it('transforms frequency data to bar chart format', () => {
    const input = [
      { key: 'A', value: 10 },
      { key: 'B', value: 20 },
    ];
    const result = toRechartsBar(input);
    expect(result).toEqual([
      { name: 'A', value: 10 },
      { name: 'B', value: 20 },
    ]);
  });
});

describe('toRechartsPie', () => {
  it('transforms frequency data to pie chart format', () => {
    const input = [{ key: 'X', value: 5 }];
    const result = toRechartsPie(input);
    expect(result).toEqual([{ name: 'X', value: 5 }]);
  });
});

describe('toRechartsMultiBar', () => {
  it('reshapes multi-bar series to category-based rows', () => {
    const series = [
      { key: 'Group1', values: [{ x: 'Cat1', y: 10 }, { x: 'Cat2', y: 20 }] },
      { key: 'Group2', values: [{ x: 'Cat1', y: 15 }, { x: 'Cat2', y: 25 }] },
    ];
    const result = toRechartsMultiBar(series);
    expect(result).toEqual([
      { category: 'Cat1', Group1: 10, Group2: 15 },
      { category: 'Cat2', Group1: 20, Group2: 25 },
    ]);
  });

  it('returns empty array for empty series', () => {
    expect(toRechartsMultiBar([])).toEqual([]);
  });
});

describe('toRechartsLine', () => {
  it('reshapes line series to x-keyed rows', () => {
    const series = [
      { key: 'S1', values: [{ x: 'a', y: 1 }, { x: 'b', y: 2 }] },
      { key: 'S2', values: [{ x: 'a', y: 3 }, { x: 'b', y: 4 }] },
    ];
    const result = toRechartsLine(series);
    expect(result).toEqual([
      { x: 'a', S1: 1, S2: 3 },
      { x: 'b', S1: 2, S2: 4 },
    ]);
  });
});

describe('toRechartsBoxPlot', () => {
  it('transforms box plot data', () => {
    const input: BoxPlotDatum[] = [
      {
        label: 'Age',
        values: {
          Q1: 25,
          Q2: 30,
          Q3: 35,
          whisker_low: 10,
          whisker_high: 50,
          outliers: [5, 55],
        },
      },
    ];
    const result = toRechartsBoxPlot(input);
    expect(result[0].label).toBe('Age');
    expect(result[0].IQR_base).toBe(25);
    expect(result[0].IQR_height).toBe(10);
    expect(result[0].outliers).toEqual([5, 55]);
  });
});

describe('toRechartsArea', () => {
  it('produces same format as line chart', () => {
    const series = [
      { key: 'S1', values: [{ x: 'a', y: 1 }, { x: 'b', y: 2 }] },
    ];
    const result = toRechartsArea(series);
    expect(result).toEqual([
      { x: 'a', S1: 1 },
      { x: 'b', S1: 2 },
    ]);
  });
});

describe('toRechartsScatter', () => {
  it('passes through scatter data', () => {
    const data = [{ x: 1, y: 2 }, { x: 3, y: 4 }];
    expect(toRechartsScatter(data)).toEqual(data);
  });
});

describe('toRechartsHorizontalBar', () => {
  it('transforms frequency data same as bar', () => {
    const input = [{ key: 'A', value: 10 }];
    const result = toRechartsHorizontalBar(input);
    expect(result).toEqual([{ name: 'A', value: 10 }]);
  });
});

describe('toRechartsRadar', () => {
  it('passes through radar data', () => {
    const data = [{ subject: 'Speed', value: 80 }, { subject: 'Power', value: 90 }];
    expect(toRechartsRadar(data)).toEqual(data);
  });
});

describe('toRechartsStackedBar', () => {
  it('produces same format as multi-bar', () => {
    const series = [
      { key: 'G1', values: [{ x: 'C1', y: 10 }] },
      { key: 'G2', values: [{ x: 'C1', y: 20 }] },
    ];
    const result = toRechartsStackedBar(series);
    expect(result).toEqual([{ category: 'C1', G1: 10, G2: 20 }]);
  });
});
