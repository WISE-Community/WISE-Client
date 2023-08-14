import { ConfigService } from '../../services/configService';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { NotificationService } from '../../services/notificationService';
import { Component } from '@angular/core';
import { isValidJSONString } from '../../common/string/string';
import { MatDialog } from '@angular/material/dialog';
import { AssetChooser } from '../project-asset-authoring/asset-chooser';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'advanced-project-authoring',
  templateUrl: 'advanced-project-authoring.component.html',
  styleUrls: ['./advanced-project-authoring.component.scss']
})
export class AdvancedProjectAuthoringComponent {
  protected jsonDisplayed: boolean;
  private projectId: number;
  protected projectJSONString: string;
  protected projectScriptFilename: string;
  protected rubricDisplayed: boolean;

  constructor(
    private dialog: MatDialog,
    private configService: ConfigService,
    private notificationService: NotificationService,
    private projectService: TeacherProjectService
  ) {
    this.projectId = this.configService.getProjectId();
  }

  ngOnInit() {
    this.setProjectScriptFilename();
  }

  protected toggleRubric(): void {
    this.jsonDisplayed = false;
    this.rubricDisplayed = !this.rubricDisplayed;
  }

  protected toggleJSON(): void {
    this.rubricDisplayed = false;
    if (this.jsonDisplayed) {
      this.hideJSON();
    } else {
      this.showJSON();
    }
  }

  private hideJSON(): void {
    if (isValidJSONString(this.projectJSONString)) {
      this.jsonDisplayed = false;
      this.notificationService.hideJSONValidMessage();
    } else if (
      confirm(
        $localize`The JSON is invalid. Invalid JSON will not be saved.\nClick "OK" to revert back to the last valid JSON.\nClick "Cancel" to keep the invalid JSON open so you can fix it.`
      )
    ) {
      this.jsonDisplayed = false;
      this.notificationService.hideJSONValidMessage();
    }
  }

  private showJSON(): void {
    this.jsonDisplayed = true;
    this.projectJSONString = JSON.stringify(this.projectService.project, null, 4);
    this.notificationService.showJSONValidMessage();
  }

  protected autoSaveProjectJSONString(): void {
    try {
      this.saveProjectJSON(this.projectJSONString);
      this.notificationService.showJSONValidMessage();
    } catch (e) {
      this.notificationService.showJSONInvalidMessage();
    }
  }

  private saveProjectJSON(projectJSONString: string): void {
    const project = JSON.parse(projectJSONString);
    this.projectService.setProject(project);
    this.setProjectScriptFilename();
    this.projectService.checkPotentialStartNodeIdChangeThenSaveProject();
  }

  private setProjectScriptFilename(): void {
    this.projectScriptFilename = this.projectService.getProjectScriptFilename();
  }

  protected chooseProjectScriptFile(): void {
    new AssetChooser(this.dialog, null, null, this.projectId)
      .open('scriptFilename')
      .afterClosed()
      .pipe(filter((data) => data != null))
      .subscribe((data: any) => {
        this.assetSelected(data);
      });
  }

  private assetSelected({ assetItem }): void {
    this.projectScriptFilename = assetItem.fileName;
    this.projectScriptFilenameChanged();
  }

  protected downloadProject(): void {
    window.location.href = `${this.configService.getWISEBaseURL()}/api/project/export/${
      this.projectId
    }`;
  }

  protected openProjectURLInNewTab(): void {
    window.open(this.getProjectURL(), '_blank');
  }

  protected copyProjectURL(): void {
    const textArea = document.createElement('textarea');
    textArea.value = this.getProjectURL();
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }

  protected getProjectURL(): string {
    return window.location.origin + this.configService.getConfigParam('projectURL');
  }

  protected projectScriptFilenameChanged(): void {
    this.projectService.setProjectScriptFilename(this.projectScriptFilename);
    if (this.showJSON) {
      this.projectJSONString = JSON.stringify(this.projectService.project, null, 4);
    }
    this.projectService.saveProject();
  }
}
