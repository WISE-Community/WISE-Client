import * as angular from 'angular';
import { downgradeComponent } from '@angular/upgrade/static';
import { AddYourOwnNode } from './add-your-own-node/add-your-own-node.component';
import { ChooseNewNodeLocation } from './choose-new-node-location/choose-new-node-location.component';
import { ChooseNewNodeTemplate } from './choose-new-node-template/choose-new-node-template.component';
import { CardSelectorComponent } from '../components/card-selector/card-selector.component';
import { ChooseSimulationComponent } from './choose-simulation/choose-simulation.component';
import { ChooseAutomatedAssessmentComponent } from './choose-automated-assessment/choose-automated-assessment.component';
import { ConfigureAutomatedAssessmentComponent } from './configure-automated-assessment/configure-automated-assessment.component';

export default angular
  .module('addNodeModule', ['ui.router'])
  .directive(
    'chooseAutomatedAssessment',
    downgradeComponent({ component: ChooseAutomatedAssessmentComponent })
  )
  .directive(
    'configureAutomatedAssessment',
    downgradeComponent({ component: ConfigureAutomatedAssessmentComponent })
  )
  .directive('chooseSimulation', downgradeComponent({ component: ChooseSimulationComponent }))
  .directive(
    'addYourOwnNode',
    downgradeComponent({ component: AddYourOwnNode }) as angular.IDirectiveFactory
  )
  .directive(
    'chooseNewNodeTemplate',
    downgradeComponent({ component: ChooseNewNodeTemplate }) as angular.IDirectiveFactory
  )
  .directive(
    'cardSelector',
    downgradeComponent({ component: CardSelectorComponent }) as angular.IDirectiveFactory
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
          component: 'chooseAutomatedAssessment'
        })
        .state('root.at.project.add-node.automated-assessment.configure', {
          url: '/configure',
          component: 'configureAutomatedAssessment',
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
          component: 'chooseSimulation'
        });
    }
  ]);
