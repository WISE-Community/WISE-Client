import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  TeacherReflection,
  TeacherReflectionAnswerRequest
} from './teacher-reflection.model';

@Injectable({
  providedIn: 'root'
})
export class TeacherReflectionService {
  private http = inject(HttpClient);
  private baseUrl = '/api/teacher/reflection';

  getQuestions(
    runId: number,
    periodId: number,
    nodeId: string,
    componentId: string
  ): Observable<TeacherReflection[]> {
    const params = new HttpParams()
      .set('runId', runId.toString())
      .set('periodId', periodId.toString())
      .set('nodeId', nodeId)
      .set('componentId', componentId);

    return this.http.get<TeacherReflection[]>(this.baseUrl, { params });
  }

  saveAnswer(request: TeacherReflectionAnswerRequest): Observable<TeacherReflection> {
    return this.http.put<TeacherReflection>(`${this.baseUrl}/answer`, request);
  }
}
