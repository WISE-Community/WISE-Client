import './lib/jquery/jquery-global';
import * as angular from 'angular';
import { downgradeInjectable } from '@angular/upgrade/static';
import { AchievementService } from './services/achievementService';
import 'angular-file-saver';
import 'ng-file-upload';
import 'angular-inview';
import 'angular-material';
import 'angular-sanitize';
import 'angular-toarrayfilter';
import 'angular-translate';
import 'angular-translate-loader-partial';
import 'angular-ui-router';
import { AnnotationService } from './services/annotationService';
import { AudioRecorderService } from './services/audioRecorderService';
import { ConfigService } from './services/configService';
import { CRaterService } from './services/cRaterService';
import './directives/components';
import { ComponentService } from './components/componentService';
import * as fabric from 'fabric';
window['fabric'] = fabric.fabric;
import Filters from './filters/filters';
import './lib/highcharts/highcharts-ng';
import * as Highcharts from './lib/highcharts/highcharts.src';
import './lib/draggable-points/draggable-points';
import * as HighchartsExporting from './lib/highcharts-exporting@4.2.1';
import * as covariance from 'compute-covariance';
window['Highcharts'] = Highcharts;
window['HighchartsExporting'] = HighchartsExporting;
window['covariance'] = covariance;
import HttpInterceptor from './services/httpInterceptor';
import { NodeService } from './services/nodeService';
import { NotebookService } from './services/notebookService';
import { NotificationService } from './services/notificationService';
import { SessionService } from './services/sessionService';
import { StudentAssetService } from './services/studentAssetService';
import { StudentDataService } from './services/studentDataService';
import { TagService } from './services/tagService';
import './themes/default/theme';
import { ComputerAvatarService } from './services/computerAvatarService';
import { ComponentTypeService } from './services/componentTypeService';

angular
  .module('common', [
    'angular-toArrayFilter',
    'components',
    'filters',
    'highcharts-ng',
    'ngAria',
    'ngFileUpload',
    'ngMaterial',
    'ngSanitize',
    'pascalprecht.translate',
    'ui.router'
  ])
  .service('AchievementService', downgradeInjectable(AchievementService))
  .factory('AnnotationService', downgradeInjectable(AnnotationService))
  .factory('AudioRecorderService', downgradeInjectable(AudioRecorderService))
  .factory('ConfigService', downgradeInjectable(ConfigService))
  .factory('ComponentService', downgradeInjectable(ComponentService))
  .factory('ComputerAvatarService', downgradeInjectable(ComputerAvatarService))
  .factory('ComponentTypeService', downgradeInjectable(ComponentTypeService))
  .factory('CRaterService', downgradeInjectable(CRaterService))
  .service('HttpInterceptor', HttpInterceptor)
  .service('NodeService', downgradeInjectable(NodeService))
  .service('NotebookService', downgradeInjectable(NotebookService))
  .service('NotificationService', downgradeInjectable(NotificationService))
  .factory('SessionService', downgradeInjectable(SessionService))
  .factory('StudentAssetService', downgradeInjectable(StudentAssetService))
  .factory('TagService', downgradeInjectable(TagService))
  .factory('StudentDataService', downgradeInjectable(StudentDataService))
  .filter('Filters', Filters)
  .config([
    '$httpProvider',
    '$locationProvider',
    '$mdThemingProvider',
    '$translateProvider',
    '$translatePartialLoaderProvider',
    (
      $httpProvider,
      $locationProvider,
      $mdThemingProvider,
      $translateProvider,
      $translatePartialLoaderProvider
    ) => {
      $httpProvider.interceptors.push('HttpInterceptor');
      $locationProvider.html5Mode(true);
      $translateProvider
        .useLoader('$translatePartialLoader', {
          urlTemplate: '/assets/wise5/{part}/i18n_{lang}.json'
        })
        .fallbackLanguage(['en'])
        .registerAvailableLanguageKeys(
          ['ar', 'el', 'en', 'es', 'ja', 'ko', 'pt', 'tr', 'zh_CN', 'zh_TW'],
          {
            en_US: 'en',
            en_UK: 'en'
          }
        )
        .determinePreferredLanguage()
        .useSanitizeValueStrategy('sanitizeParameters', 'escape');
      $translatePartialLoaderProvider.addPart('i18n');
      $mdThemingProvider.definePalette('primary', {
        '50': 'e1f0f4',
        '100': 'b8dbe4',
        '200': '8ec6d4',
        '300': '5faec2',
        '400': '3d9db5',
        '500': '1c8ca8',
        '600': '197f98',
        '700': '167188',
        '800': '136377',
        '900': '0e4957',
        A100: 'abf3ff',
        A200: '66e2ff',
        A400: '17bee5',
        A700: '00A1C6',
        contrastDefaultColor: 'light', // whether, by default, text (contrast)
        // on this palette should be dark or light
        contrastDarkColors: [
          '50',
          '100', //hues which contrast should be 'dark' by default
          '200',
          '300',
          'A100'
        ],
        contrastLightColors: undefined // could also specify this if default was 'dark'
      });
      $mdThemingProvider.definePalette('accent', {
        '50': 'fde9e6',
        '100': 'fbcbc4',
        '200': 'f8aca1',
        '300': 'f4897b',
        '400': 'f2705f',
        '500': 'f05843',
        '600': 'da503c',
        '700': 'c34736',
        '800': 'aa3e2f',
        '900': '7d2e23',
        A100: 'ff897d',
        A200: 'ff7061',
        A400: 'ff3829',
        A700: 'cc1705',
        contrastDefaultColor: 'light',
        contrastDarkColors: ['50', '100', '200', '300', 'A100'],
        contrastLightColors: undefined
      });
      const lightMap = $mdThemingProvider.extendPalette('grey', {
        A100: 'ffffff'
      });
      $mdThemingProvider.definePalette('light', lightMap);
      $mdThemingProvider.enableBrowserColor();
    }
  ]);
