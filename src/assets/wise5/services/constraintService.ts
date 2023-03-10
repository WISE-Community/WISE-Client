import { Injectable } from '@angular/core';
import { EvaluateConstraintContext } from '../common/constraint/EvaluateConstraintContext';
import { AddXNumberOfNotesOnThisStepConstraintStrategy } from '../common/constraint/strategies/AddXNumberOfNotesOnThisStepConstraintStrategy';
import { BranchPathTakenConstraintStrategy } from '../common/constraint/strategies/BranchPathTakenConstraintStrategy';
import { ChoiceChosenConstraintStrategy } from '../common/constraint/strategies/ChoiceChosenConstraintStrategy';
import { FillXNumberOfRowsConstraintStrategy } from '../common/constraint/strategies/FillXNumberOfRowsConstraintStrategy';
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
    addXNumberOfNotesOnThisStep: new AddXNumberOfNotesOnThisStepConstraintStrategy(),
    branchPathTaken: new BranchPathTakenConstraintStrategy(),
    choiceChosen: new ChoiceChosenConstraintStrategy(),
    fillXNumberOfRows: new FillXNumberOfRowsConstraintStrategy(),
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
    score: (criteria) => {
      return this.evaluateScoreCriteria(criteria);
    },
    teacherRemoval: (criteria) => {
      return this.evaluateTeacherRemovalCriteria(criteria);
    },
    hasTag: (criteria) => {
      return this.evaluateHasTagCriteria(criteria);
    }
  };

  evaluateConstraintContext: EvaluateConstraintContext;

  constructor(
    private annotationService: AnnotationService,
    componentServiceLookupService: ComponentServiceLookupService,
    private configService: ConfigService,
    private dataService: StudentDataService,
    notebookService: NotebookService,
    private tagService: TagService
  ) {
    this.evaluateConstraintContext = new EvaluateConstraintContext(
      componentServiceLookupService,
      dataService,
      notebookService
    );
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
        'addXNumberOfNotesOnThisStep',
        'branchPathTaken',
        'choiceChosen',
        'fillXNumberOfRows',
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

  evaluateHasTagCriteria(criteria: any): boolean {
    return this.tagService.hasTagName(criteria.params.tag);
  }
}
