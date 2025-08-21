import { Component, Input } from '@angular/core';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { AddStepTarget } from '../../../../app/domain/addStepTarget';

@Component({
  imports: [MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule],
  selector: 'add-step-button',
  styles: [
    `
      .rotate-180 {
        transform: rotate(180deg);
      }
      .flip-vertical {
        transform: scaleY(-1);
      }
    `
  ],
  templateUrl: './add-step-button.component.html'
})
export class AddStepButtonComponent {
  protected canAddAfter: boolean;
  protected canAddBefore: boolean;
  protected canBranch: boolean;
  @Input() nodeId: string;

  constructor(
    private projectService: TeacherProjectService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.canAddBefore = this.projectService.isFirstStepInLesson(this.nodeId);
    const isBranchPoint = this.projectService.isBranchPoint(this.nodeId);
    const isBranchPathStep = this.projectService.isNodeInAnyBranchPath(this.nodeId);
    this.canAddAfter = !isBranchPoint;
    this.canBranch = !(isBranchPoint || isBranchPathStep);
  }

  protected addStepBefore(): void {
    if (this.projectService.isFirstStepInLesson(this.nodeId)) {
      this.goToAddStepViewForIn(this.projectService.getParentGroupId(this.nodeId));
    } else {
      const previousNodes = this.projectService.getNodesByToNodeId(this.nodeId);
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

  protected goToCreateBranchView(): void {
    this.router.navigate(['create-branch'], {
      relativeTo: this.route,
      state: {
        targetId: this.nodeId
      }
    });
  }
}
