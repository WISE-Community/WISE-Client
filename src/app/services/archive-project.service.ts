import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { Project } from '../domain/project';
import { ArchiveProjectResponse } from '../domain/archiveProjectResponse';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Tag } from '../domain/tag';

@Injectable()
export class ArchiveProjectService {
  private refreshProjectsEventSource: Subject<void> = new Subject<void>();
  public refreshProjectsEvent$ = this.refreshProjectsEventSource.asObservable();

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  archiveProject(project: Project, archive: boolean): void {
    this[archive ? 'makeArchiveProjectRequest' : 'makeUnarchiveProjectRequest'](project).subscribe({
      next: (response: ArchiveProjectResponse) => {
        this.updateProjectArchivedStatus(project, response.archived, response.tag);
        this.showArchiveProjectSuccessMessage(project, archive);
      },
      error: () => {
        this.showArchiveProjectErrorMessage(archive);
      }
    });
  }

  private makeArchiveProjectRequest(project: Project): Observable<ArchiveProjectResponse> {
    return this.http.put<ArchiveProjectResponse>(`/api/project/${project.id}/archived`, null);
  }

  private makeUnarchiveProjectRequest(project: Project): Observable<ArchiveProjectResponse> {
    return this.http.delete<ArchiveProjectResponse>(`/api/project/${project.id}/archived`);
  }

  private updateProjectArchivedStatus(project: Project, archived: boolean, tag: Tag): void {
    project.updateArchivedStatus(archived, tag);
    this.refreshProjects();
  }

  private showArchiveProjectSuccessMessage(project: Project, archive: boolean): void {
    this.snackBar
      .open($localize`Successfully ${archive ? 'archived' : 'restored'} unit.`, $localize`Undo`)
      .onAction()
      .subscribe(() => {
        this.undoArchiveProjectAction(
          project,
          archive ? 'makeUnarchiveProjectRequest' : 'makeArchiveProjectRequest'
        );
      });
  }

  private undoArchiveProjectAction(project: Project, archiveFunctionName: string): void {
    this[archiveFunctionName](project).subscribe({
      next: (response: ArchiveProjectResponse) => {
        this.updateProjectArchivedStatus(project, response.archived, response.tag);
        this.snackBar.open($localize`Action undone.`);
      },
      error: () => {
        this.snackBar.open($localize`Error undoing action.`);
      }
    });
  }

  private showArchiveProjectErrorMessage(archive: boolean): void {
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

  private makeArchiveProjectsRequest(projects: Project[]): Observable<ArchiveProjectResponse[]> {
    const projectIds = projects.map((project) => project.id);
    return this.http.put<ArchiveProjectResponse[]>(`/api/projects/archived`, projectIds);
  }

  private makeUnarchiveProjectsRequest(projects: Project[]): Observable<ArchiveProjectResponse[]> {
    let params = new HttpParams();
    for (const project of projects) {
      params = params.append('projectIds', project.id);
    }
    return this.http.delete<ArchiveProjectResponse[]>(`/api/projects/archived`, {
      params: params
    });
  }

  private updateProjectsArchivedStatus(
    projects: Project[],
    archiveProjectsResponse: ArchiveProjectResponse[]
  ): void {
    for (const archiveProjectResponse of archiveProjectsResponse) {
      const project = projects.find((project: Project) => project.id === archiveProjectResponse.id);
      project.updateArchivedStatus(archiveProjectResponse.archived, archiveProjectResponse.tag);
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

  private showErrorSnackBar(archive: boolean): void {
    this.snackBar.open(
      archive ? $localize`Error archiving unit(s).` : $localize`Error restoring unit(s).`
    );
  }

  private refreshProjects(): void {
    this.refreshProjectsEventSource.next();
  }
}
