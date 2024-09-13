import { Component, EventEmitter, Input, Output, Signal } from '@angular/core';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { TeacherDataService } from '../../services/teacherDataService';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectNodeEvent } from '../domain/select-node-event';
import { NodeTypeSelected } from '../domain/node-type-selected';
import { DeleteNodeService } from '../../services/deleteNodeService';
import { CopyNodesService } from '../../services/copyNodesService';
import { DeleteTranslationsService } from '../../services/deleteTranslationsService';
import { CopyTranslationsService } from '../../services/copyTranslationsService';
import { ConstraintService } from '../../services/constraintService';

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
    private copyTranslationsService: CopyTranslationsService,
    private constraintService: ConstraintService,
    private dataService: TeacherDataService,
    private deleteNodeService: DeleteNodeService,
    private deleteTranslationsService: DeleteTranslationsService,
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
    return this.projectService.getTransitionsByFromNodeId(nodeId).length;
  }

  /**
   * If this step is a branch point, we will return the criteria that is used
   * to determine which path the student gets assigned to.
   * @param nodeId The node id of the branch point.
   * @returns A human readable string containing the criteria of how students
   * are assigned branch paths on this branch point.
   */
  protected getBranchCriteriaDescription(nodeId: string): string {
    const transitionLogic = this.projectService.getNode(nodeId).getTransitionLogic();
    for (const transition of transitionLogic.transitions) {
      if (transition.criteria != null && transition.criteria.length > 0) {
        for (const singleCriteria of transition.criteria) {
          if (singleCriteria.name === 'choiceChosen') {
            return 'multiple choice';
          } else if (singleCriteria.name === 'score') {
            return 'score';
          }
        }
      }
    }

    /*
     * None of the transitions had a specific criteria so the branching is just
     * based on the howToChooseAmongAvailablePaths field.
     */
    if (transitionLogic.howToChooseAmongAvailablePaths === 'workgroupId') {
      return 'workgroup ID';
    } else if (transitionLogic.howToChooseAmongAvailablePaths === 'random') {
      return 'random assignment';
    }
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
    return this.getNumberOfConstraintsOnNode(nodeId) > 0;
  }

  protected getNumberOfConstraintsOnNode(nodeId: string): number {
    return this.projectService.getNode(nodeId).getConstraints().length;
  }

  protected nodeHasRubric(nodeId: string): boolean {
    return this.projectService.getNode(nodeId).getNumRubrics() > 0;
  }

  protected getConstraintDescriptions(nodeId: string): string {
    return this.constraintService.getConstraintDescriptions(nodeId);
  }

  protected constraintIconClicked(nodeId: string): void {
    this.dataService.setCurrentNodeByNodeId(nodeId);
    this.router.navigate([
      `/teacher/edit/unit/${this.projectId}/node/${nodeId}/advanced/constraint`
    ]);
  }

  protected goToEditBranch(nodeId: string): void {
    this.router.navigate(['edit-branch'], {
      relativeTo: this.route,
      state: {
        targetId: nodeId
      }
    });
  }

  protected move(): void {
    this.router.navigate(['choose-move-location'], {
      relativeTo: this.route,
      state: { selectedNodeIds: [this.step.id] }
    });
  }

  protected copy(): void {
    const newNodes = this.copyNodesService.copyNodesAfter([this.step.id], this.step.id);
    this.copyTranslationsService.tryCopyNodes(newNodes);
    this.saveAndRefreshProject();
  }

  protected delete(): void {
    if (confirm($localize`Are you sure you want to delete this step?`)) {
      // get the components before they're removed by the following line
      const components = this.step.components;
      this.deleteNodeService.deleteNode(this.step.id);
      this.saveAndRefreshProject();
      this.deleteTranslationsService.tryDeleteComponents(components);
    }
  }

  private saveAndRefreshProject(): void {
    this.projectService.saveProject();
    this.projectService.refreshProject();
  }
}
