import { Component } from '@angular/core';
import { EditAdvancedComponentComponent } from '../../../../../app/authoring-tool/edit-advanced-component/edit-advanced-component.component';

@Component({
  selector: 'edit-draw-advanced',
  templateUrl: 'edit-draw-advanced.component.html'
})
export class EditDrawAdvancedComponent extends EditAdvancedComponentComponent {
  allowedConnectedComponentTypes = ['ConceptMap', 'Draw', 'Embedded', 'Graph', 'Label', 'Table'];
}
