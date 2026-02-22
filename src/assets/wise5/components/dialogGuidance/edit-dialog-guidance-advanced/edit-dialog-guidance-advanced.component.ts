import { Component } from '@angular/core';
import { EditAdvancedComponentComponent } from '../../../../../app/authoring-tool/edit-advanced-component/edit-advanced-component.component';
import { EditComponentConstraintsComponent } from '../../../../../app/authoring-tool/edit-component-constraints/edit-component-constraints.component';
import { EditComponentJsonComponent } from '../../../../../app/authoring-tool/edit-component-json/edit-component-json.component';

@Component({
  imports: [EditComponentConstraintsComponent, EditComponentJsonComponent],
  template: `
    <edit-component-constraints [componentContent]="component.content" />
    <edit-component-json [component]="component" />
  `
})
export class EditDialogGuidanceAdvancedComponent extends EditAdvancedComponentComponent {}
