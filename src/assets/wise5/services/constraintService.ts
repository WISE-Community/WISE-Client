import { Injectable } from '@angular/core';
import { EvaluateConstraintContext } from '../common/constraint/EvaluateConstraintContext';
import { IsCompletedConstraintStrategy } from '../common/constraint/strategies/IsCompletedConstraintStrategy';
import { AnnotationService } from './annotationService';
import { ComponentServiceLookupService } from './componentServiceLookupService';
import { ConfigService } from './configService';
import { NotebookService } from './notebookService';
import { StudentDataService } from './studentDataService';
import { TagService } from './tagService';

@Injectable()
export class ConstraintService {
  criteriaFunctionNameToStrategy = {
    isCompleted: new IsCompletedConstraintStrategy()
  };

  criteriaFunctionNameToFunction = {
    branchPathTaken: (criteria) => {
      return this.evaluateBranchPathTakenCriteria(criteria);
    },
    isVisible: (criteria) => {
      return this.evaluateIsVisibleCriteria(criteria);
    },
    isVisitable: (criteria) => {
      return this.evaluateIsVisitableCriteria(criteria);
    },
    isVisited: (criteria) => {
      return this.evaluateIsVisitedCriteria(criteria);
    },
    isVisitedAfter: (criteria) => {
      return this.evaluateIsVisitedAfterCriteria(criteria);
    },
    isRevisedAfter: (criteria) => {
      return this.evaluateIsRevisedAfterCriteria(criteria);
    },
    isVisitedAndRevisedAfter: (criteria) => {
      return this.evaluateIsVisitedAndRevisedAfterCriteria(criteria);
    },
    isCorrect: (criteria) => {
      return this.evaluateIsCorrectCriteria(criteria);
    },
    choiceChosen: (criteria) => {
      return this.evaluateChoiceChosenCriteria(criteria);
    },
    score: (criteria) => {
      return this.evaluateScoreCriteria(criteria);
    },
    teacherRemoval: (criteria) => {
      return this.evaluateTeacherRemovalCriteria(criteria);
    },
    usedXSubmits: (criteria) => {
      return this.evaluateUsedXSubmitsCriteria(criteria);
    },
    wroteXNumberOfWords: (criteria) => {
      return this.evaluateNumberOfWordsWrittenCriteria(criteria);
    },
    addXNumberOfNotesOnThisStep: (criteria) => {
      return this.evaluateAddXNumberOfNotesOnThisStepCriteria(criteria);
    },
    fillXNumberOfRows: (criteria) => {
      return this.evaluateFillXNumberOfRowsCriteria(criteria);
    },
    hasTag: (criteria) => {
      return this.evaluateHasTagCriteria(criteria);
    }
  };

  evaluateConstraintContext: EvaluateConstraintContext;

  constructor(
    private annotationService: AnnotationService,
    private componentServiceLookupService: ComponentServiceLookupService,
    private configService: ConfigService,
    private dataService: StudentDataService,
    private notebookService: NotebookService,
    private tagService: TagService
  ) {
    this.evaluateConstraintContext = new EvaluateConstraintContext(dataService);
  }

  evaluate(constraints: any[]): any {
    let isVisible = true;
    let isVisitable = true;
    for (const constraintForNode of constraints) {
      const tempResult = this.evaluateConstraint(constraintForNode);
      const action = constraintForNode.action;
      if (this.isVisibleConstraintAction(action)) {
        isVisible = isVisible && tempResult;
      } else if (this.isVisitableConstraintAction(action)) {
        isVisitable = isVisitable && tempResult;
      }
    }
    return { isVisible: isVisible, isVisitable: isVisitable };
  }

  private isVisibleConstraintAction(action: string): boolean {
    return [
      'makeThisNodeNotVisible',
      'makeAllNodesAfterThisNotVisible',
      'makeAllOtherNodesNotVisible'
    ].includes(action);
  }

  private isVisitableConstraintAction(action: string): boolean {
    return [
      'makeThisNodeNotVisitable',
      'makeAllNodesAfterThisNotVisitable',
      'makeAllOtherNodesNotVisitable'
    ].includes(action);
  }

  evaluateConstraint(constraintForNode: any): any {
    return this.evaluateNodeConstraint(constraintForNode);
  }

  evaluateNodeConstraint(constraintForNode: any): any {
    const removalCriteria = constraintForNode.removalCriteria;
    const removalConditional = constraintForNode.removalConditional;
    if (removalCriteria == null) {
      return true;
    } else {
      return this.evaluateMultipleRemovalCriteria(removalCriteria, removalConditional);
    }
  }

  private evaluateMultipleRemovalCriteria(
    multipleRemovalCriteria: any,
    removalConditional: any
  ): any {
    let result = false;
    for (let c = 0; c < multipleRemovalCriteria.length; c++) {
      const singleCriteriaResult = this.evaluateCriteria(multipleRemovalCriteria[c]);
      if (c === 0) {
        result = singleCriteriaResult;
      } else {
        if (removalConditional === 'any') {
          result = result || singleCriteriaResult;
        } else {
          result = result && singleCriteriaResult;
        }
      }
    }
    return result;
  }

  private evaluateCriteria(criteria: any): boolean {
    if (criteria.name === 'isCompleted') {
      this.evaluateConstraintContext.setStrategy(
        this.criteriaFunctionNameToStrategy[criteria.name]
      );
      return this.evaluateConstraintContext.evaluate(criteria);
    } else {
      const criteriaFunction = this.criteriaFunctionNameToFunction[criteria.name];
      return criteriaFunction == null || criteriaFunction(criteria);
    }
  }

  evaluateCriterias(criterias: any): boolean {
    for (const criteria of criterias) {
      if (!this.evaluateCriteria(criteria)) {
        return false;
      }
    }
    return true;
  }

  evaluateBranchPathTakenCriteria(criteria: any): boolean {
    const expectedFromNodeId = criteria.params.fromNodeId;
    const expectedToNodeId = criteria.params.toNodeId;
    const branchPathTakenEvents = this.dataService.getBranchPathTakenEventsByNodeId(
      expectedFromNodeId
    );
    for (const branchPathTakenEvent of branchPathTakenEvents) {
      const data = branchPathTakenEvent.data;
      if (criteria.params.fromNodeId === data.fromNodeId && expectedToNodeId === data.toNodeId) {
        return true;
      }
    }
    return false;
  }

  evaluateIsVisibleCriteria(criteria: any): boolean {
    const nodeStatus = this.dataService.getNodeStatusByNodeId(criteria.params.nodeId);
    return nodeStatus.isVisible;
  }

  evaluateIsVisitableCriteria(criteria: any): boolean {
    const nodeStatus = this.dataService.getNodeStatusByNodeId(criteria.params.nodeId);
    return nodeStatus.isVisitable;
  }

  evaluateIsVisitedCriteria(criteria: any): boolean {
    const events = this.dataService.getEvents();
    for (const event of events) {
      if (event.nodeId === criteria.params.nodeId && event.event === 'nodeEntered') {
        return true;
      }
    }
    return false;
  }

  evaluateIsVisitedAfterCriteria(criteria: any): boolean {
    const isVisitedAfterNodeId = criteria.params.isVisitedAfterNodeId;
    const criteriaCreatedTimestamp = criteria.params.criteriaCreatedTimestamp;
    const events = this.dataService.getEvents();
    for (const event of events) {
      if (
        event.nodeId === isVisitedAfterNodeId &&
        event.event === 'nodeEntered' &&
        event.clientSaveTime > criteriaCreatedTimestamp
      ) {
        return true;
      }
    }
    return false;
  }

  evaluateIsRevisedAfterCriteria(criteria: any): boolean {
    const isRevisedAfterNodeId = criteria.params.isRevisedAfterNodeId;
    const isRevisedAfterComponentId = criteria.params.isRevisedAfterComponentId;
    const criteriaCreatedTimestamp = criteria.params.criteriaCreatedTimestamp;
    const latestComponentStateForComponent = this.dataService.getLatestComponentStateByNodeIdAndComponentId(
      isRevisedAfterNodeId,
      isRevisedAfterComponentId
    );
    return (
      latestComponentStateForComponent != null &&
      latestComponentStateForComponent.clientSaveTime > criteriaCreatedTimestamp
    );
  }

  evaluateIsVisitedAndRevisedAfterCriteria(criteria: any): boolean {
    const isVisitedAfterNodeId = criteria.params.isVisitedAfterNodeId;
    const isRevisedAfterNodeId = criteria.params.isRevisedAfterNodeId;
    const isRevisedAfterComponentId = criteria.params.isRevisedAfterComponentId;
    const criteriaCreatedTimestamp = criteria.params.criteriaCreatedTimestamp;
    const events = this.dataService.getEvents();
    for (const event of events) {
      if (
        this.isVisitedAndRevisedAfter(
          isVisitedAfterNodeId,
          isRevisedAfterNodeId,
          isRevisedAfterComponentId,
          event,
          criteriaCreatedTimestamp
        )
      ) {
        return true;
      }
    }
    return false;
  }

  isVisitedAndRevisedAfter(visitNodeId, reviseNodeId, reviseComponentId, event, timestamp) {
    return (
      this.dataService.isNodeVisitedAfterTimestamp(event, visitNodeId, timestamp) &&
      this.dataService.hasWorkCreatedAfterTimestamp(
        reviseNodeId,
        reviseComponentId,
        event.clientSaveTime
      )
    );
  }

  evaluateIsCorrectCriteria(criteria) {
    const componentStates = this.dataService.getComponentStatesByNodeIdAndComponentId(
      criteria.params.nodeId,
      criteria.params.componentId
    );
    for (const componentState of componentStates) {
      if (componentState.studentData.isCorrect) {
        return true;
      }
    }
    return false;
  }

  evaluateChoiceChosenCriteria(criteria: any): boolean {
    const service = this.componentServiceLookupService.getService('MultipleChoice');
    const latestComponentState = this.dataService.getLatestComponentStateByNodeIdAndComponentId(
      criteria.params.nodeId,
      criteria.params.componentId
    );
    return latestComponentState != null && service.choiceChosen(criteria, latestComponentState);
  }

  evaluateScoreCriteria(criteria: any): boolean {
    const params = criteria.params;
    const scoreType = 'any';
    const latestScoreAnnotation = this.annotationService.getLatestScoreAnnotation(
      params.nodeId,
      params.componentId,
      this.configService.getWorkgroupId(),
      scoreType
    );
    if (latestScoreAnnotation != null) {
      const scoreValue = this.dataService.getScoreValueFromScoreAnnotation(
        latestScoreAnnotation,
        params.scoreId
      );
      return this.dataService.isScoreInExpectedScores(params.scores, scoreValue);
    }
    return false;
  }

  evaluateTeacherRemovalCriteria(criteria: any): boolean {
    return criteria.params.periodId !== this.configService.getPeriodId();
  }

  evaluateUsedXSubmitsCriteria(criteria: any): boolean {
    const params = criteria.params;
    return this.getSubmitCount(params.nodeId, params.componentId) >= params.requiredSubmitCount;
  }

  getSubmitCount(nodeId: string, componentId: string): number {
    // counter for manually counting the component states with isSubmit=true
    let manualSubmitCounter = 0;

    // counter for remembering the highest submitCounter value found in studentData objects
    let highestSubmitCounter = 0;

    /*
     * We are counting with two submit counters for backwards compatibility.
     * Some componentStates only have isSubmit=true and do not keep an
     * updated submitCounter for the number of submits.
     */
    const componentStates = this.dataService.getComponentStatesByNodeIdAndComponentId(
      nodeId,
      componentId
    );
    for (const componentState of componentStates) {
      if (componentState.isSubmit) {
        manualSubmitCounter++;
      }
      const studentData = componentState.studentData;
      if (studentData.submitCounter > highestSubmitCounter) {
        highestSubmitCounter = studentData.submitCounter;
      }
    }
    return Math.max(manualSubmitCounter, highestSubmitCounter);
  }

  evaluateNumberOfWordsWrittenCriteria(criteria: any): boolean {
    const params = criteria.params;
    const nodeId = params.nodeId;
    const componentId = params.componentId;
    const requiredNumberOfWords = params.requiredNumberOfWords;
    const componentState = this.dataService.getLatestComponentStateByNodeIdAndComponentId(
      nodeId,
      componentId
    );
    if (componentState != null) {
      const studentData = componentState.studentData;
      const response = studentData.response;
      const numberOfWords = this.wordCount(response);
      if (numberOfWords >= requiredNumberOfWords) {
        return true;
      }
    }
    return false;
  }

  private wordCount(str: string): number {
    return str.trim().split(/\s+/).length;
  }

  evaluateAddXNumberOfNotesOnThisStepCriteria(criteria: any): boolean {
    const params = criteria.params;
    const nodeId = params.nodeId;
    const requiredNumberOfNotes = params.requiredNumberOfNotes;
    try {
      const notebook = this.notebookService.getNotebookByWorkgroup();
      const notebookItemsByNodeId = this.dataService.getNotebookItemsByNodeId(notebook, nodeId);
      return notebookItemsByNodeId.length >= requiredNumberOfNotes;
    } catch (e) {}
    return false;
  }

  evaluateFillXNumberOfRowsCriteria(criteria: any): boolean {
    const params = criteria.params;
    const nodeId = params.nodeId;
    const componentId = params.componentId;
    const requiredNumberOfFilledRows = params.requiredNumberOfFilledRows;
    const tableHasHeaderRow = params.tableHasHeaderRow;
    const requireAllCellsInARowToBeFilled = params.requireAllCellsInARowToBeFilled;
    const tableService = this.componentServiceLookupService.getService('Table');
    const componentState = this.dataService.getLatestComponentStateByNodeIdAndComponentId(
      nodeId,
      componentId
    );
    return (
      componentState != null &&
      tableService.hasRequiredNumberOfFilledRows(
        componentState,
        requiredNumberOfFilledRows,
        tableHasHeaderRow,
        requireAllCellsInARowToBeFilled
      )
    );
  }

  evaluateHasTagCriteria(criteria: any): boolean {
    return this.tagService.hasTagName(criteria.params.tag);
  }
}
