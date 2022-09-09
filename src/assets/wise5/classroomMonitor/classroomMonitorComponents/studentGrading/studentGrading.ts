'use strict';

import * as angular from 'angular';
import { StepInfoComponent } from '../../../../../app/classroom-monitor/step-info/step-info.component';
import { downgradeComponent } from '@angular/upgrade/static';
import { StepItemComponent } from './step-item/step-item.component';
import { StudentGradingToolsComponent } from './student-grading-tools/student-grading-tools.component';
import { StepToolsComponent } from '../../../common/stepTools/step-tools.component';

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
  .directive(
    'stepTools',
    downgradeComponent({ component: StepToolsComponent }) as angular.IDirectiveFactory
  )
  .directive(
    'studentGradingTools',
    downgradeComponent({ component: StudentGradingToolsComponent }) as angular.IDirectiveFactory
  );

export default StudentGrading;
