import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
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

  makeArchiveProjectsRequest(projects: Project[]): Observable<ArchiveProjectResponse[]> {
    const projectIds = projects.map((project) => project.id);
    return this.http.put<ArchiveProjectResponse[]>(`/api/projects/archived`, projectIds);
  }

  unarchiveProject(project: Project): Observable<ArchiveProjectResponse> {
    return this.http.delete<ArchiveProjectResponse>(`/api/project/${project.id}/archived`);
  }

  makeUnarchiveProjectsRequest(projects: Project[]): Observable<ArchiveProjectResponse[]> {
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
    project.updateArchivedStatus(archived);
    this.refreshProjects();
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
        this.undoArchiveProjects(
          projects,
          archived ? 'makeUnarchiveProjectsRequest' : 'makeArchiveProjectsRequest'
        );
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
    this.snackBar.open(
      archive ? $localize`Error archiving unit.` : $localize`Error restoring unit.`
    );
  }

  archiveProjects(projects: Project[], archive: boolean): Subscription {
    return this[archive ? 'makeArchiveProjectsRequest' : 'makeUnarchiveProjectsRequest'](
      projects
    ).subscribe({
      next: (archiveProjectsResponse: ArchiveProjectResponse[]) => {
        this.updateProjectsArchivedStatus(projects, archiveProjectsResponse);
        this.openSuccessSnackBar(projects, archiveProjectsResponse, archive);
      },
      error: () => {
        this.showErrorSnackBar(archive);
      }
    });
  }

  private updateProjectsArchivedStatus(
    projects: Project[],
    archiveProjectsResponse: ArchiveProjectResponse[]
  ): void {
    for (const archiveProjectResponse of archiveProjectsResponse) {
      const project = projects.find((project: Project) => project.id === archiveProjectResponse.id);
      project.updateArchivedStatus(archiveProjectResponse.archived);
    }
    this.refreshProjects();
  }

  private openSuccessSnackBar(
    projects: Project[],
    archiveProjectsResponse: ArchiveProjectResponse[],
    archived: boolean
  ): void {
    const count = archiveProjectsResponse.filter(
      (response: ArchiveProjectResponse) => response.archived === archived
    ).length;
    this.snackBar
      .open(
        archived
          ? $localize`Successfully archived ${count} unit(s).`
          : $localize`Successfully restored ${count} unit(s).`,
        $localize`Undo`
      )
      .onAction()
      .subscribe(() => {
        this.undoArchiveAction(
          projects,
          archived ? 'makeUnarchiveProjectsRequest' : 'makeArchiveProjectsRequest'
        );
      });
  }

  private showErrorSnackBar(archive: boolean): void {
    this.snackBar.open(
      archive ? $localize`Error archiving unit(s).` : $localize`Error restoring unit(s).`
    );
  }

  private undoArchiveAction(projects: Project[], archiveFunctionName: string): void {
    this[archiveFunctionName](projects).subscribe({
      next: (archiveProjectsResponse: ArchiveProjectResponse[]) => {
        this.updateProjectsArchivedStatus(projects, archiveProjectsResponse);
        this.refreshProjects();
        this.snackBar.open($localize`Action undone.`);
      },
      error: () => {
        this.snackBar.open($localize`Error undoing action.`);
      }
    });
  }
}
