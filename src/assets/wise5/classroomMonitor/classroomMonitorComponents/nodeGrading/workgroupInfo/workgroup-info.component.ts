import { Component, Input } from '@angular/core';
import { getAvatarColorForWorkgroupId } from '../../../../common/workgroup/workgroup';
import { MatIconModule } from '@angular/material/icon';
import { StatusIconComponent } from '../../../../../../app/classroom-monitor/status-icon/status-icon.component';

@Component({
  imports: [MatIconModule, StatusIconComponent],
  selector: 'workgroup-info',
  templateUrl: 'workgroup-info.component.html'
})
export class WorkgroupInfoComponent {
  protected alertIconClass: string;
  protected alertIconName: string;
  protected alertLabel: string;
  protected avatarColor: string;
  @Input() hasAlert: boolean;
  @Input() hasNewAlert: boolean;
  @Input() hasNewWork: boolean;
  @Input() usernames: string;
  @Input() workgroupId: number;

  ngOnInit(): void {
    this.avatarColor = getAvatarColorForWorkgroupId(this.workgroupId);
    this.alertIconClass = this.hasNewAlert ? 'warn' : 'text-disabled';
    this.alertIconName = 'notifications';
    this.alertLabel = this.hasNewAlert
      ? $localize`Has new alert(s)`
      : $localize`Has dismissed alert(s)`;
  }
}
