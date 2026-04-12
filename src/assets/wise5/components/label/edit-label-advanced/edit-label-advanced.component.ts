import { Component } from '@angular/core';
import { EditAdvancedComponentComponent } from '../../../../../app/authoring-tool/edit-advanced-component/edit-advanced-component.component';
import { EditLabelConnectedComponentsComponent } from '../edit-label-connected-components/edit-label-connected-components.component';
import { EditComponentAdvancedSharedModule } from '../../../../../app/authoring-tool/edit-component-advanced/edit-component-advanced-shared.module';

@Component({
  imports: [EditComponentAdvancedSharedModule, EditLabelConnectedComponentsComponent],
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
