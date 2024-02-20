import { NgModule } from '@angular/core';
import { AiChatShowWorkModule } from '../ai-chat-show-work/ai-chat-show-work.module';
import { AiChatGradingComponent } from './ai-chat-grading.component';

@NgModule({
  declarations: [AiChatGradingComponent],
  imports: [AiChatShowWorkModule],
  exports: [AiChatGradingComponent]
})
export class AiChatGradingModule {}
