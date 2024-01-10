import { ComponentContent, hasConnectedComponent } from './ComponentContent';

describe('ComponentContent', () => {
  describe('hasConnectedComponent()', () => {
    it('returns false when content does not have any connected components', () => {
      const content = {} as ComponentContent;
      expect(hasConnectedComponent(content, 'importWork')).toBeFalse();
    });
    it('returns false when content does not have the specified connected component type', () => {
      const content = { connectedComponents: [{ type: 'showWork' }] } as ComponentContent;
      expect(hasConnectedComponent(content, 'importWork')).toBeFalse();
    });
    it('returns true when content has the specified connected component type', () => {
      const content = { connectedComponents: [{ type: 'importWork' }] } as ComponentContent;
      expect(hasConnectedComponent(content, 'importWork')).toBeTrue();
    });
  });
});
