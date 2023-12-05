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

  showSuccessMessage(project: Project, archive: boolean): void {
    this.openSnackBar(
      project,
      $localize`Successfully ${archive ? 'archived' : 'restored'} unit.`,
      archive ? 'unarchiveProject' : 'archiveProject'
    );
  }

  showErrorMessage(archive: boolean): void {
    this.snackBar.open($localize`Error ${archive ? 'archiving' : 'unarchiving'} unit.`);
  }

  updateArchivedStatus(project: Project, archived: boolean): void {
    project.archived = archived;
    if (archived) {
      project.tags.push('archived');
    } else {
      project.tags.splice(project.tags.indexOf('archived'), 1);
    }
    this.refreshProjects();
  }

  openSnackBar(project: Project, message: string, undoFunctionName: string): void {
    this.snackBar
      .open(message, $localize`Undo`)
      .onAction()
      .subscribe(() => {
        this.undoArchiveAction(project, undoFunctionName);
      });
  }

  undoArchiveAction(project: Project, archiveFunctionName: string): void {
    this[archiveFunctionName](project).subscribe({
      next: (response: ArchiveProjectResponse) => {
        this.updateArchivedStatus(project, response.archived);
        this.snackBar.open($localize`Action undone.`);
      },
      error: () => {
        this.snackBar.open($localize`Error undoing action.`);
      }
    });
  }
}
