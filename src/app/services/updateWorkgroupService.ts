import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../../assets/wise5/services/configService';
import { TeacherDataService } from '../../assets/wise5/services/teacherDataService';

@Injectable()
export class UpdateWorkgroupService {
  constructor(
    private ConfigService: ConfigService,
    private TeacherDataService: TeacherDataService,
    private http: HttpClient
  ) {}

  /**
   * Move student between workgroups, or to/from workgroup and unassigned students
   * @param userId Student User ID
   * @param workgroupIdFrom Workgroup ID to move student from. -1 if student is not in a workgroup
   * @param workgroupIdTo Workgroup ID to move student to. -1 if moving student to unassigned
   * @param periodId Period ID the student is in.
   */
  moveMember(
    userId: number,
    workgroupIdFrom: number = -1,
    workgroupIdTo: number = -1,
    periodId: number = this.TeacherDataService.getCurrentPeriodId()
  ) {
    return this.http.post(
      `/api/teacher/run/${this.ConfigService.getRunId()}/workgroup/move-user/${userId}`,
      {
        workgroupIdFrom: workgroupIdFrom,
        workgroupIdTo: workgroupIdTo,
        periodId: periodId
      }
    );
  }
}
