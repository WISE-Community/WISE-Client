import { TestBed } from '@angular/core/testing';
import { UtilService } from '../../assets/wise5/services/utilService';
let service: UtilService;

describe('UtilService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [UtilService]
    });
    service = TestBed.get(UtilService);
  });

  convertStringToNumberTests();
  makeCopyOfJSONObjectTests();
  arrayHasNonNullElementTests();
  calculateMeanTests();
  getIntersectOfArraysTests();
  isValidJSONStringTests();
  trimToLength();
  removeHTMLTags();
  replaceImgTagWithFileName();
});

function convertStringToNumberTests() {
  describe('convertStringToNumber()', () => {
    it('should convert a number string to a number', () => {
      expect(service.convertStringToNumber('5')).toEqual(5);
      expect(service.convertStringToNumber('-100')).toEqual(-100);
    });

    it('should return null for null argument', () => {
      expect(service.convertStringToNumber(null)).toBeNull();
    });

    it('should return non-null number string as is', () => {
      expect(service.convertStringToNumber('abc')).toEqual('abc');
      expect(service.convertStringToNumber('')).toEqual('');
    });
  });
}

function makeCopyOfJSONObjectTests() {
  describe('makeCopyOfJSONObject()', () => {
    it('should copy an array object', () => {
      const array1 = [1, 2, 3];
      const copiedArray = service.makeCopyOfJSONObject(array1);
      expect(copiedArray).toEqual(array1);
    });

    it('should copy an object', () => {
      const obj = { name: 'WISE', address: 'Berkeley' };
      const copiedObj = service.makeCopyOfJSONObject(obj);
      expect(copiedObj).toEqual(obj);
    });

    it('should return null for null input', () => {
      expect(service.makeCopyOfJSONObject(null)).toEqual(null);
    });

    it('should return undefined for undefined input', () => {
      expect(service.makeCopyOfJSONObject(undefined)).toEqual(undefined);
    });
  });
}

function arrayHasNonNullElementTests() {
  describe('arrayHasNonNullElement()', () => {
    it('should return true if it has at least one non null element', () => {
      const arrayToCheck = [null, {}, null];
      expect(service.arrayHasNonNullElement(arrayToCheck)).toEqual(true);
    });

    it('should return false if it has all null elements', () => {
      const arrayToCheck = [null, null, null];
      expect(service.arrayHasNonNullElement(arrayToCheck)).toEqual(false);
    });

    it('should return true if it has all non null elements', () => {
      const arrayToCheck = [{}, {}, {}];
      expect(service.arrayHasNonNullElement(arrayToCheck)).toEqual(true);
    });
  });
}

function calculateMeanTests() {
  describe('calculateMean()', () => {
    it('should calculate the mean when there is one value', () => {
      const values = [1];
      expect(service.calculateMean(values)).toEqual(1);
    });

    it('should calculate the mean when there are multiple values', () => {
      const values = [1, 2, 3, 4, 10];
      expect(service.calculateMean(values)).toEqual(4);
    });
  });
}

function getIntersectOfArraysTests() {
  describe('getIntersectOfArrays()', () => {
    const obj1 = {};
    const obj2 = {};
    const obj3 = {};
    it('should find the intersect of arrays when there are no common items', () => {
      const array1 = [obj1, obj2];
      const array2 = [obj3];
      const intersect = service.getIntersectOfArrays(array1, array2);
      expect(intersect.length).toEqual(0);
    });

    it('should find the intersect of arrays when there are some common items', () => {
      const array1 = [obj1, obj2];
      const array2 = [obj2, obj3];
      const intersect = service.getIntersectOfArrays(array1, array2);
      expect(intersect.length).toEqual(1);
    });

    it('should find the intersect of arrays when all are common items', () => {
      const array1 = [obj1, obj2, obj3];
      const array2 = [obj1, obj2, obj3];
      const intersect = service.getIntersectOfArrays(array1, array2);
      expect(intersect.length).toEqual(3);
    });
  });
}

function isValidJSONStringTests() {
  describe('isValidJSONString()', () => {
    it('should return true if json string is valid', () => {
      const validJSON = '{"a":1,"b":2}';
      expect(service.isValidJSONString(validJSON)).toBeTruthy();
      const validJSON2 = '[{"a":1},{"b":2}]';
      expect(service.isValidJSONString(validJSON2)).toBeTruthy();
    });

    it('should return false for invalid json strings', () => {
      const invalidJSON = '{"a":1,"b":2';
      expect(service.isValidJSONString(invalidJSON)).toBeFalsy();
    });
  });
}

function trimToLength() {
  describe('trimToLength()', () => {
    it('should keep strings intact if its length is equal to or less than max length', () => {
      expect(service.trimToLength('123456789', 9)).toEqual('123456789');
      expect(service.trimToLength('123456789', 10)).toEqual('123456789');
    });
    it('should trim length and add ellipses if length is longer than max length', () => {
      expect(service.trimToLength('123456789', 7)).toEqual('1234...');
    });
  });
}

function removeHTMLTags() {
  describe('removeHTMLTags()', () => {
    it('should remove html tags', () => {
      expect(service.removeHTMLTags('<p><img src="computer.png"/></p>')).toEqual(' computer.png ');
    });
  });
}

function replaceImgTagWithFileName() {
  describe('replaceImgTagWithFileName()', () => {
    it('should replace image tag with file name when it uses double quotes', () => {
      expect(service.replaceImgTagWithFileName('<img src="computer.png"/>')).toEqual(
        'computer.png'
      );
    });
    it('should replace image tag with file name when it uses single quotes', () => {
      expect(service.replaceImgTagWithFileName("<img src='computer.png'/>")).toEqual(
        'computer.png'
      );
    });
    it('should replace image tag with file name when there are other attributes', () => {
      expect(
        service.replaceImgTagWithFileName(
          "<img alt='Computer' src='computer.png' aria-label='Computer'/>"
        )
      ).toEqual('computer.png');
    });
  });
}
