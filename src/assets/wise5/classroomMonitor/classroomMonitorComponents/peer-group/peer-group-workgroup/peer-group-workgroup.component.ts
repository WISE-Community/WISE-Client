import { Component, Input, OnInit, inject } from '@angular/core';
import { ConfigService } from '../../../../services/configService';
import { getAvatarColorForWorkgroupId } from '../../../../common/workgroup/workgroup';
import { NgClass, NgStyle } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  imports: [NgClass, MatIcon, NgStyle],
  selector: 'peer-group-workgroup',
  styleUrl: './peer-group-workgroup.component.scss',
  templateUrl: './peer-group-workgroup.component.html'
})
export class PeerGroupWorkgroupComponent implements OnInit {
  private configService = inject(ConfigService);

  @Input() workgroup: any;

  avatarColor: string;
  isEmptyWorkgroup: boolean;
  workgroupUsernames: string;

  ngOnInit(): void {
    this.workgroupUsernames = this.configService.getDisplayUsernamesByWorkgroupId(
      this.workgroup.id
    );
    if (this.workgroupUsernames === '') {
      this.isEmptyWorkgroup = true;
      this.workgroupUsernames = $localize`Empty Team`;
    }
    this.avatarColor = getAvatarColorForWorkgroupId(this.workgroup.id);
  }
}
