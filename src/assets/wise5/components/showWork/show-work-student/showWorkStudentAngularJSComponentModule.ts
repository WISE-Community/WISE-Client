'use strict';

import * as angular from 'angular';
import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';
import { ShowWorkStudentComponent } from './show-work-student.component';
import { ShowWorkService } from '../showWorkService';

const showWorkStudentAngularJSComponentModule = angular
  .module('showWorkStudentAngularJSComponentModule', [])
  .service('ShowWorkService', downgradeInjectable(ShowWorkService))
  .directive(
    'showWorkStudent',
    downgradeComponent({ component: ShowWorkStudentComponent }) as angular.IDirectiveFactory
  );

export default showWorkStudentAngularJSComponentModule;
