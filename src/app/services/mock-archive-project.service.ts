import { Observable, Subject, of } from 'rxjs';
import { Project } from '../domain/project';
import { ArchiveProjectResponse } from '../domain/archiveProjectResponse';

export class MockArchiveProjectService {
  private refreshProjectsEventSource: Subject<void> = new Subject<void>();
  public refreshProjectsEvent$ = this.refreshProjectsEventSource.asObservable();

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

  refreshProjects(): void {
    this.refreshProjectsEventSource.next();
  }
}
