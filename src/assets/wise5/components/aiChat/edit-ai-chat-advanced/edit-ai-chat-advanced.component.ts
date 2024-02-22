import { Component } from '@angular/core';
import { EditAdvancedComponentComponent } from '../../../../../app/authoring-tool/edit-advanced-component/edit-advanced-component.component';
import { AiChatContent } from '../AiChatContent';

@Component({
  selector: 'edit-ai-chat-advanced',
  templateUrl: './edit-ai-chat-advanced.component.html',
  styleUrls: ['./edit-ai-chat-advanced.component.scss']
})
export class EditAiChatAdvancedComponent extends EditAdvancedComponentComponent {
  componentContent: AiChatContent;
  models: string[] = ['gpt-3.5-turbo', 'gpt-4'];
}
