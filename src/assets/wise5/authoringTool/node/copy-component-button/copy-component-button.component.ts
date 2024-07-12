import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { CopyTranslationsService } from '../../../services/copyTranslationsService';
import { Node } from '../../../common/Node';

@Component({
  selector: 'copy-component-button',
  templateUrl: './copy-component-button.component.html'
})
export class CopyComponentButtonComponent {
  @Input() componentId: string;
  @Output() newComponentEvent = new EventEmitter<any[]>();
  @Input() node: Node;

  constructor(
    private copyTranslationsService: CopyTranslationsService,
    private projectService: TeacherProjectService
  ) {}

  protected copy(event: Event): void {
    event.stopPropagation();
    const newComponents = this.node.copyComponents([this.componentId], this.componentId);
    this.projectService.saveProject();
    this.copyTranslationsService.tryCopyComponents(this.node, newComponents);
    this.newComponentEvent.emit(newComponents);
  }
}
