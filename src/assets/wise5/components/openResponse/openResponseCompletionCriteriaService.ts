import { Injectable } from '@angular/core';

export interface CompletionCriteria {
  inOrder: boolean;
  criteria: CompletionCriterion[];
}

interface CompletionCriterion {
  name: string;
  nodeId: string;
  componentId: string;
}

@Injectable()
export class OpenResponseCompletionCriteriaService {
  isSatisfied(studentData: any, completionCriteria: CompletionCriteria): boolean {
    if (completionCriteria.inOrder) {
      return this.isInOrderCompletionCriteriaSatisfied(studentData, completionCriteria);
    }
    return true;
  }

  private isInOrderCompletionCriteriaSatisfied(
    studentData: any,
    completionCriteria: CompletionCriteria
  ): boolean {
    let result = true;
    let tempTimestamp = 0;
    for (const completionCriterion of completionCriteria.criteria) {
      const functionName = completionCriterion.name;
      if (functionName == 'isSubmitted') {
        const tempComponentState = this.getComponentStateSubmittedAfter(
          studentData,
          completionCriterion.nodeId,
          completionCriterion.componentId,
          tempTimestamp
        );
        if (tempComponentState == null) {
          return false;
        } else {
          tempTimestamp = tempComponentState.serverSaveTime;
        }
      } else if (functionName == 'isSaved') {
        const tempComponentState = this.getComponentStateSavedAfter(
          studentData,
          completionCriterion.nodeId,
          completionCriterion.componentId,
          tempTimestamp
        );
        if (tempComponentState == null) {
          return false;
        } else {
          tempTimestamp = tempComponentState.serverSaveTime;
        }
      } else if (functionName == 'isVisited') {
        const tempEvent = this.getVisitEventAfter(
          studentData,
          completionCriterion.nodeId,
          tempTimestamp
        );
        if (tempEvent == null) {
          return false;
        } else {
          tempTimestamp = tempEvent.serverSaveTime;
        }
      }
    }
    return result;
  }

  private getComponentStateSubmittedAfter(
    studentData: any,
    nodeId: string,
    componentId: string,
    timestamp: number
  ): any {
    for (const componentState of studentData.componentStates) {
      if (
        componentState.nodeId === nodeId &&
        componentState.componentId === componentId &&
        componentState.serverSaveTime > timestamp &&
        componentState.isSubmit
      ) {
        return componentState;
      }
    }
    return null;
  }

  private getComponentStateSavedAfter(
    studentData: any,
    nodeId: string,
    componentId: string,
    timestamp: number
  ): any {
    for (const componentState of studentData.componentStates) {
      if (
        componentState.nodeId === nodeId &&
        componentState.componentId === componentId &&
        componentState.serverSaveTime > timestamp
      ) {
        return componentState;
      }
    }
    return null;
  }

  private getVisitEventAfter(studentData: any, nodeId: string, timestamp: number): any {
    for (const tempEvent of studentData.events) {
      if (
        tempEvent.nodeId === nodeId &&
        tempEvent.serverSaveTime > timestamp &&
        tempEvent.event === 'nodeEntered'
      ) {
        return tempEvent;
      }
    }
    return null;
  }
}
