import { Component } from './Component';
import { ComponentContent } from './ComponentContent';

describe('Component', () => {
  describe('getConnectedComponent()', () => {
    const connectedComponent = { nodeId: 'node1', componentId: 'component1' };
    const component = new Component(
      {
        connectedComponents: [connectedComponent]
      } as ComponentContent,
      'node1'
    );
    it('should return connected component for specified nodeId/componentId', () => {
      expect(component.getConnectedComponent('node1', 'component1')).toEqual(connectedComponent);
    });
    it('should return undefined when there is no connected component for specified nodeId/componentId', () => {
      expect(component.getConnectedComponent('node1', 'component2')).toBeUndefined();
    });
  });
});
