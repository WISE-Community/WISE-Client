import { Component, Input } from '@angular/core';

@Component({
  selector: 'show-work-student',
  standalone: false,
  templateUrl: './show-work-student.component.html'
})
export class ShowWorkStudentComponent {
  @Input() componentContent: any;
  @Input() componentId: string;
  @Input() nodeId: string;
  @Input() studentWork: any;
}
