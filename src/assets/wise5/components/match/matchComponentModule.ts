'use strict';

import * as angular from 'angular';
import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';
import { MatchService } from './matchService';
import { MatchStudent } from './match-student/match-student.component';

let matchComponentModule = angular
  .module('matchComponentModule', ['pascalprecht.translate'])
  .service('MatchService', downgradeInjectable(MatchService))
  .directive(
    'matchStudent',
    downgradeComponent({ component: MatchStudent }) as angular.IDirectiveFactory
  )
  .config([
    '$translatePartialLoaderProvider',
    ($translatePartialLoaderProvider) => {
      $translatePartialLoaderProvider.addPart('components/match/i18n');
    }
  ]);

export default matchComponentModule;
