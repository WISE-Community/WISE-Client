import { convertToPNGFile } from './canvas';

describe('canvas', () => {
  describe('convertToPNGFile()', () => {
    it('should convert canvas element to png image file', () => {
      const pngFile = convertToPNGFile(document.createElement('canvas'));
      expect(pngFile instanceof File).toBeTrue();
      expect(pngFile.type).toEqual('image/png');
      expect(pngFile.name).toMatch('picture_(\\d+)\\.png');
    });
  });
});
