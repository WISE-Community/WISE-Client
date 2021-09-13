import * as angular from 'angular';
import { downgradeComponent } from '@angular/upgrade/static';
import { ManageStudentsComponent } from './manage-students/manage-students.component';

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
        url: '/manage-students',
        component: 'manageStudentsComponent'
      });
    }
  ]);
