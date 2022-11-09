import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfigService } from '../../../../services/configService';
import { PeerGroupWorkgroupsContainerComponent } from '../peer-group-workgroups-container/peer-group-workgroups-container.component';

@Component({
  selector: 'peer-group-grouping',
  templateUrl: './peer-group-grouping.component.html',
  styleUrls: ['../peer-group-workgroups-container/peer-group-workgroups-container.component.scss']
})
export class PeerGroupGroupingComponent extends PeerGroupWorkgroupsContainerComponent {
  @Input() grouping: any;

  avatarColor: string;

  constructor(private ConfigService: ConfigService, protected dialog: MatDialog) {
    super(dialog);
  }

  ngOnInit(): void {
    this.avatarColor = this.ConfigService.getAvatarColorForWorkgroupId(this.grouping.id);
  }
}
