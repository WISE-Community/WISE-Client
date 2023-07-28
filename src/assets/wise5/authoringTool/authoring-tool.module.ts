'use strict';

import * as angular from 'angular';
import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';
import './addLesson/addLessonModule';
import './addNode/addNodeModule';
import '../components/component-authoring.module';
import './components/shared/shared';
import './importComponent/importComponentModule';
import './importStep/importStepModule';
import './node/node-authoring.module';
import './project-authoring/project-authoring.module';
import './structure/structureAuthoringModule';
import { ProjectLibraryService } from '../services/projectLibraryService';
import { AuthoringToolComponent } from '../authoringTool/authoringToolComponent';
import { WiseAuthoringTinymceEditorComponent } from '../directives/wise-tinymce-editor/wise-authoring-tinymce-editor.component';
import { StepToolsComponent } from '../common/stepTools/step-tools.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { AddProjectComponent } from './add-project/add-project.component';

export default angular
  .module('authoringTool', [
    'addLessonModule',
    'addNodeModule',
    'atShared',
    'componentAuthoringModule',
    'importComponentModule',
    'importStepModule',
    'nodeAuthoringModule',
    'projectAuthoringModule',
    'structureAuthoringModule',
    'ui.router'
  ])
  .directive(
    'addProjectComponent',
    downgradeComponent({ component: AddProjectComponent }) as angular.IDirectiveFactory
  )
  .directive(
    'stepTools',
    downgradeComponent({ component: StepToolsComponent }) as angular.IDirectiveFactory
  )
  .directive(
    'projectListComponent',
    downgradeComponent({ component: ProjectListComponent }) as angular.IDirectiveFactory
  )
  .directive(
    'wiseAuthoringTinymceEditor',
    downgradeComponent({
      component: WiseAuthoringTinymceEditorComponent
    }) as angular.IDirectiveFactory
  )
  .factory('ProjectLibraryService', downgradeInjectable(ProjectLibraryService))
  .component('authoringToolComponent', AuthoringToolComponent)
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
        .state('root.at.new-unit', {
          url: '/new-unit',
          component: 'addProjectComponent'
        })
        .state('root.at.main', {
          url: '/home',
          component: 'projectListComponent',
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
