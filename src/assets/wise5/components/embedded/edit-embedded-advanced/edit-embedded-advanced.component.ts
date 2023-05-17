import { Component } from '@angular/core';
import { EditAdvancedComponentComponent } from '../../../../../app/authoring-tool/edit-advanced-component/edit-advanced-component.component';
import { EmbeddedContent } from '../EmbeddedContent';

@Component({
  selector: 'edit-embedded-advanced',
  templateUrl: 'edit-embedded-advanced.component.html',
  styleUrls: ['edit-embedded-advanced.component.scss']
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
