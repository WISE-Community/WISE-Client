import '../lib/jquery/jquery-global';
import * as angular from 'angular';
import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';
import '../common-angular-js-module';
import '../../../app/student/top-bar/topBarAngularJSModule';
import { StudentWebSocketService } from '../services/studentWebSocketService';
import { VLEProjectService } from '../vle/vleProjectService';
import { NavItemComponent } from './nav-item/nav-item.component';
import { ComponentAnnotationsComponent } from '../directives/componentAnnotations/component-annotations.component';
import { ComponentHeader } from '../directives/component-header/component-header.component';
import { ComponentSaveSubmitButtons } from '../directives/component-save-submit-buttons/component-save-submit-buttons.component';
import { NotebookLauncherComponent } from '../../../app/notebook/notebook-launcher/notebook-launcher.component';
import { AddToNotebookButton } from '../directives/add-to-notebook-button/add-to-notebook-button.component';
import { NavigationComponent } from '../themes/default/navigation/navigation.component';
import { NotificationsDialogComponent } from './notifications-dialog/notifications-dialog.component';
import { StudentAccountMenuComponent } from './student-account-menu/student-account-menu.component';
import { StudentStatusService } from '../services/studentStatusService';
import { NodeComponent } from './node/node.component';
import { VLEComponent } from './vle.component';
import { NotebookNotesComponent } from '../../../app/notebook/notebook-notes/notebook-notes.component';
import { NotebookReportComponent } from '../../../app/notebook/notebook-report/notebook-report.component';

export function createStudentAngularJSModule(type = 'preview') {
  return angular
    .module(type, [
      'common',
      'ngOnload',
      'studentAsset',
      'summaryComponentModule',
      'theme',
      'topBarAngularJSModule',
      'ui.scrollpoint'
    ])
    .factory('ProjectService', downgradeInjectable(VLEProjectService))
    .factory('StudentStatusService', downgradeInjectable(StudentStatusService))
    .factory('StudentWebSocketService', downgradeInjectable(StudentWebSocketService))
    .directive(
      'navItem',
      downgradeComponent({ component: NavItemComponent }) as angular.IDirectiveFactory
    )
    .directive(
      'notebookNotes',
      downgradeComponent({ component: NotebookNotesComponent }) as angular.IDirectiveFactory
    )
    .directive(
      'notebookLauncher',
      downgradeComponent({ component: NotebookLauncherComponent }) as angular.IDirectiveFactory
    )
    .directive(
      'notebookReport',
      downgradeComponent({ component: NotebookReportComponent }) as angular.IDirectiveFactory
    )
    .directive(
      'navigation',
      downgradeComponent({ component: NavigationComponent }) as angular.IDirectiveFactory
    )
    .directive(
      'addToNotebookButton',
      downgradeComponent({ component: AddToNotebookButton }) as angular.IDirectiveFactory
    )
    .directive(
      'componentAnnotations',
      downgradeComponent({ component: ComponentAnnotationsComponent }) as angular.IDirectiveFactory
    )
    .directive(
      'componentHeader',
      downgradeComponent({ component: ComponentHeader }) as angular.IDirectiveFactory
    )
    .directive(
      'componentSaveSubmitButtons',
      downgradeComponent({ component: ComponentSaveSubmitButtons }) as angular.IDirectiveFactory
    )
    .directive(
      'node',
      downgradeComponent({ component: NodeComponent }) as angular.IDirectiveFactory
    )
    .directive(
      'notificationsMenu',
      downgradeComponent({ component: NotificationsDialogComponent }) as angular.IDirectiveFactory
    )
    .directive(
      'studentAccountMenu',
      downgradeComponent({ component: StudentAccountMenuComponent }) as angular.IDirectiveFactory
    )
    .directive('vle', downgradeComponent({ component: VLEComponent }) as angular.IDirectiveFactory)
    .config([
      '$stateProvider',
      '$mdThemingProvider',
      ($stateProvider, $mdThemingProvider) => {
        $stateProvider
          .state('root', {
            url: type === 'preview' ? '/preview' : '/student',
            abstract: true,
            resolve: {
              config: [
                'ConfigService',
                (ConfigService) => {
                  return ConfigService.retrieveConfig(`/api/config/vle`);
                }
              ]
            },
            component: 'vle'
          })
          .state(type === 'preview' ? 'root.preview' : 'root.run', {
            url: type === 'preview' ? '/unit/:projectId' : '/unit/:runId',
            resolve: {
              config: [
                'ConfigService',
                'SessionService',
                '$stateParams',
                (ConfigService, SessionService, $stateParams) => {
                  if (type === 'preview') {
                    return ConfigService.retrieveConfig(
                      `/api/config/preview/${$stateParams.projectId}`
                    );
                  } else {
                    return ConfigService.retrieveConfig(
                      `/api/config/studentRun/${$stateParams.runId}`
                    ).then(() => {
                      SessionService.initializeSession();
                    });
                  }
                }
              ],
              project: [
                'ProjectService',
                'config',
                (ProjectService, config) => {
                  return ProjectService.retrieveProject();
                }
              ],
              studentData: [
                'StudentDataService',
                'config',
                'project',
                'tags',
                (StudentDataService, config, project, tags) => {
                  return StudentDataService.retrieveStudentData();
                }
              ],
              studentStatus: [
                'StudentStatusService',
                'config',
                (StudentStatusService, config) => {
                  return StudentStatusService.retrieveStudentStatus();
                }
              ],
              notebook: [
                'NotebookService',
                'ConfigService',
                'StudentAssetService',
                'studentData',
                'config',
                'project',
                (
                  NotebookService,
                  ConfigService,
                  StudentAssetService,
                  studentData,
                  config,
                  project
                ) => {
                  return StudentAssetService.retrieveAssets().then((studentAssets) => {
                    return NotebookService.retrieveNotebookItems(
                      ConfigService.getWorkgroupId()
                    ).then((notebook) => {
                      return notebook;
                    });
                  });
                }
              ],
              achievements: [
                'AchievementService',
                'studentData',
                'config',
                'project',
                (AchievementService, studentData, config, project) => {
                  return AchievementService.retrieveStudentAchievements();
                }
              ],
              notifications: [
                'NotificationService',
                'studentData',
                'config',
                'project',
                (NotificationService, studentData, config, project) => {
                  return NotificationService.retrieveNotifications();
                }
              ],
              runStatus: [
                'StudentDataService',
                'config',
                (StudentDataService, config) => {
                  return StudentDataService.retrieveRunStatus();
                }
              ],
              tags: [
                'TagService',
                'config',
                (TagService, config) => {
                  if (type === 'preview') {
                    return {};
                  } else {
                    return TagService.retrieveStudentTags().toPromise();
                  }
                }
              ],
              webSocket: [
                'StudentWebSocketService',
                'ConfigService',
                'config',
                'project',
                (StudentWebSocketService, ConfigService, config, project) => {
                  if (!ConfigService.isPreview()) {
                    return StudentWebSocketService.initialize();
                  }
                }
              ]
            },
            views: {
              nodeView: {
                templateProvider: [
                  '$http',
                  'ConfigService',
                  ($http, ConfigService) => {
                    let wiseBaseURL = ConfigService.getWISEBaseURL();
                    return $http
                      .get(wiseBaseURL + '/assets/wise5/vle/project/index.html')
                      .then((response) => {
                        return response.data;
                      });
                  }
                ]
              }
            }
          })
          .state(type === 'preview' ? 'root.preview.node' : 'root.run.node', {
            url: '/:nodeId',
            views: {
              nodeView: {
                templateProvider: [
                  '$http',
                  'ConfigService',
                  ($http, ConfigService) => {
                    let wiseBaseURL = ConfigService.getWISEBaseURL();
                    return $http
                      .get(wiseBaseURL + '/assets/wise5/vle/node/index.html')
                      .then((response) => {
                        return response.data;
                      });
                  }
                ]
              }
            }
          })
          .state('sink', {
            url: '/*path',
            template: ''
          });
        $mdThemingProvider
          .theme('default')
          .primaryPalette('primary')
          .accentPalette('accent', {
            default: '500'
          })
          .warnPalette('red', {
            default: '800'
          });
        $mdThemingProvider
          .theme('light')
          .primaryPalette('light', { default: 'A100' })
          .accentPalette('primary');
        $mdThemingProvider.setDefaultTheme('default');
      }
    ]);
}
