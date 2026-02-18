import type { Widget, FrequencyDatum, MultiBarSeries, LineSeries, BoxPlotDatum, ScatterDatum, RadarDatum } from '@/types';
import DiscreteBarChart from './DiscreteBarChart';
import PieChartWidget from './PieChartWidget';
import MultiBarChart from './MultiBarChart';
import LineChartWidget from './LineChartWidget';
import BoxPlotChart from './BoxPlotChart';
import AreaChartWidget from './AreaChartWidget';
import ScatterPlotWidget from './ScatterPlotWidget';
import HorizontalBarChart from './HorizontalBarChart';
import RadarChartWidget from './RadarChartWidget';
import StackedBarChart from './StackedBarChart';

interface Props {
  widget: Widget;
}

export default function ChartRenderer({ widget }: Props) {
  switch (widget.type) {
    case 'discreteBarChart':
      return <DiscreteBarChart data={widget.data as FrequencyDatum[][] | FrequencyDatum[]} />;
    case 'pieChart':
      return <PieChartWidget data={widget.data as FrequencyDatum[]} />;
    case 'multiBarChart':
      return <MultiBarChart data={widget.data as MultiBarSeries[]} />;
    case 'lineChart':
      return <LineChartWidget data={widget.data as LineSeries[]} />;
    case 'boxPlotChart':
      return <BoxPlotChart data={widget.data as BoxPlotDatum[]} />;
    case 'areaChart':
      return <AreaChartWidget data={widget.data as LineSeries[]} />;
    case 'scatterPlot':
      return <ScatterPlotWidget data={widget.data as ScatterDatum[]} />;
    case 'horizontalBarChart':
      return <HorizontalBarChart data={widget.data as FrequencyDatum[][] | FrequencyDatum[]} />;
    case 'radarChart':
      return <RadarChartWidget data={widget.data as RadarDatum[]} />;
    case 'stackedBarChart':
      return <StackedBarChart data={widget.data as MultiBarSeries[]} />;
    default:
      return <div className="p-4 text-red-500">Unknown chart type</div>;
  }
}
