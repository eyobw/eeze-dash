import { describe, it, expect } from 'vitest';
import { parseCSV } from './csvParser';

describe('parseCSV', () => {
  it('parses simple CSV with header row', () => {
    const csv = 'name,age,city\nAlice,30,NYC\nBob,25,LA';
    const result = parseCSV(csv);
    expect(result).toEqual([
      { name: 'Alice', age: 30, city: 'NYC' },
      { name: 'Bob', age: 25, city: 'LA' },
    ]);
  });

  it('auto-detects numeric values', () => {
    const csv = 'col1,col2,col3\nhello,42,3.14';
    const result = parseCSV(csv);
    expect(result[0].col1).toBe('hello');
    expect(result[0].col2).toBe(42);
    expect(result[0].col3).toBe(3.14);
  });

  it('handles quoted fields with commas', () => {
    const csv = 'name,description\nAlice,"likes cats, dogs"\nBob,"just ok"';
    const result = parseCSV(csv);
    expect(result[0].description).toBe('likes cats, dogs');
    expect(result[1].description).toBe('just ok');
  });

  it('handles escaped quotes inside quoted fields', () => {
    const csv = 'name,quote\nAlice,"She said ""hello"""\nBob,"He said ""bye"""';
    const result = parseCSV(csv);
    expect(result[0].quote).toBe('She said "hello"');
    expect(result[1].quote).toBe('He said "bye"');
  });

  it('strips UTF-8 BOM', () => {
    const csv = '\uFEFFname,age\nAlice,30';
    const result = parseCSV(csv);
    expect(result).toEqual([{ name: 'Alice', age: 30 }]);
  });

  it('handles CRLF line endings', () => {
    const csv = 'name,age\r\nAlice,30\r\nBob,25';
    const result = parseCSV(csv);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ name: 'Alice', age: 30 });
  });

  it('returns empty array for header-only CSV', () => {
    const csv = 'name,age';
    const result = parseCSV(csv);
    expect(result).toEqual([]);
  });

  it('returns empty array for empty string', () => {
    expect(parseCSV('')).toEqual([]);
  });

  it('handles trailing newline', () => {
    const csv = 'name,age\nAlice,30\n';
    const result = parseCSV(csv);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ name: 'Alice', age: 30 });
  });

  it('handles missing fields by filling with empty string', () => {
    const csv = 'a,b,c\n1,2\n4,5,6';
    const result = parseCSV(csv);
    expect(result[0]).toEqual({ a: 1, b: 2, c: '' });
    expect(result[1]).toEqual({ a: 4, b: 5, c: 6 });
  });

  it('handles negative numbers', () => {
    const csv = 'val\n-5\n-3.14';
    const result = parseCSV(csv);
    expect(result[0].val).toBe(-5);
    expect(result[1].val).toBe(-3.14);
  });
});
