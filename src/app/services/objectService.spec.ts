import { TestBed } from '@angular/core/testing';
import { ObjectService } from '../../assets/wise5/services/objectService';

let service: ObjectService;
describe('ObjectService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ObjectService]
    });
    service = TestBed.inject(ObjectService);
  });
  copy();
});

function copy() {
  describe('copy()', () => {
    it('should copy an array and object', () => {
      const arr = [1, 2, 3];
      expect(service.copy(arr)).toEqual(arr);
      const obj = { name: 'WISE', address: 'Berkeley' };
      expect(service.copy(obj)).toEqual(obj);
    });
    it('should handle null and undefined params', () => {
      expect(service.copy(null)).toEqual(null);
      expect(service.copy(undefined)).toEqual(undefined);
    });
  });
}
