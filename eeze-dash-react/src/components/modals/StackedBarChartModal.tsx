import { useState } from 'react';
import Modal from './Modal';
import { useDashboard } from '@/context/DashboardContext';
import { nestMultiBarGraphData } from '@/utils/dataAnalysis';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function StackedBarChartModal({ open, onClose }: Props) {
  const { state, addWidget } = useDashboard();
  const [xValue, setXValue] = useState<string | null>(null);
  const [yValue, setYValue] = useState<string | null>(null);
  const [numericItem, setNumericItem] = useState<string | null>(null);

  const barPieColumns = state.analysis?.barPieColumns ?? [];
  const numericColumns = state.analysis?.numericColumns ?? [];

  const yOptions = barPieColumns.filter((c) => c !== xValue);

  const handleDraw = () => {
    if (!xValue || !yValue || !state.data) return;

    const data = nestMultiBarGraphData(state.data, xValue, yValue, numericItem);
    addWidget({
      name: `Stacked: ${xValue} vs ${yValue}`,
      type: 'stackedBarChart',
      data,
    });

    setXValue(null);
    setYValue(null);
    setNumericItem(null);
    onClose();
  };

  const handleClose = () => {
    setXValue(null);
    setYValue(null);
    setNumericItem(null);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Stacked Bar Chart"
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
            disabled={!xValue || !yValue}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Draw Chart
          </button>
        </>
      }
    >
      {!xValue && (
        <div>
          <p className="font-medium mb-2">Choose the first item</p>
          {barPieColumns.map((col) => (
            <label key={col} className="flex items-center gap-2 py-1">
              <input
                type="checkbox"
                checked={false}
                onChange={() => setXValue(col)}
              />
              {col}
            </label>
          ))}
        </div>
      )}

      {xValue && (
        <div>
          <p className="font-medium mb-2">
            Compare <strong>{xValue}</strong> with respect to:
          </p>
          {yOptions.map((col) => (
            <label key={col} className="flex items-center gap-2 py-1">
              <input
                type="checkbox"
                checked={yValue === col}
                onChange={() => setYValue(col)}
              />
              {col}
            </label>
          ))}

          {numericColumns.length > 0 && (
            <>
              <p className="font-medium mt-4 mb-2">Calculate total (optional)</p>
              {numericColumns.map((col) => (
                <label key={col} className="flex items-center gap-2 py-1">
                  <input
                    type="checkbox"
                    checked={numericItem === col}
                    onChange={(e) =>
                      setNumericItem(e.target.checked ? col : null)
                    }
                  />
                  {col}
                </label>
              ))}
            </>
          )}
        </div>
      )}
    </Modal>
  );
}
