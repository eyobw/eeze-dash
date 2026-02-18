import {
  ComposedChart,
  Bar,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ErrorBar,
  Cell,
} from 'recharts';
import type { BoxPlotDatum } from '@/types';
import { toRechartsBoxPlot } from '@/utils/chartDataTransformers';

interface Props {
  data: BoxPlotDatum[];
}

export default function BoxPlotChart({ data }: Props) {
  const chartData = toRechartsBoxPlot(data);

  // Build scatter data for outliers
  const outlierData = chartData.flatMap((entry) =>
    entry.outliers.map((val) => ({
      label: entry.label,
      value: val,
    }))
  );

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={chartData}
        margin={{ top: 10, right: 20, bottom: 30, left: 55 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" />
        <YAxis />
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.[0]) return null;
            const d = payload[0].payload;
            return (
              <div className="bg-white border border-gray-300 p-2 text-xs rounded shadow">
                <p className="font-bold">{d.label}</p>
                <p>Q1: {d.Q1?.toFixed(2)}</p>
                <p>Q2 (Median): {d.Q2?.toFixed(2)}</p>
                <p>Q3: {d.Q3?.toFixed(2)}</p>
                <p>Whisker Low: {d.whisker_low?.toFixed(2)}</p>
                <p>Whisker High: {d.whisker_high?.toFixed(2)}</p>
                {d.outliers?.length > 0 && (
                  <p>Outliers: {d.outliers.length}</p>
                )}
              </div>
            );
          }}
        />

        {/* Invisible base bar */}
        <Bar dataKey="IQR_base" stackId="box" fill="transparent" />

        {/* IQR box */}
        <Bar dataKey="IQR_height" stackId="box" fill="#8884d8" opacity={0.7}>
          <ErrorBar
            dataKey="whisker_low"
            width={4}
            strokeWidth={2}
            direction="y"
          />
        </Bar>

        {/* Median line shown as scatter */}
        <Scatter
          data={chartData.map((d) => ({ label: d.label, value: d.Q2 }))}
          fill="#ff7300"
        />

        {/* Outliers */}
        {outlierData.length > 0 && (
          <Scatter data={outlierData} fill="#ff0000">
            {outlierData.map((_, idx) => (
              <Cell key={idx} fill="#ff0000" />
            ))}
          </Scatter>
        )}
      </ComposedChart>
    </ResponsiveContainer>
  );
}
