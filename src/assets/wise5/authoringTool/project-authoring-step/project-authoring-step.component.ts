import { Component, EventEmitter, Input, Output, Signal } from '@angular/core';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { TeacherDataService } from '../../services/teacherDataService';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectNodeEvent } from '../domain/select-node-event';
import { NodeTypeSelected } from '../domain/node-type-selected';
import { DeleteNodeService } from '../../services/deleteNodeService';
import { CopyNodesService } from '../../services/copyNodesService';
import { DeleteTranslationsService } from '../../services/deleteTranslationsService';

@Component({
  selector: 'project-authoring-step',
  templateUrl: './project-authoring-step.component.html',
  styleUrls: ['./project-authoring-step.component.scss']
})
export class ProjectAuthoringStepComponent {
  protected nodeTypeSelected: Signal<NodeTypeSelected>;
  @Input() projectId: number;
  @Output() selectNodeEvent: EventEmitter<SelectNodeEvent> = new EventEmitter<SelectNodeEvent>();
  @Input() showPosition: boolean;
  @Input() step: any;

  constructor(
    private copyNodesService: CopyNodesService,
    private dataService: TeacherDataService,
    private deleteNodeService: DeleteNodeService,
    private deleteTranslationService: DeleteTranslationsService,
    private projectService: TeacherProjectService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.nodeTypeSelected = this.projectService.getNodeTypeSelected();
  }

  protected selectNode(checked: boolean): void {
    this.projectService.setNodeTypeSelected(checked ? NodeTypeSelected.step : null);
    this.selectNodeEvent.emit({ id: this.step.id, checked: checked });
  }

  protected isNodeInAnyBranchPath(nodeId: string): boolean {
    return this.projectService.isNodeInAnyBranchPath(nodeId);
  }

  protected getNumberOfBranchPaths(nodeId: string): number {
    return this.projectService.getNumberOfBranchPaths(nodeId);
  }

  protected getBranchCriteriaDescription(nodeId: string): string {
    return this.projectService.getBranchCriteriaDescription(nodeId);
  }

  protected getStepBackgroundColor(nodeId: string): string {
    return this.projectService.getBackgroundColor(nodeId);
  }

  protected setCurrentNode(nodeId: string): void {
    this.dataService.setCurrentNodeByNodeId(nodeId);
  }

  protected isBranchPoint(nodeId: string): boolean {
    return this.projectService.isBranchPoint(nodeId);
  }

  protected nodeHasConstraint(nodeId: string): boolean {
    return this.projectService.nodeHasConstraint(nodeId);
  }

  protected getNumberOfConstraintsOnNode(nodeId: string): number {
    return this.projectService.getConstraintsOnNode(nodeId).length;
  }

  protected nodeHasRubric(nodeId: string): boolean {
    return this.projectService.nodeHasRubric(nodeId);
  }

  protected getConstraintDescriptions(nodeId: string): string {
    let constraintDescriptions = '';
    const constraints = this.projectService.getConstraintsOnNode(nodeId);
    for (let c = 0; c < constraints.length; c++) {
      let constraint = constraints[c];
      let description = this.projectService.getConstraintDescription(constraint);
      constraintDescriptions += c + 1 + ' - ' + description + '\n';
    }
    return constraintDescriptions;
  }

  protected constraintIconClicked(nodeId: string): void {
    this.dataService.setCurrentNodeByNodeId(nodeId);
    this.router.navigate([
      `/teacher/edit/unit/${this.projectId}/node/${nodeId}/advanced/constraint`
    ]);
  }

  protected branchIconClicked(nodeId: string): void {
    this.dataService.setCurrentNodeByNodeId(nodeId);
    this.router.navigate([`/teacher/edit/unit/${this.projectId}/node/${nodeId}/advanced/path`]);
  }

  protected move(): void {
    this.router.navigate(['choose-move-location'], {
      relativeTo: this.route,
      state: { selectedNodeIds: [this.step.id] }
    });
  }

  protected copy(): void {
    this.copyNodesService.copyNodesAfter([this.step.id], this.step.id);
    this.saveAndRefreshProject();
  }

  protected delete(): void {
    if (confirm($localize`Are you sure you want to delete this step?`)) {
      const components = this.step.components; // get the components before they're removed by the following line
      this.deleteNodeService.deleteNode(this.step.id);
      this.saveAndRefreshProject();
      if (this.projectService.getLocale().hasTranslations()) {
        this.deleteTranslationService.deleteComponents(components);
      }
    }
  }

  private saveAndRefreshProject(): void {
    this.projectService.saveProject();
    this.projectService.refreshProject();
  }
}
