import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { EditAdvancedComponentComponent } from '../../../../../app/authoring-tool/edit-advanced-component/edit-advanced-component.component';
import { EditComponentJsonComponent } from '../../../../../app/authoring-tool/edit-component-json/edit-component-json.component';
import { EditConnectedComponentsComponent } from '../../../../../app/authoring-tool/edit-connected-components/edit-connected-components.component';
import { AiChatContent } from '../AiChatContent';

@Component({
  templateUrl: './edit-ai-chat-advanced.component.html',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    NgFor,
    EditConnectedComponentsComponent,
    EditComponentJsonComponent
  ]
})
export class EditAiChatAdvancedComponent extends EditAdvancedComponentComponent {
  protected allowedConnectedComponentTypes = ['OpenResponse'];
  componentContent: AiChatContent;
  protected models: string[] = ['gpt-3.5-turbo', 'gpt-4'];
}
