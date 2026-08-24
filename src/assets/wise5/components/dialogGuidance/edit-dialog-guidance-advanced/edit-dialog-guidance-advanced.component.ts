import { Component } from '@angular/core';
import { EditAdvancedComponentComponent } from '../../../../../app/authoring-tool/edit-advanced-component/edit-advanced-component.component';
import { EditComponentAdvancedSharedModule } from '../../../../../app/authoring-tool/edit-component-advanced/edit-component-advanced-shared.module';

@Component({
  imports: [EditComponentAdvancedSharedModule],
  templateUrl: './edit-dialog-guidance-advanced.component.html'
})
export class EditDialogGuidanceAdvancedComponent extends EditAdvancedComponentComponent {
  allowedConnectedComponentTypes = [];
}
