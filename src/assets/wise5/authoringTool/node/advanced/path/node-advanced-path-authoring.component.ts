import { Component, OnInit } from '@angular/core';
import { MultipleChoiceContent } from '../../../../components/multipleChoice/MultipleChoiceContent';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'node-advanced-path-authoring',
  templateUrl: 'node-advanced-path-authoring.component.html',
  styleUrls: ['node-advanced-path-authoring.component.scss']
})
export class NodeAdvancedPathAuthoringComponent implements OnInit {
  protected canChangePathOptions = [
    { value: true, text: $localize`True` },
    { value: false, text: $localize`False` }
  ];
  protected howToChooseAmongAvailablePathsOptions = [
    { value: 'random', text: $localize`Random` },
    { value: 'workgroupId', text: $localize`Workgroup ID` },
    { value: 'firstAvailable', text: $localize`First Available` },
    { value: 'lastAvailable', text: $localize`Last Available` },
    { value: 'tag', text: $localize`Tag` }
  ];
  protected items: any[];
  node: any;
  protected nodeId: string;
  protected nodeIds: string[];
  protected transitionCriterias = [
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
  protected whenToChoosePathOptions = [
    { value: 'enterNode', text: $localize`Enter Node` },
    { value: 'exitNode', text: $localize`Exit Node` },
    { value: 'scoreChanged', text: $localize`Score Changed` },
    { value: 'studentDataChanged', text: $localize`Student Data Changed` }
  ];

  constructor(
    private projectService: TeacherProjectService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.parent.parent.params.subscribe((params) => {
      this.node = this.projectService.getNodeById(params.nodeId);
      this.nodeIds = this.projectService.getFlattenedProjectAsNodeIds(true);
    });
  }

  addNewTransition(): void {
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

  protected isABranchNode(): boolean {
    return this.node.transitionLogic.transitions.length > 1;
  }

  protected setDefaultBranchNodeTransitionLogic(): void {
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

  protected addNewTransitionsIfNeeded(): void {
    if (this.node.transitionLogic.transitions == null) {
      this.node.transitionLogic.transitions = [];
    }
  }

  addNewTransitionCriteria(transition): void {
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

  deleteTransitionCriteria(transition, transitionCriteriaIndex): void {
    if (confirm($localize`Are you sure you want to delete this requirement?`)) {
      const transitionCriterias = transition.criteria;
      if (transitionCriterias != null) {
        transitionCriterias.splice(transitionCriteriaIndex, 1);
      }
      this.projectService.saveProject();
    }
  }

  protected getTransitionCriteriaParamsByName(name): any[] {
    for (const singleTransitionCriteria of this.transitionCriterias) {
      if (singleTransitionCriteria.value === name) {
        return singleTransitionCriteria.params;
      }
    }
    return [];
  }

  protected transitionCriteriaNameChanged(transitionCriteria): void {
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

  protected transitionCriteriaNodeIdChanged(transitionCriteria): void {
    if (transitionCriteria != null && transitionCriteria.params != null) {
      let nodeId = transitionCriteria.params.nodeId;
      transitionCriteria.params = {};
      if (nodeId != null) {
        transitionCriteria.params.nodeId = nodeId;
      }
    }
    this.saveProject();
  }

  protected transitionCriteriaComponentIdChanged(transitionCriteria): void {
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

  protected transitionToNodeIdChanged(): void {
    this.projectService.calculateNodeNumbers();
    this.saveProject();
  }

  deleteTransition(transition: any): void {
    const stepTitle = this.projectService.getNodePositionAndTitle(transition.to);
    const answer = confirm($localize`Are you sure you want to delete this path to "${stepTitle}"?`);
    if (answer) {
      this.projectService.getNode(this.node.id).deleteTransition(transition);
      this.saveProject();
    }
  }

  protected saveProject(): any {
    return this.projectService.saveProject();
  }

  protected getChoices(nodeId: string, componentId: string): any[] {
    return this.projectService.getChoices(nodeId, componentId);
  }

  protected getChoiceTypeByNodeIdAndComponentId(nodeId, componentId) {
    let choiceType = null;
    let component = this.projectService.getComponent(nodeId, componentId) as MultipleChoiceContent;
    if (component != null && component.choiceType != null) {
      choiceType = component.choiceType;
    }
    return choiceType;
  }

  protected getNodeTitle(nodeId: string): string {
    return this.projectService.getNodeTitle(nodeId);
  }

  protected getNodePositionById(nodeId) {
    return this.projectService.getNodePositionById(nodeId);
  }

  protected isGroupNode(nodeId) {
    return this.projectService.isGroupNode(nodeId);
  }

  protected getComponents(nodeId: string): any[] {
    return this.projectService.getComponents(nodeId);
  }

  protected scoresChanged(value: any, params: any): void {
    params.scores = value.split(',');
    this.saveProject();
  }

  protected scoreIdChanged(transitionCriteria: any): void {
    if (transitionCriteria.params.scoreId === '') {
      delete transitionCriteria.params.scoreId;
    }
    this.saveProject();
  }
}
