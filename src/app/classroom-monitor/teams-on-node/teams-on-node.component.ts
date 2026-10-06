import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ClassroomStatusService } from '../../../assets/wise5/services/classroomStatusService';
import { MatIconModule } from '@angular/material/icon';
import { ProjectService } from '../../../assets/wise5/services/projectService';
import { ConfigService } from '../../../assets/wise5/services/configService';
import { scan } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, MatTooltipModule],
  selector: 'teams-on-node',
  templateUrl: './teams-on-node.component.html'
})
export class TeamsOnNodeComponent {
  private classroomStatusService = inject(ClassroomStatusService);
  private configService = inject(ConfigService);
  private projectService = inject(ProjectService);

  readonly nodeId = input<string>('');
  readonly period = input<any>();

  // using scan and count ensures we get a new value every time the source emits
  private studentStatusReceived = this.classroomStatusService.studentStatusReceived$
    ? toSignal(
        this.classroomStatusService.studentStatusReceived$.pipe(scan((count) => count + 1, 0)),
        { initialValue: 0 }
      )
    : undefined;

  protected workgroupsOnNode = computed(() => {
    this.studentStatusReceived?.();
    const nodeId = this.nodeId();
    const period = this.period();
    if (!nodeId || period?.periodId == null) {
      return [];
    }
    return this.classroomStatusService.getWorkgroupsOnNode(nodeId, period.periodId) ?? [];
  });

  protected tooltipText = computed(() => {
    const workgroups = this.workgroupsOnNode();
    const nodeId = this.nodeId();
    const teams = workgroups.length === 1 ? $localize`team` : $localize`teams`;
    const stepOrLesson =
      nodeId && this.projectService.isApplicationNode(nodeId) ? $localize`step` : $localize`lesson`;
    let text = $localize`${workgroups.length} ${teams} on this ${stepOrLesson}\:`;
    if (this.configService.getPermissions()?.canViewStudentNames) {
      text +=
        `\n` +
        workgroups
          .map(
            (workgroup) =>
              `${this.configService.getDisplayUsernamesByWorkgroupId(workgroup.workgroupId)}\n`
          )
          .join('');
    }
    return text;
  });
}
