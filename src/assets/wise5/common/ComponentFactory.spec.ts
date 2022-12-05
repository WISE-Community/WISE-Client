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
    const componentTypes = [
      {
        type: 'MultipleChoice',
        instance: MultipleChoiceComponent,
        message: 'should return MultipleChoiceComponent if content.type is MultipleChoice'
      },
      {
        type: 'HTML',
        instance: Component,
        message: 'should return Component if content.type is not MultipleChoice'
      }
    ];
    for (const componentType of componentTypes) {
      it(componentType.message, () => {
        const component = factory.getComponent(
          { type: componentType.type } as ComponentContent,
          'node1'
        );
        expect(component instanceof componentType.instance).toBeTrue();
      });
    }
  });
}
