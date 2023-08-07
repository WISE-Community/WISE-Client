import * as angular from 'angular';

angular.module('manageStudents', []).config([
  '$stateProvider',
  ($stateProvider) => {
    $stateProvider.state('root.cm.manageStudents', {
      url: '/manage-students',
      component: 'manageStudentsComponent'
    });
  }
]);
