import { CSVToArray } from './array';
import csvArraySample from './arraySample';
import { getIntersectOfArrays } from './array';

describe('CSVToArray()', () => {
  it('should convert a delimited string to an array of arrays', () => {
    const arrayData = CSVToArray(csvArraySample.delimitedString);
    expect(arrayData).toEqual(csvArraySample.convertedArray);
  });
});

const obj1 = { id: 1 };
const obj2 = { id: 2 };
const obj3 = { id: 3 };

describe('getIntersectOfArrays()', () => {
  noCommonItems_returnNoItems();
  someCommonItems_returnSomeItems();
  allCommonItems_returnAllItems();
});

function noCommonItems_returnNoItems() {
  it('should return an empty array when there are no common items', () => {
    const array1 = [obj1, obj2];
    const array2 = [obj3];
    const intersect = getIntersectOfArrays(array1, array2);
    expect(intersect.length).toEqual(0);
  });
}

function someCommonItems_returnSomeItems() {
  it('should return an array with common items when there are some common items', () => {
    const array1 = [obj1, obj2];
    const array2 = [obj2, obj3];
    const intersect = getIntersectOfArrays(array1, array2);
    expect(intersect.length).toEqual(1);
    expect(intersect[0]).toEqual(obj2);
  });
}

function allCommonItems_returnAllItems() {
  it('should return an array with all items when all items are in common', () => {
    const array1 = [obj1, obj2, obj3];
    const array2 = [obj1, obj2, obj3];
    const intersect = getIntersectOfArrays(array1, array2);
    expect(intersect.length).toEqual(3);
    expect(intersect[0]).toEqual(obj1);
    expect(intersect[1]).toEqual(obj2);
    expect(intersect[2]).toEqual(obj3);
  });
}
