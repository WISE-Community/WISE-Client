import { Component } from '@angular/core';
import { EditAdvancedComponentComponent } from '../../../../../app/authoring-tool/edit-advanced-component/edit-advanced-component.component';
import { EditComponentConstraintsComponent } from '../../../../../app/authoring-tool/edit-component-constraints/edit-component-constraints.component';
import { EditComponentJsonComponent } from '../../../../../app/authoring-tool/edit-component-json/edit-component-json.component';
import { EditCRaterInfoComponent } from '../../common/cRater/edit-crater-info/edit-crater-info.component';

@Component({
  imports: [EditComponentConstraintsComponent, EditComponentJsonComponent, EditCRaterInfoComponent],
  template: `
    <edit-component-constraints [componentContent]="component.content" />
    <edit-component-json [component]="component" />
    <edit-crater-info [cRaterRubric]="component.content.cRaterRubric" />
  `
})
export class EditDialogGuidanceAdvancedComponent extends EditAdvancedComponentComponent {}
