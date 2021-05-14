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
import './structure/structureAuthoringModule';
import { ProjectAssetService } from '../../../app/services/projectAssetService';
import { ProjectLibraryService } from '../services/projectLibraryService';
import { AdvancedProjectAuthoringComponent } from '../authoringTool/advanced/advanced-project-authoring.component';
import { EditComponentExcludeFromTotalScoreComponent } from '../../../app/authoring-tool/edit-component-exclude-from-total-score/edit-component-exclude-from-total-score.component';
import { AuthoringToolComponent } from '../authoringTool/authoringToolComponent';
import { MainAuthoringComponent } from '../authoringTool/main/mainAuthoringComponent';
import { NotebookAuthoringComponent } from '../authoringTool/notebook/notebookAuthoringComponent';
import { MilestonesAuthoringComponent } from '../authoringTool/milestones/milestonesAuthoringComponent';
import { NodeAdvancedAuthoringComponent } from '../authoringTool/node/advanced/node-advanced-authoring.component';
import { NodeAdvancedBranchAuthoringComponent } from '../authoringTool/node/advanced/branch/node-advanced-branch-authoring.component';
import { NodeAdvancedConstraintAuthoringComponent } from '../authoringTool/node/advanced/constraint/node-advanced-constraint-authoring.component';
import { NodeAdvancedGeneralAuthoringComponent } from '../authoringTool/node/advanced/general/node-advanced-general-authoring.component';
import { NodeAdvancedJsonAuthoringComponent } from '../authoringTool/node/advanced/json/node-advanced-json-authoring.component';
import { NodeAdvancedPathAuthoringComponent } from '../authoringTool/node/advanced/path/node-advanced-path-authoring.component';
import { NodeAuthoringComponent } from '../authoringTool/node/nodeAuthoringComponent';
import {
  ProjectAssetAuthoringController,
  ProjectAssetAuthoringComponent
} from '../authoringTool/asset/projectAssetAuthoringComponent';
import { ProjectAuthoringComponent } from '../authoringTool/project/projectAuthoringComponent';
import { ProjectInfoAuthoringComponent } from '../authoringTool/info/projectInfoAuthoringComponent';
import { RubricAuthoringComponent } from '../authoringTool/rubric/rubric-authoring.component';
import WISELinkAuthoringController from '../authoringTool/wiseLink/wiseLinkAuthoringController';
import { WiseAuthoringTinymceEditorComponent } from '../directives/wise-tinymce-editor/wise-authoring-tinymce-editor.component';
import { EditComponentJsonComponent } from '../../../app/authoring-tool/edit-component-json/edit-component-json.component';
import { EditComponentMaxScoreComponent } from '../../../app/authoring-tool/edit-component-max-score/edit-component-max-score.component';
import { EditComponentRubricComponent } from '../../../app/authoring-tool/edit-component-rubric/edit-component-rubric.component';
import { EditComponentTagsComponent } from '../../../app/authoring-tool/edit-component-tags/edit-component-tags.component';
import { EditComponentWidthComponent } from '../../../app/authoring-tool/edit-component-width/edit-component-width.component';

export default angular
  .module('authoringTool', [
    'addComponentModule',
    'addNodeModule',
    'atShared',
    'componentAuthoringModule',
    'editRubricModule',
    'importComponentModule',
    'importStepModule',
    'structureAuthoringModule',
    'ui.router'
  ])
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
  .factory('ProjectAssetService', downgradeInjectable(ProjectAssetService))
  .factory('ProjectLibraryService', downgradeInjectable(ProjectLibraryService))
  .component('authoringToolComponent', AuthoringToolComponent)
  .component('mainAuthoringComponent', MainAuthoringComponent)
  .component('notebookAuthoringComponent', NotebookAuthoringComponent)
  .component('milestonesAuthoringComponent', MilestonesAuthoringComponent)
  .component('nodeAuthoringComponent', NodeAuthoringComponent)
  .component('projectAssetAuthoringComponent', ProjectAssetAuthoringComponent)
  .controller('ProjectAssetAuthoringController', ProjectAssetAuthoringController)
  .component('projectAuthoringComponent', ProjectAuthoringComponent)
  .component('projectInfoAuthoringComponent', ProjectInfoAuthoringComponent)
  .directive(
    'rubricAuthoringComponent',
    downgradeComponent({ component: RubricAuthoringComponent }) as angular.IDirectiveFactory
  )
  .controller('WISELinkAuthoringController', WISELinkAuthoringController)
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
        });
      $translatePartialLoaderProvider.addPart('authoringTool/i18n');
      $mdThemingProvider
        .theme('at')
        .primaryPalette('deep-purple', { default: '400' })
        .accentPalette('accent', { default: '500' })
        .warnPalette('red', { default: '800' });
    }
  ]);
