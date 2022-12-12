import { Component, Input } from '@angular/core';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';

@Component({
  selector: 'step-info',
  templateUrl: 'step-info.component.html'
})
export class StepInfoComponent {
  alertIconClass: string;
  alertIconLabel: string;
  alertIconName: string;
  @Input() hasAlert: boolean;
  @Input() hasNewAlert: boolean;
  @Input() hasNewWork: boolean;
  hasRubrics: boolean;
  @Input() nodeId: string;
  rubricIconLabel: string;
  stepTitle: string;

  constructor(private projectService: TeacherProjectService) {}

  ngOnInit() {
    this.stepTitle = this.projectService.getNodePositionAndTitle(this.nodeId);
    if (this.hasAlert) {
      this.alertIconClass = this.hasNewAlert ? 'warn' : 'text-disabled';
      this.alertIconName = 'notifications';
      this.alertIconLabel = this.hasNewAlert
        ? $localize`Has new alert(s)`
        : $localize`Has dismissed alert(s)`;
    }
    this.hasRubrics = this.projectService.getNumberOfRubricsByNodeId(this.nodeId) > 0;
    this.rubricIconLabel = $localize`Step has rubrics/teaching tips`;
  }
}
