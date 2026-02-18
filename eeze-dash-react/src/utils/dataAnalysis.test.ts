import { describe, it, expect } from 'vitest';
import {
  analyzeColumns,
  findRow,
  wrapData,
  nestMultiBarGraphData,
  lineChartDataGenerator,
  getQuartiles,
} from './dataAnalysis';

const sampleData = [
  { id: 1, name: 'Alice', age: 30, city: 'Helsinki', score: 90, gender: 'F' },
  { id: 2, name: 'Bob', age: 25, city: 'Helsinki', score: 85, gender: 'M' },
  { id: 3, name: 'Carol', age: 35, city: 'Espoo', score: 92, gender: 'F' },
  { id: 4, name: 'Dave', age: 28, city: 'Espoo', score: 78, gender: 'M' },
  { id: 5, name: 'Eve', age: 32, city: 'Helsinki', score: 88, gender: 'F' },
];

describe('analyzeColumns', () => {
  it('returns empty analysis for empty data', () => {
    const result = analyzeColumns([]);
    expect(result.columns).toEqual([]);
    expect(result.totalRows).toBe(0);
  });

  it('identifies numeric columns excluding id', () => {
    const result = analyzeColumns(sampleData);
    expect(result.numericColumns).toContain('age');
    expect(result.numericColumns).toContain('score');
    expect(result.numericColumns).not.toContain('id');
  });

  it('identifies bar/pie columns (2-30 unique values)', () => {
    const result = analyzeColumns(sampleData);
    expect(result.barPieColumns).toContain('city');
    expect(result.barPieColumns).toContain('gender');
  });

  it('identifies line filter columns (<=3 unique values)', () => {
    const result = analyzeColumns(sampleData);
    // gender has 2 unique values, city has 2
    expect(result.lineFilterColumns.length).toBeGreaterThan(0);
  });

  it('returns correct totalRows', () => {
    const result = analyzeColumns(sampleData);
    expect(result.totalRows).toBe(5);
  });
});

describe('findRow', () => {
  it('counts frequency of values in a column', () => {
    const result = findRow(sampleData, 'city');
    expect(result).toEqual(
      expect.arrayContaining([
        { key: 'Helsinki', value: 3 },
        { key: 'Espoo', value: 2 },
      ])
    );
  });

  it('counts frequency for gender', () => {
    const result = findRow(sampleData, 'gender');
    expect(result).toEqual(
      expect.arrayContaining([
        { key: 'F', value: 3 },
        { key: 'M', value: 2 },
      ])
    );
  });
});

describe('wrapData', () => {
  it('wraps data in an array', () => {
    const data = [{ key: 'a', value: 1 }];
    const result = wrapData(data);
    expect(result).toEqual([data]);
    expect(result.length).toBe(1);
  });
});

describe('nestMultiBarGraphData', () => {
  it('creates multi-bar series without numeric aggregation', () => {
    const result = nestMultiBarGraphData(sampleData, 'city', 'gender');
    expect(result.length).toBe(2); // Helsinki, Espoo
    expect(result[0].key).toBe('Helsinki');
    expect(result[0].values.length).toBe(2); // F, M

    const helsinkiF = result[0].values.find((v) => v.x === 'F');
    expect(helsinkiF?.y).toBe(2); // Alice, Eve
  });

  it('creates multi-bar series with numeric aggregation', () => {
    const result = nestMultiBarGraphData(sampleData, 'city', 'gender', 'score');
    const helsinkiF = result[0].values.find((v) => v.x === 'F');
    expect(helsinkiF?.y).toBe(90 + 88); // Alice + Eve scores
  });
});

describe('lineChartDataGenerator', () => {
  it('generates line series for selected y columns', () => {
    const result = lineChartDataGenerator(sampleData, 'name', ['age', 'score']);
    expect(result.length).toBe(2);
    expect(result[0].key).toBe('age');
    expect(result[0].values.length).toBe(5);
    expect(result[0].values[0]).toEqual({ x: 'Alice', y: 30 });
  });

  it('respects maxRows limit', () => {
    const result = lineChartDataGenerator(sampleData, 'name', ['age'], 3);
    expect(result[0].values.length).toBe(3);
  });
});

describe('getQuartiles', () => {
  it('calculates quartiles for sorted data', () => {
    // Simple test with known values
    const sorted = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const result = getQuartiles(sorted, 'test');
    expect(result.label).toBe('test');
    expect(result.values.Q1).toBeDefined();
    expect(result.values.Q2).toBeDefined();
    expect(result.values.Q3).toBeDefined();
    expect(result.values.whisker_low).toBeDefined();
    expect(result.values.whisker_high).toBeDefined();
    expect(result.values.Q2).toBeGreaterThan(result.values.Q1);
    expect(result.values.Q3).toBeGreaterThan(result.values.Q2);
  });

  it('identifies outliers', () => {
    const sorted = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 100];
    const result = getQuartiles(sorted, 'outlier-test');
    expect(result.values.outliers.length).toBeGreaterThan(0);
    expect(result.values.outliers).toContain(100);
  });
});
