import { Component } from '@angular/core';
import { EditAdvancedComponentComponent } from '../../../../../app/authoring-tool/edit-advanced-component/edit-advanced-component.component';
import { EditDiscussionConnectedComponentsComponent } from '../edit-discussion-connected-components/edit-discussion-connected-components.component';
import { EditComponentAdvancedSharedModule } from '../../../../../app/authoring-tool/edit-component-advanced/edit-component-advanced-shared.module';

@Component({
  imports: [EditComponentAdvancedSharedModule, EditDiscussionConnectedComponentsComponent],
  templateUrl: './edit-discussion-advanced.component.html'
})
export class EditDiscussionAdvancedComponent extends EditAdvancedComponentComponent {
  allowedConnectedComponentTypes = ['Discussion'];
}
