import { ComponentService } from '../componentService';
import { Injectable } from '@angular/core';
import { arraysContainSameValues } from '../../common/array/array';
import { Choice } from './Choice';
import { generateRandomKey } from '../../common/string/string';

@Injectable()
export class MultipleChoiceService extends ComponentService {
  protected type: string = 'MultipleChoice';


  createComponent(): any {
    const component: any = super.createComponent();
    component.type = this.type;
    component.prompt = $localize`Choose an option from below`;
    component.choiceType = 'radio';
    component.choices = [
      new Choice(generateRandomKey(), $localize`Choice 1`, false, ''),
      new Choice(generateRandomKey(), $localize`Choice 2`, false, '')
    ];
    component.showFeedback = true;
    return component;
  }

  /**
   * Returns true iff the student chose a choice specified in the criteria
   * @param criteria the criteria object
   * @param componentState contains student's last choice
   * @returns a boolean value whether the student chose the choice specified in the
   * criteria object
   */
  choiceChosen(criteria: any, componentState: any): boolean {
    const studentChoiceIds = componentState.studentData.studentChoices.map((choice) => choice.id);
    return this.isChoicesSelected(studentChoiceIds, criteria.params.choiceIds);
  }

  private isChoicesSelected(
    studentChoiceIds: string[],
    constraintChoiceIds: string | string[]
  ): boolean {
    return constraintChoiceIds instanceof Array
      ? arraysContainSameValues(studentChoiceIds, constraintChoiceIds)
      : studentChoiceIds.includes(constraintChoiceIds);
  }

  isCompleted(component: any, componentStates: any[], nodeEvents: any[], node: any) {
    if (componentStates && componentStates.length) {
      const isSubmitRequired = this.isSubmitRequired(node, component);
      for (let c = componentStates.length - 1; c >= 0; c--) {
        const componentState = componentStates[c];
        const studentChoices = this.getStudentChoicesFromComponentState(componentState);
        if (
          studentChoices != null &&
          (!isSubmitRequired || (isSubmitRequired && componentState.isSubmit))
        ) {
          return true;
        }
      }
    }
    return false;
  }

  private getStudentChoicesFromComponentState(componentState: any): any[] {
    return componentState.studentData ? componentState.studentData.studentChoices : [];
  }

  /**
   * Get the human readable student data string
   * @param componentState the component state
   * @return a human readable student data string
   */
  getStudentDataString(componentState: any) {
    if (componentState != null) {
      const studentData = componentState.studentData;
      if (studentData != null) {
        const studentChoices = studentData.studentChoices;
        if (studentChoices != null) {
          return studentChoices.map((studentChoice) => studentChoice.text).join(', ');
        }
      }
    }
    return '';
  }

  componentStateHasStudentWork(componentState: any, componentContent: any) {
    if (componentState != null) {
      const studentData = componentState.studentData;
      if (studentData != null) {
        const studentChoices = studentData.studentChoices;
        if (studentChoices != null && studentChoices.length > 0) {
          return true;
        }
      }
    }
    return false;
  }

  componentHasCorrectAnswer(component: any): boolean {
    return component.choices.some((choice) => choice.isCorrect);
  }
}
