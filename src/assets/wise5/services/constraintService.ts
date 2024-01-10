import { Injectable } from '@angular/core';
import { ConstraintEvaluationResult } from '../common/constraint/ConstraintEvaluationResult';
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
import { ProjectService } from './projectService';
import { StudentDataService } from './studentDataService';
import { TagService } from './tagService';
import { CompletionService } from './completionService';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class ConstraintService {
  activeConstraints: any[] = [];
  private constraintsUpdatedSource: Subject<void> = new Subject<void>();
  public constraintsUpdated$: Observable<void> = this.constraintsUpdatedSource.asObservable();
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
  isNodeAffectedByConstraintResult: any = {};

  constructor(
    annotationService: AnnotationService,
    completionService: CompletionService,
    componentServiceLookupService: ComponentServiceLookupService,
    private configService: ConfigService,
    dataService: StudentDataService,
    notebookService: NotebookService,
    private projectService: ProjectService,
    tagService: TagService
  ) {
    this.evaluateConstraintContext = new EvaluateConstraintContext(
      annotationService,
      completionService,
      componentServiceLookupService,
      configService,
      dataService,
      notebookService,
      tagService
    );
    this.subscribeToProjectParsed();
  }

  private subscribeToProjectParsed(): void {
    this.projectService.projectParsed$.subscribe(() => {
      this.activeConstraints = [];
      this.isNodeAffectedByConstraintResult = {};
      for (const node of this.projectService.project.nodes) {
        const constraints = node.constraints;
        if (constraints != null) {
          if (this.configService.getConfigParam('constraints')) {
            for (const constraint of constraints) {
              this.activeConstraints.push(constraint);
            }
          }
        }
      }
    });
  }

  evaluate(constraints: any[] = []): ConstraintEvaluationResult {
    let isVisible = true;
    let isVisitable = true;
    for (const constraint of constraints) {
      const result = this.evaluateConstraint(constraint);
      const action = constraint.action;
      if (this.isVisibleConstraintAction(action)) {
        isVisible = isVisible && result;
      } else if (this.isVisitableConstraintAction(action)) {
        isVisitable = isVisitable && result;
      }
    }
    return { isVisible: isVisible, isVisitable: isVisitable };
  }

  private isVisibleConstraintAction(action: string): boolean {
    return [
      'makeThisComponentNotVisible',
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

  evaluateConstraint(constraint: any): boolean {
    const removalCriteria = constraint.removalCriteria;
    return (
      removalCriteria == null ||
      this.evaluateMultipleRemovalCriteria(removalCriteria, constraint.removalConditional)
    );
  }

  private evaluateMultipleRemovalCriteria(
    multipleRemovalCriteria: any[],
    removalConditional: any
  ): boolean {
    return removalConditional === 'any'
      ? multipleRemovalCriteria.some((criteria) => this.evaluateCriteria(criteria))
      : multipleRemovalCriteria.every((criteria) => this.evaluateCriteria(criteria));
  }

  evaluateCriteria(criteria: any): boolean {
    const strategy = this.criteriaFunctionNameToStrategy[criteria.name];
    return strategy == null || this.evaluateStrategy(criteria, strategy);
  }

  private evaluateStrategy(criteria: any, strategy: ConstraintStrategy): boolean {
    this.evaluateConstraintContext.setStrategy(strategy);
    return this.evaluateConstraintContext.evaluate(criteria);
  }

  evaluateCriterias(criterias: any[]): boolean {
    return criterias.every((criteria) => this.evaluateCriteria(criteria));
  }

  getConstraintsThatAffectNode(node: any): any[] {
    if (!this.configService.getConfigParam('constraints')) {
      return [];
    }
    const constraints = [];
    const allConstraints = this.activeConstraints;
    for (const constraint of allConstraints) {
      if (this.isNodeAffectedByConstraint(node, constraint)) {
        constraints.push(constraint);
      }
    }
    return constraints;
  }

  /**
   * Check if a node is affected by the constraint
   * @param node check if the node is affected
   * @param constraint the constraint that might affect the node
   * @returns whether the node is affected by the constraint
   */
  private isNodeAffectedByConstraint(node: any, constraint: any): boolean {
    const cachedResult = this.getCachedIsNodeAffectedByConstraintResult(node.id, constraint.id);
    if (cachedResult != null) {
      return cachedResult;
    } else {
      let result = false;
      if (this.isNodeAfterConstraintAction(constraint.action)) {
        if (this.projectService.isNodeIdAfter(constraint.targetId, node.id)) {
          result = true;
        }
      } else {
        result = this.isNodeTargetOfConstraint(node, constraint.targetId);
      }
      this.cacheIsNodeAffectedByConstraintResult(node.id, constraint.id, result);
      return result;
    }
  }

  private isNodeAfterConstraintAction(action: string): boolean {
    return (
      action === 'makeAllNodesAfterThisNotVisible' || action === 'makeAllNodesAfterThisNotVisitable'
    );
  }

  private isNodeTargetOfConstraint(node: any, targetId: string) {
    const targetNode = this.projectService.getNodeById(targetId);
    return (
      targetNode != null &&
      ((targetNode.type === 'node' && node.id === targetId) ||
        (targetNode.type === 'group' &&
          (node.id === targetId || this.projectService.isNodeDescendentOfGroup(node, targetNode))))
    );
  }

  /**
   * Check if we have calculated the result for whether the node is affected by the constraint
   * @param nodeId the node id
   * @param constraintId the constraint id
   * @return Return the result if we have calculated the result before. If we have not calculated
   * the result before, we will return null.
   */
  private getCachedIsNodeAffectedByConstraintResult(nodeId: string, constraintId: string): boolean {
    return this.isNodeAffectedByConstraintResult[nodeId + '-' + constraintId];
  }

  /**
   * Remember the result for whether the node is affected by the constraint
   * @param nodeId the node id
   * @param constraintId the constraint id
   * @param whether the node is affected by the constraint
   */
  private cacheIsNodeAffectedByConstraintResult(
    nodeId: string,
    constraintId: string,
    result: boolean
  ): void {
    this.isNodeAffectedByConstraintResult[nodeId + '-' + constraintId] = result;
  }

  /**
   * Order the constraints so that they show up in the same order as in the project.
   * @param constraints An array of constraint objects
   * @return An array of ordered constraints
   */
  orderConstraints(constraints: any[]): any[] {
    const orderedNodeIds = this.projectService.getFlattenedProjectAsNodeIds();
    return constraints.sort(this.constraintsComparatorGenerator(orderedNodeIds));
  }

  /**
   * Create the constraints comparator function that is used for sorting an array of constraint
   * objects.
   * @param orderedNodeIds An array of node ids in the order in which they show up in the project.
   * @return A comparator that orders constraint objects in the order in which the target ids show
   * up in the project.
   */
  private constraintsComparatorGenerator(orderedNodeIds: string[]): any {
    return function (constraintA: any, constraintB: any) {
      const constraintAIndex = orderedNodeIds.indexOf(constraintA.targetId);
      const constraintBIndex = orderedNodeIds.indexOf(constraintB.targetId);
      return constraintAIndex - constraintBIndex;
    };
  }

  clearActiveConstraints(): void {
    this.activeConstraints = [];
    this.constraintsUpdatedSource.next();
  }

  hasActiveConstraints(): boolean {
    return this.activeConstraints.length > 0;
  }
}
