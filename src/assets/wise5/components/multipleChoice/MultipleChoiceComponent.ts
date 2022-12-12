import { Component } from '../../common/Component';
import { Choice } from './Choice';
import { MultipleChoiceContent } from './MultipleChoiceContent';

export class MultipleChoiceComponent extends Component {
  content: MultipleChoiceContent;

  getChoices(): Choice[] {
    return this.content.choices;
  }

  getChoiceType(): string {
    return this.content.choiceType;
  }

  isCheckbox(): boolean {
    return this.content.choiceType === 'checkbox';
  }

  isRadio(): boolean {
    return this.content.choiceType === 'radio';
  }
}
