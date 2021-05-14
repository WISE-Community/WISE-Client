import '../lib/jquery/jquery-global';
import * as angular from 'angular';
import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';
import '../common-angular-js-module';
import { MilestoneService } from '../services/milestoneService';
import { TeacherProjectService } from '../services/teacherProjectService';
import { SpaceService } from '../services/spaceService';
import { StudentStatusService } from '../services/studentStatusService';
import { DataExportService } from '../services/dataExportService';
import { TeacherDataService } from '../services/teacherDataService';
import { TeacherWebSocketService } from '../services/teacherWebSocketService';
import ClassroomMonitorController from '../classroomMonitor/classroomMonitorController';
import DataExportController from '../classroomMonitor/dataExport/dataExportController';
import ExportController from '../classroomMonitor/dataExport/exportController';
import ExportVisitsController from '../classroomMonitor/dataExport/exportVisitsController';
import { MilestonesComponent } from '../../../app/classroom-monitor/milestones/milestones.component';
import NotebookGradingController from '../classroomMonitor/notebook/notebookGradingController';
import StudentGradingController from '../classroomMonitor/studentGrading/studentGradingController';
import StudentProgressController from '../classroomMonitor/studentProgress/studentProgressController';
import { StepToolsComponent } from '../common/stepTools/step-tools.component';

import '../classroomMonitor/classroomMonitorComponents';
import '../authoringTool/authoring-tool.module';
import '../components/animation/animationGradingComponentModule';
import '../components/audioOscillator/audioOscillatorGradingComponentModule';
import '../components/conceptMap/conceptMapGradingComponentModule';
import '../components/discussion/discussionGradingComponentModule';
import '../components/draw/drawGradingComponentModule';
import '../components/embedded/embeddedGradingComponentModule';
import '../components/graph/graphGradingComponentModule';
import '../components/label/labelGradingComponentModule';
import '../components/match/matchGradingComponentModule';
import '../components/multipleChoice/multipleChoiceGradingComponentModule';
import '../components/openResponse/openResponseGradingComponentModule';
import '../components/table/tableGradingComponentModule';

angular
  .module('teacher', [
    'common',
    'angular-inview',
    'authoringTool',
    'animationGradingComponentModule',
    'audioOscillatorGradingComponentModule',
    'classroomMonitor.components',
    'conceptMapGradingComponentModule',
    'discussionGradingComponentModule',
    'drawGradingComponentModule',
    'embeddedGradingComponentModule',
    'graphGradingComponentModule',
    'labelGradingComponentModule',
    'matchGradingComponentModule',
    'multipleChoiceGradingComponentModule',
    'ngAnimate',
    'ngFileSaver',
    'openResponseGradingComponentModule',
    'tableGradingComponentModule'
  ])
  .service('DataExportService', downgradeInjectable(DataExportService))
  .service('MilestoneService', downgradeInjectable(MilestoneService))
  .factory('ProjectService', downgradeInjectable(TeacherProjectService))
  .factory('SpaceService', downgradeInjectable(SpaceService))
  .factory('StudentStatusService', downgradeInjectable(StudentStatusService))
  .service('TeacherDataService', downgradeInjectable(TeacherDataService))
  .service('TeacherWebSocketService', downgradeInjectable(TeacherWebSocketService))
  .directive(
    'stepTools',
    downgradeComponent({ component: StepToolsComponent }) as angular.IDirectiveFactory
  )
  .controller('ClassroomMonitorController', ClassroomMonitorController)
  .controller('DataExportController', DataExportController)
  .controller('ExportController', ExportController)
  .controller('ExportVisitsController', ExportVisitsController)
  .directive(
    'milestones',
    downgradeComponent({ component: MilestonesComponent }) as angular.IDirectiveFactory
  )
  .controller('NotebookGradingController', NotebookGradingController)
  .controller('StudentGradingController', StudentGradingController)
  .controller('StudentProgressController', StudentProgressController)
  .config([
    '$stateProvider',
    '$translatePartialLoaderProvider',
    '$mdThemingProvider',
    ($stateProvider, $translatePartialLoaderProvider, $mdThemingProvider) => {
      $stateProvider
        .state('root', {
          url: '/teacher',
          abstract: true
        })
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
                return TeacherDataService.retrieveRunStatus();
              }
            ],
            studentStatuses: [
              'StudentStatusService',
              'config',
              (StudentStatusService, config) => {
                return StudentStatusService.retrieveStudentStatuses();
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
          templateUrl: '/assets/wise5/classroomMonitor/studentGrading/studentGrading.html',
          controller: 'StudentGradingController',
          controllerAs: 'studentGradingController',
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
          component: 'nodeProgressView',
          params: { nodeId: null }
        })
        .state('root.cm.unit.node', {
          url: '/node/:nodeId',
          component: 'nodeProgressView',
          params: { nodeId: null }
        })
        .state('root.cm.manageStudents', {
          url: '/manageStudents',
          component: 'manageStudentsComponent'
        })
        .state('root.cm.dashboard', {
          url: '/dashboard',
          templateUrl: '/assets/wise5/classroomMonitor/dashboard/dashboard.html',
          controller: 'DashboardController',
          controllerAs: 'dashboardController'
        })
        .state('root.cm.export', {
          url: '/export',
          templateUrl: '/assets/wise5/classroomMonitor/dataExport/dataExport.html',
          controller: 'DataExportController',
          controllerAs: 'dataExportController'
        })
        .state('root.cm.exportVisits', {
          url: '/export/visits',
          templateUrl: '/assets/wise5/classroomMonitor/dataExport/exportVisits.html',
          controller: 'ExportVisitsController',
          controllerAs: 'exportVisitsController'
        })
        .state('root.cm.milestones', {
          url: '/milestones',
          component: 'milestones'
        })
        .state('root.cm.notebooks', {
          url: '/notebook',
          templateUrl: '/assets/wise5/classroomMonitor/notebook/notebookGrading.html',
          controller: 'NotebookGradingController',
          controllerAs: 'notebookGradingController'
        })
        .state('sink', {
          url: '/*path',
          template: ''
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
      $mdThemingProvider.setDefaultTheme('at');
    }
  ]);
