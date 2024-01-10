import { Component, OnInit } from '@angular/core';
import { MultipleChoiceContent } from '../../../../components/multipleChoice/MultipleChoiceContent';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { TeacherProjectService } from '../../../../services/teacherProjectService';

@Component({
  selector: 'node-advanced-path-authoring',
  templateUrl: 'node-advanced-path-authoring.component.html',
  styleUrls: ['node-advanced-path-authoring.component.scss']
})
export class NodeAdvancedPathAuthoringComponent implements OnInit {
  canChangePathOptions = [
    { value: true, text: $localize`True` },
    { value: false, text: $localize`False` }
  ];
  howToChooseAmongAvailablePathsOptions = [
    { value: 'random', text: $localize`Random` },
    { value: 'workgroupId', text: $localize`Workgroup ID` },
    { value: 'firstAvailable', text: $localize`First Available` },
    { value: 'lastAvailable', text: $localize`Last Available` },
    { value: 'tag', text: $localize`Tag` }
  ];
  items: any[];
  node: any;
  nodeId: string;
  nodeIds: string[];
  transitionCriterias = [
    {
      value: 'score',
      text: $localize`Get a specific score on a component`,
      params: [
        { value: 'nodeId', text: $localize`Node ID` },
        { value: 'componentId', text: $localize`Component ID` },
        { value: 'scores', text: $localize`Scores(s)` },
        { value: 'scoreId', text: $localize`Score ID (Optional)` }
      ]
    },
    {
      value: 'choiceChosen',
      text: $localize`Choose a specific choice on a component`,
      params: [
        { value: 'nodeId', text: $localize`Node ID` },
        { value: 'componentId', text: $localize`Component ID` },
        { value: 'choiceIds', text: $localize`Choices` }
      ]
    },
    {
      value: 'tag',
      text: $localize`Have Tag Assigned To Workgroup`,
      params: [{ value: 'tag', text: $localize`Tag` }]
    }
  ];
  whenToChoosePathOptions = [
    { value: 'enterNode', text: $localize`Enter Node` },
    { value: 'exitNode', text: $localize`Exit Node` },
    { value: 'scoreChanged', text: $localize`Score Changed` },
    { value: 'studentDataChanged', text: $localize`Student Data Changed` }
  ];

  constructor(
    private ProjectService: TeacherProjectService,
    private TeacherDataService: TeacherDataService
  ) {}

  ngOnInit() {
    this.nodeId = this.TeacherDataService.getCurrentNodeId();
    this.node = this.ProjectService.getNodeById(this.nodeId);
    this.nodeIds = this.ProjectService.getFlattenedProjectAsNodeIds(true);
  }

  addNewTransition() {
    this.addNewTransitionsIfNeeded();
    const nodeTransitions = this.node.transitionLogic.transitions;
    if (nodeTransitions.length > 0) {
      const lastNodeTransition = nodeTransitions[nodeTransitions.length - 1];
      const newTransition = {
        to: lastNodeTransition.to
      };
      nodeTransitions.push(newTransition);
    } else {
      const newTransition = {
        to: this.nodeId
      };
      nodeTransitions.push(newTransition);
    }
    if (this.isABranchNode()) {
      this.setDefaultBranchNodeTransitionLogic();
    }
    this.saveProject();
  }

  isABranchNode() {
    return this.node.transitionLogic.transitions.length > 1;
  }

  setDefaultBranchNodeTransitionLogic() {
    if (this.node.transitionLogic.howToChooseAmongAvailablePaths == null) {
      this.node.transitionLogic.howToChooseAmongAvailablePaths = 'workgroupId';
    }
    if (this.node.transitionLogic.whenToChoosePath == null) {
      this.node.transitionLogic.whenToChoosePath = 'enterNode';
    }
    if (this.node.transitionLogic.canChangePath == null) {
      this.node.transitionLogic.canChangePath = false;
    }
    if (this.node.transitionLogic.maxPathsVisitable == null) {
      this.node.transitionLogic.maxPathsVisitable = 1;
    }
  }

  addNewTransitionsIfNeeded() {
    if (this.node.transitionLogic.transitions == null) {
      this.node.transitionLogic.transitions = [];
    }
  }

  addNewTransitionCriteria(transition) {
    for (const nodeTransition of this.node.transitionLogic.transitions) {
      if (nodeTransition == transition) {
        if (nodeTransition.criteria == null) {
          nodeTransition.criteria = [];
        }
        const newTransitionCriteria = {
          name: '',
          params: {
            nodeId: '',
            componentId: ''
          }
        };
        nodeTransition.criteria.push(newTransitionCriteria);
      }
    }
    this.saveProject();
  }

  deleteTransitionCriteria(transition, transitionCriteriaIndex) {
    if (confirm($localize`Are you sure you want to delete this requirement?`)) {
      const transitionCriterias = transition.criteria;
      if (transitionCriterias != null) {
        transitionCriterias.splice(transitionCriteriaIndex, 1);
      }
      this.ProjectService.saveProject();
    }
  }

  getTransitionCriteriaParamsByName(name) {
    for (const singleTransitionCriteria of this.transitionCriterias) {
      if (singleTransitionCriteria.value === name) {
        return singleTransitionCriteria.params;
      }
    }
    return [];
  }

  transitionCriteriaNameChanged(transitionCriteria) {
    let nodeId = null;
    let componentId = null;
    if (transitionCriteria.params != null) {
      nodeId = transitionCriteria.params.nodeId;
      componentId = transitionCriteria.params.componentId;
    }
    transitionCriteria.params = {};
    if (nodeId != null) {
      transitionCriteria.params.nodeId = nodeId;
    }
    if (componentId != null) {
      transitionCriteria.params.componentId = componentId;
    }
    this.saveProject();
  }

  transitionCriteriaNodeIdChanged(transitionCriteria) {
    if (transitionCriteria != null && transitionCriteria.params != null) {
      let nodeId = transitionCriteria.params.nodeId;
      transitionCriteria.params = {};
      if (nodeId != null) {
        transitionCriteria.params.nodeId = nodeId;
      }
    }
    this.saveProject();
  }

  transitionCriteriaComponentIdChanged(transitionCriteria) {
    if (transitionCriteria != null && transitionCriteria.params != null) {
      let nodeId = transitionCriteria.params.nodeId;
      let componentId = transitionCriteria.params.componentId;
      transitionCriteria.params = {};
      if (nodeId != null) {
        transitionCriteria.params.nodeId = nodeId;
      }
      if (componentId != null) {
        transitionCriteria.params.componentId = componentId;
      }
    }
    this.saveProject();
  }

  transitionToNodeIdChanged() {
    this.ProjectService.calculateNodeNumbers();
    this.saveProject();
  }

  deleteTransition(transition) {
    const stepTitle = this.ProjectService.getNodePositionAndTitle(transition.to);
    const answer = confirm($localize`Are you sure you want to delete this path to "${stepTitle}"?`);
    if (answer) {
      this.ProjectService.deleteTransition(this.node, transition);
      this.saveProject();
    }
  }

  saveProject() {
    return this.ProjectService.saveProject();
  }

  getChoices(nodeId: string, componentId: string): any[] {
    return this.ProjectService.getChoices(nodeId, componentId);
  }

  getChoiceTypeByNodeIdAndComponentId(nodeId, componentId) {
    let choiceType = null;
    let component = this.ProjectService.getComponent(nodeId, componentId) as MultipleChoiceContent;
    if (component != null && component.choiceType != null) {
      choiceType = component.choiceType;
    }
    return choiceType;
  }

  getNodeTitle(nodeId: string): string {
    return this.ProjectService.getNodeTitle(nodeId);
  }

  getNodePositionById(nodeId) {
    return this.ProjectService.getNodePositionById(nodeId);
  }

  isGroupNode(nodeId) {
    return this.ProjectService.isGroupNode(nodeId);
  }

  getComponents(nodeId: string): any[] {
    return this.ProjectService.getComponents(nodeId);
  }

  scoresChanged(value: any, params: any): void {
    params.scores = value.split(',');
    this.saveProject();
  }

  scoreIdChanged(transitionCriteria: any): void {
    if (transitionCriteria.params.scoreId === '') {
      delete transitionCriteria.params.scoreId;
    }
    this.saveProject();
  }
}
