import { Component, EventEmitter, Input, Output, Signal } from '@angular/core';
import { TeacherDataService } from '../../services/teacherDataService';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { SelectNodeEvent } from '../domain/select-node-event';
import { NodeTypeSelected } from '../domain/node-type-selected';
import { ExpandEvent } from '../domain/expand-event';
import { DeleteNodeService } from '../../services/deleteNodeService';
import { ActivatedRoute, Router } from '@angular/router';
import { temporarilyHighlightElement } from '../../common/dom/dom';

@Component({
  selector: 'project-authoring-lesson',
  templateUrl: './project-authoring-lesson.component.html',
  styleUrls: ['./project-authoring-lesson.component.scss']
})
export class ProjectAuthoringLessonComponent {
  @Input() expanded: boolean = true;
  @Output() onExpandedChanged: EventEmitter<ExpandEvent> = new EventEmitter<ExpandEvent>();
  protected idToNode: any = {};
  @Input() lesson: any;
  protected nodeTypeSelected: Signal<NodeTypeSelected>;
  @Input() projectId: number;
  @Output() selectNodeEvent: EventEmitter<SelectNodeEvent> = new EventEmitter<SelectNodeEvent>();
  @Input() showPosition: boolean;

  constructor(
    private dataService: TeacherDataService,
    private deleteNodeService: DeleteNodeService,
    private projectService: TeacherProjectService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.idToNode = this.projectService.idToNode;
    this.nodeTypeSelected = this.projectService.getNodeTypeSelected();
  }

  protected selectNode(checked: boolean): void {
    this.projectService.setNodeTypeSelected(checked ? NodeTypeSelected.lesson : null);
    this.selectNodeEvent.emit({ id: this.lesson.id, checked: checked });
  }

  protected setCurrentNode(nodeId: string): void {
    this.dataService.setCurrentNodeByNodeId(nodeId);
  }

  protected toggleExpanded(): void {
    this.expanded = !this.expanded;
    this.onExpandedChanged.emit({ id: this.lesson.id, expanded: this.expanded });
  }

  protected move(): void {
    this.router.navigate(['choose-move-location'], {
      relativeTo: this.route,
      state: { selectedNodeIds: [this.lesson.id] }
    });
  }

  protected delete(): void {
    if (confirm($localize`Are you sure you want to delete this lesson?`)) {
      this.deleteNodeService.deleteNode(this.lesson.id);
      this.saveAndRefreshProject();
    }
  }

  protected isFirstNodeInBranchPath(nodeId: string): boolean {
    return this.projectService.isFirstNodeInBranchPath(nodeId);
  }

  protected addStepBefore(nodeId: string): void {
    const newStep = this.createNewEmptyStep();
    if (this.projectService.isFirstStepInLesson(nodeId)) {
      this.projectService.createNodeInside(newStep, this.projectService.getParentGroupId(nodeId));
    } else {
      this.projectService.createNodeAfter(
        newStep,
        this.projectService.getPreviousStepNodeId(nodeId)
      );
    }
    this.updateProject(newStep.id);
  }

  protected addStepAfter(nodeId: string): void {
    const newStep = this.createNewEmptyStep();
    this.projectService.createNodeAfter(newStep, nodeId);
    this.updateProject(newStep.id);
  }

  protected addStepInside(nodeId: string): void {
    const newStep = this.createNewEmptyStep();
    this.projectService.createNodeInside(newStep, nodeId);
    this.updateProject(newStep.id);
  }

  private createNewEmptyStep(): any {
    return this.projectService.createNode('New Step');
  }

  private updateProject(newNodeId: string): void {
    this.projectService.checkPotentialStartNodeIdChangeThenSaveProject().then(() => {
      this.projectService.refreshProject();
      // This timeout is used to allow steps to have time to apply background color if they are in a
      // branch path
      setTimeout(() => {
        temporarilyHighlightElement(newNodeId);
      });
    });
  }

  private saveAndRefreshProject(): void {
    this.projectService.saveProject();
    this.projectService.refreshProject();
  }
}
