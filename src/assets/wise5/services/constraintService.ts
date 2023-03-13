import { Injectable } from '@angular/core';
import { EvaluateConstraintContext } from '../common/constraint/EvaluateConstraintContext';
import { AddXNumberOfNotesOnThisStepConstraintStrategy } from '../common/constraint/strategies/AddXNumberOfNotesOnThisStepConstraintStrategy';
import { BranchPathTakenConstraintStrategy } from '../common/constraint/strategies/BranchPathTakenConstraintStrategy';
import { ChoiceChosenConstraintStrategy } from '../common/constraint/strategies/ChoiceChosenConstraintStrategy';
import { ConstraintStrategy } from '../common/constraint/strategies/ConstraintStrategy';
import { FillXNumberOfRowsConstraintStrategy } from '../common/constraint/strategies/FillXNumberOfRowsConstraintStrategy';
import { HasTagConstraintStrategy } from '../common/constraint/strategies/HasTagConstraintStrategy';
import { IsCompletedConstraintStrategy } from '../common/constraint/strategies/IsCompletedConstraintStrategy';
import { IsCorrectConstraintStrategy } from '../common/constraint/strategies/IsCorrectConstraintStrategy';
import { IsRevisedAfterConstraintStrategy } from '../common/constraint/strategies/IsRevisedAfterConstraintStrategy';
import { IsVisibleConstraintStrategy } from '../common/constraint/strategies/IsVisibleConstraintStrategy';
import { IsVisitableConstraintStrategy } from '../common/constraint/strategies/IsVisitableContraintStrategy';
import { IsVisitedAfterConstraintStrategy } from '../common/constraint/strategies/IsVisitedAfterConstraintStrategy';
import { IsVisitedAndRevisedAfterConstraintStrategy } from '../common/constraint/strategies/IsVisitedAndRevisedAfterConstraintStrategy';
import { IsVisitedConstraintStrategy } from '../common/constraint/strategies/IsVisitedConstraintStrategy';
import { ScoreConstraintStrategy } from '../common/constraint/strategies/ScoreConstraintStrategy';
import { TeacherRemovalConstraintStrategy } from '../common/constraint/strategies/TeacherRemovalConstraintStrategy';
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
    hasTag: new HasTagConstraintStrategy(),
    isCompleted: new IsCompletedConstraintStrategy(),
    isCorrect: new IsCorrectConstraintStrategy(),
    isRevisedAfter: new IsRevisedAfterConstraintStrategy(),
    isVisible: new IsVisibleConstraintStrategy(),
    isVisitable: new IsVisitableConstraintStrategy(),
    isVisited: new IsVisitedConstraintStrategy(),
    isVisitedAfter: new IsVisitedAfterConstraintStrategy(),
    isVisitedAndRevisedAfter: new IsVisitedAndRevisedAfterConstraintStrategy(),
    score: new ScoreConstraintStrategy(),
    teacherRemoval: new TeacherRemovalConstraintStrategy(),
    usedXSubmits: new UsedXSubmitsConstraintStrategy(),
    wroteXNumberOfWords: new WroteXNumberOfWordsConstraintStrategy()
  };
  evaluateConstraintContext: EvaluateConstraintContext;

  constructor(
    annotationService: AnnotationService,
    componentServiceLookupService: ComponentServiceLookupService,
    configService: ConfigService,
    dataService: StudentDataService,
    notebookService: NotebookService,
    tagService: TagService
  ) {
    this.evaluateConstraintContext = new EvaluateConstraintContext(
      annotationService,
      componentServiceLookupService,
      configService,
      dataService,
      notebookService,
      tagService
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
    const strategy = this.criteriaFunctionNameToStrategy[criteria.name];
    return strategy == null || this.evaluateStrategy(criteria, strategy);
  }

  private evaluateStrategy(criteria: any, strategy: ConstraintStrategy): boolean {
    this.evaluateConstraintContext.setStrategy(strategy);
    return this.evaluateConstraintContext.evaluate(criteria);
  }

  evaluateCriterias(criterias: any): boolean {
    for (const criteria of criterias) {
      if (!this.evaluateCriteria(criteria)) {
        return false;
      }
    }
    return true;
  }
}
