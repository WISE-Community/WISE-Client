import * as angular from 'angular';
import { downgradeComponent } from '@angular/upgrade/static';
import { EditNodeRubricComponent } from './edit-node-rubric.component';

export default angular
  .module('editRubricModule', ['ui.router'])
  .directive('editNodeRubric', downgradeComponent({ component: EditNodeRubricComponent }))
  .config([
    '$stateProvider',
    ($stateProvider) => {
      $stateProvider.state('root.at.project.node.edit-rubric', {
        url: '/edit-rubric',
        component: 'editNodeRubric'
      });
    }
  ]);
