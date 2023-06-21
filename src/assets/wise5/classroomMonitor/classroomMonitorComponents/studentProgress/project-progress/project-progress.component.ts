import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'project-progress',
  templateUrl: './project-progress.component.html',
  styleUrls: ['./project-progress.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProjectProgressComponent implements OnInit {
  @Input() completed: number;
  @Input() percent: number;
  @Input() total: number;

  constructor() {}

  ngOnInit(): void {}
}
