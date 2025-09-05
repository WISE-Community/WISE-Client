import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Node } from '../../../common/Node';
import { TeacherPeerGroupService } from '../../../services/teacherPeerGroupService';

@Component({
  imports: [CommonModule, MatButtonModule, MatIconModule],
  selector: 'peer-group-button',
  templateUrl: './peer-group-button.component.html'
})
export class PeerGroupButtonComponent {
  @Input() component: any;
  @Input() node: Node;
  protected peerGroupingTag: string;

  constructor(private peerGroupService: TeacherPeerGroupService) {}

  ngOnChanges(): void {
    this.peerGroupingTag = this.component?.peerGroupingTag;
  }

  protected showPeerGroup(): void {
    this.peerGroupService.showPeerGroupDetails(this.peerGroupingTag);
  }
}
