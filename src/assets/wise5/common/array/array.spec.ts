import { arraysContainSameValues, CSVToArray, reduceByUniqueId } from './array';
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

describe('arraysContainSameValues()', () => {
  it('should return true when arrays have same values, even when not in the same order', () => {
    expect(arraysContainSameValues([], [])).toBeTrue();
    expect(arraysContainSameValues(['a', 'b'], ['a', 'b'])).toBeTrue();
    expect(arraysContainSameValues(['b', 'a'], ['a', 'b'])).toBeTrue();
  });
  it('should return false when arrays have different values', () => {
    expect(arraysContainSameValues(['a'], [])).toBeFalse();
    expect(arraysContainSameValues(['a', 'b'], ['a'])).toBeFalse();
  });
});

describe('reduceByUniqueId', () => {
  it('should get empty array when input is empty array', () => {
    const objArr = [];
    const result = reduceByUniqueId(objArr);
    expect(result.length).toEqual(0);
  });

  it('should get one object when there is one object in input array', () => {
    const objArr = [{ id: 1 }];
    const result = reduceByUniqueId(objArr);
    expect(result.length).toEqual(1);
    expect(result[0].id).toEqual(1);
  });

  it('should get unique objects when there are multiple duplicates', () => {
    const objArr = [{ id: 1 }, { id: 2 }, { id: 1 }, { id: 3 }, { id: 3 }, { id: 1 }];
    const result = reduceByUniqueId(objArr);
    expect(result.length).toEqual(3);
    expect(result[0].id).toEqual(1);
    expect(result[1].id).toEqual(2);
    expect(result[2].id).toEqual(3);
  });

  it('should get original array when there are no duplicates', () => {
    const objArr = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const result = reduceByUniqueId(objArr);
    expect(result.length).toEqual(3);
    expect(result[0].id).toEqual(1);
    expect(result[1].id).toEqual(2);
    expect(result[2].id).toEqual(3);
  });
});
