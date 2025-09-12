import { Component } from '@angular/core';
import { EditAdvancedComponentComponent } from '../../../../../app/authoring-tool/edit-advanced-component/edit-advanced-component.component';
import { EditComponentWidthComponent } from '../../../../../app/authoring-tool/edit-component-width/edit-component-width.component';
import { EditComponentConstraintsComponent } from '../../../../../app/authoring-tool/edit-component-constraints/edit-component-constraints.component';
import { EditComponentJsonComponent } from '../../../../../app/authoring-tool/edit-component-json/edit-component-json.component';
import { EditComponentRubricComponent } from '../../../../../app/authoring-tool/edit-component-rubric/edit-component-rubric.component';

@Component({
  imports: [
    EditComponentConstraintsComponent,
    EditComponentJsonComponent,
    EditComponentRubricComponent,
    EditComponentWidthComponent
  ],
  template: `<edit-component-width [componentContent]="componentContent" />
    <edit-component-rubric [componentContent]="componentContent" />
    <edit-component-constraints [componentContent]="component.content" />
    <edit-component-json [component]="component" />`
})
export class EditHTMLAdvancedComponent extends EditAdvancedComponentComponent {}
