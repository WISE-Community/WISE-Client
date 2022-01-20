import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'show-work-student',
  templateUrl: './show-work-student.component.html',
  styleUrls: ['./show-work-student.component.scss']
})
export class ShowWorkStudentComponent implements OnInit {
  @Input() componentContent: any;
  @Input() nodeId: string;
  @Input() studentWork: any;

  ngOnInit(): void {}
}
