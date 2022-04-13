'use strict';

import * as angular from 'angular';
import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';
import { DialogGuidanceStudentComponent } from './dialog-guidance-student/dialog-guidance-student.component';
import { DialogGuidanceService } from './dialogGuidanceService';

const dialogGuidanceStudentComponentModule = angular
  .module('dialogGuidanceStudentComponentModule', [])
  .service('DialogGuidanceService', downgradeInjectable(DialogGuidanceService))
  .directive(
    'dialogGuidanceStudent',
    downgradeComponent({ component: DialogGuidanceStudentComponent }) as angular.IDirectiveFactory
  );

export default dialogGuidanceStudentComponentModule;
