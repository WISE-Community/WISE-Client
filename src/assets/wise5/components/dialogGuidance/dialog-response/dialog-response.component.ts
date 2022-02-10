import { Component, Input, OnInit } from '@angular/core';
import { ComputerAvatarService } from '../../../services/computerAvatarService';
import { ConfigService } from '../../../services/configService';
import { DialogResponse } from '../DialogResponse';

@Component({
  selector: 'dialog-response',
  templateUrl: './dialog-response.component.html',
  styleUrls: ['./dialog-response.component.scss']
})
export class DialogResponseComponent implements OnInit {
  @Input()
  computerAvatarId: string;

  @Input()
  response: DialogResponse;

  avatarColor: string;
  computerAvatarImage: string;
  computerAvatarsPath: string;
  isStudent: boolean;

  constructor(
    private computerAvatarService: ComputerAvatarService,
    private ConfigService: ConfigService
  ) {}

  ngOnInit(): void {
    this.isStudent = this.response.user === 'Student';
    if (this.isStudent) {
      this.avatarColor = this.ConfigService.getAvatarColorForWorkgroupId(this.response.workgroupId);
    }
    if (this.computerAvatarId != null) {
      this.computerAvatarsPath = this.computerAvatarService.getAvatarsPath();
      this.computerAvatarImage = this.computerAvatarService.getImage(this.computerAvatarId);
    }
  }
}
