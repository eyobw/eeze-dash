import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import type { LineSeries } from '@/types';
import { toRechartsArea } from '@/utils/chartDataTransformers';

const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff7300',
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042',
];

interface Props {
  data: LineSeries[];
}

export default function AreaChartWidget({ data }: Props) {
  const chartData = toRechartsArea(data);
  const seriesKeys = data.map((s) => s.key);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData} margin={{ top: 20, right: 20, bottom: 40, left: 55 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="x" fontSize={12} />
        <YAxis />
        <Tooltip />
        <Legend />
        {seriesKeys.map((key, idx) => (
          <Area
            key={key}
            type="monotone"
            dataKey={key}
            stackId="1"
            stroke={COLORS[idx % COLORS.length]}
            fill={COLORS[idx % COLORS.length]}
            fillOpacity={0.4}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}
