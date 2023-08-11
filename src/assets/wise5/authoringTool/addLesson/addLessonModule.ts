import * as angular from 'angular';

export default angular.module('addLessonModule', ['ui.router']).config([
  '$stateProvider',
  ($stateProvider) => {
    $stateProvider
      .state('root.at.project.add-lesson', {
        url: '/add-lesson',
        abstract: true,
        params: {
          title: ''
        }
      })
      .state('root.at.project.add-lesson.configure', {
        url: '/configure',
        component: 'addLessonConfigure'
      })
      .state('root.at.project.add-lesson.choose-location', {
        url: '/choose-location',
        component: 'addLessonChooseLocation'
      });
  }
]);
