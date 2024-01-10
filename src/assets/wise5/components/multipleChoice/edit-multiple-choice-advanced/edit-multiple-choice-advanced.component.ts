import { Component } from '@angular/core';
import { EditAdvancedComponentComponent } from '../../../../../app/authoring-tool/edit-advanced-component/edit-advanced-component.component';
import { MultipleChoiceContent } from '../MultipleChoiceContent';

@Component({
  template: 'edit-multiple-choice-advanced',
  templateUrl: 'edit-multiple-choice-advanced.component.html',
  styleUrls: ['edit-multiple-choice-advanced.component.scss']
})
export class EditMultipleChoiceAdvancedComponent extends EditAdvancedComponentComponent {
  allowedConnectedComponentTypes = ['MultipleChoice'];
  componentContent: MultipleChoiceContent;
}
