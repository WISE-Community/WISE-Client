import { Component, Input, OnInit } from '@angular/core';
import { ProjectService } from '../../../services/projectService';
import { TeacherDataService } from '../../../services/teacherDataService';

@Component({
  selector: 'show-my-work-grading',
  templateUrl: './show-my-work-grading.component.html',
  styleUrls: ['./show-my-work-grading.component.scss']
})
export class ShowMyWorkGradingComponent implements OnInit {
  @Input() componentId: string;
  protected componentState: any;
  @Input() nodeId: string;
  protected showWorkComponentId: string;
  protected showWorkNodeId: string;
  @Input() workgroupId: number;

  constructor(
    private projectService: ProjectService,
    private teacherDataService: TeacherDataService
  ) {}

  ngOnInit(): void {
    const component: any = this.projectService.getComponent(this.nodeId, this.componentId);
    this.showWorkNodeId = component.showWorkNodeId;
    this.showWorkComponentId = component.showWorkComponentId;
    this.componentState = this.teacherDataService.getLatestComponentStateByWorkgroupIdNodeIdAndComponentId(
      this.workgroupId,
      this.showWorkNodeId,
      this.showWorkComponentId
    );
  }
}
