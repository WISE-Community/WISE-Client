'use strict';

import * as angular from 'angular';
import './classroomMonitorComponents/manageStudents/manageStudentsModule';
import './classroomMonitorComponents/milestones/milestones';
import './classroomMonitorComponents/nodeGrading/nodeGrading';
import './classroomMonitorComponents/nodeProgress/nodeProgress';
import './classroomMonitorComponents/studentGrading/studentGrading';
import './classroomMonitorComponents/studentProgress/studentProgress';
import './classroomMonitorComponents/shared/shared';
import './classroomMonitorComponents/notebook/notebook';
import '../components/component-grading.module';
import './dataExport/data-export-module';
import ClassroomMonitorController from './classroomMonitorController';
import StudentProgressController from './studentProgress/studentProgressController';
import { downgradeComponent } from '@angular/upgrade/static';
import { NotebookGradingComponent } from './notebook-grading/notebook-grading.component';
import { StudentGradingComponent } from './student-grading/student-grading.component';

export default angular
  .module('classroomMonitor', [
    'componentGrading',
    'cmShared',
    'dataExport',
    'manageStudents',
    'milestones',
    'nodeGrading',
    'nodeProgress',
    'notebookGrading',
    'studentGrading',
    'studentProgress'
  ])
  .controller('ClassroomMonitorController', ClassroomMonitorController)
  .directive('notebookGrading', downgradeComponent({ component: NotebookGradingComponent }))
  .directive(
    'studentGrading',
    downgradeComponent({ component: StudentGradingComponent }) as angular.IDirectiveFactory
  )
  .controller('StudentProgressController', StudentProgressController)
  .config([
    '$stateProvider',
    '$translatePartialLoaderProvider',
    '$mdThemingProvider',
    ($stateProvider, $translatePartialLoaderProvider, $mdThemingProvider) => {
      $stateProvider
        .state('root.cm', {
          url: '/manage/unit/:runId',
          templateUrl: '/assets/wise5/classroomMonitor/classroomMonitor.html',
          controller: 'ClassroomMonitorController',
          controllerAs: 'classroomMonitorController',
          abstract: true,
          resolve: {
            config: [
              'ConfigService',
              'SessionService',
              '$stateParams',
              (ConfigService, SessionService, $stateParams) => {
                return ConfigService.retrieveConfig(
                  `/api/config/classroomMonitor/${$stateParams.runId}`
                ).then(() => {
                  SessionService.initializeSession();
                });
              }
            ],
            project: [
              'ProjectService',
              'config',
              (ProjectService, config) => {
                return ProjectService.retrieveProject();
              }
            ],
            runStatus: [
              'TeacherDataService',
              'config',
              (TeacherDataService, config) => {
                TeacherDataService.currentPeriod = null;
                return TeacherDataService.retrieveRunStatus();
              }
            ],
            studentStatuses: [
              'ClassroomStatusService',
              'config',
              (ClassroomStatusService, config) => {
                return ClassroomStatusService.retrieveStudentStatuses();
              }
            ],
            achievements: [
              'AchievementService',
              'studentStatuses',
              'config',
              'project',
              (AchievementService, studentStatuses, config, project) => {
                return AchievementService.retrieveStudentAchievements();
              }
            ],
            notifications: [
              'NotificationService',
              'ConfigService',
              'studentStatuses',
              'config',
              'project',
              (NotificationService, ConfigService, studentStatuses, config, project) => {
                return NotificationService.retrieveNotifications();
              }
            ],
            webSocket: [
              'TeacherWebSocketService',
              'config',
              (TeacherWebSocketService, config) => {
                return TeacherWebSocketService.initialize();
              }
            ],
            language: [
              '$translate',
              'ConfigService',
              'config',
              ($translate, ConfigService, config) => {
                let locale = ConfigService.getLocale(); // defaults to "en"
                $translate.use(locale);
              }
            ],
            annotations: [
              'TeacherDataService',
              'config',
              (TeacherDataService, config) => {
                return TeacherDataService.retrieveAnnotations();
              }
            ],
            notebook: [
              'NotebookService',
              'ConfigService',
              'config',
              'project',
              (NotebookService, ConfigService, config, project) => {
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
              }
            ]
          }
        })
        .state('root.cm.teamLanding', {
          url: '/team',
          templateUrl: '/assets/wise5/classroomMonitor/studentProgress/studentProgress.html',
          controller: 'StudentProgressController',
          controllerAs: 'studentProgressController'
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
        .state('root.cm.dashboard', {
          url: '/dashboard',
          templateUrl: '/assets/wise5/classroomMonitor/dashboard/dashboard.html',
          controller: 'DashboardController',
          controllerAs: 'dashboardController'
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
