import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../../assets/wise5/services/configService';

@Injectable()
export class UpdateWorkgroupService {
  constructor(private ConfigService: ConfigService, private http: HttpClient) {}

  /**
   * Move student between workgroups, or to/from workgroup and unassigned students
   * @param userId Student User ID
   * @param workgroupIdFrom Workgroup ID to move student from. -1 if student is not in a workgroup
   * @param workgroupIdTo Workgroup ID to move student to. -1 if moving student to unassigned
   * @param periodId Period ID the student is in.
   */
  moveMember(userId: number, workgroupIdTo: number) {
    return this.http.post(
      `/api/teacher/run/${this.ConfigService.getRunId()}/workgroup/move-user/${userId}`,
      {
        workgroupIdTo: workgroupIdTo
      }
    );
  }
}
