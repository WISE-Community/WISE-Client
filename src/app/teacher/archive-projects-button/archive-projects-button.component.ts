import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { ArchiveProjectService } from '../../services/archive-project.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ArchiveProjectResponse } from '../../domain/archiveProjectResponse';
import { Project } from '../../domain/project';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule],
  selector: 'archive-projects-button',
  templateUrl: './archive-projects-button.component.html',
  styleUrls: ['./archive-projects-button.component.scss']
})
export class ArchiveProjectsButtonComponent {
  @Output() archiveActionEvent = new EventEmitter<void>();
  @Input() projects: Project[] = [];
  @Input() showArchive: boolean = false;

  constructor(
    private archiveProjectService: ArchiveProjectService,
    private snackBar: MatSnackBar
  ) {}

  protected archiveSelectedProjects(archive: boolean): Subscription {
    const projects = this.getSelectedProjects();
    return this.archiveProjectService[archive ? 'archiveProjects' : 'unarchiveProjects'](
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
    this.archiveActionEvent.emit();
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
        this.undoArchiveAction(projects, archived ? 'unarchiveProjects' : 'archiveProjects');
      });
  }

  private showErrorSnackBar(archive: boolean): void {
    this.snackBar.open(
      archive ? $localize`Error archiving unit(s).` : $localize`Error restoring unit(s).`
    );
  }

  private undoArchiveAction(projects: Project[], archiveFunctionName: string): void {
    this.archiveProjectService[archiveFunctionName](projects).subscribe({
      next: (archiveProjectsResponse: ArchiveProjectResponse[]) => {
        this.updateProjectsArchivedStatus(projects, archiveProjectsResponse);
        this.archiveProjectService.refreshProjects();
        this.snackBar.open($localize`Action undone.`);
      },
      error: () => {
        this.snackBar.open($localize`Error undoing action.`);
      }
    });
  }

  private getSelectedProjects(): Project[] {
    return this.projects.filter((project: Project) => project.selected);
  }
}
