import { Component, Input, OnInit } from '@angular/core';
import { MultipleChoiceContent } from '../../../components/multipleChoice/MultipleChoiceContent';
import { TeacherDataService } from '../../../services/teacherDataService';
import { TeacherProjectService } from '../../../services/teacherProjectService';

@Component({
  selector: 'constraint-authoring',
  templateUrl: './constraint-authoring.component.html',
  styleUrls: ['./constraint-authoring.component.scss']
})
export class ConstraintAuthoringComponent implements OnInit {
  @Input() constraint: any;
  constraintActions = [
    { value: '', text: $localize`Please Choose an Action` },
    {
      value: 'makeAllNodesAfterThisNotVisitable',
      text: $localize`Make all nodes after this not visitable`
    },
    {
      value: 'makeAllNodesAfterThisNotVisible',
      text: $localize`Make all nodes after this not visible`
    },
    { value: 'makeAllOtherNodesNotVisitable', text: $localize`Make all other nodes not visitable` },
    { value: 'makeAllOtherNodesNotVisible', text: $localize`Make all other nodes not visible` },
    { value: 'makeThisNodeNotVisitable', text: $localize`Make this node not visitable` },
    { value: 'makeThisNodeNotVisible', text: $localize`Make this node not visible` }
  ];
  node: any;
  nodeIds: string[];
  removalConditionals = [
    { value: 'all', text: $localize`All` },
    { value: 'any', text: $localize`Any` }
  ];
  removalCriteria = [
    { value: '', text: $localize`Please Choose a Removal Criteria` },
    {
      value: 'isCompleted',
      text: $localize`Is Completed`,
      params: [{ value: 'nodeId', text: $localize`Step` }]
    },
    {
      value: 'score',
      text: $localize`Score`,
      params: [
        { value: 'nodeId', text: $localize`Step` },
        { value: 'componentId', text: $localize`Component` },
        { value: 'scores', text: $localize`Score(s)` }
      ]
    },
    {
      value: 'branchPathTaken',
      text: $localize`Branch Path Taken`,
      params: [
        { value: 'fromNodeId', text: $localize`From Step` },
        { value: 'toNodeId', text: $localize`To Step` }
      ]
    },
    {
      value: 'choiceChosen',
      text: $localize`Choice Chosen`,
      params: [
        { value: 'nodeId', text: $localize`Step` },
        { value: 'componentId', text: $localize`Component` },
        { value: 'choiceIds', text: $localize`Choices` }
      ]
    },
    {
      value: 'isCorrect',
      text: $localize`Is Correct`,
      params: [
        { value: 'nodeId', text: $localize`Step` },
        { value: 'componentId', text: $localize`Component` }
      ]
    },
    {
      value: 'usedXSubmits',
      text: $localize`Used X Submits`,
      params: [
        { value: 'nodeId', text: $localize`Step` },
        { value: 'componentId', text: $localize`Component` },
        { value: 'requiredSubmitCount', text: $localize`Required Submit Count` }
      ]
    },
    {
      value: 'isVisible',
      text: $localize`Is Visible`,
      params: [{ value: 'nodeId', text: $localize`Step` }]
    },
    {
      value: 'isVisitable',
      text: $localize`Is Visitable`,
      params: [{ value: 'nodeId', text: $localize`Step` }]
    },
    {
      value: 'isVisited',
      text: $localize`Is Visited`,
      params: [{ value: 'nodeId', text: $localize`Step` }]
    },
    {
      value: 'wroteXNumberOfWords',
      text: $localize`Wrote X Number of Words`,
      params: [
        { value: 'nodeId', text: $localize`Step` },
        { value: 'componentId', text: $localize`Component` },
        { value: 'requiredNumberOfWords', text: $localize`Required Number of Words` }
      ]
    },
    {
      value: 'addXNumberOfNotesOnThisStep',
      text: $localize`Add X Number of Notes On This Step`,
      params: [
        { value: 'nodeId', text: $localize`Step` },
        { value: 'requiredNumberOfNotes', text: $localize`Required Number of Notes` }
      ]
    },
    {
      value: 'fillXNumberOfRows',
      text: $localize`Fill X Number of Rows`,
      params: [
        { value: 'nodeId', text: $localize`Step` },
        { value: 'componentId', text: $localize`Component` },
        {
          value: 'requiredNumberOfFilledRows',
          defaultValue: null,
          text: $localize`Required Number of Filled Rows (Not Including Header Row)`
        },
        {
          value: 'tableHasHeaderRow',
          defaultValue: true,
          text: $localize`Table Has Header Row`
        },
        {
          value: 'requireAllCellsInARowToBeFilled',
          defaultValue: true,
          text: $localize`Require All Cells In a Row To Be Filled`
        }
      ]
    },
    { value: 'teacherRemoval', text: $localize`Teacher Removes Constraint`, params: [] }
  ];

  constructor(
    private dataService: TeacherDataService,
    private projectService: TeacherProjectService
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
    if (params != null) {
      for (const paramObject of params) {
        const value = paramObject.value;
        if (paramObject.hasOwnProperty('defaultValue')) {
          criteria.params[value] = paramObject.defaultValue;
        } else {
          criteria.params[value] = '';
        }
        if (value === 'nodeId') {
          criteria.params[value] = this.node.id;
        }
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

  protected constraintRemovalCriteriaComponentIdChanged(): void {
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
