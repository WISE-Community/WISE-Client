import { Component } from '@angular/core';
import { EditAdvancedComponentComponent } from '../../../../../app/authoring-tool/edit-advanced-component/edit-advanced-component.component';
import { EditCommonAdvancedComponent } from '../../../../../app/authoring-tool/edit-common-advanced/edit-common-advanced.component';

@Component({
  imports: [EditCommonAdvancedComponent],
  template: `<edit-common-advanced
    [component]="component"
    [allowedConnectedComponentTypes]="allowedConnectedComponentTypes"
  /> `
})
export class EditAnimationAdvancedComponent extends EditAdvancedComponentComponent {
  allowedConnectedComponentTypes = ['Animation', 'Graph'];
}
