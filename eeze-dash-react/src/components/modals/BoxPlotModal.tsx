import { useState } from 'react';
import Modal from './Modal';
import { useDashboard } from '@/context/DashboardContext';
import { getQuartiles } from '@/utils/dataAnalysis';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function BoxPlotModal({ open, onClose }: Props) {
  const { state, addWidget } = useDashboard();
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const numericColumns = state.analysis?.numericColumns ?? [];

  const handleDraw = () => {
    if (!state.data) return;

    const chartData = numericColumns
      .filter((col) => selected[col])
      .map((col) => {
        const values = state.data!
          .map((row) => Number(row[col]))
          .filter((v) => !isNaN(v))
          .sort((a, b) => a - b);
        return getQuartiles(values, col);
      });

    if (chartData.length === 0) return;

    addWidget({
      name: 'Box Plot',
      type: 'boxPlotChart',
      data: chartData,
    });

    setSelected({});
    onClose();
  };

  const handleClose = () => {
    setSelected({});
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Box Plot Form"
      footer={
        <>
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Close
          </button>
          <button
            onClick={handleDraw}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Draw Chart
          </button>
        </>
      }
    >
      <p className="mb-2">Select items for a box plot</p>
      {numericColumns.map((col) => (
        <label key={col} className="flex items-center gap-2 py-1">
          <input
            type="checkbox"
            checked={!!selected[col]}
            onChange={(e) =>
              setSelected((prev) => ({ ...prev, [col]: e.target.checked }))
            }
          />
          {col}
        </label>
      ))}
    </Modal>
  );
}
