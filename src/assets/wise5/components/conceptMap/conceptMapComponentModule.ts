'use strict';

import * as angular from 'angular';
import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';
import { ConceptMapService } from './conceptMapService';
import { ConceptMapStudent } from './concept-map-student/concept-map-student.component';

let conceptMapComponentModule = angular
  .module('conceptMapComponentModule', ['pascalprecht.translate'])
  .service('ConceptMapService', downgradeInjectable(ConceptMapService))
  .directive(
    'conceptMapStudent',
    downgradeComponent({ component: ConceptMapStudent }) as angular.IDirectiveFactory
  )
  .config([
    '$translatePartialLoaderProvider',
    ($translatePartialLoaderProvider) => {
      $translatePartialLoaderProvider.addPart('components/conceptMap/i18n');
    }
  ]);

export default conceptMapComponentModule;
