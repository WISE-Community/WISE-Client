import { Observable, Subject, Subscription, of } from 'rxjs';
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

  archiveProjects(projects: Project[], archived: boolean): Subscription {
    projects.forEach((project) => (project.archived = archived));
    this.refreshProjects();
    return of(projects).subscribe();
  }

  refreshProjects(): void {
    this.refreshProjectsEventSource.next();
  }
}
