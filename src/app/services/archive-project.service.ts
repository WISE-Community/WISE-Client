import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Project } from '../domain/project';

@Injectable()
export class ArchiveProjectService {
  constructor(private http: HttpClient) {}

  archiveProject(project: Project): Observable<any> {
    return this.http.put<Project>(`/api/project/${project.id}/archived`, null);
  }

  archiveProjects(projects: Project[]): Observable<any> {
    const projectIds = projects.map((project) => project.id);
    return this.http.put<Project[]>(`/api/projects/archived`, projectIds);
  }

  unarchiveProject(project: Project): Observable<any> {
    return this.http.delete<Project>(`/api/project/${project.id}/archived`);
  }

  unarchiveProjects(projects: Project[]): Observable<any> {
    let params = new HttpParams();
    for (const project of projects) {
      params = params.append('projectIds', project.id);
    }
    return this.http.delete<any>(`/api/projects/archived`, {
      params: params
    });
  }
}
