import * as angular from 'angular';
import { downgradeComponent } from '@angular/upgrade/static';
import { ManageStudentsComponent } from './manage-students/manage-students.component';
import { ManageStudentsLegacyComponent } from '../../manageStudents/manage-students-legacy.component';
import { ManagePeriodComponent } from './manage-period/manage-period.component';
import { ManageTeamComponent } from './manage-team/manage-team.component';
import { ManageUserComponent } from './manage-user/manage-user.component';

angular
  .module('manageStudents', [])
  .directive(
    'manageStudentsComponent',
    downgradeComponent({ component: ManageStudentsComponent }) as angular.IDirectiveFactory
  )
  .directive(
    'manageStudentsLegacyComponent',
    downgradeComponent({ component: ManageStudentsLegacyComponent }) as angular.IDirectiveFactory
  )
  .directive(
    'managePeriodComponent',
    downgradeComponent({ component: ManagePeriodComponent }) as angular.IDirectiveFactory
  )
  .directive(
    'manageTeamComponent',
    downgradeComponent({ component: ManageTeamComponent }) as angular.IDirectiveFactory
  )
  .directive(
    'manageUserComponent',
    downgradeComponent({ component: ManageUserComponent }) as angular.IDirectiveFactory
  )
  .config([
    '$stateProvider',
    ($stateProvider) => {
      $stateProvider
        .state('root.cm.manageStudents', {
          url: '/manage-students',
          component: 'manageStudentsComponent'
        })
        .state('root.cm.manageStudentsLegacy', {
          url: '/manageStudents',
          component: 'manageStudentsLegacyComponent'
        });
    }
  ]);
