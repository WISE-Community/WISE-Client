import { Injectable } from '@angular/core';
import { ConfigService } from '../../assets/wise5/services/configService';

@Injectable()
export class WorkgroupService {
  constructor(private ConfigService: ConfigService) {}
  getWorkgroupsInPeriod(periodId: number): Map<number, any> {
    const workgroups = new Map();
    for (const workgroup of this.getWorkgroupsSortedById()) {
      if (workgroup.periodId === periodId) {
        workgroup.displayNames = this.ConfigService.getDisplayUsernamesByWorkgroupId(
          workgroup.workgroupId
        );
        workgroups.set(workgroup.workgroupId, workgroup);
      }
    }
    return workgroups;
  }

  private getWorkgroupsSortedById() {
    return this.ConfigService.getClassmateUserInfos().sort((a, b) => {
      return a.workgroupId - b.workgroupId;
    });
  }
}
