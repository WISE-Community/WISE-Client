import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfigService } from '../../services/configService';
import { CopyProjectService } from '../../services/copyProjectService';
import { DialogWithCloseComponent } from '../../directives/dialog-with-close/dialog-with-close.component';
import { DialogWithSpinnerComponent } from '../../directives/dialog-with-spinner/dialog-with-spinner.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterModule } from '@angular/router';
import { scrollToTopOfPage, temporarilyHighlightElement } from '../../common/dom/dom';
import { SessionService } from '../../services/sessionService';

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
  protected projects: any[] = [];
  protected sharedProjects: any[] = [];

  constructor(
    private configService: ConfigService,
    private copyProjectService: CopyProjectService,
    private dialog: MatDialog,
    private router: Router,
    private sessionService: SessionService
  ) {}

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

  protected openProject(projectId: number, runId?: number): void {
    this.showMessageInModalDialog($localize`Loading Unit...`);
    this.router.navigate([`/teacher/edit/unit/${projectId}`]);
    const contactPageLink = this.getContactPageLink(projectId, runId);
    this.startTimer(contactPageLink);
  }

  private getContactPageLink(projectId: number, runId?: number): string {
    let link = this.configService.getWISEBaseURL();
    link += `/contact?authoringFailed=true&projectId=${projectId}`;
    if (runId) {
      link += `&runId=${runId}`;
    }
    return link;
  }

  private startTimer(link: string): void {
    let seconds = 10;
    const timer = setInterval(() => {
      seconds--;
      if (seconds <= 0) {
        clearInterval(timer);
        this.dialog.closeAll();
        this.openContactPageLinkDialog(link);
      }
    }, 1000);
  }

  private openContactPageLinkDialog(link: string): void {
    this.dialog.open(DialogWithCloseComponent, {
      data: {
        title: `<a href="${link}">${$localize`Having trouble loading unit? Contact WISE staff.`}</a>`
      }
    });
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
