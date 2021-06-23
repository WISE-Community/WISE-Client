'use strict';

import * as angular from 'angular';
import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';
import { EmbeddedService } from './embeddedService';
import { EmbeddedStudent } from './embedded-student/embedded-student.component';

const embeddedComponentModule = angular
  .module('embeddedComponentModule', ['pascalprecht.translate'])
  .service('EmbeddedService', downgradeInjectable(EmbeddedService))
  .directive(
    'embeddedStudent',
    downgradeComponent({ component: EmbeddedStudent }) as angular.IDirectiveFactory
  )
  .config([
    '$translatePartialLoaderProvider',
    ($translatePartialLoaderProvider) => {
      $translatePartialLoaderProvider.addPart('components/embedded/i18n');
    }
  ]);

export default embeddedComponentModule;
