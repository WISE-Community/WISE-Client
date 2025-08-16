import { Component } from '@angular/core';
import { ComponentStudent } from '../../component-student.component';

@Component({
  selector: 'show-group-work-student',
  styleUrl: './show-group-work-student.component.scss',
  standalone: false,
  template: `<component-header [component]="component" />
    <show-group-work-display
      [componentId]="componentId"
      [componentContent]="componentContent"
      [nodeId]="nodeId"
      [workgroupId]="workgroupId"
    />`
})
export class ShowGroupWorkStudentComponent extends ComponentStudent {}
