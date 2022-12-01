import { Component, Input, OnInit } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { WiseLinkService } from '../../../../../app/services/wiseLinkService';
import { ComputerAvatar } from '../../../common/ComputerAvatar';
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
  computerAvatar: ComputerAvatar;

  @Input()
  response: DialogResponse;

  avatarColor: string;
  computerAvatarImageSrc: string;
  displayNames: string;
  isStudent: boolean;
  text: SafeHtml = '';

  constructor(
    private computerAvatarService: ComputerAvatarService,
    private ConfigService: ConfigService,
    private wiseLinkService: WiseLinkService
  ) {}

  ngOnInit(): void {
    this.isStudent = this.response.user === 'Student';
    if (this.isStudent) {
      this.avatarColor = this.ConfigService.getAvatarColorForWorkgroupId(this.response.workgroupId);
      const firstNames = this.ConfigService.getStudentFirstNamesByWorkgroupId(
        this.response.workgroupId
      );
      this.displayNames = firstNames.join(', ');
    } else {
      this.displayNames = this.computerAvatar.name;
    }
    if (this.computerAvatar != null) {
      this.computerAvatarImageSrc =
        this.computerAvatarService.getAvatarsPath() + this.computerAvatar.image;
    }
    this.text = this.wiseLinkService.generateHtmlWithWiseLink(this.response.text);
  }
}
