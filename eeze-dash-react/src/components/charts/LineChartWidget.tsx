import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import type { LineSeries } from '@/types';
import { toRechartsLine } from '@/utils/chartDataTransformers';

const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff7300',
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042',
];

interface Props {
  data: LineSeries[];
}

export default function LineChartWidget({ data }: Props) {
  const chartData = toRechartsLine(data);
  const seriesKeys = data.map((s) => s.key);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{ top: 20, right: 20, bottom: 40, left: 55 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="x" fontSize={12} />
        <YAxis />
        <Tooltip />
        <Legend />
        {seriesKeys.map((key, idx) => (
          <Line
            key={key}
            type="linear"
            dataKey={key}
            stroke={COLORS[idx % COLORS.length]}
            dot={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
