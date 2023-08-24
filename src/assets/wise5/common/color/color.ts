/**
 * Convert an rgb color string and opacity to hex string
 * @param color rgb string (e.g. 'rgb(0,0,0)')
 * @param opacity number between 0 and 1
 * @returns 6-digit hex string (e.g. '#000000')
 */
export function rgbToHex(color: string, opacity: number = 1): string {
  let hex = '#000000';
  let values = ['0', '0', '0'];
  if (isRGB(color)) {
    values = color
      .replace(/rgb?\(/, '')
      .replace(/\)/, '')
      .replace(/[\s+]/g, '')
      .split(',');
  }
  const r = Math.floor(opacity * parseInt(values[0]) + (1 - opacity) * 255),
    g = Math.floor(opacity * parseInt(values[1]) + (1 - opacity) * 255),
    b = Math.floor(opacity * parseInt(values[2]) + (1 - opacity) * 255);
  hex =
    '#' +
    ('0' + r.toString(16)).slice(-2) +
    ('0' + g.toString(16)).slice(-2) +
    ('0' + b.toString(16)).slice(-2);
  return hex;
}

function isRGB(str: string): boolean {
  const rgbRegex = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;
  return rgbRegex.test(str);
}

/**
 * The colors for the branch path steps. The colors are from
 * http://colorbrewer2.org/export/colorbrewer.js, 'qualitative', 'Set2'.
 */
export const branchPathBackgroundColors = [
  '#66c2a5',
  '#fc8d62',
  '#8da0cb',
  '#e78ac3',
  '#a6d854',
  '#ffd92f',
  '#e5c494',
  '#b3b3b3'
];
