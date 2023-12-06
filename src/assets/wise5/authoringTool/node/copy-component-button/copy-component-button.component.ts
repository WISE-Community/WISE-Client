import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { Node } from '../../../common/Node';

@Component({
  selector: 'copy-component-button',
  templateUrl: './copy-component-button.component.html'
})
export class CopyComponentButtonComponent {
  @Input() componentId: string;
  @Output() newComponentEvent = new EventEmitter<any[]>();
  @Input() node: Node;

  constructor(private projectService: TeacherProjectService) {}

  protected copy(event: Event): void {
    event.stopPropagation();
    const newComponents = this.node.copyComponents([this.componentId], this.componentId);
    this.projectService.saveProject();
    this.newComponentEvent.emit(newComponents);
  }
}
