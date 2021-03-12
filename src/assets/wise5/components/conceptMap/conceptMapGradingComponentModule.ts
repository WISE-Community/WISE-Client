'use strict';

import * as angular from 'angular';
import { downgradeComponent } from '@angular/upgrade/static';
import { ConceptMapGrading } from './concept-map-grading/concept-map-grading.component';

const conceptMapGradingComponentModule = angular
  .module('conceptMapGradingComponentModule', ['pascalprecht.translate'])
  .directive(
    'conceptMapGrading',
    downgradeComponent({ component: ConceptMapGrading }) as angular.IDirectiveFactory
  );

export default conceptMapGradingComponentModule;
