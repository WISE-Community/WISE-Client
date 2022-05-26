import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ComponentState } from '../../../app/domain/componentState';
import { ConfigService } from './configService';

@Injectable()
export class TeacherWorkService {
  constructor(private configService: ConfigService, private http: HttpClient) {}

  saveWork(work: ComponentState): Observable<ComponentState> {
    return this.http.post<ComponentState>(
      `/api/teacher/run/${this.configService.getRunId()}/work`,
      work
    );
  }
}
