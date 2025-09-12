import { Component } from '@angular/core';
import { EditCommonAdvancedComponent } from '../../../../../app/authoring-tool/edit-common-advanced/edit-common-advanced.component';
import { EditAdvancedComponentComponent } from '../../../../../app/authoring-tool/edit-advanced-component/edit-advanced-component.component';

@Component({
  imports: [EditCommonAdvancedComponent],
  template: `<edit-common-advanced
    [component]="component"
    [allowedConnectedComponentTypes]="allowedConnectedComponentTypes"
  />`
})
export class EditAudioOscillatorAdvancedComponent extends EditAdvancedComponentComponent {
  allowedConnectedComponentTypes = ['AudioOscillator'];
}
