import * as angular from 'angular';
import { downgradeComponent } from '@angular/upgrade/static';
import { AddYourOwnNode } from './add-your-own-node/add-your-own-node.component';
import { ChooseNewNodeLocation } from './choose-new-node-location/choose-new-node-location.component';
import { ChooseNewNodeTemplate } from './choose-new-node-template/choose-new-node-template.component';
import AutomatedAssessmentChooseItemController from './automatedAssessment/automatedAssessmentChooseItemController';
import AutomatedAssessmentConfigureController from './automatedAssessment/automatedAssessmentConfigureController';
import SimulationChooseItemController from './simulation/simulationChooseItemController';

export default angular
  .module('addNodeModule', ['ui.router'])
  .controller('AutomatedAssessmentChooseItemController', AutomatedAssessmentChooseItemController)
  .controller('AutomatedAssessmentConfigureController', AutomatedAssessmentConfigureController)
  .controller('SimulationChooseItemController', SimulationChooseItemController)
  .directive(
    'addYourOwnNode',
    downgradeComponent({ component: AddYourOwnNode }) as angular.IDirectiveFactory
  )
  .directive(
    'chooseNewNodeTemplate',
    downgradeComponent({ component: ChooseNewNodeTemplate }) as angular.IDirectiveFactory
  )
  .directive(
    'chooseNewNodeLocation',
    downgradeComponent({ component: ChooseNewNodeLocation }) as angular.IDirectiveFactory
  )
  .config([
    '$stateProvider',
    ($stateProvider) => {
      $stateProvider
        .state('root.at.project.add-node', {
          url: '/add-node',
          abstract: true,
          resolve: {}
        })
        .state('root.at.project.add-node.choose-template', {
          url: '/choose-template',
          component: 'chooseNewNodeTemplate'
        })
        .state('root.at.project.add-node.add-your-own', {
          url: '/add-your-own',
          component: 'addYourOwnNode',
          params: {
            initialComponents: [],
            title: ''
          }
        })
        .state('root.at.project.add-node.choose-location', {
          url: '/choose-location',
          component: 'chooseNewNodeLocation',
          params: {
            initialComponents: [],
            title: ''
          }
        })
        .state('root.at.project.add-node.automated-assessment', {
          url: '/automated-assessment',
          abstract: true,
          params: {
            structure: null
          }
        })
        .state('root.at.project.add-node.automated-assessment.choose-item', {
          url: '/choose-item',
          templateUrl: 'assets/wise5/authoringTool/addNode/automatedAssessment/choose-item.html',
          controller: 'AutomatedAssessmentChooseItemController',
          controllerAs: '$ctrl',
          params: {
            structure: null
          }
        })
        .state('root.at.project.add-node.automated-assessment.configure', {
          url: '/configure',
          templateUrl: 'assets/wise5/authoringTool/addNode/automatedAssessment/configure-item.html',
          controller: 'AutomatedAssessmentConfigureController',
          controllerAs: '$ctrl',
          params: {
            node: null,
            importFromProjectId: null
          }
        })
        .state('root.at.project.add-node.simulation', {
          url: '/simulation',
          abstract: true
        })
        .state('root.at.project.add-node.simulation.choose-item', {
          url: '/choose-item',
          templateUrl: 'assets/wise5/authoringTool/addNode/simulation/choose-item.html',
          controller: 'SimulationChooseItemController',
          controllerAs: '$ctrl'
        });
    }
  ]);
