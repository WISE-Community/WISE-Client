import { Component, Input } from '@angular/core';
import { AiChatMessage } from '../AiChatMessage';
import { ComputerAvatar } from '../../../common/ComputerAvatar';
import { ComputerAvatarService } from '../../../services/computerAvatarService';

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
  constructor(private computerAvatarService: ComputerAvatarService) {}

  ngOnInit(): void {
    if (this.computerAvatar != null) {
      this.displayNames = this.computerAvatar.name;
      this.computerAvatarImageSrc =
        this.computerAvatarService.getAvatarsPath() +
        this.computerAvatarService.getAvatar(this.computerAvatar.id).image;
    }
  }
}
