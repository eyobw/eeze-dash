export type ChartType =
  | 'discreteBarChart'
  | 'pieChart'
  | 'multiBarChart'
  | 'lineChart'
  | 'boxPlotChart'
  | 'areaChart'
  | 'scatterPlot'
  | 'horizontalBarChart'
  | 'radarChart'
  | 'stackedBarChart';

/** Legacy typo kept for sessionStorage backwards-compat */
export type LegacyChartType = 'disrceteBarChart';

export interface FrequencyDatum {
  key: string;
  value: number;
}

export interface MultiBarSeries {
  key: string;
  values: { x: string; y: number }[];
}

export interface LineSeries {
  key: string;
  values: { x: unknown; y: number }[];
}

export interface BoxPlotQuartiles {
  Q1: number;
  Q2: number;
  Q3: number;
  whisker_low: number;
  whisker_high: number;
  outliers: number[];
}

export interface BoxPlotDatum {
  label: string;
  values: BoxPlotQuartiles;
}

export interface ScatterDatum {
  x: number;
  y: number;
}

export interface RadarDatum {
  subject: string;
  [series: string]: string | number;
}

export type ChartData =
  | FrequencyDatum[]         // pie
  | FrequencyDatum[][]       // bar (wrapped in array)
  | MultiBarSeries[]         // multi-bar, stacked-bar
  | LineSeries[]             // line, area
  | BoxPlotDatum[]           // box plot
  | ScatterDatum[]           // scatter plot
  | RadarDatum[];            // radar

export interface Widget {
  id: string;
  name: string;
  type: ChartType;
  data: ChartData;
}

export interface LayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface DatasetAnalysis {
  columns: string[];
  numericColumns: string[];
  barPieColumns: string[];
  lineChartXColumns: string[];
  lineFilterColumns: [string, unknown][];
  totalRows: number;
}

export interface DashboardState {
  data: Record<string, unknown>[] | null;
  widgets: Widget[];
  layouts: LayoutItem[];
  analysis: DatasetAnalysis | null;
}

export type DashboardAction =
  | { type: 'LOAD_DATA'; payload: Record<string, unknown>[] }
  | { type: 'ADD_WIDGET'; payload: Widget }
  | { type: 'REMOVE_WIDGET'; payload: string }
  | { type: 'UPDATE_LAYOUTS'; payload: LayoutItem[] }
  | { type: 'RESTORE_DASHBOARD'; payload: { data: Record<string, unknown>[]; widgets: Widget[]; layouts: LayoutItem[] } }
  | { type: 'CLEAR_ALL' };
