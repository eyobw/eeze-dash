import { useMemo } from 'react';
import type { DatasetAnalysis } from '@/types';
import { analyzeColumns } from '@/utils/dataAnalysis';

/**
 * Memoized dataset analysis.
 */
export function useDataAnalysis(
  data: Record<string, unknown>[] | null
): DatasetAnalysis | null {
  return useMemo(() => {
    if (!data || data.length === 0) return null;
    return analyzeColumns(data);
  }, [data]);
}
