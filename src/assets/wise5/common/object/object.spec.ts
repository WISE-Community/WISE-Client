import { copy } from './object';

describe('copy()', () => {
  it('should copy arrays and objects', () => {
    const arr = [1, 2, 3];
    expect(copy(arr)).toEqual(arr);
    const obj = { name: 'WISE', address: 'Berkeley' };
    expect(copy(obj)).toEqual(obj);
  });
  it('should handle null and undefined inputs', () => {
    expect(copy(null)).toEqual(null);
    expect(copy(undefined)).toEqual(undefined);
  });
});
