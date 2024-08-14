import { Component, Input } from '@angular/core';
import { Node } from '../../../common/Node';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { TranslatableInputComponent } from '../../components/translatable-input/translatable-input.component';

@Component({
  imports: [TranslatableInputComponent],
  selector: 'edit-node-title',
  standalone: true,
  styleUrl: './edit-node-title.component.scss',
  templateUrl: './edit-node-title.component.html'
})
export class EditNodeTitleComponent {
  protected label: string;
  @Input() node: Node;
  protected nodeJson: any;

  constructor(private projectService: TeacherProjectService) {}

  ngOnChanges(): void {
    this.nodeJson = this.projectService.getNodeById(this.node.id);
    this.label =
      (this.node.isGroup() ? $localize`Lesson Title` : $localize`Step Title`) +
      ' ' +
      this.projectService.getNodePositionById(this.node.id);
  }

  protected save(): void {
    this.projectService.saveProject();
  }
}
