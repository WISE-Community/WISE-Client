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
    if (constraintChoiceIds instanceof Array) {
      return arraysContainSameValues(studentChoiceIds, constraintChoiceIds);
    } else {
      return studentChoiceIds.includes(constraintChoiceIds);
    }
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
}
