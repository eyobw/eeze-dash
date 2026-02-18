import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { FrequencyDatum } from '@/types';
import { toRechartsPie } from '@/utils/chartDataTransformers';

const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff7300',
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042',
  '#a4de6c', '#d0ed57',
];

interface Props {
  data: FrequencyDatum[];
}

export default function PieChartWidget({ data }: Props) {
  const chartData = toRechartsPie(data);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius="70%"
          label={false}
        >
          {chartData.map((_, idx) => (
            <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
