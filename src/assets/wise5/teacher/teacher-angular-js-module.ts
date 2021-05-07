import '../lib/jquery/jquery-global';
import * as angular from 'angular';
import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';
import '../common-angular-js-module';
import { MilestoneService } from '../services/milestoneService';
import { TeacherProjectService } from '../services/teacherProjectService';
import { ProjectAssetService } from '../../../app/services/projectAssetService';
import { SpaceService } from '../services/spaceService';
import { StudentStatusService } from '../services/studentStatusService';
import { DataExportService } from '../services/dataExportService';
import { TeacherDataService } from '../services/teacherDataService';
import { TeacherWebSocketService } from '../services/teacherWebSocketService';
import { AdvancedProjectAuthoringComponent } from '../authoringTool/advanced/advanced-project-authoring.component';
import { AuthoringToolComponent } from '../authoringTool/authoringToolComponent';
import { MainAuthoringComponent } from '../authoringTool/main/mainAuthoringComponent';
import { NotebookAuthoringComponent } from '../authoringTool/notebook/notebookAuthoringComponent';
import ClassroomMonitorController from '../classroomMonitor/classroomMonitorController';
import DataExportController from '../classroomMonitor/dataExport/dataExportController';
import ExportController from '../classroomMonitor/dataExport/exportController';
import ExportVisitsController from '../classroomMonitor/dataExport/exportVisitsController';
import { MilestonesAuthoringComponent } from '../authoringTool/milestones/milestonesAuthoringComponent';
import { MilestonesComponent } from '../../../app/classroom-monitor/milestones/milestones.component';
import { NodeAdvancedAuthoringComponent } from '../authoringTool/node/advanced/node-advanced-authoring.component';
import { NodeAdvancedBranchAuthoringComponent } from '../authoringTool/node/advanced/branch/node-advanced-branch-authoring.component';
import { NodeAdvancedConstraintAuthoringComponent } from '../authoringTool/node/advanced/constraint/node-advanced-constraint-authoring.component';
import { NodeAdvancedGeneralAuthoringComponent } from '../authoringTool/node/advanced/general/node-advanced-general-authoring.component';
import { NodeAdvancedJsonAuthoringComponent } from '../authoringTool/node/advanced/json/node-advanced-json-authoring.component';
import { NodeAdvancedPathAuthoringComponent } from '../authoringTool/node/advanced/path/node-advanced-path-authoring.component';
import { NodeAuthoringComponent } from '../authoringTool/node/nodeAuthoringComponent';
import NotebookGradingController from '../classroomMonitor/notebook/notebookGradingController';
import {
  ProjectAssetAuthoringController,
  ProjectAssetAuthoringComponent
} from '../authoringTool/asset/projectAssetAuthoringComponent';
import { ProjectAuthoringComponent } from '../authoringTool/project/projectAuthoringComponent';
import { ProjectInfoAuthoringComponent } from '../authoringTool/info/projectInfoAuthoringComponent';
import { RubricAuthoringComponent } from '../authoringTool/rubric/rubric-authoring.component';
import StudentGradingController from '../classroomMonitor/studentGrading/studentGradingController';
import StudentProgressController from '../classroomMonitor/studentProgress/studentProgressController';
import WISELinkAuthoringController from '../authoringTool/wiseLink/wiseLinkAuthoringController';
import { WiseAuthoringTinymceEditorComponent } from '../directives/wise-tinymce-editor/wise-authoring-tinymce-editor.component';
import { EditComponentExcludeFromTotalScoreComponent } from '../../../app/authoring-tool/edit-component-exclude-from-total-score/edit-component-exclude-from-total-score.component';
import { EditComponentJsonComponent } from '../../../app/authoring-tool/edit-component-json/edit-component-json.component';
import { EditComponentMaxScoreComponent } from '../../../app/authoring-tool/edit-component-max-score/edit-component-max-score.component';
import { EditComponentRubricComponent } from '../../../app/authoring-tool/edit-component-rubric/edit-component-rubric.component';
import { EditComponentTagsComponent } from '../../../app/authoring-tool/edit-component-tags/edit-component-tags.component';
import { EditComponentWidthComponent } from '../../../app/authoring-tool/edit-component-width/edit-component-width.component';

import '../classroomMonitor/classroomMonitorComponents';
import '../authoringTool/structure/structureAuthoringModule';
import '../components/animation/animationAuthoringComponentModule';
import '../components/animation/animationGradingComponentModule';
import '../components/audioOscillator/audioOscillatorAuthoringComponentModule';
import '../components/audioOscillator/audioOscillatorGradingComponentModule';
import '../authoringTool/components/authoringToolComponents';
import '../components/conceptMap/conceptMapAuthoringComponentModule';
import '../components/conceptMap/conceptMapGradingComponentModule';
import '../components/discussion/discussionAuthoringComponentModule';
import '../components/discussion/discussionGradingComponentModule';
import '../components/draw/drawAuthoringComponentModule';
import '../components/draw/drawGradingComponentModule';
import '../components/embedded/embeddedAuthoringComponentModule';
import '../components/embedded/embeddedGradingComponentModule';
import '../components/graph/graphAuthoringComponentModule';
import '../components/graph/graphGradingComponentModule';
import '../components/html/htmlAuthoringComponentModule';
import '../authoringTool/addComponent/addComponentModule';
import '../authoringTool/addNode/addNodeModule';
import '../authoringTool/node/editRubric/editRubricModule';
import '../authoringTool/importComponent/importComponentModule';
import '../authoringTool/importStep/importStepModule';
import '../components/label/labelAuthoringComponentModule';
import '../components/label/labelGradingComponentModule';
import '../components/match/matchAuthoringComponentModule';
import '../components/match/matchGradingComponentModule';
import '../components/multipleChoice/multipleChoiceAuthoringComponentModule';
import '../components/multipleChoice/multipleChoiceGradingComponentModule';
import '../components/openResponse/openResponseAuthoringComponentModule';
import '../components/openResponse/openResponseGradingComponentModule';
import '../components/outsideURL/outsideURLAuthoringComponentModule';
import '../components/summary/summaryAuthoringComponentModule';
import '../components/table/tableAuthoringComponentModule';
import '../components/table/tableGradingComponentModule';

angular
  .module('teacher', [
    'common',
    'angular-inview',
    'addComponentModule',
    'addNodeModule',
    'editRubricModule',
    'summaryAuthoringComponentModule',
    'animationAuthoringComponentModule',
    'animationGradingComponentModule',
    'audioOscillatorAuthoringComponentModule',
    'audioOscillatorGradingComponentModule',
    'authoringTool.components',
    'classroomMonitor.components',
    'conceptMapAuthoringComponentModule',
    'conceptMapGradingComponentModule',
    'discussionAuthoringComponentModule',
    'discussionGradingComponentModule',
    'drawAuthoringComponentModule',
    'drawGradingComponentModule',
    'embeddedAuthoringComponentModule',
    'embeddedGradingComponentModule',
    'graphAuthoringComponentModule',
    'graphGradingComponentModule',
    'htmlAuthoringComponentModule',
    'importComponentModule',
    'importStepModule',
    'labelAuthoringComponentModule',
    'labelGradingComponentModule',
    'matchAuthoringComponentModule',
    'matchGradingComponentModule',
    'multipleChoiceAuthoringComponentModule',
    'multipleChoiceGradingComponentModule',
    'ngAnimate',
    'ngFileSaver',
    'openResponseAuthoringComponentModule',
    'openResponseGradingComponentModule',
    'outsideURLAuthoringComponentModule',
    'structureAuthoringModule',
    'tableAuthoringComponentModule',
    'tableGradingComponentModule'
  ])
  .service('DataExportService', downgradeInjectable(DataExportService))
  .service('MilestoneService', downgradeInjectable(MilestoneService))
  .factory('ProjectService', downgradeInjectable(TeacherProjectService))
  .factory('ProjectAssetService', downgradeInjectable(ProjectAssetService))
  .factory('SpaceService', downgradeInjectable(SpaceService))
  .factory('StudentStatusService', downgradeInjectable(StudentStatusService))
  .service('TeacherDataService', downgradeInjectable(TeacherDataService))
  .service('TeacherWebSocketService', downgradeInjectable(TeacherWebSocketService))
  .directive(
    'editComponentExcludeFromTotalScore',
    downgradeComponent({
      component: EditComponentExcludeFromTotalScoreComponent
    }) as angular.IDirectiveFactory
  )
  .directive(
    'editComponentJson',
    downgradeComponent({ component: EditComponentJsonComponent }) as angular.IDirectiveFactory
  )
  .directive(
    'editComponentRubric',
    downgradeComponent({ component: EditComponentRubricComponent }) as angular.IDirectiveFactory
  )
  .directive(
    'editComponentTags',
    downgradeComponent({ component: EditComponentTagsComponent }) as angular.IDirectiveFactory
  )
  .directive(
    'editComponentWidth',
    downgradeComponent({ component: EditComponentWidthComponent }) as angular.IDirectiveFactory
  )
  .directive(
    'editComponentMaxScore',
    downgradeComponent({ component: EditComponentMaxScoreComponent }) as angular.IDirectiveFactory
  )
  .component('nodeAdvancedAuthoringComponent', NodeAdvancedAuthoringComponent)
  .component('nodeAdvancedBranchAuthoringComponent', NodeAdvancedBranchAuthoringComponent)
  .component('nodeAdvancedConstraintAuthoringComponent', NodeAdvancedConstraintAuthoringComponent)
  .directive(
    'nodeAdvancedGeneralAuthoringComponent',
    downgradeComponent({
      component: NodeAdvancedGeneralAuthoringComponent
    }) as angular.IDirectiveFactory
  )
  .directive(
    'nodeAdvancedJsonAuthoringComponent',
    downgradeComponent({
      component: NodeAdvancedJsonAuthoringComponent
    }) as angular.IDirectiveFactory
  )
  .component('nodeAdvancedPathAuthoringComponent', NodeAdvancedPathAuthoringComponent)
  .directive(
    'advancedProjectAuthoringComponent',
    downgradeComponent({
      component: AdvancedProjectAuthoringComponent
    }) as angular.IDirectiveFactory
  )
  .directive(
    'wiseAuthoringTinymceEditor',
    downgradeComponent({
      component: WiseAuthoringTinymceEditorComponent
    }) as angular.IDirectiveFactory
  )
  .component('authoringToolComponent', AuthoringToolComponent)
  .component('mainAuthoringComponent', MainAuthoringComponent)
  .component('notebookAuthoringComponent', NotebookAuthoringComponent)
  .controller('ClassroomMonitorController', ClassroomMonitorController)
  .controller('DataExportController', DataExportController)
  .controller('ExportController', ExportController)
  .controller('ExportVisitsController', ExportVisitsController)
  .component('milestonesAuthoringComponent', MilestonesAuthoringComponent)
  .directive(
    'milestones',
    downgradeComponent({ component: MilestonesComponent }) as angular.IDirectiveFactory
  )
  .component('nodeAuthoringComponent', NodeAuthoringComponent)
  .controller('NotebookGradingController', NotebookGradingController)
  .component('projectAssetAuthoringComponent', ProjectAssetAuthoringComponent)
  .controller('ProjectAssetAuthoringController', ProjectAssetAuthoringController)
  .component('projectAuthoringComponent', ProjectAuthoringComponent)
  .component('projectInfoAuthoringComponent', ProjectInfoAuthoringComponent)
  .directive(
    'rubricAuthoringComponent',
    downgradeComponent({ component: RubricAuthoringComponent }) as angular.IDirectiveFactory
  )
  .controller('StudentGradingController', StudentGradingController)
  .controller('StudentProgressController', StudentProgressController)
  .controller('WISELinkAuthoringController', WISELinkAuthoringController)
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
        .state('root.at', {
          url: '/edit',
          abstract: true,
          component: 'authoringToolComponent'
        })
        .state('root.at.main', {
          url: '/home',
          component: 'mainAuthoringComponent',
          resolve: {
            config: [
              'ConfigService',
              (ConfigService) => {
                return ConfigService.retrieveConfig(`/api/author/config`);
              }
            ],
            language: [
              '$translate',
              'ConfigService',
              'config',
              ($translate, ConfigService, config) => {
                $translate.use(ConfigService.getLocale());
              }
            ]
          }
        })
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
        .state('root.at.project.node', {
          url: '/node/:nodeId',
          component: 'nodeAuthoringComponent',
          resolve: {
            node: [
              'ProjectService',
              '$stateParams',
              (ProjectService, $stateParams) => {
                return ProjectService.getNode($stateParams.nodeId);
              }
            ]
          },
          params: {
            newComponents: []
          }
        })
        .state('root.at.project.node.advanced', {
          url: '/advanced',
          component: 'nodeAdvancedAuthoringComponent'
        })
        .state('root.at.project.node.advanced.branch', {
          url: '/branch',
          component: 'nodeAdvancedBranchAuthoringComponent'
        })
        .state('root.at.project.node.advanced.constraint', {
          url: '/constraint',
          component: 'nodeAdvancedConstraintAuthoringComponent'
        })
        .state('root.at.project.node.advanced.general', {
          url: '/general',
          component: 'nodeAdvancedGeneralAuthoringComponent'
        })
        .state('root.at.project.node.advanced.json', {
          url: '/json',
          component: 'nodeAdvancedJsonAuthoringComponent'
        })
        .state('root.at.project.node.advanced.path', {
          url: '/path',
          component: 'nodeAdvancedPathAuthoringComponent'
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

      $translatePartialLoaderProvider.addPart('authoringTool/i18n');
      $translatePartialLoaderProvider.addPart('classroomMonitor/i18n');
      $mdThemingProvider
        .theme('at')
        .primaryPalette('deep-purple', { default: '400' })
        .accentPalette('accent', { default: '500' })
        .warnPalette('red', { default: '800' });
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
