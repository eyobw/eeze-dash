import { useState, useMemo } from 'react';

interface Props {
  columns: string[];
  data: Record<string, unknown>[];
}

type SortDirection = 'asc' | 'desc' | null;

interface SortConfig {
  column: string;
  direction: SortDirection;
}

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export default function DataTable({ columns, data }: Props) {
  const [searchText, setSearchText] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ column: '', direction: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Filter data by search
  const filteredData = useMemo(() => {
    if (!searchText.trim()) return data;

    const term = searchText.toLowerCase();
    return data.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(term)
      )
    );
  }, [data, searchText]);

  // Sort filtered data
  const sortedData = useMemo(() => {
    if (!sortConfig.direction || !sortConfig.column) return filteredData;

    const { column, direction } = sortConfig;
    return [...filteredData].sort((a, b) => {
      const aVal = a[column];
      const bVal = b[column];

      // Handle nulls/undefined
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return direction === 'asc' ? -1 : 1;
      if (bVal == null) return direction === 'asc' ? 1 : -1;

      // Numeric-aware comparison
      const aNum = Number(aVal);
      const bNum = Number(bVal);
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return direction === 'asc' ? aNum - bNum : bNum - aNum;
      }

      // String comparison
      const aStr = String(aVal);
      const bStr = String(bVal);
      const cmp = aStr.localeCompare(bStr);
      return direction === 'asc' ? cmp : -cmp;
    });
  }, [filteredData, sortConfig]);

  // Pagination
  const totalRows = sortedData.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, totalRows);
  const paginatedData = sortedData.slice(startIdx, endIdx);

  // Reset page on search or sort change
  const handleSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  const handleSort = (column: string) => {
    setCurrentPage(1);
    setSortConfig((prev) => {
      if (prev.column !== column) return { column, direction: 'asc' };
      if (prev.direction === 'asc') return { column, direction: 'desc' };
      if (prev.direction === 'desc') return { column: '', direction: null };
      return { column, direction: 'asc' };
    });
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const getSortIndicator = (column: string) => {
    if (sortConfig.column !== column) return ' \u2195';
    if (sortConfig.direction === 'asc') return ' \u2191';
    if (sortConfig.direction === 'desc') return ' \u2193';
    return ' \u2195';
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Table</h3>
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          className="border border-gray-300 rounded px-3 py-2 flex-1"
          placeholder="Search"
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              {columns.map((col) => (
                <th
                  key={col}
                  className="border border-gray-300 px-3 py-2 text-left font-medium cursor-pointer select-none hover:bg-gray-200"
                  onClick={() => handleSort(col)}
                >
                  {col}
                  <span className="text-gray-400 text-xs">{getSortIndicator(col)}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, idx) => (
              <tr
                key={startIdx + idx}
                className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
              >
                {columns.map((col) => (
                  <td key={col} className="border border-gray-300 px-3 py-1.5">
                    {String(row[col] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center justify-between mt-4 text-sm">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span>
            {totalRows === 0 ? '0 of 0' : `${startIdx + 1}-${endIdx} of ${totalRows}`}
          </span>
          <button
            onClick={() => setCurrentPage(1)}
            disabled={safePage <= 1}
            className="px-2 py-1 border border-gray-300 rounded disabled:opacity-40 hover:bg-gray-100"
          >
            &laquo;
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={safePage <= 1}
            className="px-2 py-1 border border-gray-300 rounded disabled:opacity-40 hover:bg-gray-100"
          >
            &lsaquo;
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage >= totalPages}
            className="px-2 py-1 border border-gray-300 rounded disabled:opacity-40 hover:bg-gray-100"
          >
            &rsaquo;
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={safePage >= totalPages}
            className="px-2 py-1 border border-gray-300 rounded disabled:opacity-40 hover:bg-gray-100"
          >
            &raquo;
          </button>
        </div>
      </div>
    </div>
  );
}
