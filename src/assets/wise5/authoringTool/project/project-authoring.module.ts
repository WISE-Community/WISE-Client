import * as angular from 'angular';
import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';
import { AdvancedProjectAuthoringComponent } from '../../authoringTool/advanced/advanced-project-authoring.component';
import { ProjectAssetService } from '../../../../app/services/projectAssetService';
import { ProjectAuthoringComponent } from '../../authoringTool/project/projectAuthoringComponent';
import { RecoveryAuthoringComponent } from '../recovery-authoring/recovery-authoring.component';
import { ConcurrentAuthorsMessageComponent } from '../concurrent-authors-message/concurrent-authors-message.component';
import { NotebookAuthoringComponent } from '../notebook-authoring/notebook-authoring.component';
import { MilestonesAuthoringComponent } from '../milestones-authoring/milestones-authoring.component';
import { ProjectAssetAuthoringComponent } from '../project-asset-authoring/project-asset-authoring.component';
import { ProjectInfoAuthoringComponent } from '../project-info-authoring/project-info-authoring.component';

export default angular
  .module('projectAuthoringModule', [])
  .directive(
    'milestonesAuthoringComponent',
    downgradeComponent({ component: MilestonesAuthoringComponent })
  )
  .directive(
    'notebookAuthoringComponent',
    downgradeComponent({ component: NotebookAuthoringComponent })
  )
  .directive(
    'projectAssetAuthoringComponent',
    downgradeComponent({ component: ProjectAssetAuthoringComponent })
  )
  .component('projectAuthoringComponent', ProjectAuthoringComponent)
  .directive(
    'projectInfoAuthoringComponent',
    downgradeComponent({ component: ProjectInfoAuthoringComponent })
  )
  .directive(
    'advancedProjectAuthoringComponent',
    downgradeComponent({
      component: AdvancedProjectAuthoringComponent
    }) as angular.IDirectiveFactory
  )
  .directive(
    'concurrentAuthorsMessage',
    downgradeComponent({
      component: ConcurrentAuthorsMessageComponent
    }) as angular.IDirectiveFactory
  )
  .directive(
    'recoveryAuthoringComponent',
    downgradeComponent({ component: RecoveryAuthoringComponent })
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
        .state('root.at.project.notebook', {
          url: '/notebook',
          component: 'notebookAuthoringComponent'
        })
        .state('root.at.project.milestones', {
          url: '/milestones',
          component: 'milestonesAuthoringComponent'
        })
        .state('root.at.recovery', {
          url: '/unit/:projectId/recovery',
          component: 'recoveryAuthoringComponent',
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
                return ProjectService.retrieveProject(false);
              }
            ]
          }
        });
    }
  ]);
