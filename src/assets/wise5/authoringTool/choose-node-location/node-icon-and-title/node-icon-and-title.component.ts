import { Component, Input } from '@angular/core';
import { TeacherProjectService } from '../../../services/teacherProjectService';

@Component({
  selector: 'node-icon-and-title',
  templateUrl: './node-icon-and-title.component.html'
})
export class NodeIconAndTitleComponent {
  @Input() protected nodeId: string;
  @Input() protected showPosition: boolean;

  constructor(private projectService: TeacherProjectService) {}

  protected getNodePosition(nodeId: string): string {
    return this.projectService.getNodePositionById(nodeId);
  }

  protected getNodeTitle(nodeId: string): string {
    return this.projectService.getNodeTitle(nodeId);
  }
}
