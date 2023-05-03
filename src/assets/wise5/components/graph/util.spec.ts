import { calculateMean } from './util';

describe('calculateMean', () => {
  it('should calculate the mean when there is one value', () => {
    const values = [1];
    expect(calculateMean(values)).toEqual(1);
  });

  it('should calculate the mean when there are multiple values', () => {
    const values = [1, 2, 3, 4, 10];
    expect(calculateMean(values)).toEqual(4);
  });
});
