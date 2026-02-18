import { useState } from 'react';
import Modal from './Modal';
import { useDashboard } from '@/context/DashboardContext';
import { radarChartDataGenerator } from '@/utils/dataAnalysis';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function RadarChartModal({ open, onClose }: Props) {
  const { state, addWidget } = useDashboard();
  const numericColumns = state.analysis?.numericColumns ?? [];
  const barPieColumns = state.analysis?.barPieColumns ?? [];

  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [groupColumn, setGroupColumn] = useState<string | null>(null);

  const selectedCount = Object.values(selected).filter(Boolean).length;

  const handleDraw = () => {
    if (!state.data || selectedCount < 3) return;

    const cols = numericColumns.filter((col) => selected[col]);
    const data = radarChartDataGenerator(state.data, cols, groupColumn);

    addWidget({
      name: 'Radar Chart',
      type: 'radarChart',
      data,
    });

    setSelected({});
    setGroupColumn(null);
    onClose();
  };

  const handleClose = () => {
    setSelected({});
    setGroupColumn(null);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Radar Chart"
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
            disabled={selectedCount < 3}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Draw Chart
          </button>
        </>
      }
    >
      <p className="mb-2">Select 3 or more numeric columns</p>
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

      {barPieColumns.length > 0 && (
        <>
          <p className="font-medium mt-4 mb-2">Group by (optional)</p>
          <label className="flex items-center gap-2 py-1">
            <input
              type="radio"
              name="radar-group"
              checked={groupColumn === null}
              onChange={() => setGroupColumn(null)}
            />
            None
          </label>
          {barPieColumns.map((col) => (
            <label key={col} className="flex items-center gap-2 py-1">
              <input
                type="radio"
                name="radar-group"
                checked={groupColumn === col}
                onChange={() => setGroupColumn(col)}
              />
              {col}
            </label>
          ))}
        </>
      )}
    </Modal>
  );
}
