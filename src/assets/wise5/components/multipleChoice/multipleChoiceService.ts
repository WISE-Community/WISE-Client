'use strict';

import { ComponentService } from '../componentService';
import { Injectable } from '@angular/core';
import { arraysContainSameValues } from '../../common/array/array';

@Injectable()
export class MultipleChoiceService extends ComponentService {
  getComponentTypeLabel(): string {
    return $localize`Multiple Choice`;
  }

  createComponent() {
    const component: any = super.createComponent();
    component.type = 'MultipleChoice';
    component.choiceType = 'radio';
    component.choices = [];
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
    return typeof constraintChoiceIds === 'string'
      ? studentChoiceIds.length === 1 && studentChoiceIds[0] === constraintChoiceIds
      : arraysContainSameValues(studentChoiceIds, constraintChoiceIds);
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

  getStudentChoicesFromComponentState(componentState: any) {
    if (componentState.studentData) {
      return componentState.studentData.studentChoices;
    }
    return [];
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

  componentHasCorrectAnswer(component: any) {
    for (const choice of component.choices) {
      if (choice.isCorrect) {
        return true;
      }
    }
    return false;
  }

  calculateIsCorrect(componentContent: any, componentState: any): boolean {
    if (this.isRadio(componentContent)) {
      return this.isRadioCorrect(componentContent, componentState);
    } else if (this.isCheckbox(componentContent)) {
      return this.isCheckboxCorrect(componentContent, componentState);
    }
  }

  isRadio(componentContent: any): boolean {
    return componentContent.choiceType === 'radio';
  }

  isCheckbox(componentContent: any): boolean {
    return componentContent.choiceType === 'checkbox';
  }

  isRadioCorrect(componentContent: any, componentState: any): boolean {
    const correctChoiceId = this.getCorrectChoiceIdForRadio(componentContent);
    return componentState.studentData.studentChoices[0].id === correctChoiceId;
  }

  getCorrectChoiceIdForRadio(componentContent: any): string {
    for (const choice of componentContent.choices) {
      if (choice.isCorrect) {
        return choice.id;
      }
    }
    return null;
  }

  isCheckboxCorrect(componentContent: any, componentState: any): boolean {
    const correctChoiceIds = this.getCorrectChoiceIdsForCheckbox(componentContent);
    const choiceIdsStudentChose = this.getChoicesIdsStudentChose(
      componentState.studentData.studentChoices
    );
    return this.isChoiceIdsSame(correctChoiceIds, choiceIdsStudentChose);
  }

  getCorrectChoiceIdsForCheckbox(componentContent: any): string[] {
    const correctChoiceIds: string[] = [];
    for (const choice of componentContent.choices) {
      if (choice.isCorrect) {
        correctChoiceIds.push(choice.id);
      }
    }
    return correctChoiceIds;
  }

  getChoicesIdsStudentChose(studentChoices: any[]): string[] {
    return studentChoices.map((studentChoice) => studentChoice.id);
  }

  isChoiceIdsSame(choiceIds1: string[], choiceIds2: string[]): boolean {
    if (choiceIds1.length !== choiceIds2.length) {
      return false;
    } else {
      choiceIds1.sort();
      choiceIds2.sort();
      for (let i = 0; i < choiceIds1.length; i++) {
        if (choiceIds1[i] !== choiceIds2[i]) {
          return false;
        }
      }
      return true;
    }
  }
}
