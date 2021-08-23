'use strict';

import * as angular from 'angular';
import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';
import { TableService } from './tableService';
import { TableStudent } from './table-student/table-student.component';

let tableComponentModule = angular
  .module('tableComponentModule', ['pascalprecht.translate'])
  .service('TableService', downgradeInjectable(TableService))
  .directive(
    'tableStudent',
    downgradeComponent({ component: TableStudent }) as angular.IDirectiveFactory
  )
  .config([
    '$translatePartialLoaderProvider',
    ($translatePartialLoaderProvider) => {
      $translatePartialLoaderProvider.addPart('components/table/i18n');
    }
  ]);

export default tableComponentModule;
