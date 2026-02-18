import { useState } from 'react';
import Modal from './Modal';
import { useDashboard } from '@/context/DashboardContext';
import { findRow, wrapData } from '@/utils/dataAnalysis';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function HorizontalBarModal({ open, onClose }: Props) {
  const { state, addWidget } = useDashboard();
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const columns = state.analysis?.barPieColumns ?? [];

  const handleCheck = (column: string, isChecked: boolean) => {
    setChecked((prev) => ({ ...prev, [column]: isChecked }));

    if (isChecked && state.data) {
      const freqData = findRow(state.data, column);
      addWidget({
        name: `Horizontal Bar for ${column}`,
        type: 'horizontalBarChart',
        data: wrapData(freqData),
      });
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Horizontal Bar Chart"
      footer={
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Close
        </button>
      }
    >
      {columns.map((col) => (
        <label key={col} className="flex items-center gap-2 py-1">
          <input
            type="checkbox"
            checked={!!checked[col]}
            onChange={(e) => handleCheck(col, e.target.checked)}
          />
          {col}
        </label>
      ))}
    </Modal>
  );
}
