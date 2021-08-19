'use strict';

import * as angular from 'angular';
import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';
import { DrawService } from './drawService';
import { DrawStudent } from './draw-student/draw-student.component';

let drawComponentModule = angular
  .module('drawComponentModule', ['pascalprecht.translate'])
  .service('DrawService', downgradeInjectable(DrawService))
  .directive(
    'drawStudent',
    downgradeComponent({ component: DrawStudent }) as angular.IDirectiveFactory
  )
  .config([
    '$translatePartialLoaderProvider',
    ($translatePartialLoaderProvider) => {
      $translatePartialLoaderProvider.addPart('components/draw/i18n');
    }
  ]);

export default drawComponentModule;
