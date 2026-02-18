/**
 * Zero-dependency CSV parser.
 * Supports: header row, comma delimiter, quoted fields, escaped quotes,
 * numeric auto-detection, BOM stripping.
 */
export function parseCSV(text: string): Record<string, unknown>[] {
  // Strip UTF-8 BOM
  const cleaned = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;

  const rows = parseRows(cleaned);
  if (rows.length < 2) return [];

  const headers = rows[0];
  const result: Record<string, unknown>[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    // Skip empty rows
    if (row.length === 1 && row[0] === '') continue;

    const obj: Record<string, unknown> = {};
    for (let j = 0; j < headers.length; j++) {
      const raw = j < row.length ? row[j] : '';
      obj[headers[j]] = autoType(raw);
    }
    result.push(obj);
  }

  return result;
}

/**
 * Parse CSV text into a 2D array of strings.
 * Handles quoted fields and escaped quotes (RFC 4180).
 */
function parseRows(text: string): string[][] {
  const rows: string[][] = [];
  let i = 0;
  const len = text.length;

  while (i <= len) {
    const row: string[] = [];

    while (true) {
      if (i >= len) {
        row.push('');
        break;
      }

      if (text[i] === '"') {
        // Quoted field
        let field = '';
        i++; // skip opening quote
        while (i < len) {
          if (text[i] === '"') {
            if (i + 1 < len && text[i + 1] === '"') {
              // Escaped quote
              field += '"';
              i += 2;
            } else {
              // End of quoted field
              i++; // skip closing quote
              break;
            }
          } else {
            field += text[i];
            i++;
          }
        }
        row.push(field);
      } else {
        // Unquoted field
        let field = '';
        while (i < len && text[i] !== ',' && text[i] !== '\n' && text[i] !== '\r') {
          field += text[i];
          i++;
        }
        row.push(field);
      }

      // Check what follows the field
      if (i >= len) break;
      if (text[i] === ',') {
        i++; // skip comma, continue to next field
      } else if (text[i] === '\r') {
        i++; // skip CR
        if (i < len && text[i] === '\n') i++; // skip LF
        break;
      } else if (text[i] === '\n') {
        i++; // skip LF
        break;
      }
    }

    rows.push(row);
    if (i >= len && row.length === 1 && row[0] === '') break;
  }

  // Remove trailing empty row
  if (rows.length > 0) {
    const last = rows[rows.length - 1];
    if (last.length === 1 && last[0] === '') {
      rows.pop();
    }
  }

  return rows;
}

/**
 * Auto-detect numeric values. Returns number if parseable, otherwise the original string.
 */
function autoType(value: string): unknown {
  const trimmed = value.trim();
  if (trimmed === '') return '';

  // Check for numeric value
  const num = Number(trimmed);
  if (!isNaN(num) && trimmed !== '') {
    return num;
  }

  return trimmed;
}
