'use strict';

import { ComponentService } from '../componentService';
import { Injectable } from '@angular/core';
import { MatchContent } from './MatchContent';

@Injectable()
export class MatchService extends ComponentService {
  getComponentTypeLabel(): string {
    return $localize`Match`;
  }

  createComponent() {
    const component: any = super.createComponent();
    component.type = 'Match';
    component.choices = [];
    component.choiceReuseEnabled = false;
    component.buckets = [];
    component.feedback = [{ bucketId: '0', choices: [] }];
    component.ordered = false;
    return component;
  }

  isCompleted(component: any, componentStates: any[], nodeEvents: any[], node: any) {
    if (componentStates && componentStates.length > 0) {
      const isSubmitRequired = this.isSubmitRequired(node, component);
      for (const componentState of componentStates) {
        const buckets = componentState.studentData.buckets;
        if (buckets && buckets.length > 0) {
          if (!isSubmitRequired || (isSubmitRequired && componentState.isSubmit)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  componentStateHasStudentWork(componentState: any, componentContent: any) {
    if (componentState != null) {
      const buckets = componentState.studentData.buckets;
      for (const bucket of buckets) {
        const items = bucket.items;
        if (items != null && items.length > 0) {
          return true;
        }
      }
    }
    return false;
  }

  getChoiceById(id: string, choices: any[]): any {
    return this.getItemById(id, choices);
  }

  getBucketById(id: string, buckets: any[]): any {
    return this.getItemById(id, buckets);
  }

  getItemById(id: string, items: any[]): any {
    for (const item of items) {
      if (item.id === id) {
        return item;
      }
    }
    return null;
  }

  componentHasCorrectAnswer(component: MatchContent): boolean {
    return component.feedback.some((feedback) =>
      feedback.choices.some((choice) => choice.isCorrect)
    );
  }

  setItemStatus(item: any, hasCorrectAnswer: boolean): void {
    item.status = '';
    if (item.isCorrect) {
      item.status = 'correct';
    } else if (item.isIncorrectPosition) {
      item.status = 'warn';
    } else if (hasCorrectAnswer && !item.isCorrect && !item.isIncorrectPosition) {
      item.status = 'incorrect';
    }
  }
}
