import { Component, Input } from '@angular/core';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'add-step-button',
  templateUrl: './add-step-button.component.html',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule]
})
export class AddStepButtonComponent {
  @Input() nodeId: string;

  constructor(
    private projectService: TeacherProjectService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  protected addStepBefore(): void {
    this.goToAddStepView(this.projectService.getParentGroupId(this.nodeId));
  }

  protected addStepAfter(): void {
    this.goToAddStepView(this.nodeId);
  }

  private goToAddStepView(nodeId: string): void {
    this.router.navigate(['add-node', 'choose-template'], {
      relativeTo: this.route,
      state: {
        targetId: nodeId
      }
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
