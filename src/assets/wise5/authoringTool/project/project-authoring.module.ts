import * as angular from 'angular';
import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';
import { AdvancedProjectAuthoringComponent } from '../../authoringTool/advanced/advanced-project-authoring.component';
import { MilestonesAuthoringComponent } from '../../authoringTool/milestones/milestonesAuthoringComponent';
import { NotebookAuthoringComponent } from '../../authoringTool/notebook/notebookAuthoringComponent';
import {
  ProjectAssetAuthoringController,
  ProjectAssetAuthoringComponent
} from '../../authoringTool/asset/projectAssetAuthoringComponent';
import { ProjectAssetService } from '../../../../app/services/projectAssetService';
import { ProjectAuthoringComponent } from '../../authoringTool/project/projectAuthoringComponent';
import { ProjectInfoAuthoringComponent } from '../../authoringTool/info/projectInfoAuthoringComponent';
import { RubricAuthoringComponent } from '../../authoringTool/rubric/rubric-authoring.component';

export default angular
  .module('projectAuthoringModule', [])
  .component('milestonesAuthoringComponent', MilestonesAuthoringComponent)
  .component('notebookAuthoringComponent', NotebookAuthoringComponent)
  .component('projectAssetAuthoringComponent', ProjectAssetAuthoringComponent)
  .component('projectAuthoringComponent', ProjectAuthoringComponent)
  .component('projectInfoAuthoringComponent', ProjectInfoAuthoringComponent)
  .controller('ProjectAssetAuthoringController', ProjectAssetAuthoringController)
  .directive(
    'advancedProjectAuthoringComponent',
    downgradeComponent({
      component: AdvancedProjectAuthoringComponent
    }) as angular.IDirectiveFactory
  )
  .directive(
    'rubricAuthoringComponent',
    downgradeComponent({ component: RubricAuthoringComponent }) as angular.IDirectiveFactory
  )
  .factory('ProjectAssetService', downgradeInjectable(ProjectAssetService))
  .config([
    '$stateProvider',
    ($stateProvider) => {
      $stateProvider
        .state('root.at.project', {
          url: '/unit/:projectId',
          component: 'projectAuthoringComponent',
          resolve: {
            projectConfig: [
              'ConfigService',
              'SessionService',
              '$stateParams',
              (ConfigService, SessionService, $stateParams) => {
                return ConfigService.retrieveConfig(
                  `/api/author/config/${$stateParams.projectId}`
                ).then(() => {
                  SessionService.initializeSession();
                });
              }
            ],
            project: [
              'ProjectService',
              'projectConfig',
              (ProjectService, projectConfig) => {
                return ProjectService.retrieveProject();
              }
            ],
            projectId: [
              'ConfigService',
              'projectConfig',
              (ConfigService, projectConfig) => {
                return ConfigService.getProjectId();
              }
            ],
            projectAssets: [
              'ProjectAssetService',
              'projectConfig',
              'project',
              (ProjectAssetService, projectConfig, project) => {
                return ProjectAssetService.retrieveProjectAssets();
              }
            ],
            language: [
              '$translate',
              'ConfigService',
              'projectConfig',
              ($translate, ConfigService, projectConfig) => {
                $translate.use(ConfigService.getLocale());
              }
            ]
          }
        })
        .state('root.at.project.asset', {
          url: '/asset',
          component: 'projectAssetAuthoringComponent'
        })
        .state('root.at.project.info', {
          url: '/info',
          component: 'projectInfoAuthoringComponent'
        })
        .state('root.at.project.advanced', {
          url: '/advanced',
          component: 'advancedProjectAuthoringComponent'
        })
        .state('root.at.project.rubric', {
          url: '/rubric',
          component: 'rubricAuthoringComponent'
        })
        .state('root.at.project.notebook', {
          url: '/notebook',
          component: 'notebookAuthoringComponent'
        })
        .state('root.at.project.milestones', {
          url: '/milestones',
          component: 'milestonesAuthoringComponent'
        });
    }
  ]);
