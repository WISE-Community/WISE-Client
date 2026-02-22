import { Component, Input } from '@angular/core';
import { AiChatMessage } from '../AiChatMessage';
import { ConfigService } from '../../../services/configService';
import { getAvatarColorForWorkgroupId } from '../../../common/workgroup/workgroup';
import { MatIcon } from '@angular/material/icon';
import { NgStyle } from '@angular/common';

@Component({
  imports: [MatIcon, NgStyle],
  selector: 'ai-chat-student-message',
  styleUrl: './ai-chat-student-message.component.scss',
  templateUrl: './ai-chat-student-message.component.html'
})
export class AiChatStudentMessageComponent {
  protected avatarColor: string;
  protected displayNames: string;
  @Input() message: AiChatMessage;
  @Input() workgroupId: number;

  constructor(private configService: ConfigService) {}

  ngOnInit(): void {
    const firstNames = this.configService.getStudentFirstNamesByWorkgroupId(this.workgroupId);
    this.displayNames = firstNames.join(', ');
    this.avatarColor = getAvatarColorForWorkgroupId(this.workgroupId);
  }
}
