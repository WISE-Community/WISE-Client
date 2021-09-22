import { Component } from '@angular/core';
import { EditAdvancedComponentComponent } from '../../../../../app/authoring-tool/edit-advanced-component/edit-advanced-component.component';

@Component({
  selector: 'edit-animation-advanced',
  templateUrl: 'edit-animation-advanced.component.html'
})
export class EditAnimationAdvancedComponent extends EditAdvancedComponentComponent {
  allowedConnectedComponentTypes = ['Animation', 'Graph'];
}
