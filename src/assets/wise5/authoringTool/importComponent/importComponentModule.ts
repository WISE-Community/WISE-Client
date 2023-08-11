import * as angular from 'angular';

export default angular.module('importComponentModule', ['ui.router']).config([
  '$stateProvider',
  ($stateProvider) => {
    $stateProvider
      .state('root.at.project.node.import-component', {
        url: '/import-component',
        abstract: true,
        resolve: {}
      })
      .state('root.at.project.node.import-component.choose-step', {
        url: '/choose-component',
        component: 'chooseComponent',
        params: {
          insertAfterComponentId: ''
        }
      });
  }
]);
