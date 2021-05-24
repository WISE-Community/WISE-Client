import * as angular from 'angular';
import { ManageStudentsComponent } from '../../manageStudents/manage-students-component';
import { downgradeComponent } from '@angular/upgrade/static';

angular
  .module('manageStudents', [])
  .directive(
    'manageStudentsComponent',
    downgradeComponent({ component: ManageStudentsComponent }) as angular.IDirectiveFactory
  )
  .config([
    '$stateProvider',
    ($stateProvider) => {
      $stateProvider.state('root.cm.manageStudents', {
        url: '/manageStudents',
        component: 'manageStudentsComponent'
      });
    }
  ]);
