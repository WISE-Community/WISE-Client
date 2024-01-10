import { copy } from './object';

describe('copy()', () => {
  copy_array_returnDeepCopy();
  copy_object_returnDeepCopy();
  copy_null_returnNull();
  copy_undefined_returnUndefined();
});

function copy_array_returnDeepCopy(): void {
  it('should deep copy an array', () => {
    const arr = [1, 2, 3];
    const arrCopy = copy(arr);
    expect(arrCopy).toEqual(arr);
    arrCopy.push(4);
    expect(arrCopy).not.toEqual(arr);
  });
}

function copy_object_returnDeepCopy(): void {
  it('should deep copy an object', () => {
    const obj = { name: 'WISE', address: 'Berkeley' };
    const objCopy = copy(obj);
    expect(objCopy).toEqual(obj);
    objCopy.id = 1;
    expect(objCopy).not.toEqual(obj);
  });
}

function copy_null_returnNull(): void {
  it('should return null for null input', () => {
    expect(copy(null)).toEqual(null);
  });
}

function copy_undefined_returnUndefined(): void {
  it('should return undefined for undefined input', () => {
    expect(copy(undefined)).toEqual(undefined);
  });
}
