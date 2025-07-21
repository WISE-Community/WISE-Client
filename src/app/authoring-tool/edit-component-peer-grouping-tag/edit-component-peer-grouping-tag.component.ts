import { Component, Input } from '@angular/core';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';
import { PeerGroupingAuthoringModule } from '../../../assets/wise5/authoringTool/peer-grouping/peer-grouping-authoring.module';

@Component({
  selector: 'edit-component-peer-grouping-tag',
  template: `<select-peer-grouping-authoring
    [tag]="componentContent.peerGroupingTag"
    (tagChanged)="peerGroupingTagChanged($event)"
  />`,
  imports: [PeerGroupingAuthoringModule]
})
export class EditComponentPeerGroupingTagComponent {
  @Input() componentContent: any;

  constructor(private projectService: TeacherProjectService) {}

  peerGroupingTagChanged(tag: string): void {
    this.componentContent.peerGroupingTag = tag;
    this.projectService.componentChanged();
  }
}
