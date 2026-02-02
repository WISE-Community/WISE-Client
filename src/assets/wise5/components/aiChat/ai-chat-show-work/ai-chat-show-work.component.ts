import { Component, inject } from '@angular/core';
import { ComponentShowWorkDirective } from '../../component-show-work.directive';
import { ComputerAvatarService } from '../../../services/computerAvatarService';
import { ComputerAvatar } from '../../../common/computer-avatar/ComputerAvatar';
import { AiChatMessagesComponent } from '../ai-chat-messages/ai-chat-messages.component';

@Component({
  imports: [AiChatMessagesComponent],
  selector: 'ai-chat-show-work',
  templateUrl: './ai-chat-show-work.component.html'
})
export class AiChatShowWorkComponent extends ComponentShowWorkDirective {
  protected computerAvatar: ComputerAvatar;
  private computerAvatarService = inject(ComputerAvatarService);
  protected messages: any[] = [];
  protected workgroupId: number;

  ngOnInit(): void {
    super.ngOnInit();
    this.computerAvatar = this.computerAvatarService.getAvatar(
      this.componentState.studentData.computerAvatarId
    );
    this.messages = this.componentState.studentData.messages;
    this.workgroupId = this.componentState.workgroupId;
  }
}
