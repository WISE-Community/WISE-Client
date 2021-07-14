'use strict';

import * as angular from 'angular';
import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';
import { SummaryService } from './summaryService';
import { SummaryStudent } from './summary-student/summary-student.component';

const summaryComponentModule = angular
  .module('summaryComponentModule', ['pascalprecht.translate'])
  .service('SummaryService', downgradeInjectable(SummaryService))
  .directive(
    'summaryStudent',
    downgradeComponent({ component: SummaryStudent }) as angular.IDirectiveFactory
  )
  .config([
    '$translatePartialLoaderProvider',
    ($translatePartialLoaderProvider) => {
      $translatePartialLoaderProvider.addPart('components/summary/i18n');
    }
  ]);

export default summaryComponentModule;
