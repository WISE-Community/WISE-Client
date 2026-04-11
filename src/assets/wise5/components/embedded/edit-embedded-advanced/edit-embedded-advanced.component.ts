import { Component } from '@angular/core';
import { EditAdvancedComponentComponent } from '../../../../../app/authoring-tool/edit-advanced-component/edit-advanced-component.component';
import { EmbeddedContent } from '../EmbeddedContent';
import { TranslatableInputComponent } from '../../../authoringTool/components/translatable-input/translatable-input.component';
import { EditComponentAdvancedSharedModule } from '../../../../../app/authoring-tool/edit-component-advanced/edit-component-advanced-shared.module';

@Component({
  imports: [EditComponentAdvancedSharedModule, TranslatableInputComponent],
  styles: ['.model-parameters { width: 100%; }'],
  templateUrl: 'edit-embedded-advanced.component.html'
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
