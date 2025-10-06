import { Component, Input, OnInit } from '@angular/core';
import { ProjectService } from '../../../services/projectService';
import { TeacherDataService } from '../../../services/teacherDataService';
import { ShowWorkStudentComponent } from '../../showWork/show-work-student/show-work-student.component';

@Component({
  imports: [ShowWorkStudentComponent],
  template: `
    @if (componentState != null) {
      <show-work-student
        [studentWork]="componentState"
        [componentId]="showWorkComponentId"
        [nodeId]="showWorkNodeId"
      />
    }
  `
})
export class ShowMyWorkGradingComponent implements OnInit {
  @Input() componentId: string;
  protected componentState: any;
  @Input() nodeId: string;
  protected showWorkComponentId: string;
  protected showWorkNodeId: string;
  @Input() workgroupId: number;

  constructor(
    private dataService: TeacherDataService,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    const component: any = this.projectService.getComponent(this.nodeId, this.componentId);
    this.showWorkNodeId = component.showWorkNodeId;
    this.showWorkComponentId = component.showWorkComponentId;
    this.componentState = this.dataService.getLatestComponentStateByWorkgroupIdNodeIdAndComponentId(
      this.workgroupId,
      this.showWorkNodeId,
      this.showWorkComponentId
    );
  }
}
