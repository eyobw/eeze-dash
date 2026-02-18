import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import type { FrequencyDatum } from '@/types';
import { toRechartsHorizontalBar } from '@/utils/chartDataTransformers';

interface Props {
  data: FrequencyDatum[][] | FrequencyDatum[];
}

export default function HorizontalBarChart({ data }: Props) {
  const raw = Array.isArray(data[0]) ? (data as FrequencyDatum[][])[0] : (data as FrequencyDatum[]);
  const chartData = toRechartsHorizontalBar(raw);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 10, right: 20, bottom: 10, left: 80 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis type="category" dataKey="name" fontSize={12} width={70} />
        <Tooltip />
        <Bar dataKey="value" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
}
