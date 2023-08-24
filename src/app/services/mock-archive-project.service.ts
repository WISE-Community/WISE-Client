import { Observable, of } from 'rxjs';
import { Project } from '../domain/project';
import { ArchiveProjectResponse } from '../domain/archiveProjectResponse';

export class MockArchiveProjectService {
  archiveProject(project: Project): Observable<ArchiveProjectResponse> {
    project.archived = true;
    return of(project);
  }

  archiveProjects(projects: Project[]): Observable<ArchiveProjectResponse[]> {
    projects.forEach((project) => (project.archived = true));
    return of(projects);
  }

  unarchiveProject(project: Project): Observable<ArchiveProjectResponse> {
    project.archived = false;
    return of(project);
  }

  unarchiveProjects(projects: Project[]): Observable<ArchiveProjectResponse[]> {
    projects.forEach((project) => (project.archived = false));
    return of(projects);
  }
}
