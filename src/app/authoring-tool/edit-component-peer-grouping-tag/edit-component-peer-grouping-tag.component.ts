import { Component, Input } from '@angular/core';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';

@Component({
  selector: 'edit-component-peer-grouping-tag',
  templateUrl: './edit-component-peer-grouping-tag.component.html',
  styleUrls: ['./edit-component-peer-grouping-tag.component.scss']
})
export class EditComponentPeerGroupingTagComponent {
  @Input() componentContent: any;

  constructor(private projectService: TeacherProjectService) {}

  ngOnInit(): void {}

  peerGroupingTagChanged(tag: string): void {
    this.componentContent.peerGroupingTag = tag;
    this.projectService.componentChanged();
  }
}
