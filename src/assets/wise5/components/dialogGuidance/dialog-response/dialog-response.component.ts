import { Component, Input, OnInit } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { WiseLinkService } from '../../../../../app/services/wiseLinkService';
import { ComputerAvatar } from '../../../common/computer-avatar/ComputerAvatar';
import { ComputerAvatarService } from '../../../services/computerAvatarService';
import { ConfigService } from '../../../services/configService';
import { DialogResponse } from '../DialogResponse';
import { getAvatarColorForWorkgroupId } from '../../../common/workgroup/workgroup';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [CommonModule, MatIconModule],
  selector: 'dialog-response',
  styleUrl: './dialog-response.component.scss',
  templateUrl: './dialog-response.component.html'
})
export class DialogResponseComponent implements OnInit {
  protected avatarColor: string;
  @Input() computerAvatar: ComputerAvatar;
  protected computerAvatarImageSrc: string;
  protected displayNames: string;
  protected isStudent: boolean;
  @Input() response: DialogResponse;
  protected text: SafeHtml = '';

  constructor(
    private computerAvatarService: ComputerAvatarService,
    private configService: ConfigService,
    private wiseLinkService: WiseLinkService
  ) {}

  ngOnInit(): void {
    this.text = this.wiseLinkService.generateHtmlWithWiseLink(this.response.text);
    this.isStudent = this.response.user === 'Student';
    if (this.isStudent) {
      this.displayNames = this.configService
        .getStudentFirstNamesByWorkgroupId(this.response.workgroupId)
        .join(', ');
      this.avatarColor = getAvatarColorForWorkgroupId(this.response.workgroupId);
    } else {
      this.displayNames = this.computerAvatar.name;
      if (this.computerAvatar != null) {
        this.computerAvatarImageSrc =
          this.computerAvatarService.getAvatarsPath() + this.computerAvatar.image;
      }
    }
  }
}
