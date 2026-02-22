import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { EditAdvancedComponentComponent } from '../../../../../app/authoring-tool/edit-advanced-component/edit-advanced-component.component';
import { EditComponentJsonComponent } from '../../../../../app/authoring-tool/edit-component-json/edit-component-json.component';
import { EditConnectedComponentsComponent } from '../../../../../app/authoring-tool/edit-connected-components/edit-connected-components.component';
import { AiChatContent } from '../AiChatContent';
import { EditComponentWidthComponent } from '../../../../../app/authoring-tool/edit-component-width/edit-component-width.component';

@Component({
  imports: [
    EditComponentJsonComponent,
    EditComponentWidthComponent,
    EditConnectedComponentsComponent,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  templateUrl: './edit-ai-chat-advanced.component.html'
})
export class EditAiChatAdvancedComponent extends EditAdvancedComponentComponent {
  protected allowedConnectedComponentTypes = ['OpenResponse'];
  componentContent: AiChatContent;
  protected models: string[] = ['gpt-3.5-turbo', 'gpt-4'];
}
