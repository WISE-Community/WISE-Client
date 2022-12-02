import { MultipleChoiceComponent } from '../components/multipleChoice/MultipleChoiceComponent';
import { Component } from './Component';
import { ComponentContent } from './ComponentContent';
import { ComponentFactory } from './ComponentFactory';

const factory = new ComponentFactory();
describe('ComponentFactory', () => {
  getComponent();
});

function getComponent() {
  describe('getComponent()', () => {
    it('should return MultipleChoiceComponent if content type is MultipleChoice', () => {
      const component = factory.getComponent(
        { type: 'MultipleChoice' } as ComponentContent,
        'node1'
      );
      expect(component instanceof MultipleChoiceComponent).toBeTrue();
    });
    it('should return Component if content type is not MultipleChoice', () => {
      const component = factory.getComponent({ type: 'HTML' } as ComponentContent, 'node1');
      expect(component instanceof Component).toBeTrue();
    });
  });
}
