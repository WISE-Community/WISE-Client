import { Component, OnInit } from '@angular/core';
import { MultipleChoiceContent } from '../../../../components/multipleChoice/MultipleChoiceContent';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { UtilService } from '../../../../services/utilService';

@Component({
  selector: 'node-advanced-constraint-authoring',
  templateUrl: 'node-advanced-constraint-authoring.component.html',
  styleUrls: ['node-advanced-constraint-authoring.component.scss']
})
export class NodeAdvancedConstraintAuthoringComponent implements OnInit {
  constraintActions: any[];
  node: any;
  nodeId: string;
  nodeIds: string[];
  removalConditionals: any[];
  removalCriteria: any;

  constructor(
    private ProjectService: TeacherProjectService,
    private TeacherDataService: TeacherDataService,
    private UtilService: UtilService
  ) {
    this.constraintActions = [
      {
        value: '',
        text: $localize`Please Choose an Action`
      },
      {
        value: 'makeAllNodesAfterThisNotVisitable',
        text: $localize`Make all nodes after this not visitable`
      },
      {
        value: 'makeAllNodesAfterThisNotVisible',
        text: $localize`Make all nodes after this not visible`
      },
      {
        value: 'makeAllOtherNodesNotVisitable',
        text: $localize`Make all other nodes not visitable`
      },
      {
        value: 'makeAllOtherNodesNotVisible',
        text: $localize`Make all other nodes not visible`
      },
      {
        value: 'makeThisNodeNotVisitable',
        text: $localize`Make this node not visitable`
      },
      {
        value: 'makeThisNodeNotVisible',
        text: $localize`Make this node not visible`
      }
    ];
    this.removalConditionals = [
      {
        value: 'all',
        text: $localize`All`
      },
      {
        value: 'any',
        text: $localize`Any`
      }
    ];
    this.removalCriteria = [
      {
        value: '',
        text: $localize`Please Choose a Removal Criteria`
      },
      {
        value: 'isCompleted',
        text: $localize`Is Completed`,
        params: [
          {
            value: 'nodeId',
            text: $localize`Step`
          }
        ]
      },
      {
        value: 'score',
        text: $localize`Score`,
        params: [
          {
            value: 'nodeId',
            text: $localize`Step`
          },
          {
            value: 'componentId',
            text: $localize`Component`
          },
          {
            value: 'scores',
            text: $localize`Score(s)`
          }
        ]
      },
      {
        value: 'branchPathTaken',
        text: $localize`Branch Path Taken`,
        params: [
          {
            value: 'fromNodeId',
            text: $localize`From Step`
          },
          {
            value: 'toNodeId',
            text: $localize`To Step`
          }
        ]
      },
      {
        value: 'choiceChosen',
        text: $localize`Choice Chosen`,
        params: [
          {
            value: 'nodeId',
            text: $localize`Step`
          },
          {
            value: 'componentId',
            text: $localize`Component`
          },
          {
            value: 'choiceIds',
            text: $localize`Choices`
          }
        ]
      },
      {
        value: 'isCorrect',
        text: $localize`Is Correct`,
        params: [
          {
            value: 'nodeId',
            text: $localize`Step`
          },
          {
            value: 'componentId',
            text: $localize`Component`
          }
        ]
      },
      {
        value: 'usedXSubmits',
        text: $localize`Used X Submits`,
        params: [
          {
            value: 'nodeId',
            text: $localize`Step`
          },
          {
            value: 'componentId',
            text: $localize`Component`
          },
          {
            value: 'requiredSubmitCount',
            text: $localize`Required Submit Count`
          }
        ]
      },
      {
        value: 'isVisible',
        text: $localize`Is Visible`,
        params: [
          {
            value: 'nodeId',
            text: $localize`Step`
          }
        ]
      },
      {
        value: 'isVisitable',
        text: $localize`Is Visitable`,
        params: [
          {
            value: 'nodeId',
            text: $localize`Step`
          }
        ]
      },
      {
        value: 'isVisited',
        text: $localize`Is Visited`,
        params: [
          {
            value: 'nodeId',
            text: $localize`Step`
          }
        ]
      },
      {
        value: 'wroteXNumberOfWords',
        text: $localize`Wrote X Number of Words`,
        params: [
          {
            value: 'nodeId',
            text: $localize`Step`
          },
          {
            value: 'componentId',
            text: $localize`Component`
          },
          {
            value: 'requiredNumberOfWords',
            text: $localize`Required Number of Words`
          }
        ]
      },
      {
        value: 'addXNumberOfNotesOnThisStep',
        text: $localize`Add X Number of Notes On This Step`,
        params: [
          {
            value: 'nodeId',
            text: $localize`Step`
          },
          {
            value: 'requiredNumberOfNotes',
            text: $localize`Required Number of Notes`
          }
        ]
      },
      {
        value: 'fillXNumberOfRows',
        text: $localize`Fill X Number of Rows`,
        params: [
          {
            value: 'nodeId',
            text: $localize`Step`
          },
          {
            value: 'componentId',
            text: $localize`Component`
          },
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
      {
        value: 'teacherRemoval',
        text: $localize`Teacher Removes Constraint`,
        params: []
      }
    ];
  }

  ngOnInit() {
    this.nodeIds = this.ProjectService.getFlattenedProjectAsNodeIds(true);
    this.nodeId = this.TeacherDataService.getCurrentNodeId();
    this.node = this.ProjectService.getNodeById(this.nodeId);
  }

  addConstraintAndScrollToBottom(): void {
    const newNodeConstraintId = this.addConstraint();
    setTimeout(() => {
      this.ProjectService.scrollToBottomOfPage();
      this.UtilService.temporarilyHighlightElement(newNodeConstraintId);
    });
  }

  addConstraint(): string {
    const newNodeConstraintId = this.getNewNodeConstraintId(this.nodeId);
    const constraint = {
      id: newNodeConstraintId,
      action: '',
      targetId: this.nodeId,
      removalConditional: 'any',
      removalCriteria: [
        {
          name: '',
          params: {}
        }
      ]
    };
    if (this.node.constraints == null) {
      this.node.constraints = [];
    }
    this.node.constraints.push(constraint);
    this.ProjectService.saveProject();
    return newNodeConstraintId;
  }

  getNewNodeConstraintId(nodeId: string): string {
    let newNodeConstraintId = null;
    const usedConstraintIds = [];
    const node = this.ProjectService.getNodeById(nodeId);
    if (node != null && node.constraints != null) {
      for (const constraint of node.constraints) {
        if (constraint != null) {
          usedConstraintIds.push(constraint.id);
        }
      }
    }
    let constraintCounter = 1;
    while (newNodeConstraintId == null) {
      let potentialNewNodeConstraintId = nodeId + 'Constraint' + constraintCounter;
      if (usedConstraintIds.indexOf(potentialNewNodeConstraintId) == -1) {
        newNodeConstraintId = potentialNewNodeConstraintId;
      } else {
        constraintCounter++;
      }
    }
    return newNodeConstraintId;
  }

  deleteConstraint(constraintIndex): void {
    if (confirm($localize`Are you sure you want to delete this constraint?`)) {
      const node = this.ProjectService.getNodeById(this.nodeId);
      const constraints = node.constraints;
      if (constraints != null) {
        constraints.splice(constraintIndex, 1);
      }
      this.ProjectService.saveProject();
    }
  }

  addRemovalCriteria(constraint: any): void {
    const removalCriteria = {
      name: '',
      params: {}
    };
    constraint.removalCriteria.push(removalCriteria);
    this.ProjectService.saveProject();
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
          criteria.params[value] = this.nodeId;
        }
      }
    }
    this.ProjectService.saveProject();
  }

  getRemovalCriteriaParamsByName(name: string): any[] {
    for (const singleRemovalCriteria of this.removalCriteria) {
      if (singleRemovalCriteria.value === name) {
        return singleRemovalCriteria.params;
      }
    }
    return [];
  }

  constraintRemovalCriteriaNodeIdChanged(criteria: any): void {
    criteria.params.componentId = '';
    this.ProjectService.saveProject();
  }

  constraintRemovalCriteriaComponentIdChanged() {
    this.ProjectService.saveProject();
  }

  deleteRemovalCriteria(constraint: any, removalCriteriaIndex: number): void {
    if (confirm($localize`Are you sure you want to delete this removal criteria?`)) {
      const removalCriteria = constraint.removalCriteria;
      if (removalCriteria != null) {
        removalCriteria.splice(removalCriteriaIndex, 1);
      }
      this.ProjectService.saveProject();
    }
  }

  getChoices(nodeId: string, componentId: string): any[] {
    return this.ProjectService.getChoices(nodeId, componentId);
  }

  getChoiceTypeByNodeIdAndComponentId(nodeId: string, componentId: string): string {
    let choiceType = null;
    let component = this.ProjectService.getComponent(nodeId, componentId) as MultipleChoiceContent;
    if (component != null && component.choiceType != null) {
      choiceType = component.choiceType;
    }
    return choiceType;
  }

  getComponents(nodeId: string): any[] {
    return this.ProjectService.getComponents(nodeId);
  }

  getNodeTitle(nodeId: string): string {
    return this.ProjectService.getNodeTitle(nodeId);
  }

  getNodePositionById(nodeId: string): string {
    return this.ProjectService.getNodePositionById(nodeId);
  }

  scoresChanged(value: any, params: any): void {
    params.scores = value.split(',');
    this.ProjectService.saveProject();
  }

  saveProject(): void {
    this.ProjectService.saveProject();
  }
}
