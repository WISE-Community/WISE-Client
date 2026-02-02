import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterModule } from '@angular/router';
import { scrollToTopOfPage, temporarilyHighlightElement } from '../../common/dom/dom';
import { DialogWithSpinnerComponent } from '../../directives/dialog-with-spinner/dialog-with-spinner.component';
import { ConfigService } from '../../services/configService';
import { CopyProjectService } from '../../services/copyProjectService';
import { SessionService } from '../../services/sessionService';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatListModule,
    MatTabsModule,
    MatTooltipModule,
    RouterModule
  ],
  styles: `
    .projectItem:hover {
      cursor: pointer;
      background-color: #add8e6;
    }
  `,
  templateUrl: './project-list.component.html'
})
export class ProjectListComponent implements OnInit, OnDestroy {
  private configService = inject(ConfigService);
  private copyProjectService = inject(CopyProjectService);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private sessionService = inject(SessionService);

  protected projects: any[] = [];
  protected sharedProjects: any[] = [];

  ngOnInit(): void {
    this.projects = this.configService
      .getConfigParam('projects')
      .filter((project) => !project.isDeleted);
    this.sharedProjects = this.configService
      .getConfigParam('sharedProjects')
      .sort((projectA, projectB) => projectB.id - projectA.id);
  }

  ngOnDestroy(): void {
    this.dialog.closeAll();
  }

  protected copyProject(projectId: number): void {
    if (confirm(this.getCopyProjectConfirmMessage(projectId))) {
      this.showMessageInModalDialog($localize`Copying Unit...`);
      this.copyProjectService.copyProject(projectId).subscribe({
        next: (project: any) => {
          scrollToTopOfPage();
          this.highlightNewProject(project.id);
        },
        error: () => {
          alert($localize`There was an error copying this unit. Please contact WISE staff.`);
        },
        complete: () => {
          this.dialog.closeAll();
        }
      });
    }
  }

  private getCopyProjectConfirmMessage(projectId: number): string {
    const project = this.projects
      .concat(this.sharedProjects)
      .find((project) => project.id === projectId);
    let projectInfo = `${projectId} ${project.name}`;
    if (project.runId != null) {
      projectInfo += $localize` (Run ID: ${project.runId})`;
    }
    return $localize`Are you sure you want to copy this unit?\n\n${projectInfo}`;
  }

  private highlightNewProject(projectId: number): void {
    this.configService.retrieveConfig(`/api/author/config`).subscribe(() => {
      this.projects = this.configService.getConfigParam('projects');
      // wait for new element to appear on the page
      setTimeout(() => {
        temporarilyHighlightElement(projectId.toString(), 3000);
      });
    });
  }

  private showMessageInModalDialog(message: string): void {
    this.dialog.open(DialogWithSpinnerComponent, {
      data: {
        title: message
      },
      disableClose: true
    });
  }

  protected openProject(projectId: number): void {
    this.showMessageInModalDialog($localize`Loading Unit...`);
    this.router.navigate([`/teacher/edit/unit/${projectId}`]);
  }

  protected previewProject(projectId: number): void {
    window.open(`${this.configService.getWISEBaseURL()}/preview/unit/${projectId}`);
  }

  protected goHome(): void {
    this.sessionService.goHome();
  }

  protected addNewProject(): void {
    this.router.navigate([`/teacher/edit/new-unit`]);
  }
}
