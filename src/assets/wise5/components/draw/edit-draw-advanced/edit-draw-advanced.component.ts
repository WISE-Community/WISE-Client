import { Component } from '@angular/core';
import { EditAdvancedComponentComponent } from '../../../../../app/authoring-tool/edit-advanced-component/edit-advanced-component.component';
import { EditComponentAdvancedSharedModule } from '../../../../../app/authoring-tool/edit-component-advanced/edit-component-advanced-shared.module';
import { EditDrawConnectedComponentsComponent } from '../edit-draw-connected-components/edit-draw-connected-components.component';

@Component({
  imports: [EditComponentAdvancedSharedModule, EditDrawConnectedComponentsComponent],
  templateUrl: './edit-draw-advanced.component.html'
})
export class EditDrawAdvancedComponent extends EditAdvancedComponentComponent {
  allowedConnectedComponentTypes = ['ConceptMap', 'Draw', 'Embedded', 'Graph', 'Label', 'Table'];
}
