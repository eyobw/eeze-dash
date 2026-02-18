import { useState } from 'react';
import Modal from './Modal';
import { useDashboard } from '@/context/DashboardContext';
import { scatterPlotDataGenerator } from '@/utils/dataAnalysis';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ScatterPlotModal({ open, onClose }: Props) {
  const { state, addWidget } = useDashboard();
  const numericColumns = state.analysis?.numericColumns ?? [];

  const [xColumn, setXColumn] = useState<string | null>(null);
  const [yColumn, setYColumn] = useState<string | null>(null);

  const handleDraw = () => {
    if (!xColumn || !yColumn || !state.data) return;

    const data = scatterPlotDataGenerator(state.data, xColumn, yColumn);
    addWidget({
      name: `${xColumn} vs ${yColumn}`,
      type: 'scatterPlot',
      data,
    });

    setXColumn(null);
    setYColumn(null);
    onClose();
  };

  const handleClose = () => {
    setXColumn(null);
    setYColumn(null);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Scatter Plot"
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
            disabled={!xColumn || !yColumn}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Draw
          </button>
        </>
      }
    >
      <p className="font-medium mb-1">X Axis (numeric)</p>
      {numericColumns.map((col) => (
        <label key={col} className="flex items-center gap-2 py-1">
          <input
            type="radio"
            name="scatter-x"
            checked={xColumn === col}
            onChange={() => setXColumn(col)}
          />
          {col}
        </label>
      ))}

      <p className="font-medium mt-4 mb-1">Y Axis (numeric)</p>
      {numericColumns.map((col) => (
        <label key={col} className="flex items-center gap-2 py-1">
          <input
            type="radio"
            name="scatter-y"
            checked={yColumn === col}
            onChange={() => setYColumn(col)}
          />
          {col}
        </label>
      ))}
    </Modal>
  );
}
