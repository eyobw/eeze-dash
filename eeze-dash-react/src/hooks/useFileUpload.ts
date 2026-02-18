import { useCallback } from 'react';
import { parseCSV } from '@/utils/csvParser';

/**
 * Hook that provides a file change handler for JSON and CSV uploads.
 */
export function useFileUpload(onLoad: (data: Record<string, unknown>[]) => void) {
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const text = event.target?.result as string;
          const isCSV = file.name.toLowerCase().endsWith('.csv');
          const parsed = isCSV ? parseCSV(text) : JSON.parse(text);
          onLoad(parsed);
        } catch (err) {
          console.error('Failed to parse file:', err);
        }
      };
      reader.readAsText(file);
    },
    [onLoad]
  );

  return { handleFileChange };
}
