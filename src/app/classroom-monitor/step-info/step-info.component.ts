import { Component, Input } from '@angular/core';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { StatusIconComponent } from '../status-icon/status-icon.component';
import { NodeIconComponent } from '../../../assets/wise5/vle/node-icon/node-icon.component';

@Component({
  imports: [CommonModule, FlexLayoutModule, NodeIconComponent, StatusIconComponent],
  selector: 'step-info',
  standalone: true,
  templateUrl: 'step-info.component.html'
})
export class StepInfoComponent {
  protected alertIconClass: string;
  protected alertIconLabel: string;
  protected alertIconName: string;
  @Input() hasAlert: boolean;
  @Input() hasNewAlert: boolean;
  @Input() hasNewWork: boolean;
  protected hasRubrics: boolean;
  @Input() nodeId: string;
  protected rubricIconLabel: string;
  protected stepTitle: string;

  constructor(private projectService: TeacherProjectService) {}

  ngOnInit(): void {
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
