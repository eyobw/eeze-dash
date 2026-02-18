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
import { toRechartsBar } from '@/utils/chartDataTransformers';

interface Props {
  data: FrequencyDatum[][] | FrequencyDatum[];
}

export default function DiscreteBarChart({ data }: Props) {
  // data might be wrapped in array from wrapData()
  const raw = Array.isArray(data[0]) ? (data as FrequencyDatum[][])[0] : (data as FrequencyDatum[]);
  const chartData = toRechartsBar(raw);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} margin={{ top: 10, right: 20, bottom: 30, left: 55 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" angle={-30} textAnchor="end" fontSize={12} />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}
