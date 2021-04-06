import * as angular from 'angular';
import { downgradeComponent } from '@angular/upgrade/static';
import { ChooseNewNode } from './choose-new-node/choose-new-node.component';
import { ChooseNewNodeLocation } from './choose-new-node-location/choose-new-node-location.component';

export default angular
  .module('addNodeModule', ['ui.router'])
  .directive(
    'chooseNewNode',
    downgradeComponent({ component: ChooseNewNode }) as angular.IDirectiveFactory
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
        .state('root.at.project.add-node.choose-node', {
          url: '/choose-node',
          component: 'chooseNewNode',
          params: {
            title: ''
          }
        })
        .state('root.at.project.add-node.choose-location', {
          url: '/choose-location',
          component: 'chooseNewNodeLocation',
          params: {
            title: ''
          }
        });
    }
  ]);
