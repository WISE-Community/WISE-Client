import * as angular from 'angular';
import { downgradeInjectable } from '@angular/upgrade/static';
import { ProjectAssetService } from '../../../../app/services/projectAssetService';

export default angular
  .module('projectAuthoringModule', [])
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
