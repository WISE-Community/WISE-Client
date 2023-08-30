import { Component, Input } from '@angular/core';
import { TeacherProjectService } from '../../services/teacherProjectService';

@Component({
  selector: 'node-icon-and-title',
  template: `<div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="8px">
    <node-icon [nodeId]="nodeId" size="18"></node-icon>&nbsp;
    <span *ngIf="showPosition">{{ getNodePosition(nodeId) }}:&nbsp;</span>{{ getNodeTitle(nodeId) }}
  </div>`
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
