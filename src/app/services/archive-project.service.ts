import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Project } from '../domain/project';
import { ArchiveProjectResponse } from '../domain/archiveProjectResponse';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ArchiveProjectService {
  private refreshProjectsEventSource: Subject<void> = new Subject<void>();
  public refreshProjectsEvent$ = this.refreshProjectsEventSource.asObservable();

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

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

  showArchiveProjectSuccessMessage(project: Project, archive: boolean): void {
    this.snackBar
      .open($localize`Successfully ${archive ? 'archived' : 'restored'} unit.`, $localize`Undo`)
      .onAction()
      .subscribe(() => {
        this.undoArchiveProjectAction(project, archive ? 'unarchiveProject' : 'archiveProject');
      });
  }

  undoArchiveProjectAction(project: Project, archiveFunctionName: string): void {
    this[archiveFunctionName](project).subscribe({
      next: (response: ArchiveProjectResponse) => {
        this.updateProjectArchivedStatus(project, response.archived);
        this.snackBar.open($localize`Action undone.`);
      },
      error: () => {
        this.snackBar.open($localize`Error undoing action.`);
      }
    });
  }

  updateProjectArchivedStatus(project: Project, archived: boolean): void {
    project.archived = archived;
    if (archived) {
      project.tags.push('archived');
    } else {
      project.tags.splice(project.tags.indexOf('archived'), 1);
    }
    this.refreshProjects();
  }

  updateProjectsArchivedStatus(projects: Project[], archived: boolean): void {
    projects.forEach((project) => {
      this.updateProjectArchivedStatus(project, archived);
    });
  }

  showArchiveProjectsSuccessMessage(projects: Project[], archived: boolean): void {
    this.snackBar
      .open(
        archived
          ? $localize`Successfully archived ${projects.length} unit(s).`
          : $localize`Successfully restored ${projects.length} unit(s).`,
        $localize`Undo`
      )
      .onAction()
      .subscribe(() => {
        this.undoArchiveProjects(projects, archived ? 'unarchiveProjects' : 'archiveProjects');
      });
  }

  undoArchiveProjects(projects: Project[], archiveFunctionName: string): void {
    this[archiveFunctionName](projects).subscribe({
      next: (response: ArchiveProjectResponse[]) => {
        for (const projectResponse of response) {
          const project = projects.find((project) => project.id === projectResponse.id);
          this.updateProjectArchivedStatus(project, projectResponse.archived);
        }
        this.snackBar.open($localize`Action undone.`);
      },
      error: () => {
        this.snackBar.open($localize`Error undoing action.`);
      }
    });
  }

  showArchiveProjectErrorMessage(archive: boolean): void {
    this.snackBar.open($localize`Error ${archive ? 'archiving' : 'unarchiving'} unit.`);
  }
}
