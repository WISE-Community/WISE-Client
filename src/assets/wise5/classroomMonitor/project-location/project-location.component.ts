import { Component, inject, Input } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { ProjectService } from '../../services/projectService';
import { MatIcon } from '@angular/material/icon';
import { StudentProgress } from '../student-progress/StudentProgress';

@Component({
  imports: [MatIcon, MatTooltip],
  selector: 'project-location',
  styleUrl: './project-location.component.scss',
  templateUrl: './project-location.component.html'
})
export class ProjectLocationComponent {
  private projectService: ProjectService = inject(ProjectService);

  protected currentSegment: any;
  protected segments: any[];
  @Input() studentProgress: StudentProgress;

  ngOnChanges(): void {
    const groupNodes = this.projectService.getOrderedGroupNodes();
    if (groupNodes.length > 1) {
      this.segments = groupNodes;
      this.currentSegment = this.projectService.getParentGroup(this.studentProgress.currentNodeId);
    } else {
      this.segments = this.getOrderedNodes();
      this.currentSegment = this.projectService.getNode(this.studentProgress.currentNodeId);
    }
  }

  private getOrderedNodes(): any[] {
    const idToOrder = this.projectService.idToOrder;
    return this.projectService
      .getNodes()
      .filter((node) => node.type !== 'group')
      .sort((a, b) => idToOrder[a.id].order - idToOrder[b.id].order);
  }
}
