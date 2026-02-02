import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from '../../assets/wise5/services/configService';

@Injectable()
export class WorkgroupService {
  private configService = inject(ConfigService);
  private http = inject(HttpClient);

  getWorkgroupsInPeriod(periodId: number): Map<number, any> {
    const workgroups = new Map();
    for (const workgroup of this.getWorkgroupsSortedById()) {
      if (periodId === -1 || (workgroup.periodId === periodId && workgroup.workgroupId != null)) {
        workgroup.displayNames = this.configService.getDisplayUsernamesByWorkgroupId(
          workgroup.workgroupId
        );
        workgroups.set(workgroup.workgroupId, workgroup);
      }
    }
    return workgroups;
  }

  private getWorkgroupsSortedById() {
    return this.configService.getClassmateUserInfos().sort((a, b) => {
      return a.workgroupId - b.workgroupId;
    });
  }

  createWorkgroup(periodId: number, memberIds: number[]): Observable<any> {
    return this.http.post(
      `/api/teacher/run/${this.configService.getRunId()}/workgroup/create/${periodId}`,
      memberIds
    );
  }

  isUserInAnyWorkgroup(user: any): boolean {
    return this.configService.getClassmateUserInfos().some((userInfo) => {
      return userInfo.userIds != null && userInfo.userIds.includes(user.id);
    });
  }
}
