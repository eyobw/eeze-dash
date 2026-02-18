import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import type { MultiBarSeries } from '@/types';
import { toRechartsMultiBar } from '@/utils/chartDataTransformers';

const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff7300',
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042',
];

interface Props {
  data: MultiBarSeries[];
}

export default function MultiBarChart({ data }: Props) {
  const chartData = toRechartsMultiBar(data);
  const keys = data.map((s) => s.key);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} margin={{ top: 10, right: 20, bottom: 30, left: 55 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" angle={-30} textAnchor="end" fontSize={12} />
        <YAxis />
        <Tooltip />
        <Legend />
        {keys.map((key, idx) => (
          <Bar key={key} dataKey={key} fill={COLORS[idx % COLORS.length]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
