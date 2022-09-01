import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'project-progress',
  templateUrl: './project-progress.component.html',
  styleUrls: ['./project-progress.component.scss']
})
export class ProjectProgressComponent implements OnInit {
  @Input() completed: number;
  @Input() percent: number;
  @Input() total: number;

  constructor() {}

  ngOnInit(): void {}
}
