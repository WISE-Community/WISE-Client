import { Component, inject, Input, ViewEncapsulation } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ClassroomStatusService } from '../../../assets/wise5/services/classroomStatusService';
import { MatIconModule } from '@angular/material/icon';
import { ProjectService } from '../../../assets/wise5/services/projectService';
import { ConfigService } from '../../../assets/wise5/services/configService';
import { Subscription } from 'rxjs';

@Component({
  imports: [MatIconModule, MatTooltipModule],
  selector: 'teams-on-node',
  templateUrl: './teams-on-node.component.html'
})
export class TeamsOnNodeComponent {
  private classroomStatusService = inject(ClassroomStatusService);
  private configService = inject(ConfigService);
  private projectService = inject(ProjectService);

  @Input() nodeId: string;
  @Input() period: any;
  private subscriptions: Subscription = new Subscription();
  protected tooltipText: string;
  protected workgroupsOnNode: any[] = [];

  ngOnInit(): void {
    this.subscriptions.add(
      this.classroomStatusService.studentStatusReceived$.subscribe(() => {
        this.ngOnChanges();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnChanges(): void {
    this.workgroupsOnNode = this.classroomStatusService.getWorkgroupsOnNode(
      this.nodeId,
      this.period.periodId
    );
    const teams = this.workgroupsOnNode.length === 1 ? $localize`team` : $localize`teams`;
    const stepOrLesson = this.projectService.isApplicationNode(this.nodeId)
      ? $localize`step`
      : $localize`lesson`;
    this.tooltipText = $localize`${this.workgroupsOnNode.length} ${teams} on this ${stepOrLesson}\:`;
    if (this.configService.getPermissions().canViewStudentNames) {
      this.tooltipText +=
        `\n` +
        this.workgroupsOnNode
          .map(
            (workgroup) =>
              `${this.configService.getDisplayUsernamesByWorkgroupId(workgroup.workgroupId)}\n`
          )
          .join('');
    }
  }
}
