import { Component } from '@angular/core';
import { EditAdvancedComponentComponent } from '../../../../../app/authoring-tool/edit-advanced-component/edit-advanced-component.component';
import { AiChatContent } from '../AiChatContent';

@Component({
  selector: 'edit-ai-chat-advanced',
  templateUrl: './edit-ai-chat-advanced.component.html'
})
export class EditAiChatAdvancedComponent extends EditAdvancedComponentComponent {
  componentContent: AiChatContent;
  protected models: string[] = ['gpt-3.5-turbo', 'gpt-4'];
}
