'use strict';

import * as angular from 'angular';
import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';
import { GraphService } from './graphService';
import { GraphStudent } from './graph-student/graph-student.component';

let graphComponentModule = angular
  .module('graphComponentModule', ['pascalprecht.translate'])
  .service('GraphService', downgradeInjectable(GraphService))
  .directive(
    'graphStudent',
    downgradeComponent({ component: GraphStudent }) as angular.IDirectiveFactory
  )
  .config([
    '$translatePartialLoaderProvider',
    ($translatePartialLoaderProvider) => {
      $translatePartialLoaderProvider.addPart('components/graph/i18n');
    }
  ]);

export default graphComponentModule;
