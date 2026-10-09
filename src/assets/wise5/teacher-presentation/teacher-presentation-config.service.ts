import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TeacherPresentationConfig } from './teacher-presentation-config';

@Injectable({
  providedIn: 'root'
})
export class TeacherPresentationConfigService {
  private http = inject(HttpClient);
  private baseUrl = '/api/teacher/presentation-config';

  getConfig(
    runId: number,
    periodId: number,
    nodeId: string,
    componentId: string
  ): Observable<TeacherPresentationConfig> {
    const params = new HttpParams()
      .set('runId', runId.toString())
      .set('periodId', periodId.toString())
      .set('nodeId', nodeId)
      .set('componentId', componentId);

    return this.http.get<TeacherPresentationConfig>(this.baseUrl, { params });
  }

  saveConfig(config: Partial<TeacherPresentationConfig>): Observable<TeacherPresentationConfig> {
    return this.http.put<TeacherPresentationConfig>(this.baseUrl, config);
  }
}
