'use strict';

import { Component, Input } from '@angular/core';
import { getAvatarColorForWorkgroupId } from '../../../../common/workgroup/workgroup';

@Component({
  selector: 'workgroup-info',
  templateUrl: 'workgroup-info.component.html'
})
export class WorkgroupInfoComponent {
  alertIconClass: string;
  alertIconName: string;
  alertLabel: string;
  avatarColor: any;

  @Input()
  hasAlert: boolean;

  @Input()
  hasNewAlert: boolean;

  @Input()
  hasNewWork: boolean;

  @Input()
  usernames: string;

  @Input()
  workgroupId: number;

  constructor() {}

  ngOnInit() {
    this.avatarColor = getAvatarColorForWorkgroupId(this.workgroupId);
    this.alertIconClass = this.hasNewAlert ? 'warn' : 'text-disabled';
    this.alertIconName = 'notifications';
    this.alertLabel = this.hasNewAlert
      ? $localize`Has new alert(s)`
      : $localize`Has dismissed alert(s)`;
  }
}
