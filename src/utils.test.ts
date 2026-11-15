import { applyTransparency, isNumeric } from './utils';

describe('applyTransparency', () => {
  it('converts a 6-digit hex colour', () => {
    expect(applyTransparency('#ff8000', 0.5)).toBe('rgba(255, 128, 0, 0.5)');
  });
  it('expands a 3-digit hex colour', () => {
    expect(applyTransparency('#f80', 0.25)).toBe('rgba(255, 136, 0, 0.25)');
  });
  it('converts an rgb() colour', () => {
    expect(applyTransparency('rgb(10, 20, 30)', 0.4)).toBe('rgba(10, 20, 30, 0.4)');
  });
  it('keeps an existing alpha below 1', () => {
    expect(applyTransparency('rgba(10, 20, 30, 0.2)', 0.8)).toBe('rgba(10, 20, 30, 0.2)');
  });
  it('clamps alpha to the 0..1 range', () => {
    expect(applyTransparency('#000000', 5)).toBe('rgba(0, 0, 0, 1)');
    expect(applyTransparency('#000000', -1)).toBe('rgba(0, 0, 0, 0)');
  });
  it('throws for an unsupported format', () => {
    expect(() => applyTransparency('red', 0.5)).toThrow('Unsupported color format');
  });
});

describe('isNumeric', () => {
  it('accepts numeric strings', () => {
    expect(isNumeric('42')).toBe(true);
    expect(isNumeric('-3.5')).toBe(true);
  });
  it('rejects non-numeric strings', () => {
    expect(isNumeric('abc')).toBe(false);
    expect(isNumeric('')).toBe(false);
    expect(isNumeric('12px')).toBe(false);
  });
  it('rejects non-string values', () => {
    expect(isNumeric(5 as unknown as string)).toBe(false);
  });
});
