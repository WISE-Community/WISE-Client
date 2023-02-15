import { CSVToArray } from './array';
import csvArraySample from './arraySample';

fdescribe('CSVToArray()', () => {
  it('should convert a delimited string to an array of arrays', () => {
    const arrayData = CSVToArray(csvArraySample.delimitedString);
    expect(arrayData).toEqual(csvArraySample.convertedArray);
  });
});
