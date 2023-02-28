import { TestBed } from '@angular/core/testing';
import { UtilService } from '../../assets/wise5/services/utilService';

let service: UtilService;
describe('UtilService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UtilService]
    });
    service = TestBed.inject(UtilService);
  });
  arrayHasNonNullElementTests();
  calculateMeanTests();
  trimToLength();
  removeHTMLTags();
  replaceImgTagWithFileName();
});

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
