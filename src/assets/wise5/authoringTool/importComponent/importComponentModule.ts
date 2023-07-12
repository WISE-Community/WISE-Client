import * as angular from 'angular';
import { downgradeComponent } from '@angular/upgrade/static';
import { ChooseImportComponentComponent } from './choose-import-component/choose-import-component.component';

export default angular
  .module('importComponentModule', ['ui.router'])
  .directive('chooseComponent', downgradeComponent({ component: ChooseImportComponentComponent }))
  .config([
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
