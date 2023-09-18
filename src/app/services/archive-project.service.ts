import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Project } from '../domain/project';
import { ArchiveProjectResponse } from '../domain/archiveProjectResponse';

@Injectable()
export class ArchiveProjectService {
  private refreshProjectsEventSource: Subject<void> = new Subject<void>();
  public refreshProjectsEvent$ = this.refreshProjectsEventSource.asObservable();

  constructor(private http: HttpClient) {}

  archiveProject(project: Project): Observable<ArchiveProjectResponse> {
    return this.http.put<ArchiveProjectResponse>(`/api/project/${project.id}/archived`, null);
  }

  archiveProjects(projects: Project[]): Observable<ArchiveProjectResponse[]> {
    const projectIds = projects.map((project) => project.id);
    return this.http.put<ArchiveProjectResponse[]>(`/api/projects/archived`, projectIds);
  }

  unarchiveProject(project: Project): Observable<ArchiveProjectResponse> {
    return this.http.delete<ArchiveProjectResponse>(`/api/project/${project.id}/archived`);
  }

  unarchiveProjects(projects: Project[]): Observable<ArchiveProjectResponse[]> {
    let params = new HttpParams();
    for (const project of projects) {
      params = params.append('projectIds', project.id);
    }
    return this.http.delete<ArchiveProjectResponse[]>(`/api/projects/archived`, {
      params: params
    });
  }

  refreshProjects(): void {
    this.refreshProjectsEventSource.next();
  }
}
