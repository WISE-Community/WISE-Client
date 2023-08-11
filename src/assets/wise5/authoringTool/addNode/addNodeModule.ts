import * as angular from 'angular';

export default angular.module('addNodeModule', ['ui.router']).config([
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
