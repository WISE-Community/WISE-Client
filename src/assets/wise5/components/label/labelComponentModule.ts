'use strict';

import * as angular from 'angular';
import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';
import { LabelService } from './labelService';
import { LabelStudent } from './label-student/label-student.component';

let labelComponentModule = angular
  .module('labelComponentModule', ['pascalprecht.translate'])
  .service('LabelService', downgradeInjectable(LabelService))
  .directive(
    'labelStudent',
    downgradeComponent({ component: LabelStudent }) as angular.IDirectiveFactory
  )
  .config([
    '$translatePartialLoaderProvider',
    ($translatePartialLoaderProvider) => {
      $translatePartialLoaderProvider.addPart('components/label/i18n');
    }
  ]);

export default labelComponentModule;
