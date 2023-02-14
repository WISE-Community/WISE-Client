import { getIntersectOfArrays } from './array';

const obj1 = { id: 1 };
const obj2 = { id: 2 };
const obj3 = { id: 3 };

describe('getIntersectOfArrays()', () => {
  noCommonItems_returnNoItems();
  someCommonItems_returnSomeItems();
  allCommonItems_returnAllItems();
});

function noCommonItems_returnNoItems() {
  it('should get the intersect of arrays when there are no common items', () => {
    const array1 = [obj1, obj2];
    const array2 = [obj3];
    const intersect = getIntersectOfArrays(array1, array2);
    expect(intersect.length).toEqual(0);
  });
}

function someCommonItems_returnSomeItems() {
  it('should get the intersect of arrays when there are some common items', () => {
    const array1 = [obj1, obj2];
    const array2 = [obj2, obj3];
    const intersect = getIntersectOfArrays(array1, array2);
    expect(intersect.length).toEqual(1);
    expect(intersect[0]).toEqual(obj2);
  });
}

function allCommonItems_returnAllItems() {
  it('should get the intersect of arrays when all are common items', () => {
    const array1 = [obj1, obj2, obj3];
    const array2 = [obj1, obj2, obj3];
    const intersect = getIntersectOfArrays(array1, array2);
    expect(intersect.length).toEqual(3);
    expect(intersect[0]).toEqual(obj1);
    expect(intersect[1]).toEqual(obj2);
    expect(intersect[2]).toEqual(obj3);
  });
}
