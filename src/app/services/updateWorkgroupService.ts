import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ConfigService } from '../../assets/wise5/services/configService';
import { Observable } from 'rxjs';

@Injectable()
export class UpdateWorkgroupService {
  private configService = inject(ConfigService);
  private http = inject(HttpClient);

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
