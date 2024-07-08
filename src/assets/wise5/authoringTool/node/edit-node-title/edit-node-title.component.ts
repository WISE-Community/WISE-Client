import { Component, Input } from '@angular/core';
import { Node } from '../../../common/Node';
import { TeacherProjectService } from '../../../services/teacherProjectService';

@Component({
  selector: 'edit-node-title',
  templateUrl: './edit-node-title.component.html'
})
export class EditNodeTitleComponent {
  protected isGroupNode: boolean;
  protected label: string;
  @Input() node: Node;
  protected nodeJson: any;

  constructor(private projectService: TeacherProjectService) {}

  ngOnChanges(): void {
    this.nodeJson = this.projectService.getNodeById(this.node.id);
    this.isGroupNode = this.node.isGroup();
    this.label =
      (this.isGroupNode ? $localize`Lesson Title` : $localize`Step Title`) +
      ' ' +
      this.projectService.getNodePositionById(this.node.id);
  }

  protected save(): void {
    this.projectService.saveProject();
  }
}
