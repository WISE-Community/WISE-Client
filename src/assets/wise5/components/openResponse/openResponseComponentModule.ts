'use strict';

import * as angular from 'angular';
import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';
import { OpenResponseService } from './openResponseService';
import { OpenResponseStudent } from './open-response-student/open-response-student.component';

const openResponseComponentModule = angular
  .module('openResponseComponentModule', ['pascalprecht.translate'])
  .service('OpenResponseService', downgradeInjectable(OpenResponseService))
  .directive(
    'openResponseStudent',
    downgradeComponent({ component: OpenResponseStudent }) as angular.IDirectiveFactory
  )
  .config([
    '$translatePartialLoaderProvider',
    ($translatePartialLoaderProvider) => {
      $translatePartialLoaderProvider.addPart('components/openResponse/i18n');
    }
  ]);

export default openResponseComponentModule;
