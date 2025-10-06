import { Component } from '@angular/core';
import { AiChatShowWorkComponent } from '../ai-chat-show-work/ai-chat-show-work.component';

@Component({
  imports: [AiChatShowWorkComponent],
  template: ` <ai-chat-show-work
    [nodeId]="nodeId"
    [componentId]="componentId"
    [componentState]="componentState"
    [isRevision]="isRevision"
  />`
})
export class AiChatGradingComponent extends AiChatShowWorkComponent {}
