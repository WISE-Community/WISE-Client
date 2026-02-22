import { Component } from '@angular/core';
import { EditAdvancedComponentComponent } from '../../../../../app/authoring-tool/edit-advanced-component/edit-advanced-component.component';
import { EmbeddedContent } from '../EmbeddedContent';
import { TranslatableInputComponent } from '../../../authoringTool/components/translatable-input/translatable-input.component';
import { EditComponentAddToNotebookButtonComponent } from '../../../../../app/authoring-tool/edit-component-add-to-notebook-button/edit-component-add-to-notebook-button.component';
import { EditCommonAdvancedComponent } from '../../../../../app/authoring-tool/edit-common-advanced/edit-common-advanced.component';

@Component({
  templateUrl: 'edit-embedded-advanced.component.html',
  styles: ['.model-parameters { width: 100%; }'],
  imports: [
    TranslatableInputComponent,
    EditComponentAddToNotebookButtonComponent,
    EditCommonAdvancedComponent
  ]
})
export class EditEmbeddedAdvancedComponent extends EditAdvancedComponentComponent {
  allowedConnectedComponentTypes = [
    'Animation',
    'AudioOscillator',
    'ConceptMap',
    'Discussion',
    'Draw',
    'Embedded',
    'Graph',
    'Label',
    'Match',
    'MultipleChoice',
    'OpenResponse',
    'Table'
  ];
  componentContent: EmbeddedContent;
}
