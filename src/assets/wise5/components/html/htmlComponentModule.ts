'use strict';

import * as angular from 'angular';
import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';
import { HTMLService } from './htmlService';
import { HtmlStudent } from './html-student/html-student.component';

const htmlComponentModule = angular
  .module('htmlComponentModule', [])
  .service('HTMLService', downgradeInjectable(HTMLService))
  .directive(
    'htmlStudent',
    downgradeComponent({ component: HtmlStudent }) as angular.IDirectiveFactory
  )
  .config([
    '$translatePartialLoaderProvider',
    ($translatePartialLoaderProvider) => {
      $translatePartialLoaderProvider.addPart('components/html/i18n');
    }
  ]);

export default htmlComponentModule;
