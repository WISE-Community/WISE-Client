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

  getConstraintDescriptions(nodeId: string): string {
    let constraintDescriptions = '';
    const constraints = this.projectService.getNode(nodeId).getConstraints();
    for (let c = 0; c < constraints.length; c++) {
      const constraint = constraints[c];
      const description = this.getConstraintDescription(constraint);
      constraintDescriptions += c + 1 + ' - ' + description + '\n';
    }
    return constraintDescriptions;
  }

  /**
   * Get the human readable description of the constraint.
   * @param constraint The constraint object.
   * @returns A human readable text string that describes the constraint.
   * example
   * 'All steps after this one will not be visitable until the student completes
   * "3.7 Revise Your Bowls Explanation"'
   */
  private getConstraintDescription(constraint: any): string {
    let message = '';
    for (const singleRemovalCriteria of constraint.removalCriteria) {
      if (message != '') {
        // this constraint has multiple removal criteria
        if (constraint.removalConditional === 'any') {
          message += ' or ';
        } else if (constraint.removalConditional === 'all') {
          message += ' and ';
        }
      }
      message += this.getCriteriaMessage(singleRemovalCriteria);
    }
    return this.getActionMessage(constraint.action) + message;
  }

  /**
   * Get the message that describes how to satisfy the criteria
   * TODO: check if the criteria is satisfied
   * @param criteria the criteria object that needs to be satisfied
   * @returns the message to display to the student that describes how to
   * satisfy the criteria
   */
  getCriteriaMessage(criteria: any): string {
    let message = '';
    const name = criteria.name;
    const params = criteria.params;

    if (name === 'isCompleted') {
      const nodeId = params.nodeId;
      if (nodeId != null) {
        const nodeTitle = this.projectService.getNodePositionAndTitle(nodeId);
        message += $localize`Complete <b>${nodeTitle}</b>`;
      }
    } else if (name === 'isVisited') {
      const nodeId = params.nodeId;
      if (nodeId != null) {
        const nodeTitle = this.projectService.getNodePositionAndTitle(nodeId);
        message += $localize`Visit <b>${nodeTitle}</b>`;
      }
    } else if (name === 'isCorrect') {
      const nodeId = params.nodeId;
      if (nodeId != null) {
        const nodeTitle = this.projectService.getNodePositionAndTitle(nodeId);
        message += $localize`Correctly answer <b>${nodeTitle}</b>`;
      }
    } else if (name === 'score') {
      const nodeId = params.nodeId;
      let nodeTitle = '';
      let scoresString = '';

      if (nodeId != null) {
        nodeTitle = this.projectService.getNodePositionAndTitle(nodeId);
      }

      const scores = params.scores;
      if (scores != null) {
        scoresString = scores.join(', ');
      }
      message += $localize`Obtain a score of <b>${scoresString}</b> on <b>${nodeTitle}</b>`;
    } else if (name === 'choiceChosen') {
      const nodeId = params.nodeId;
      const componentId = params.componentId;
      const choiceIds = params.choiceIds;
      let nodeTitle = this.projectService.getNodePositionAndTitle(nodeId);
      let choices = this.projectService.getChoiceText(nodeId, componentId, choiceIds);
      let choiceText = choices.join(', ');
      message += $localize`You must choose "${choiceText}" on "${nodeTitle}"`;
    } else if (name === 'usedXSubmits') {
      const nodeId = params.nodeId;
      let nodeTitle = '';

      const requiredSubmitCount = params.requiredSubmitCount;

      if (nodeId != null) {
        nodeTitle = this.projectService.getNodePositionAndTitle(nodeId);
      }

      if (requiredSubmitCount == 1) {
        message += $localize`Submit <b>${requiredSubmitCount}</b> time on <b>${nodeTitle}</b>`;
      } else {
        message += $localize`Submit <b>${requiredSubmitCount}</b> times on <b>${nodeTitle}</b>`;
      }
    } else if (name === 'branchPathTaken') {
      const fromNodeId = params.fromNodeId;
      const fromNodeTitle = this.projectService.getNodePositionAndTitle(fromNodeId);
      const toNodeId = params.toNodeId;
      const toNodeTitle = this.projectService.getNodePositionAndTitle(toNodeId);
      message += $localize`Take the branch path from <b>${fromNodeTitle}</b> to <b>${toNodeTitle}</b>`;
    } else if (name === 'wroteXNumberOfWords') {
      const nodeId = params.nodeId;
      if (nodeId != null) {
        const requiredNumberOfWords = params.requiredNumberOfWords;
        const nodeTitle = this.projectService.getNodePositionAndTitle(nodeId);
        message += $localize`Write <b>${requiredNumberOfWords}</b> words on <b>${nodeTitle}</b>`;
      }
    } else if (name === 'isVisible') {
      const nodeId = params.nodeId;
      if (nodeId != null) {
        const nodeTitle = this.projectService.getNodePositionAndTitle(nodeId);
        message += $localize`"${nodeTitle}" is visible`;
      }
    } else if (name === 'isVisitable') {
      const nodeId = params.nodeId;
      if (nodeId != null) {
        const nodeTitle = this.projectService.getNodePositionAndTitle(nodeId);
        message += $localize`"${nodeTitle}" is visitable`;
      }
    } else if (name === 'addXNumberOfNotesOnThisStep') {
      const nodeId = params.nodeId;
      const requiredNumberOfNotes = params.requiredNumberOfNotes;
      const nodeTitle = this.projectService.getNodePositionAndTitle(nodeId);
      if (requiredNumberOfNotes == 1) {
        message += $localize`Add <b>${requiredNumberOfNotes}</b> note on <b>${nodeTitle}</b>`;
      } else {
        message += $localize`Add <b>${requiredNumberOfNotes}</b> notes on <b>${nodeTitle}</b>`;
      }
    } else if (name === 'fillXNumberOfRows') {
      const requiredNumberOfFilledRows = params.requiredNumberOfFilledRows;
      const nodeId = params.nodeId;
      const nodeTitle = this.projectService.getNodePositionAndTitle(nodeId);
      if (requiredNumberOfFilledRows == 1) {
        message += $localize`You must fill in <b>${requiredNumberOfFilledRows}</b> row in the <b>Table</b> on <b>${nodeTitle}</b>`;
      } else {
        message += $localize`You must fill in <b>${requiredNumberOfFilledRows}</b> rows in the <b>Table</b> on <b>${nodeTitle}</b>`;
      }
    } else if (name === 'teacherRemoval') {
      message += $localize`Wait for your teacher to unlock the item`;
    }
    return message;
  }

  /**
   * Get the constraint action as human readable text.
   * @param action A constraint action.
   * @return A human readable text string that describes the action
   * example
   * 'All steps after this one will not be visitable until '
   */
  private getActionMessage(action: string): string {
    if (action === 'makeAllNodesAfterThisNotVisitable') {
      return $localize`All steps after this one will not be visitable until `;
    }
    if (action === 'makeAllNodesAfterThisNotVisible') {
      return $localize`All steps after this one will not be visible until `;
    }
    if (action === 'makeAllOtherNodesNotVisitable') {
      return $localize`All other steps will not be visitable until `;
    }
    if (action === 'makeAllOtherNodesNotVisible') {
      return $localize`All other steps will not be visible until `;
    }
    if (action === 'makeThisNodeNotVisitable') {
      return $localize`This step will not be visitable until `;
    }
    if (action === 'makeThisNodeNotVisible') {
      return $localize`This step will not be visible until `;
    }
  }
}
