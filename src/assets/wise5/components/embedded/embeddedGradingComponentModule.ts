'use strict';

import * as angular from 'angular';
import { downgradeComponent } from '@angular/upgrade/static';
import { EmbeddedGrading } from './embedded-grading/embedded-grading.component';

const embeddedGradingComponentModule = angular
  .module('embeddedGradingComponentModule', ['pascalprecht.translate'])
  .directive(
    'embeddedGrading',
    downgradeComponent({ component: EmbeddedGrading }) as angular.IDirectiveFactory
  );

export default embeddedGradingComponentModule;
