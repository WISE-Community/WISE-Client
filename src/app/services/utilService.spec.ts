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
  calculateMeanTests();
});

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
