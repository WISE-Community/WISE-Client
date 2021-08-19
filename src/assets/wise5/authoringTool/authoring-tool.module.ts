'use strict';

import * as angular from 'angular';
import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';
import './addComponent/addComponentModule';
import './addNode/addNodeModule';
import '../components/component-authoring.module';
import './components/shared/shared';
import './importComponent/importComponentModule';
import './importStep/importStepModule';
import './node/editRubric/editRubricModule';
import './node/node-authoring.module';
import './project/project-authoring.module';
import './structure/structureAuthoringModule';
import { ProjectLibraryService } from '../services/projectLibraryService';
import { AuthoringToolComponent } from '../authoringTool/authoringToolComponent';
import { MainAuthoringComponent } from '../authoringTool/main/mainAuthoringComponent';
import { WiseAuthoringTinymceEditorComponent } from '../directives/wise-tinymce-editor/wise-authoring-tinymce-editor.component';

export default angular
  .module('authoringTool', [
    'addComponentModule',
    'addNodeModule',
    'atShared',
    'componentAuthoringModule',
    'editRubricModule',
    'importComponentModule',
    'importStepModule',
    'nodeAuthoringModule',
    'projectAuthoringModule',
    'structureAuthoringModule',
    'ui.router'
  ])
  .directive(
    'wiseAuthoringTinymceEditor',
    downgradeComponent({
      component: WiseAuthoringTinymceEditorComponent
    }) as angular.IDirectiveFactory
  )
  .factory('ProjectLibraryService', downgradeInjectable(ProjectLibraryService))
  .component('authoringToolComponent', AuthoringToolComponent)
  .component('mainAuthoringComponent', MainAuthoringComponent)
  .config([
    '$stateProvider',
    '$translatePartialLoaderProvider',
    '$mdThemingProvider',
    ($stateProvider, $translatePartialLoaderProvider, $mdThemingProvider) => {
      $stateProvider
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
        });

      $translatePartialLoaderProvider.addPart('authoringTool/i18n');
      $mdThemingProvider
        .theme('at')
        .primaryPalette('deep-purple', { default: '400' })
        .accentPalette('accent', { default: '500' })
        .warnPalette('red', { default: '800' });
    }
  ]);
