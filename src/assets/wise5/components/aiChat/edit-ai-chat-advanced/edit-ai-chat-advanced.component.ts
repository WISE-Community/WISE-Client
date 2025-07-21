import { Component } from '@angular/core';
import { EditAdvancedComponentComponent } from '../../../../../app/authoring-tool/edit-advanced-component/edit-advanced-component.component';
import { AiChatContent } from '../AiChatContent';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { MatOption } from '@angular/material/core';
import { EditConnectedComponentsComponent } from '../../../../../app/authoring-tool/edit-connected-components/edit-connected-components.component';
import { EditComponentJsonComponent } from '../../../../../app/authoring-tool/edit-component-json/edit-component-json.component';

@Component({
  selector: 'edit-ai-chat-advanced',
  templateUrl: './edit-ai-chat-advanced.component.html',
  imports: [
    MatFormField,
    MatLabel,
    MatSelect,
    FormsModule,
    NgFor,
    MatOption,
    EditConnectedComponentsComponent,
    EditComponentJsonComponent
  ]
})
export class EditAiChatAdvancedComponent extends EditAdvancedComponentComponent {
  protected allowedConnectedComponentTypes = ['OpenResponse'];
  componentContent: AiChatContent;
  protected models: string[] = ['gpt-3.5-turbo', 'gpt-4'];
}
