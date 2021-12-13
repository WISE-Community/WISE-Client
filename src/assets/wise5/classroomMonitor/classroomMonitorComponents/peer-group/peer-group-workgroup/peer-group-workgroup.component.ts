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
  workgroupUsernames: string;

  constructor(private ConfigService: ConfigService) {}

  ngOnInit(): void {
    this.workgroupUsernames = this.ConfigService.getDisplayUsernamesByWorkgroupId(
      this.workgroup.id
    );
    this.avatarColor = this.ConfigService.getAvatarColorForWorkgroupId(this.workgroup.id);
  }
}
