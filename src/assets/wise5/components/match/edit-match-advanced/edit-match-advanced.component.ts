import { Component } from '@angular/core';
import { EditAdvancedComponentComponent } from '../../../../../app/authoring-tool/edit-advanced-component/edit-advanced-component.component';
import { MatchContent } from '../MatchContent';
import { EditMatchConnectedComponentsComponent } from '../edit-match-connected-components/edit-match-connected-components.component';
import { EditComponentAdvancedSharedModule } from '../../../../../app/authoring-tool/edit-component-advanced/edit-component-advanced-shared.module';

@Component({
  imports: [EditComponentAdvancedSharedModule, EditMatchConnectedComponentsComponent],
  styles: ['.checkbox { margin-top: 4px; margin-bottom: 4px; }'],
  templateUrl: './edit-match-advanced.component.html'
})
export class EditMatchAdvancedComponent extends EditAdvancedComponentComponent {
  allowedConnectedComponentTypes = ['DialogGuidance', 'Match'];
  componentContent: MatchContent;
}
