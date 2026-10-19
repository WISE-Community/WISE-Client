import { applyMasonry } from './dom';

describe('dom utilities', () => {
  describe('applyMasonry()', () => {
    it('should calculate and set gridRowEnd span on grid children based on height and rowGap', () => {
      const grid = document.createElement('div');
      grid.style.display = 'grid';
      grid.style.rowGap = '12px';

      const item1 = document.createElement('div');
      const item2 = document.createElement('div');
      spyOn(item1, 'getBoundingClientRect').and.returnValue({ height: 118 } as DOMRect);
      spyOn(item2, 'getBoundingClientRect').and.returnValue({ height: 248 } as DOMRect);
      grid.appendChild(item1);
      grid.appendChild(item2);
      document.body.appendChild(grid);

      applyMasonry(grid);

      // (118 + 12) / (1 + 12) = 130 / 13 = 10
      expect(item1.style.gridRowEnd).toBe('span 10');
      // (248 + 12) / (1 + 12) = 260 / 13 = 20
      expect(item2.style.gridRowEnd).toBe('span 20');

      document.body.removeChild(grid);
    });
  });
});
