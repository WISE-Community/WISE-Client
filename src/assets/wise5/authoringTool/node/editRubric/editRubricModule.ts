import * as angular from 'angular';
import { downgradeComponent } from '@angular/upgrade/static';
import { EditRubricComponent } from './edit-rubric.component';

export default angular
  .module('editRubricModule', ['ui.router'])
  .directive('editRubricComponent', downgradeComponent({ component: EditRubricComponent }))
  .config([
    '$stateProvider',
    ($stateProvider) => {
      $stateProvider.state('root.at.project.node.edit-rubric', {
        url: '/edit-rubric',
        component: 'editRubricComponent'
      });
    }
  ]);
