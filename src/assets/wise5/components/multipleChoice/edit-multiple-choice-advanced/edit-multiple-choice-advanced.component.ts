import { Component } from '@angular/core';
import { EditAdvancedComponentComponent } from '../../../../../app/authoring-tool/edit-advanced-component/edit-advanced-component.component';
import { EditMultipleChoiceConnectedComponentsComponent } from '../edit-multiple-choice-connected-components/edit-multiple-choice-connected-components.component';
import { MultipleChoiceContent } from '../MultipleChoiceContent';
import { EditComponentAdvancedSharedModule } from '../../../../../app/authoring-tool/edit-component-advanced/edit-component-advanced-shared.module';

@Component({
  imports: [EditComponentAdvancedSharedModule, EditMultipleChoiceConnectedComponentsComponent],
  styles: ['.show-feedback-checkbox { margin-top: 4px; margin-bottom: 4px; }'],
  templateUrl: 'edit-multiple-choice-advanced.component.html'
})
export class EditMultipleChoiceAdvancedComponent extends EditAdvancedComponentComponent {
  allowedConnectedComponentTypes = ['MultipleChoice'];
  componentContent: MultipleChoiceContent;
}
