import * as angular from 'angular';
import { downgradeComponent } from '@angular/upgrade/static';
import { AddYourOwnNode } from './add-your-own-node/add-your-own-node.component';
import { ChooseNewNodeLocation } from './choose-new-node-location/choose-new-node-location.component';
import { ChooseNewNodeTemplate } from './choose-new-node-template/choose-new-node-template.component';

export default angular
  .module('addNodeModule', ['ui.router'])
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
