import { Component, Input, OnInit } from '@angular/core';
import { ConfigService } from '../../../../services/configService';

@Component({
  selector: 'peer-group-workgroup',
  templateUrl: './peer-group-workgroup.component.html',
  styleUrls: ['./peer-group-workgroup.component.scss']
})
export class PeerGroupWorkgroupComponent implements OnInit {
  @Input() workgroup: any;

  avatarColor: string;
  isEmptyWorkgroup: boolean;
  workgroupUsernames: string;

  constructor(private configService: ConfigService) {}

  ngOnInit(): void {
    this.workgroupUsernames = this.configService.getDisplayUsernamesByWorkgroupId(
      this.workgroup.id
    );
    if (this.workgroupUsernames === '') {
      this.isEmptyWorkgroup = true;
      this.workgroupUsernames = $localize`Empty Team`;
    }
    this.avatarColor = this.configService.getAvatarColorForWorkgroupId(this.workgroup.id);
  }
}
