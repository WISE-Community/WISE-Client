import { DialogGuidanceComponent } from '../components/dialogGuidance/DialogGuidanceComponent';
import { MultipleChoiceComponent } from '../components/multipleChoice/MultipleChoiceComponent';
import { PeerChatComponent } from '../components/peerChat/PeerChatComponent';
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
        type: 'DialogGuidance',
        instance: DialogGuidanceComponent,
        message: 'should return DialogGuidanceComponent if content.type is DialogGuidance'
      },
      {
        type: 'MultipleChoice',
        instance: MultipleChoiceComponent,
        message: 'should return MultipleChoiceComponent if content.type is MultipleChoice'
      },
      {
        type: 'PeerChat',
        instance: PeerChatComponent,
        message: 'should return PeerChatComponent if content.type is PeerChat'
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
