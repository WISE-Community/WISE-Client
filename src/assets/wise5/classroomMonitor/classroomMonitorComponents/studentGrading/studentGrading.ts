'use strict';

import StepItem from './stepItem/stepItem';
import * as angular from 'angular';
import { StepInfoComponent } from '../../../../../app/classroom-monitor/step-info/step-info.component';
import { downgradeComponent } from '@angular/upgrade/static';
import { StudentGradingToolsComponent } from './student-grading-tools/student-grading-tools.component';

const StudentGrading = angular
  .module('studentGrading', [])
  .directive(
    'stepInfo',
    downgradeComponent({ component: StepInfoComponent }) as angular.IDirectiveFactory
  )
  .component('stepItem', StepItem)
  .directive(
    'studentGradingTools',
    downgradeComponent({ component: StudentGradingToolsComponent }) as angular.IDirectiveFactory
  );

export default StudentGrading;
