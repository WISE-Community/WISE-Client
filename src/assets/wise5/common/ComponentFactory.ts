import { MultipleChoiceComponent } from '../components/multipleChoice/MultipleChoiceComponent';
import { Component } from './Component';
import { ComponentContent } from './ComponentContent';

export class ComponentFactory {
  getComponent(content: ComponentContent, nodeId: string): Component {
    if (content.type === 'MultipleChoice') {
      return new MultipleChoiceComponent(content, nodeId);
    } else {
      return new Component(content, nodeId);
    }
  }
}
