import { Component, Input } from '@angular/core';
import { Node } from '../../../common/Node';
import { TeacherProjectService } from '../../../services/teacherProjectService';

@Component({
  selector: 'edit-node-title',
  templateUrl: './edit-node-title.component.html',
  styleUrls: ['./edit-node-title.component.scss']
})
export class EditNodeTitleComponent {
  protected isGroupNode: boolean;
  @Input() node: Node;
  protected nodeJson: any;
  protected nodePosition: string;

  constructor(private projectService: TeacherProjectService) {}

  ngOnChanges(): void {
    this.isGroupNode = this.node.isGroup();
    this.nodeJson = this.projectService.getNodeById(this.node.id);
    this.nodePosition = this.projectService.getNodePositionById(this.node.id);
  }

  protected save(): void {
    this.projectService.saveProject();
  }
}
