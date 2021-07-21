import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../../assets/wise5/services/configService';

@Injectable()
export class UpdateWorkgroupService {
  constructor(private ConfigService: ConfigService, private http: HttpClient) {}

  moveMember(userId: string, workgroupIdFrom, workgroupIdTo) {
    return this.http.post(
      `/api/teacher/run/${this.ConfigService.getRunId()}/workgroup/move-user/${userId}`,
      {
        workgroupIdFrom: workgroupIdFrom,
        workgroupIdTo: workgroupIdTo
      }
    );
  }
}
