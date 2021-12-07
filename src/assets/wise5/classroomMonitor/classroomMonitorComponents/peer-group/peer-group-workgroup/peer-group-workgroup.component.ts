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

  constructor(private ConfigrService: ConfigService) {}

  ngOnInit(): void {
    this.workgroupUsernames = this.workgroup.displayNames;
    this.avatarColor = this.ConfigrService.getAvatarColorForWorkgroupId(this.workgroup.workgroupId);
  }
}
