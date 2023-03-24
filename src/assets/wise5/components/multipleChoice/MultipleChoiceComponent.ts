import { arraysContainSameValues } from '../../common/array/array';
import { Component } from '../../common/Component';
import { Choice } from './Choice';
import { MultipleChoiceContent } from './MultipleChoiceContent';

export class MultipleChoiceComponent extends Component {
  content: MultipleChoiceContent;

  calculateIsCorrect(componentState: any): boolean {
    return this.isRadio()
      ? this.isRadioCorrect(componentState)
      : this.isCheckboxCorrect(componentState);
  }

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

  private isCheckboxCorrect(componentState: any): boolean {
    return arraysContainSameValues(
      this.getCorrectChoiceIdsForCheckbox(),
      this.getChoicesIdsStudentChose(componentState.studentData.studentChoices)
    );
  }

  private getCorrectChoiceIdsForCheckbox(): string[] {
    const correctChoiceIds: string[] = [];
    for (const choice of this.content.choices) {
      if (choice.isCorrect) {
        correctChoiceIds.push(choice.id);
      }
    }
    return correctChoiceIds;
  }

  private getChoicesIdsStudentChose(studentChoices: any[]): string[] {
    return studentChoices.map((studentChoice) => studentChoice.id);
  }

  private isRadioCorrect(componentState: any): boolean {
    const correctChoiceId = this.getCorrectChoiceIdForRadio();
    return componentState.studentData.studentChoices[0].id === correctChoiceId;
  }

  private getCorrectChoiceIdForRadio(): string {
    for (const choice of this.content.choices) {
      if (choice.isCorrect) {
        return choice.id;
      }
    }
    return null;
  }
}
