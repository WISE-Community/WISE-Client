'use strict';

import * as angular from 'angular';

const importStepModule = angular.module('importStepModule', ['ui.router']).config([
  '$stateProvider',
  ($stateProvider) => {
    $stateProvider
      .state('root.at.project.import-step', {
        url: '/import-step',
        abstract: true,
        resolve: {}
      })
      .state('root.at.project.import-step.choose-step', {
        url: '/choose-step',
        component: 'chooseImportStepComponent',
        params: {
          selectedNodes: [],
          importFromProjectId: null
        }
      })
      .state('root.at.project.import-step.choose-location', {
        url: '/choose-location',
        component: 'chooseImportStepLocationComponent',
        params: {
          selectedNodes: [],
          importFromProjectId: null
        }
      });
  }
]);

export default importStepModule;
