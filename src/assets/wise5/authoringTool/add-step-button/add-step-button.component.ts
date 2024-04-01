import { Component, Input } from '@angular/core';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'add-step-button',
  templateUrl: './add-step-button.component.html',
  styleUrls: ['./add-step-button.component.scss']
})
export class AddStepButtonComponent {
  @Input() first: boolean;
  @Input() nodeId: string;

  constructor(
    private projectService: TeacherProjectService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  protected addStepBefore(): void {
    this.addStepInside(this.projectService.getParentGroupId(this.nodeId));
  }

  private addStepInside(nodeId: string): void {
    this.router.navigate(['add-node', 'choose-template'], {
      relativeTo: this.route,
      state: {
        nodeIdToInsertInsideOrAfter: nodeId
      }
    });
  }

  protected addStepAfter(): void {
    this.router.navigate(['add-node', 'choose-template'], {
      relativeTo: this.route,
      state: {
        nodeIdToInsertInsideOrAfter: this.nodeId
      }
    });
  }
}
