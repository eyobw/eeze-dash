import { useState, useMemo } from 'react';
import Modal from './Modal';
import { useDashboard } from '@/context/DashboardContext';
import { lineChartDataGenerator } from '@/utils/dataAnalysis';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function LineChartModal({ open, onClose }: Props) {
  const { state, addWidget } = useDashboard();
  const analysis = state.analysis;

  const [filter, setFilter] = useState<Record<string, unknown>>({});
  const [xColumn, setXColumn] = useState<string | null>(null);
  const [selectedYColumns, setSelectedYColumns] = useState<Record<string, boolean>>({});
  const [datasetLength, setDatasetLength] = useState<number>(
    state.data ? Math.floor(state.data.length / 2) : 0
  );

  const maxLength = state.data?.length ?? 0;

  // Apply filters to data
  const filteredData = useMemo(() => {
    if (!state.data) return [];
    return state.data.filter((row) => {
      for (const [key, val] of Object.entries(filter)) {
        if (val !== undefined && val !== '' && row[key] !== val) {
          // Handle numeric comparison
          if (typeof row[key] === 'number' && String(row[key]) !== String(val)) {
            return false;
          }
          if (typeof row[key] !== 'number' && row[key] !== val) {
            return false;
          }
        }
      }
      return true;
    });
  }, [state.data, filter]);

  const handleDraw = () => {
    if (!xColumn || !state.data) return;

    const yColumns = Object.entries(selectedYColumns)
      .filter(([, v]) => v)
      .map(([k]) => k);

    if (yColumns.length === 0) return;

    const sourceData =
      filteredData.length > datasetLength
        ? filteredData.slice(0, datasetLength)
        : filteredData;

    const data = lineChartDataGenerator(sourceData, xColumn, yColumns);
    addWidget({
      name: 'Line Chart',
      type: 'lineChart',
      data,
    });

    // Reset
    setFilter({});
    setXColumn(null);
    setSelectedYColumns({});
    onClose();
  };

  const handleClose = () => {
    setFilter({});
    setXColumn(null);
    setSelectedYColumns({});
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Line Chart Form"
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
            disabled={!xColumn}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Draw
          </button>
        </>
      }
    >
      {/* Filter radios */}
      {analysis?.lineFilterColumns && analysis.lineFilterColumns.length > 0 && (
        <div className="mb-4">
          <p className="font-medium mb-1">Filters</p>
          {analysis.lineFilterColumns.map(([col, val], idx) => (
            <label key={idx} className="flex items-center gap-2 py-1">
              <input
                type="radio"
                name={`filter_${col}`}
                checked={filter[col] === val}
                onChange={() => setFilter((prev) => ({ ...prev, [col]: val }))}
              />
              {col} = {String(val)}
            </label>
          ))}
        </div>
      )}

      {/* X-axis selection */}
      <p className="font-medium mb-1">x-Axis</p>
      {analysis?.lineChartXColumns.map((col) => (
        <label key={col} className="flex items-center gap-2 py-1">
          <input
            type="checkbox"
            checked={xColumn === col}
            onChange={() => setXColumn(col)}
          />
          {col}
        </label>
      ))}

      {/* Y-axis selection */}
      <p className="font-medium mt-4 mb-1">y-Axis</p>
      {analysis?.numericColumns.map((col) => (
        <label key={col} className="flex items-center gap-2 py-1">
          <input
            type="checkbox"
            checked={!!selectedYColumns[col]}
            onChange={(e) =>
              setSelectedYColumns((prev) => ({
                ...prev,
                [col]: e.target.checked,
              }))
            }
          />
          {col}
        </label>
      ))}

      {/* Range slider */}
      <div className="mt-4">
        <input
          type="range"
          min={0}
          max={maxLength}
          value={datasetLength}
          onChange={(e) => setDatasetLength(Number(e.target.value))}
          className="w-full"
        />
        <label className="text-sm text-gray-600">{datasetLength}</label>
      </div>
    </Modal>
  );
}
