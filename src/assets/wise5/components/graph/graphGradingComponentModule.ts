'use strict';

import * as angular from 'angular';
import { downgradeComponent } from '@angular/upgrade/static';
import { GraphGrading } from './graph-grading/graph-grading.component';

const graphGradingComponentModule = angular
  .module('graphGradingComponentModule', ['pascalprecht.translate'])
  .directive(
    'graphGrading',
    downgradeComponent({ component: GraphGrading }) as angular.IDirectiveFactory
  );

export default graphGradingComponentModule;
