import { Component, Input } from '@angular/core';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { AddStepTarget } from '../../../../app/domain/addStepTarget';

@Component({
  selector: 'add-step-button',
  templateUrl: './add-step-button.component.html',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule]
})
export class AddStepButtonComponent {
  protected branchMergePoint: boolean;
  protected branchPathStep: boolean;
  protected branchPoint: boolean;
  @Input() nodeId: string;

  constructor(
    private projectService: TeacherProjectService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.branchPoint = this.projectService.isBranchPoint(this.nodeId);
    this.branchPathStep = this.projectService.isNodeInAnyBranchPath(this.nodeId);
    this.branchMergePoint = this.projectService.isBranchMergePoint(this.nodeId);
  }

  protected addStepBefore(): void {
    const previousNodes = this.projectService.getNodesByToNodeId(this.nodeId);
    if (previousNodes.length === 0) {
      this.goToAddStepViewForIn(this.projectService.getParentGroupId(this.nodeId));
    } else {
      const previousNodeId: string = previousNodes[0].id;
      if (this.projectService.isFirstNodeInBranchPath(this.nodeId)) {
        this.goToAddStepViewForFirstStepInBranchPath(previousNodeId, this.nodeId);
      } else {
        this.goToAddStepViewForAfter(previousNodeId);
      }
    }
  }

  private goToAddStepViewForIn(groupId: string): void {
    this.router.navigate(['add-node', 'choose-template'], {
      relativeTo: this.route,
      state: new AddStepTarget('in', groupId)
    });
  }

  protected goToAddStepViewForAfter(previousNodeId: string): void {
    this.router.navigate(['add-node', 'choose-template'], {
      relativeTo: this.route,
      state: new AddStepTarget('after', previousNodeId)
    });
  }

  private goToAddStepViewForFirstStepInBranchPath(
    previousNodeId: string,
    nextNodeId: string
  ): void {
    this.router.navigate(['add-node', 'choose-template'], {
      relativeTo: this.route,
      state: new AddStepTarget('firstStepInBranchPath', null, previousNodeId, nextNodeId)
    });
  }

  protected goToAddBranchView(): void {
    this.router.navigate(['add-branch'], {
      relativeTo: this.route,
      state: {
        targetId: this.nodeId
      }
    });
  }
}
