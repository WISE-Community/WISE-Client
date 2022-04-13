import { Component } from '@angular/core';
import { EditAdvancedComponentComponent } from '../../../../../app/authoring-tool/edit-advanced-component/edit-advanced-component.component';

@Component({
  selector: 'edit-discussion-advanced',
  templateUrl: 'edit-discussion-advanced.component.html'
})
export class EditDiscussionAdvancedComponent extends EditAdvancedComponentComponent {
  allowedConnectedComponentTypes = ['Discussion'];
}
