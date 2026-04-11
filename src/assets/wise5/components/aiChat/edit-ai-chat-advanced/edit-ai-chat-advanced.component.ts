import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { EditAdvancedComponentComponent } from '../../../../../app/authoring-tool/edit-advanced-component/edit-advanced-component.component';
import { AiChatContent } from '../AiChatContent';
import { EditComponentAdvancedSharedModule } from '../../../../../app/authoring-tool/edit-component-advanced/edit-component-advanced-shared.module';

@Component({
  imports: [EditComponentAdvancedSharedModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './edit-ai-chat-advanced.component.html'
})
export class EditAiChatAdvancedComponent extends EditAdvancedComponentComponent {
  protected allowedConnectedComponentTypes = ['OpenResponse'];
  componentContent: AiChatContent;
  protected models: string[] = ['gpt-4o', 'gpt-4o-mini', 'gpt-5.4', 'gpt-5.4-mini', 'gpt-5.4-nano'];
}
