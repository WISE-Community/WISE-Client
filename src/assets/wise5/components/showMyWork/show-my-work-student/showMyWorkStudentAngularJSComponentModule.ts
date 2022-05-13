'use strict';

import * as angular from 'angular';
import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';
import { ShowMyWorkStudentComponent } from './show-my-work-student.component';
import { ShowMyWorkService } from '../showMyWorkService';

const showMyWorkStudentAngularJSComponentModule = angular
  .module('showMyWorkStudentAngularJSComponentModule', [])
  .service('ShowMyWorkService', downgradeInjectable(ShowMyWorkService))
  .directive(
    'showMyWorkStudent',
    downgradeComponent({ component: ShowMyWorkStudentComponent }) as angular.IDirectiveFactory
  );

export default showMyWorkStudentAngularJSComponentModule;
