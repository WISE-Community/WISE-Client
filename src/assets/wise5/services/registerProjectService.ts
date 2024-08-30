import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class RegisterProjectService {
  constructor(private http: HttpClient) {}

  /**
   * Registers a new project having the projectJSON content with the server.
   * Returns a new project id if the project is successfully registered.
   * @param name title of the new project
   * @param projectJSONString a valid JSON string of the project
   */
  register(name: string, projectJSONString: string): Observable<number> {
    return this.http.post<number>('/api/author/project/new', {
      projectName: name,
      projectJSONString: projectJSONString
    });
  }
}
