import { Component } from '@angular/core';
import { EditAdvancedComponentComponent } from '../../../../../app/authoring-tool/edit-advanced-component/edit-advanced-component.component';

@Component({
  selector: 'edit-label-advanced',
  templateUrl: 'edit-label-advanced.component.html'
})
export class EditLabelAdvancedComponent extends EditAdvancedComponentComponent {
  allowedConnectedComponentTypes = [
    'ConceptMap',
    'Draw',
    'Embedded',
    'Graph',
    'Label',
    'OpenResponse',
    'Table'
  ];
}
