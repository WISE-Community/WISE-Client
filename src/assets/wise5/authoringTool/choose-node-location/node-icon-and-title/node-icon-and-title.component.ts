import { Component, Input } from '@angular/core';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { NodeIconComponent } from '../../../vle/node-icon/node-icon.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule, FlexLayoutModule, NodeIconComponent],
  selector: 'node-icon-and-title',
  standalone: true,
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
