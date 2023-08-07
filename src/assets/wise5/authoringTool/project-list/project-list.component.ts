import { Component, OnInit } from '@angular/core';
import { temporarilyHighlightElement } from '../../common/dom/dom';
import { ConfigService } from '../../services/configService';
import { CopyProjectService } from '../../services/copyProjectService';
import { UpgradeModule } from '@angular/upgrade/static';
import { MatDialog } from '@angular/material/dialog';
import { DialogWithSpinnerComponent } from '../../directives/dialog-with-spinner/dialog-with-spinner.component';
import { SessionService } from '../../services/sessionService';

@Component({
  selector: 'project-list-authoring',
  styleUrls: ['./project-list.component.scss'],
  templateUrl: './project-list.component.html'
})
export class ProjectListComponent implements OnInit {
  protected projects: any[];
  protected sharedProjects: any[];
  private $state: any;

  constructor(
    private configService: ConfigService,
    private copyProjectService: CopyProjectService,
    private dialog: MatDialog,
    private sessionService: SessionService,
    private upgrade: UpgradeModule
  ) {}

  ngOnInit(): void {
    this.$state = this.upgrade.$injector.get('$state');
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
          this.scrollToTopOfPage();
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
    this.configService.retrieveConfig(`/api/author/config`).then(() => {
      this.projects = this.configService.getConfigParam('projects');
      // wait for new element to appear on the page
      setTimeout(() => {
        temporarilyHighlightElement(projectId.toString(), 3000);
      });
    });
  }

  private scrollToTopOfPage(): void {
    document.getElementById('top').scrollIntoView();
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
    this.$state.go('root.at.project', { projectId: projectId });
  }

  protected previewProject(projectId: number): void {
    window.open(`${this.configService.getWISEBaseURL()}/preview/unit/${projectId}`);
  }

  protected goHome(): void {
    this.sessionService.goHome();
  }

  protected addNewProject(): void {
    this.$state.go('root.at.new-unit');
  }
}
