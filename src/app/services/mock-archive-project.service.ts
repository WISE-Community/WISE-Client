import { Observable, Subject, of } from 'rxjs';
import { Project } from '../domain/project';
import { ArchiveProjectResponse } from '../domain/archiveProjectResponse';

export class MockArchiveProjectService {
  private refreshProjectsEventSource: Subject<void> = new Subject<void>();
  public refreshProjectsEvent$ = this.refreshProjectsEventSource.asObservable();

  archiveProject(project: Project): Observable<ArchiveProjectResponse> {
    return this.archiveProjectHelper(project, true);
  }

  unarchiveProject(project: Project): Observable<ArchiveProjectResponse> {
    return this.archiveProjectHelper(project, false);
  }

  private archiveProjectHelper(
    project: Project,
    archived: boolean
  ): Observable<ArchiveProjectResponse> {
    project.archived = archived;
    return of(project);
  }

  archiveProjects(projects: Project[]): Observable<ArchiveProjectResponse[]> {
    return this.archiveProjectsHelper(projects, true);
  }

  unarchiveProjects(projects: Project[]): Observable<ArchiveProjectResponse[]> {
    return this.archiveProjectsHelper(projects, false);
  }

  private archiveProjectsHelper(
    projects: Project[],
    archived: boolean
  ): Observable<ArchiveProjectResponse[]> {
    projects.forEach((project) => (project.archived = archived));
    return of(projects);
  }

  refreshProjects(): void {
    this.refreshProjectsEventSource.next();
  }
}
