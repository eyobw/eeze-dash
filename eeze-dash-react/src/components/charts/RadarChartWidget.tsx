import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { RadarDatum } from '@/types';
import { toRechartsRadar } from '@/utils/chartDataTransformers';

const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff7300',
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042',
];

interface Props {
  data: RadarDatum[];
}

export default function RadarChartWidget({ data }: Props) {
  const chartData = toRechartsRadar(data);

  // Derive series keys (everything except 'subject')
  const seriesKeys = chartData.length > 0
    ? Object.keys(chartData[0]).filter((k) => k !== 'subject')
    : [];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="70%">
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" fontSize={11} />
        <PolarRadiusAxis />
        <Tooltip />
        {seriesKeys.length > 1 && <Legend />}
        {seriesKeys.map((key, idx) => (
          <Radar
            key={key}
            name={key}
            dataKey={key}
            stroke={COLORS[idx % COLORS.length]}
            fill={COLORS[idx % COLORS.length]}
            fillOpacity={0.3}
          />
        ))}
      </RadarChart>
    </ResponsiveContainer>
  );
}
