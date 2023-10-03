import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../../assets/wise5/services/configService';
import { Observable } from 'rxjs';

@Injectable()
export class UpdateWorkgroupService {
  constructor(private configService: ConfigService, private http: HttpClient) {}

  /**
   * Move student to a workgroup
   * @param userId Student User ID
   * @param workgroupIdTo Workgroup ID to move student to
   * @return Observable of move student response
   */
  moveMember(userId: number, workgroupIdTo: number): Observable<any> {
    return this.http.post(
      `/api/teacher/run/${this.configService.getRunId()}/workgroup/move-user/${userId}`,
      {
        workgroupIdTo: workgroupIdTo
      }
    );
  }
}
