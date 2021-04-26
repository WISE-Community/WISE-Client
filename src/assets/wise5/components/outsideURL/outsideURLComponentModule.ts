'use strict';

import * as angular from 'angular';
import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';
import { OutsideURLService } from './outsideURLService';
import { OutsideUrlStudent } from './outside-url-student/outside-url-student.component';

let outsideURLComponentModule = angular
  .module('outsideURLComponentModule', [])
  .service('OutsideURLService', downgradeInjectable(OutsideURLService))
  .directive(
    'outsideUrlStudent',
    downgradeComponent({ component: OutsideUrlStudent }) as angular.IDirectiveFactory
  )
  .config([
    '$translatePartialLoaderProvider',
    ($translatePartialLoaderProvider) => {
      $translatePartialLoaderProvider.addPart('components/outsideURL/i18n');
    }
  ]);

export default outsideURLComponentModule;
