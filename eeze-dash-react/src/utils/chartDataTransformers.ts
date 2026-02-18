import type {
  FrequencyDatum,
  MultiBarSeries,
  LineSeries,
  BoxPlotDatum,
  ScatterDatum,
  RadarDatum,
} from '@/types';

/**
 * Transform frequency data for Recharts BarChart.
 * Recharts expects: [{ name: 'A', value: 10 }, ...]
 */
export function toRechartsBar(data: FrequencyDatum[]): { name: string; value: number }[] {
  return data.map((d) => ({ name: d.key, value: d.value }));
}

/**
 * Transform frequency data for Recharts PieChart.
 * Same shape as bar, Recharts PieChart uses name/value.
 */
export function toRechartsPie(data: FrequencyDatum[]): { name: string; value: number }[] {
  return data.map((d) => ({ name: d.key, value: d.value }));
}

/**
 * Transform multi-bar series for Recharts grouped BarChart.
 * NVD3 format: [{ key: 'Group1', values: [{x, y}] }, ...]
 * Recharts format: [{ category: 'Cat1', Group1: val, Group2: val }, ...]
 */
export function toRechartsMultiBar(
  series: MultiBarSeries[]
): { category: string; [key: string]: string | number }[] {
  if (series.length === 0) return [];

  // All series share the same x (category) values
  const categories = series[0].values.map((v) => v.x);

  return categories.map((cat, idx) => {
    const row: { category: string; [key: string]: string | number } = {
      category: cat,
    };
    for (const s of series) {
      row[s.key] = s.values[idx]?.y ?? 0;
    }
    return row;
  });
}

/**
 * Transform line chart series for Recharts LineChart.
 * NVD3 format: [{ key: 'Series1', values: [{x, y}] }, ...]
 * Recharts format: [{ x: val, Series1: val, Series2: val }, ...]
 */
export function toRechartsLine(
  series: LineSeries[]
): { x: string; [key: string]: string | number }[] {
  if (series.length === 0) return [];

  const length = series[0].values.length;
  const result: { x: string; [key: string]: string | number }[] = [];

  for (let i = 0; i < length; i++) {
    const row: { x: string; [key: string]: string | number } = {
      x: String(series[0].values[i].x),
    };
    for (const s of series) {
      row[s.key] = s.values[i]?.y ?? 0;
    }
    result.push(row);
  }

  return result;
}

/**
 * Transform box plot data for Recharts ComposedChart.
 * Each datum becomes one category on the X axis.
 */
export interface RechartsBoxPlotEntry {
  label: string;
  min: number;
  Q1: number;
  Q2: number;
  Q3: number;
  max: number;
  whisker_low: number;
  whisker_high: number;
  IQR_base: number;   // invisible base for stacked bar (= Q1)
  IQR_height: number; // Q3 - Q1
  outliers: number[];
}

export function toRechartsBoxPlot(data: BoxPlotDatum[]): RechartsBoxPlotEntry[] {
  return data.map((d) => ({
    label: d.label,
    min: d.values.whisker_low,
    Q1: d.values.Q1,
    Q2: d.values.Q2,
    Q3: d.values.Q3,
    max: d.values.whisker_high,
    whisker_low: d.values.whisker_low,
    whisker_high: d.values.whisker_high,
    IQR_base: d.values.Q1,
    IQR_height: d.values.Q3 - d.values.Q1,
    outliers: d.values.outliers,
  }));
}

/**
 * Transform line series for Recharts AreaChart.
 * Same format as line chart — Recharts Area uses the same data shape.
 */
export function toRechartsArea(
  series: LineSeries[]
): { x: string; [key: string]: string | number }[] {
  return toRechartsLine(series);
}

/**
 * Transform scatter data for Recharts ScatterChart.
 * Recharts expects: [{ x: number, y: number }, ...]
 */
export function toRechartsScatter(data: ScatterDatum[]): ScatterDatum[] {
  return data;
}

/**
 * Transform frequency data for Recharts horizontal BarChart (layout="vertical").
 * Same format as vertical bar.
 */
export function toRechartsHorizontalBar(data: FrequencyDatum[]): { name: string; value: number }[] {
  return toRechartsBar(data);
}

/**
 * Transform radar data for Recharts RadarChart.
 * Data is already in the correct shape: [{ subject, ...series }]
 */
export function toRechartsRadar(data: RadarDatum[]): RadarDatum[] {
  return data;
}

/**
 * Transform multi-bar series for Recharts stacked BarChart.
 * Same format as multi-bar — the stacking is done via stackId prop in the component.
 */
export function toRechartsStackedBar(
  series: MultiBarSeries[]
): { category: string; [key: string]: string | number }[] {
  return toRechartsMultiBar(series);
}
