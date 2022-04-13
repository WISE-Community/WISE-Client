import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './configService';

@Injectable()
export class CopyProjectService {
  constructor(protected http: HttpClient, protected ConfigService: ConfigService) {}

  copyProject(projectId: number): Observable<any> {
    return this.http.post(
      `${this.ConfigService.getConfigParam('copyProjectURL')}/${projectId}`,
      null
    );
  }
}
