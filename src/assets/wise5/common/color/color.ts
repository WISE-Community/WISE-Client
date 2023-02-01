export function rgbToHex(color: string, opacity?: any): string {
  let hex = '#000000';
  let values = ['0', '0', '0'];
  if (isRGB(color)) {
    values = color
      .replace(/rgb?\(/, '')
      .replace(/\)/, '')
      .replace(/[\s+]/g, '')
      .split(',');
  }
  const a = parseFloat(opacity || 1),
    r = Math.floor(a * parseInt(values[0]) + (1 - a) * 255),
    g = Math.floor(a * parseInt(values[1]) + (1 - a) * 255),
    b = Math.floor(a * parseInt(values[2]) + (1 - a) * 255);
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
