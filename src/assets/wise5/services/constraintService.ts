import { Injectable } from '@angular/core';
import { EvaluateConstraintContext } from '../common/constraint/EvaluateConstraintContext';
import { BranchPathTakenConstraintStrategy } from '../common/constraint/strategies/BranchPathTakenConstraintStrategy';
import { IsCompletedConstraintStrategy } from '../common/constraint/strategies/IsCompletedConstraintStrategy';
import { IsCorrectConstraintStrategy } from '../common/constraint/strategies/IsCorrectConstraintStrategy';
import { IsRevisedAfterConstraintStrategy } from '../common/constraint/strategies/IsRevisedAfterConstraintStrategy';
import { IsVisibleConstraintStrategy } from '../common/constraint/strategies/IsVisibleConstraintStrategy';
import { IsVisitableConstraintStrategy } from '../common/constraint/strategies/IsVisitableContraintStrategy';
import { IsVisitedAfterConstraintStrategy } from '../common/constraint/strategies/IsVisitedAfterConstraintStrategy';
import { IsVisitedAndRevisedAfterConstraintStrategy } from '../common/constraint/strategies/IsVisitedAndRevisedAfterConstraintStrategy';
import { IsVisitedConstraintStrategy } from '../common/constraint/strategies/IsVisitedConstraintStrategy';
import { UsedXSubmitsConstraintStrategy } from '../common/constraint/strategies/UsedXSubmitsConstraintStrategy';
import { WroteXNumberOfWordsConstraintStrategy } from '../common/constraint/strategies/WroteXNumberOfWordsConstraintStrategy';
import { AnnotationService } from './annotationService';
import { ComponentServiceLookupService } from './componentServiceLookupService';
import { ConfigService } from './configService';
import { NotebookService } from './notebookService';
import { StudentDataService } from './studentDataService';
import { TagService } from './tagService';

@Injectable()
export class ConstraintService {
  criteriaFunctionNameToStrategy = {
    branchPathTaken: new BranchPathTakenConstraintStrategy(),
    isCompleted: new IsCompletedConstraintStrategy(),
    isCorrect: new IsCorrectConstraintStrategy(),
    isRevisedAfter: new IsRevisedAfterConstraintStrategy(),
    isVisible: new IsVisibleConstraintStrategy(),
    isVisitable: new IsVisitableConstraintStrategy(),
    isVisited: new IsVisitedConstraintStrategy(),
    isVisitedAfter: new IsVisitedAfterConstraintStrategy(),
    isVisitedAndRevisedAfter: new IsVisitedAndRevisedAfterConstraintStrategy(),
    usedXSubmits: new UsedXSubmitsConstraintStrategy(),
    wroteXNumberOfWords: new WroteXNumberOfWordsConstraintStrategy()
  };

  criteriaFunctionNameToFunction = {
    choiceChosen: (criteria) => {
      return this.evaluateChoiceChosenCriteria(criteria);
    },
    score: (criteria) => {
      return this.evaluateScoreCriteria(criteria);
    },
    teacherRemoval: (criteria) => {
      return this.evaluateTeacherRemovalCriteria(criteria);
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
    if (
      [
        'branchPathTaken',
        'isCompleted',
        'isCorrect',
        'isRevisedAfter',
        'isVisible',
        'isVisitable',
        'isVisited',
        'isVisitedAfter',
        'isVisitedAndRevisedAfter',
        'usedXSubmits',
        'wroteXNumberOfWords'
      ].includes(criteria.name)
    ) {
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
