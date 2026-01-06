import { Component, Input, inject } from '@angular/core';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';
import { SelectPeerGroupingAuthoringComponent } from '../../../assets/wise5/authoringTool/peer-grouping/select-peer-grouping-authoring/select-peer-grouping-authoring.component';

@Component({
  imports: [SelectPeerGroupingAuthoringComponent],
  selector: 'edit-component-peer-grouping-tag',
  template: `<select-peer-grouping-authoring
    [tag]="componentContent.peerGroupingTag"
    (tagChanged)="peerGroupingTagChanged($event)"
  />`
})
export class EditComponentPeerGroupingTagComponent {
  private projectService = inject(TeacherProjectService);

  @Input() componentContent: any;

  peerGroupingTagChanged(tag: string): void {
    this.componentContent.peerGroupingTag = tag;
    this.projectService.componentChanged();
  }
}
