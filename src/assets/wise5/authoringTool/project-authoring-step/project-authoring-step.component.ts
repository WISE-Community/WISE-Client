import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { TeacherDataService } from '../../services/teacherDataService';
import { Router } from '@angular/router';
import { SelectNodeEvent } from '../domain/select-node-event';
import { NodeTypeSelected } from '../domain/node-type-selected';

@Component({
  selector: 'project-authoring-step',
  templateUrl: './project-authoring-step.component.html',
  styleUrls: ['./project-authoring-step.component.scss']
})
export class ProjectAuthoringStepComponent {
  checked: boolean = false;
  @Input() nodeTypeSelected: NodeTypeSelected;
  @Input() projectId: number;
  @Output() selectNodeEvent: EventEmitter<SelectNodeEvent> = new EventEmitter<SelectNodeEvent>();
  @Input() showPosition: boolean;
  @Input() step: any;

  constructor(
    private dataService: TeacherDataService,
    private projectService: TeacherProjectService,
    private router: Router
  ) {}

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
}
