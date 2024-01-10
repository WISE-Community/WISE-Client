'use strict';

import { ConfigService } from '../../services/configService';
import { CopyProjectService } from '../../services/copyProjectService';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { TeacherDataService } from '../../services/teacherDataService';
import { UtilService } from '../../services/utilService';
import * as angular from 'angular';
import * as $ from 'jquery';

class MainAuthoringController {
  $translate;
  errorCreatingProjectTimeout: any;
  icons: any;
  inProcessOfCreatingProject: boolean = false;
  is_rtl: boolean = false;
  project: any;
  projects: any[];
  sharedProjects: any[];
  showCreateProjectView: boolean = false;
  showCreatingProjectMessage: boolean = false;
  showErrorCreatingProjectMessage: boolean = false;

  static $inject = [
    '$anchorScroll',
    '$filter',
    '$location',
    '$mdDialog',
    '$state',
    '$timeout',
    'ConfigService',
    'CopyProjectService',
    'ProjectService',
    'TeacherDataService',
    'UtilService'
  ];

  constructor(
    private $anchorScroll: any,
    $filter: any,
    private $location: any,
    private $mdDialog: any,
    private $state: any,
    private $timeout: any,
    private ConfigService: ConfigService,
    private CopyProjectService: CopyProjectService,
    private ProjectService: TeacherProjectService,
    private TeacherDataService: TeacherDataService,
    private UtilService: UtilService
  ) {
    this.$translate = $filter('translate');
  }

  $onInit() {
    this.projects = this.ConfigService.getConfigParam('projects');
    this.sharedProjects = this.ConfigService.getConfigParam('sharedProjects').sort(
      (projectA, projectB) => projectB.id - projectA.id
    );
    this.is_rtl = $('html').attr('dir') == 'rtl';
    this.icons = { prev: 'arrow_back', next: 'arrow_forward' };
    if (this.is_rtl) {
      this.icons = { prev: 'arrow_forward', next: 'arrow_back' };
    }
  }

  getProjectByProjectId(projectId) {
    for (const project of this.projects.concat(this.sharedProjects)) {
      if (project.id === projectId) {
        return project;
      }
    }
    return null;
  }

  copyProject(projectId) {
    const project = this.getProjectByProjectId(projectId);
    let projectInfo = `${projectId} ${project.name}`;
    if (project.runId != null) {
      projectInfo += ` (Run ID: ${project.runId})`;
    }

    const confirmCopyMessage = `${this.$translate(
      'areYouSureYouWantToCopyThisProject'
    )}\n\n${projectInfo}`;
    if (confirm(confirmCopyMessage)) {
      this.showCopyingProjectMessage();
      this.CopyProjectService.copyProject(projectId).subscribe(
        (project: any) => {
          this.saveEvent('projectCopied', 'Authoring', {}, project.id);
          this.highlightProject(project.id);
          this.$mdDialog.hide();
        },
        () => {
          alert($localize`There was an error copying this project. Please contact WISE staff.`);
          this.$mdDialog.hide();
        }
      );
    }
  }

  highlightProject(projectId) {
    this.ConfigService.retrieveConfig(`/api/author/config`).then(() => {
      this.projects = this.ConfigService.getConfigParam('projects');
      this.scrollToTopOfPage();
      this.$timeout(() => {
        // wait for new element to appear on the page
        const highlightDuration = 3000;
        this.UtilService.temporarilyHighlightElement(projectId, highlightDuration);
      });
    });
  }

  showCopyingProjectMessage() {
    this.showMessageInModalDialog(this.$translate('copyingProject'));
  }

  showLoadingProjectMessage() {
    this.showMessageInModalDialog(this.$translate('loadingProject'));
  }

  showMessageInModalDialog(message) {
    this.$mdDialog.show({
      template: `
        <div align="center">
          <div style="width: 200px; height: 100px; margin: 20px;">
            <span>${message}...</span>
            <br/>
            <br/>
            <md-progress-circular md-mode="indeterminate"></md-progress-circular>
          </div>
        </div>
      `,
      clickOutsideToClose: false
    });
  }

  showRegisterNewProjectView() {
    this.project = this.ProjectService.getNewProjectTemplate();
    this.showCreateProjectView = true;
    this.$timeout(() => {
      document.getElementById('newProjectTitle').focus();
    });
  }

  registerNewProject() {
    /*
     * Make sure we are not already in the process of creating a project.
     * This is used to make sure the author does not inadvertently click the register button twice,
     * which can lead to problems in the back end.
     */
    if (!this.isInProcessOfCreatingProject()) {
      this.turnOnInProcessOfCreatingProject();
      this.turnOnCreatingProjectMessage();
      this.startErrorCreatingProjectTimeout();
      const projectJSONString = angular.toJson(this.project, 4);
      this.ProjectService.registerNewProject(this.project.metadata.title, projectJSONString)
        .then((projectId) => {
          this.cancelErrorCreatingProjectTimeout();
          this.saveEvent('projectCreated', 'Authoring', {}, projectId);
          this.$state.go('root.at.project', { projectId: projectId });
        })
        .catch(() => {
          this.turnOffInProcessOfCreatingProject();
          this.turnOnErrorCreatingProjectMessage();
          this.cancelErrorCreatingProjectTimeout();
        });
    }
  }

  turnOnInProcessOfCreatingProject() {
    this.inProcessOfCreatingProject = true;
  }

  turnOffInProcessOfCreatingProject() {
    this.inProcessOfCreatingProject = false;
  }

  isInProcessOfCreatingProject() {
    return this.inProcessOfCreatingProject;
  }

  turnOnCreatingProjectMessage() {
    this.showCreatingProjectMessage = true;
    this.showErrorCreatingProjectMessage = false;
  }

  turnOnErrorCreatingProjectMessage() {
    this.showCreatingProjectMessage = false;
    this.showErrorCreatingProjectMessage = true;
  }

  clearAllCreatingProjectMessages() {
    this.showCreatingProjectMessage = false;
    this.showErrorCreatingProjectMessage = false;
  }

  startErrorCreatingProjectTimeout() {
    this.errorCreatingProjectTimeout = this.$timeout(() => {
      this.turnOffInProcessOfCreatingProject();
      this.turnOnErrorCreatingProjectMessage();
    }, 10000);
  }

  cancelErrorCreatingProjectTimeout() {
    this.$timeout.cancel(this.errorCreatingProjectTimeout);
  }

  cancelRegisterNewProject() {
    this.project = null;
    this.showCreateProjectView = false;
    this.clearAllCreatingProjectMessages();
  }

  openProject(projectId) {
    this.showLoadingProjectMessage();
    this.$state.go('root.at.project', { projectId: projectId });
  }

  previewProject(projectId) {
    const data = { constraints: true };
    this.saveEvent('projectPreviewed', 'Authoring', data, projectId);
    window.open(`${this.ConfigService.getWISEBaseURL()}/preview/unit/${projectId}`);
  }

  goHome() {
    this.saveEvent('goToTeacherHome', 'Navigation', {}, null);
    this.$location.url('teacher');
  }

  saveEvent(eventName, category, data = {}, projectId) {
    const context = 'AuthoringTool';
    const nodeId = null;
    const componentId = null;
    const componentType = null;
    this.TeacherDataService.saveEvent(
      context,
      nodeId,
      componentId,
      componentType,
      category,
      eventName,
      data
    );
  }

  scrollToTopOfPage() {
    this.$anchorScroll('top');
  }
}

export const MainAuthoringComponent = {
  templateUrl: `/assets/wise5/authoringTool/main/mainAuthoring.html`,
  controller: MainAuthoringController
};
