import type { DatasetAnalysis, FrequencyDatum, MultiBarSeries, LineSeries, BoxPlotQuartiles, BoxPlotDatum, ScatterDatum, RadarDatum } from '@/types';

/**
 * Analyze columns of a dataset to determine which columns are suitable
 * for each chart type.
 */
export function analyzeColumns(data: Record<string, unknown>[]): DatasetAnalysis {
  if (data.length === 0) {
    return {
      columns: [],
      numericColumns: [],
      barPieColumns: [],
      lineChartXColumns: [],
      lineFilterColumns: [],
      totalRows: 0,
    };
  }

  const sample = data[0];
  const columns = Object.keys(sample);

  // Find numeric columns (exclude 'id')
  const numericColumns = columns.filter(
    (col) => typeof sample[col] === 'number' && col !== 'id'
  );

  const barPieColumns: string[] = [];
  const lineChartXColumns: string[] = [];
  const lineFilterColumns: [string, unknown][] = [];

  for (const col of columns) {
    const values = data.map((row) => row[col]);
    const uniqueValues = [...new Set(values)];

    // For frequency bar and pie chart: 2-30 unique values
    if (uniqueValues.length > 1 && uniqueValues.length <= 30) {
      barPieColumns.push(col);
    }

    // For line chart X axis: 4-12 unique values OR all unique
    if (
      (uniqueValues.length <= 12 && uniqueValues.length >= 4) ||
      uniqueValues.length === values.length
    ) {
      lineChartXColumns.push(col);
    }

    // For line chart filter: <=3 unique values
    if (uniqueValues.length > 1 && uniqueValues.length <= 3) {
      for (const uv of uniqueValues) {
        lineFilterColumns.push([col, uv]);
      }
    }
  }

  return {
    columns,
    numericColumns,
    barPieColumns,
    lineChartXColumns,
    lineFilterColumns,
    totalRows: data.length,
  };
}

/**
 * Count frequency of each unique value in a column.
 * Replaces d3.nest().
 */
export function findRow(
  data: Record<string, unknown>[],
  column: string
): FrequencyDatum[] {
  const counts = new Map<string, number>();
  for (const row of data) {
    const key = String(row[column]);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return Array.from(counts.entries()).map(([key, value]) => ({ key, value }));
}

/**
 * Wrap frequency data for bar chart (NVD3 expected [{values: [...]}]).
 * We keep the same shape for Recharts compatibility in transformers.
 */
export function wrapData(data: FrequencyDatum[]): FrequencyDatum[][] {
  return [data];
}

/**
 * Build multi-bar chart data. Replaces underscore.js-based nesting.
 */
export function nestMultiBarGraphData(
  data: Record<string, unknown>[],
  xField: string,
  yField: string,
  numericField?: string | null
): MultiBarSeries[] {
  const xValues = [...new Set(data.map((row) => String(row[xField])))];
  const yValues = [...new Set(data.map((row) => String(row[yField])))];

  return xValues.map((xVal) => ({
    key: xVal,
    values: yValues.map((yVal) => {
      const matching = data.filter(
        (row) => String(row[xField]) === xVal && String(row[yField]) === yVal
      );

      let y: number;
      if (numericField) {
        y = matching.reduce(
          (sum, row) => sum + (Number(row[numericField]) || 0),
          0
        );
      } else {
        y = matching.length;
      }

      return { x: yVal, y };
    }),
  }));
}

/**
 * Generate line chart data from filtered data.
 */
export function lineChartDataGenerator(
  data: Record<string, unknown>[],
  xColumn: string,
  yColumns: string[],
  maxRows?: number
): LineSeries[] {
  const sliced = maxRows ? data.slice(0, maxRows) : data;

  return yColumns.map((col) => ({
    key: col,
    values: sliced.map((row) => ({
      x: row[xColumn],
      y: Number(row[col]) || 0,
    })),
  }));
}

/**
 * Calculate quartiles for a sorted numeric array.
 * Preserves the original algorithm from the AngularJS app.
 */
export function getQuartiles(
  sortedList: number[],
  name: string
): BoxPlotDatum {
  const list = sortedList;
  const quartiles: Partial<BoxPlotQuartiles> = {};

  if (list.length % 4 === 0) {
    quartiles.Q1 = (list[list.length / 4] + list[list.length / 4 + 1]) / 2;
    quartiles.Q2 = (list[list.length / 2] + list[list.length / 2 + 1]) / 2;
    quartiles.Q3 =
      (list[(list.length * 3) / 4] + list[(list.length * 3) / 4 + 1]) / 2;
  } else {
    if (list.length % 2 === 0) {
      quartiles.Q2 = (list[list.length / 2] + list[list.length / 2 + 1]) / 2;
    } else {
      quartiles.Q2 = list[Math.floor(list.length / 2) + 1];
    }
    quartiles.Q1 = list[Math.floor(list.length / 4) + 1];
    quartiles.Q3 = list[Math.floor((list.length * 3) / 4) + 1];
  }

  const IQR = quartiles.Q3! - quartiles.Q1!;
  quartiles.whisker_low = quartiles.Q1! - (3 * IQR) / 2;
  quartiles.whisker_high = quartiles.Q3! + (3 * IQR) / 2;

  quartiles.outliers = list.filter(
    (v) => v < quartiles.whisker_low! || v > quartiles.whisker_high!
  );

  return { label: name, values: quartiles as BoxPlotQuartiles };
}

/**
 * Generate scatter plot data from two numeric columns.
 */
export function scatterPlotDataGenerator(
  data: Record<string, unknown>[],
  xColumn: string,
  yColumn: string
): ScatterDatum[] {
  return data
    .map((row) => ({
      x: Number(row[xColumn]),
      y: Number(row[yColumn]),
    }))
    .filter((d) => !isNaN(d.x) && !isNaN(d.y));
}

/**
 * Generate radar chart data from numeric columns, optionally grouped.
 */
export function radarChartDataGenerator(
  data: Record<string, unknown>[],
  numericColumns: string[],
  groupColumn?: string | null
): RadarDatum[] {
  if (!groupColumn) {
    // No grouping: each numeric column becomes a subject, average as value
    return numericColumns.map((col) => {
      const values = data.map((row) => Number(row[col])).filter((v) => !isNaN(v));
      const avg = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
      return { subject: col, value: Math.round(avg * 100) / 100 };
    });
  }

  // Grouped: subjects are numeric columns, each group becomes a series
  const groups = [...new Set(data.map((row) => String(row[groupColumn])))];

  return numericColumns.map((col) => {
    const datum: RadarDatum = { subject: col };
    for (const group of groups) {
      const groupRows = data.filter((row) => String(row[groupColumn]) === group);
      const values = groupRows.map((row) => Number(row[col])).filter((v) => !isNaN(v));
      datum[group] = values.length > 0
        ? Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 100) / 100
        : 0;
    }
    return datum;
  });
}
