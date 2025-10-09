import { Component } from '@angular/core';
import { ComponentStudent } from '../../component-student.component';
import { ComponentHeaderComponent } from '../../../directives/component-header/component-header.component';
import { ShowGroupWorkDisplayComponent } from '../show-group-work-display/show-group-work-display.component';

@Component({
  imports: [ComponentHeaderComponent, ShowGroupWorkDisplayComponent],
  styleUrl: './show-group-work-student.component.scss',
  template: `<component-header [component]="component" />
    <show-group-work-display
      [componentId]="componentId"
      [componentContent]="componentContent"
      [nodeId]="nodeId"
      [workgroupId]="workgroupId"
    />`
})
export class ShowGroupWorkStudentComponent extends ComponentStudent {}
