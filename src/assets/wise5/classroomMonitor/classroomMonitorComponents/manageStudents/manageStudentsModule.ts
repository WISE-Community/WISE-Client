import * as angular from 'angular';
import { downgradeComponent } from '@angular/upgrade/static';
import { ManageStudentsComponent } from './manage-students/manage-students.component';
import { ManageStudentsLegacyComponent } from '../../manageStudents/manage-students-legacy.component';
import { TeamInfoComponent } from './team-info/team-info.component';
import { UserInfoComponent } from './user-info/user-info.component';

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
    'teamInfoComponent',
    downgradeComponent({ component: TeamInfoComponent }) as angular.IDirectiveFactory
  )
  .directive(
    'userInfoComponent',
    downgradeComponent({ component: UserInfoComponent }) as angular.IDirectiveFactory
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
