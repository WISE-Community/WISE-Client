import { Component, Input } from '@angular/core';
import { AiChatMessage } from '../aiChatMessage';
import { ComputerAvatarService } from '../../../services/computerAvatarService';
import { ComputerAvatar } from '../../../common/ComputerAvatar';

@Component({
  selector: 'ai-chat-bot-message',
  templateUrl: './ai-chat-bot-message.component.html',
  styleUrls: ['./ai-chat-bot-message.component.scss']
})
export class AiChatBotMessageComponent {
  @Input() computerAvatar: ComputerAvatar;
  protected computerAvatarImageSrc: string;
  protected displayNames: string;
  @Input() message: AiChatMessage;
  protected text: string;

  constructor(private computerAvatarService: ComputerAvatarService) {}

  ngOnInit(): void {
    this.displayNames = this.computerAvatar.name;
    this.text = this.message.content;
    if (this.computerAvatar != null) {
      this.computerAvatarImageSrc =
        this.computerAvatarService.getAvatarsPath() +
        this.computerAvatarService.getAvatar(this.computerAvatar.id).image;
    }
  }
}
