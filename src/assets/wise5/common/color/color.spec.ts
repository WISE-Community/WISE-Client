import { rgbToHex } from './color';

describe('rgbToHex()', () => {
  it('should convert an rgb value to hex', () => {
    const hex = rgbToHex('rgb(10, 10, 10)');
    expect(hex).toEqual('#0a0a0a');
  });
  it('should convert an rgb value and opacity to hex', () => {
    const hex = rgbToHex('rgb(10,10,10)', 0.5);
    expect(hex).toEqual('#848484');
  });
  it('should return default hex color for an invalid rbg string', () => {
    const hex = rgbToHex('rgb(10,10)');
    expect(hex).toEqual('#000000');
  });
  it('should return default hex color with opacity set for an invalid rbg string', () => {
    const hex = rgbToHex('rgb(10,10)', 0.5);
    expect(hex).toEqual('#7f7f7f');
  });
});
