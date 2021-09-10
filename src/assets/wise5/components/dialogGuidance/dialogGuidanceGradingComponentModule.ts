'use strict';

import * as angular from 'angular';
import { downgradeComponent } from '@angular/upgrade/static';
import { DialogGuidanceGradingComponent } from './dialog-guidance-grading/dialog-guidance-grading.component';

const dialogGuidanceGradingComponentModule = angular
  .module('dialogGuidanceGradingComponentModule', ['pascalprecht.translate'])
  .directive(
    'dialogGuidanceGrading',
    downgradeComponent({ component: DialogGuidanceGradingComponent }) as angular.IDirectiveFactory
  );

export default dialogGuidanceGradingComponentModule;
