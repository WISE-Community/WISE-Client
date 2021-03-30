'use strict';

import * as angular from 'angular';
import { downgradeComponent } from '@angular/upgrade/static';
import { AnimationGrading } from './animation-grading/animation-grading.component';

const animationGradingComponentModule = angular
  .module('animationGradingComponentModule', ['pascalprecht.translate'])
  .directive(
    'animationGrading',
    downgradeComponent({ component: AnimationGrading }) as angular.IDirectiveFactory
  );

export default animationGradingComponentModule;
