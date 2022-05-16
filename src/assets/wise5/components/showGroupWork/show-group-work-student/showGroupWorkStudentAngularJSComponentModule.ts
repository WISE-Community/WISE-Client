'use strict';

import * as angular from 'angular';
import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';
import { ShowGroupWorkService } from '../showGroupWorkService';
import { ShowGroupWorkStudentComponent } from './show-group-work-student.component';

const showGroupWorkStudentAngularJSComponentModule = angular
  .module('showGroupWorkStudentAngularJSComponentModule', [])
  .service('ShowGroupWorkService', downgradeInjectable(ShowGroupWorkService))
  .directive(
    'showGroupWorkStudent',
    downgradeComponent({
      component: ShowGroupWorkStudentComponent
    }) as angular.IDirectiveFactory
  );

export default showGroupWorkStudentAngularJSComponentModule;
