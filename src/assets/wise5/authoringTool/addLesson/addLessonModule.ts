import * as angular from 'angular';
import { downgradeComponent } from '@angular/upgrade/static';
import { AddLessonConfigureComponent } from './add-lesson-configure/add-lesson-configure.component';
import { AddLessonChooseLocationComponent } from './add-lesson-choose-location/add-lesson-choose-location.component';

export default angular
  .module('addLessonModule', ['ui.router'])
  .directive(
    'addLessonConfigure',
    downgradeComponent({ component: AddLessonConfigureComponent }) as angular.IDirectiveFactory
  )
  .directive(
    'addLessonChooseLocation',
    downgradeComponent({ component: AddLessonChooseLocationComponent }) as angular.IDirectiveFactory
  )
  .config([
    '$stateProvider',
    ($stateProvider) => {
      $stateProvider
        .state('root.at.project.add-lesson', {
          url: '/add-lesson',
          abstract: true,
          params: {
            name: ''
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
