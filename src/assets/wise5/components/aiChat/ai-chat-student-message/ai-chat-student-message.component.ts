import { Component, Input } from '@angular/core';
import { AiChatMessage } from '../aiChatMessage';
import { ConfigService } from '../../../services/configService';
import { getAvatarColorForWorkgroupId } from '../../../common/workgroup/workgroup';

@Component({
  selector: 'ai-chat-student-message',
  templateUrl: './ai-chat-student-message.component.html',
  styleUrls: ['./ai-chat-student-message.component.scss']
})
export class AiChatStudentMessageComponent {
  protected avatarColor: string;
  protected displayNames: string;
  @Input() message: AiChatMessage;
  protected text: string;
  @Input() workgroupId: number;

  constructor(private configService: ConfigService) {}

  ngOnInit(): void {
    const firstNames = this.configService.getStudentFirstNamesByWorkgroupId(this.workgroupId);
    this.displayNames = firstNames.join(', ');
    this.avatarColor = getAvatarColorForWorkgroupId(this.workgroupId);
    this.text = this.message.content;
  }
}
