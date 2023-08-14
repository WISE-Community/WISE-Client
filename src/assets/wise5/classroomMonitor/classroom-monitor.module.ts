'use strict';

import * as angular from 'angular';
import './classroomMonitorComponents/manageStudents/manageStudentsModule';
import './dataExport/data-export-angular-js-module';
import { downgradeComponent } from '@angular/upgrade/static';
import { ClassroomMonitorComponent } from './classroom-monitor.component';

export default angular
  .module('classroomMonitor', ['dataExport', 'manageStudents'])
  .directive('classroomMonitor', downgradeComponent({ component: ClassroomMonitorComponent }))
  .config([
    '$stateProvider',
    '$translatePartialLoaderProvider',
    '$mdThemingProvider',
    ($stateProvider, $translatePartialLoaderProvider, $mdThemingProvider) => {
      $stateProvider
        .state('root.cm', {
          url: '/manage/unit/:runId',
          component: 'classroomMonitor',
          abstract: true,
          resolve: {
            config: [
              'ConfigService',
              'SessionService',
              '$stateParams',
              async (ConfigService, SessionService, $stateParams) => {
                return await ConfigService.retrieveConfig(
                  `/api/config/classroomMonitor/${$stateParams.runId}`
                ).subscribe((config) => {
                  SessionService.initializeSession();
                });
              }
            ],
            project: [
              'ProjectService',
              'ConfigService',
              'config',
              (ProjectService, ConfigService, config) => {
                return ProjectService.retrieveProject();
              }
            ],
            parsedProject: [
              'ProjectService',
              'project',
              (ProjectService, project) => {
                ProjectService.setProject(project);
                return project;
              }
            ],
            runStatus: [
              'TeacherDataService',
              'ConfigService',
              (TeacherDataService, ConfigService) => {
                return ConfigService.configRetrieved$.subscribe(() => {
                  TeacherDataService.currentPeriod = null;
                  return TeacherDataService.retrieveRunStatus();
                });
              }
            ],
            studentStatuses: [
              'ClassroomStatusService',
              'ConfigService',
              (ClassroomStatusService, ConfigService) => {
                return ConfigService.configRetrieved$.subscribe(() => {
                  return ClassroomStatusService.retrieveStudentStatuses();
                });
              }
            ],
            achievements: [
              'AchievementService',
              'studentStatuses',
              'ConfigService',
              'project',
              (AchievementService, studentStatuses, ConfigService, project) => {
                return ConfigService.configRetrieved$.subscribe(() => {
                  return AchievementService.retrieveStudentAchievements();
                });
              }
            ],
            notifications: [
              'NotificationService',
              'ConfigService',
              'studentStatuses',
              'project',
              (NotificationService, ConfigService, studentStatuses, project) => {
                return ConfigService.configRetrieved$.subscribe(() => {
                  return NotificationService.retrieveNotifications();
                });
              }
            ],
            webSocket: [
              'TeacherWebSocketService',
              'ConfigService',
              (TeacherWebSocketService, ConfigService) => {
                return ConfigService.configRetrieved$.subscribe(() => {
                  return TeacherWebSocketService.initialize();
                });
              }
            ],
            language: [
              '$translate',
              'ConfigService',
              ($translate, ConfigService) => {
                return ConfigService.configRetrieved$.subscribe(() => {
                  let locale = ConfigService.getLocale(); // defaults to "en"
                  $translate.use(locale);
                });
              }
            ],
            annotations: [
              'TeacherDataService',
              'ConfigService',
              (TeacherDataService, ConfigService) => {
                return ConfigService.configRetrieved$.subscribe(() => {
                  return TeacherDataService.retrieveAnnotations();
                });
              }
            ],
            notebook: [
              'NotebookService',
              'ConfigService',
              'ProjectService',
              (NotebookService, ConfigService, ProjectService) => {
                return ConfigService.configRetrieved$.subscribe(() => {
                  ProjectService.projectParsed$.subscribe(() => {
                    if (
                      NotebookService.isNotebookEnabled() ||
                      NotebookService.isNotebookEnabled('teacherNotebook')
                    ) {
                      return NotebookService.retrieveNotebookItems().then((notebook) => {
                        return notebook;
                      });
                    } else {
                      return NotebookService.notebook;
                    }
                  });
                });
              }
            ]
          }
        })
        .state('root.cm.teamLanding', {
          url: '/team',
          component: 'studentProgress'
        })
        .state('root.cm.team', {
          url: '/team/:workgroupId',
          component: 'studentGrading',
          resolve: {
            studentData: [
              '$stateParams',
              'TeacherDataService',
              'config',
              ($stateParams, TeacherDataService, config) => {
                return TeacherDataService.retrieveStudentDataByWorkgroupId(
                  $stateParams.workgroupId
                );
              }
            ]
          }
        })
        .state('root.cm.unit', {
          url: '',
          component: 'nodeProgressView'
        })
        .state('root.cm.unit.node', {
          url: '/node/:nodeId',
          component: 'nodeProgressView'
        })
        .state('root.cm.milestones', {
          url: '/milestones',
          component: 'milestones'
        })
        .state('root.cm.notebooks', {
          url: '/notebook',
          component: 'notebookGrading'
        });
      $translatePartialLoaderProvider.addPart('classroomMonitor/i18n');
      $mdThemingProvider
        .theme('cm')
        .primaryPalette('blue', {
          default: '800'
        })
        .accentPalette('accent', {
          default: '500'
        })
        .warnPalette('red', {
          default: '800'
        });
      $mdThemingProvider
        .theme('light')
        .primaryPalette('light', { default: 'A100' })
        .accentPalette('pink', { default: '900' });
    }
  ]);
