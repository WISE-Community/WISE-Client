'use strict';

import * as angular from 'angular';
import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';
import { AnimationService } from './animationService';
import { AnimationStudent } from './animation-student/animation-student.component';

const animationComponentModule = angular
  .module('animationComponentModule', ['pascalprecht.translate'])
  .service('AnimationService', downgradeInjectable(AnimationService))
  .directive(
    'animationStudent',
    downgradeComponent({ component: AnimationStudent }) as angular.IDirectiveFactory
  )
  .config([
    '$translatePartialLoaderProvider',
    ($translatePartialLoaderProvider) => {
      $translatePartialLoaderProvider.addPart('components/animation/i18n');
    }
  ]);

export default animationComponentModule;
