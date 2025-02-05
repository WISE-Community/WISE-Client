import { FileSizePipe } from './filesize.pipe';

describe('FilesizePipe', () => {
  it('transforms input to human readable-strings', () => {
    const pipe = new FileSizePipe();
    expect(pipe.transform(0)).toBe('0 Bytes');
    expect(pipe.transform(1025)).toBe('1 KB');
    expect(pipe.transform(102025)).toBe('99.63 KB');
    expect(pipe.transform(52302025)).toBe('49.88 MB');
  });
});
