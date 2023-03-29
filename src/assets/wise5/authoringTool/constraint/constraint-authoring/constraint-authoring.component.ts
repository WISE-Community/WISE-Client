import { Directive, Input, OnInit } from '@angular/core';
import { RemovalCriteria } from '../../../../../app/domain/removalCriteria';
import { RemovalCriteriaParam } from '../../../../../app/domain/removalCriteriaParam';
import { MultipleChoiceContent } from '../../../components/multipleChoice/MultipleChoiceContent';
import { TeacherDataService } from '../../../services/teacherDataService';
import { TeacherProjectService } from '../../../services/teacherProjectService';

@Directive()
export abstract class ConstraintAuthoringComponent implements OnInit {
  REMOVAL_CRITERIA_COMPONENT_PARAM: RemovalCriteriaParam = new RemovalCriteriaParam(
    'componentId',
    $localize`Component`
  );
  REMOVAL_CRITERIA_STEP_PARAM: RemovalCriteriaParam = new RemovalCriteriaParam(
    'nodeId',
    $localize`Step`
  );

  @Input() constraint: any;
  constraintActions = [];
  node: any;
  nodeIds: string[];
  removalConditionals = [
    { value: 'all', text: $localize`All` },
    { value: 'any', text: $localize`Any` }
  ];
  removalCriteria = [
    new RemovalCriteria('', $localize`Please Choose a Removal Criteria`, []),
    new RemovalCriteria('isCompleted', $localize`Is Completed`, [this.REMOVAL_CRITERIA_STEP_PARAM]),
    new RemovalCriteria('score', $localize`Score`, [
      this.REMOVAL_CRITERIA_STEP_PARAM,
      this.REMOVAL_CRITERIA_COMPONENT_PARAM,
      new RemovalCriteriaParam('scores', $localize`Score(s)`)
    ]),
    new RemovalCriteria('branchPathTaken', $localize`Branch Path Taken`, [
      new RemovalCriteriaParam('fromNodeId', $localize`From Step`),
      new RemovalCriteriaParam('toNodeId', $localize`To Step`)
    ]),
    new RemovalCriteria('choiceChosen', $localize`Choice Chosen`, [
      this.REMOVAL_CRITERIA_STEP_PARAM,
      this.REMOVAL_CRITERIA_COMPONENT_PARAM,
      new RemovalCriteriaParam('choiceIds', $localize`Choices`)
    ]),
    new RemovalCriteria('isCorrect', $localize`Is Correct`, [
      this.REMOVAL_CRITERIA_STEP_PARAM,
      this.REMOVAL_CRITERIA_COMPONENT_PARAM
    ]),
    new RemovalCriteria('usedXSubmits', $localize`Used X Submits`, [
      this.REMOVAL_CRITERIA_STEP_PARAM,
      this.REMOVAL_CRITERIA_COMPONENT_PARAM,
      new RemovalCriteriaParam('requiredSubmitCount', $localize`Required Submit Count`)
    ]),
    new RemovalCriteria('isVisible', $localize`Is Visible`, [this.REMOVAL_CRITERIA_STEP_PARAM]),
    new RemovalCriteria('isVisitable', $localize`Is Visitable`, [this.REMOVAL_CRITERIA_STEP_PARAM]),
    new RemovalCriteria('isVisited', $localize`Is Visited`, [this.REMOVAL_CRITERIA_STEP_PARAM]),
    new RemovalCriteria('wroteXNumberOfWords', $localize`Wrote X Number of Words`, [
      this.REMOVAL_CRITERIA_STEP_PARAM,
      this.REMOVAL_CRITERIA_COMPONENT_PARAM,
      new RemovalCriteriaParam('requiredNumberOfWords', $localize`Required Number of Words`)
    ]),
    new RemovalCriteria(
      'addXNumberOfNotesOnThisStep',
      $localize`Add X Number of Notes On This Step`,
      [
        this.REMOVAL_CRITERIA_STEP_PARAM,
        new RemovalCriteriaParam('requiredNumberOfNotes', $localize`Required Number of Notes`)
      ]
    ),
    new RemovalCriteria('fillXNumberOfRows', $localize`Fill X Number of Rows`, [
      this.REMOVAL_CRITERIA_STEP_PARAM,
      this.REMOVAL_CRITERIA_COMPONENT_PARAM,
      new RemovalCriteriaParam(
        'requiredNumberOfFilledRows',
        $localize`Required Number of Filled Rows (Not Including Header Row)`
      ),
      new RemovalCriteriaParam('tableHasHeaderRow', $localize`Table Has Header Row`, true),
      new RemovalCriteriaParam(
        'requireAllCellsInARowToBeFilled',
        $localize`Require All Cells In a Row To Be Filled`,
        true
      )
    ]),
    new RemovalCriteria('teacherRemoval', $localize`Teacher Removes Constraint`, [])
  ];

  constructor(
    protected dataService: TeacherDataService,
    protected projectService: TeacherProjectService
  ) {}

  ngOnInit(): void {
    this.nodeIds = this.projectService.getFlattenedProjectAsNodeIds(true);
    this.node = this.projectService.getNodeById(this.dataService.getCurrentNodeId());
  }

  addRemovalCriteria(constraint: any): void {
    const removalCriteria = {
      name: '',
      params: {}
    };
    constraint.removalCriteria.push(removalCriteria);
    this.saveProject();
  }

  removalCriteriaNameChanged(criteria: any): void {
    criteria.params = {};
    const params = this.getRemovalCriteriaParamsByName(criteria.name);
    for (const paramObject of params) {
      const value = paramObject.value;
      criteria.params[value] = paramObject.defaultValue;
      if (value === 'nodeId') {
        criteria.params[value] = this.node.id;
      }
    }
    this.saveProject();
  }

  private getRemovalCriteriaParamsByName(name: string): any[] {
    for (const singleRemovalCriteria of this.removalCriteria) {
      if (singleRemovalCriteria.value === name) {
        return singleRemovalCriteria.params;
      }
    }
    return [];
  }

  protected constraintRemovalCriteriaNodeIdChanged(criteria: any): void {
    criteria.params.componentId = '';
    this.saveProject();
  }

  deleteRemovalCriteria(constraint: any, removalCriteriaIndex: number): void {
    if (confirm($localize`Are you sure you want to delete this removal criteria?`)) {
      constraint.removalCriteria.splice(removalCriteriaIndex, 1);
      this.saveProject();
    }
  }

  protected getChoices(nodeId: string, componentId: string): any[] {
    return this.projectService.getChoices(nodeId, componentId);
  }

  protected getChoiceTypeByNodeIdAndComponentId(nodeId: string, componentId: string): string {
    const component = this.projectService.getComponent(
      nodeId,
      componentId
    ) as MultipleChoiceContent;
    return component != null && component.choiceType != null ? component.choiceType : null;
  }

  protected getComponents(nodeId: string): any[] {
    return this.projectService.getComponents(nodeId);
  }

  protected getNodeTitle(nodeId: string): string {
    return this.projectService.getNodeTitle(nodeId);
  }

  protected getNodePositionById(nodeId: string): string {
    return this.projectService.getNodePositionById(nodeId);
  }

  protected scoresChanged(value: any, params: any): void {
    params.scores = value.split(',');
    this.saveProject();
  }

  protected saveProject(): void {
    this.projectService.saveProject();
  }
}
