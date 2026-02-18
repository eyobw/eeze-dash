import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import type { ScatterDatum } from '@/types';
import { toRechartsScatter } from '@/utils/chartDataTransformers';

interface Props {
  data: ScatterDatum[];
}

export default function ScatterPlotWidget({ data }: Props) {
  const chartData = toRechartsScatter(data);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 55 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" dataKey="x" name="X" fontSize={12} />
        <YAxis type="number" dataKey="y" name="Y" />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Scatter data={chartData} fill="#8884d8" />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
