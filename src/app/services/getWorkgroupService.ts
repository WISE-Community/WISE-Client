import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../../assets/wise5/services/configService';

@Injectable()
export class GetWorkgroupService {
  constructor(private ConfigService: ConfigService, private http: HttpClient) {}

  getAllWorkgroupsInPeriod(periodId: number) {
    return this.http.get(
      `/api/teacher/run/${this.ConfigService.getRunId()}/period/${periodId}/workgroups`
    );
  }
}
