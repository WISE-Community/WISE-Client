import { RandomKeyService } from '../../assets/wise5/services/randomKeyService';

describe('RandomKeyService', () => {
  generate();
});

function generate() {
  describe('generate()', () => {
    it('should return random keys of length 10 by default', () => {
      const key1 = RandomKeyService.generate();
      const key2 = RandomKeyService.generate();
      expect(key1.length).toEqual(10);
      expect(key2.length).toEqual(10);
      expect(key1).not.toEqual(key2);
    });

    it('should return random keys of specified length', () => {
      expect(RandomKeyService.generate(5).length).toEqual(5);
      expect(RandomKeyService.generate(23).length).toEqual(23);
    });

    it('should produce 100 unique random strings', () => {
      const keysSoFar = [];
      for (let i = 0; i < 100; i++) {
        const key = RandomKeyService.generate();
        expect(keysSoFar.includes(key)).toEqual(false);
        keysSoFar.push(key);
      }
    });
  });
}
