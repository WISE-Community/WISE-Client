'use strict';

import StudentGradingTools from './studentGradingTools/studentGradingTools';
import * as angular from 'angular';
import { StepInfoComponent } from '../../../../../app/classroom-monitor/step-info/step-info.component';
import { downgradeComponent } from '@angular/upgrade/static';
import { StepItemComponent } from './step-item/step-item.component';

const StudentGrading = angular
  .module('studentGrading', [])
  .directive(
    'stepInfo',
    downgradeComponent({ component: StepInfoComponent }) as angular.IDirectiveFactory
  )
  .directive(
    'stepItem',
    downgradeComponent({ component: StepItemComponent }) as angular.IDirectiveFactory
  )
  .component('studentGradingTools', StudentGradingTools);

export default StudentGrading;
