import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ConfigService } from '../../assets/wise5/services/configService';

@Injectable()
export class GetWorkgroupService {
  private configService = inject(ConfigService);
  private http = inject(HttpClient);

  getAllWorkgroupsInPeriod(periodId: number) {
    return this.http.get(
      `/api/teacher/run/${this.configService.getRunId()}/period/${periodId}/workgroups`
    );
  }
}
