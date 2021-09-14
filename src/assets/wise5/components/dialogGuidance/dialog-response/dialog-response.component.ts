import { Component, Input, OnInit } from '@angular/core';
import { ConfigService } from '../../../services/configService';
import { DialogResponse } from '../DialogResponse';

@Component({
  selector: 'dialog-response',
  templateUrl: './dialog-response.component.html',
  styleUrls: ['./dialog-response.component.scss']
})
export class DialogResponseComponent implements OnInit {
  @Input()
  response: DialogResponse;

  avatarColor: string;
  isStudent: boolean;

  constructor(protected ConfigService: ConfigService) {}

  ngOnInit(): void {
    this.isStudent = this.response.user === 'Student';
    if (this.isStudent) {
      this.avatarColor = this.ConfigService.getAvatarColorForWorkgroupId(this.response.workgroupId);
    }
  }
}
