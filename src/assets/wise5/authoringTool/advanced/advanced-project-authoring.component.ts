import { ConfigService } from '../../services/configService';
import { TeacherProjectService } from '../../services/teacherProjectService';
import * as angular from 'angular';
import { NotificationService } from '../../services/notificationService';
import { Component } from '@angular/core';
import { UpgradeModule } from '@angular/upgrade/static';
import { isValidJSONString } from '../../common/string/string';
import { MatDialog } from '@angular/material/dialog';
import { AssetChooser } from '../project-asset-authoring/asset-chooser';

@Component({
  selector: 'advanced-project-authoring',
  templateUrl: 'advanced-project-authoring.component.html',
  styleUrls: ['./advanced-project-authoring.component.scss']
})
export class AdvancedProjectAuthoringComponent {
  isJSONDisplayed: boolean;
  projectId: number;
  projectJSONString: string;
  projectScriptFilename: string;
  rubricDisplayed: boolean;

  constructor(
    private dialog: MatDialog,
    private upgrade: UpgradeModule,
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
    this.isJSONDisplayed = false;
    this.rubricDisplayed = !this.rubricDisplayed;
  }

  toggleJSON() {
    this.rubricDisplayed = false;
    if (this.isJSONDisplayed) {
      this.hideJSON();
    } else {
      this.showJSON();
    }
  }

  hideJSON() {
    if (isValidJSONString(this.projectJSONString)) {
      this.isJSONDisplayed = false;
      this.notificationService.hideJSONValidMessage();
    } else if (
      confirm(
        $localize`The JSON is invalid. Invalid JSON will not be saved.\nClick "OK" to revert back to the last valid JSON.\nClick "Cancel" to keep the invalid JSON open so you can fix it.`
      )
    ) {
      this.isJSONDisplayed = false;
      this.notificationService.hideJSONValidMessage();
    }
  }

  showJSON() {
    this.isJSONDisplayed = true;
    this.projectJSONString = angular.toJson(this.projectService.project, 4);
    this.notificationService.showJSONValidMessage();
  }

  autoSaveProjectJSONString() {
    try {
      this.saveProjectJSON(this.projectJSONString);
      this.notificationService.showJSONValidMessage();
    } catch (e) {
      this.notificationService.showJSONInvalidMessage();
    }
  }

  saveProjectJSON(projectJSONString) {
    const project = angular.fromJson(projectJSONString);
    this.projectService.setProject(project);
    this.setProjectScriptFilename();
    this.projectService.checkPotentialStartNodeIdChangeThenSaveProject();
  }

  setProjectScriptFilename() {
    this.projectScriptFilename = this.projectService.getProjectScriptFilename();
  }

  chooseProjectScriptFile() {
    new AssetChooser(this.dialog, null, null, this.projectId)
      .open('scriptFilename')
      .afterClosed()
      .subscribe((data: any) => {
        this.assetSelected(data);
      });
  }

  assetSelected({ assetItem }) {
    this.projectScriptFilename = assetItem.fileName;
    this.projectScriptFilenameChanged();
  }

  downloadProject() {
    window.location.href = `${this.configService.getWISEBaseURL()}/api/project/export/${
      this.projectId
    }`;
  }

  openProjectURLInNewTab() {
    window.open(this.getProjectURL(), '_blank');
  }

  copyProjectURL() {
    const textArea = document.createElement('textarea');
    textArea.value = this.getProjectURL();
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }

  getProjectURL() {
    return window.location.origin + this.configService.getConfigParam('projectURL');
  }

  projectScriptFilenameChanged() {
    this.projectService.setProjectScriptFilename(this.projectScriptFilename);
    if (this.showJSON) {
      this.projectJSONString = angular.toJson(this.projectService.project, 4);
    }
    this.projectService.saveProject();
  }

  goBack() {
    this.upgrade.$injector.get('$state').go('root.at.project');
  }
}
