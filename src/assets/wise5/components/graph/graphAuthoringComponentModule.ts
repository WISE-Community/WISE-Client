'use strict';

import * as angular from 'angular';
import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';
import { GraphService } from './graphService';
import { EditGraphAdvancedComponent } from './edit-graph-advanced/edit-graph-advanced.component';
import { GraphAuthoring } from './graph-authoring/graph-authoring.component';
import { EditGraphConnectedComponentsComponent } from './edit-graph-connected-components/edit-graph-connected-components.component';

const graphAuthoringComponentModule = angular
  .module('graphAuthoringComponentModule', ['pascalprecht.translate'])
  .service('GraphService', downgradeInjectable(GraphService))
  .directive(
    'graphAuthoring',
    downgradeComponent({ component: GraphAuthoring }) as angular.IDirectiveFactory
  )
  .component('editGraphAdvanced', EditGraphAdvancedComponent)
  .directive(
    'editGraphConnectedComponents',
    downgradeComponent({
      component: EditGraphConnectedComponentsComponent
    }) as angular.IDirectiveFactory
  )
  .config([
    '$translatePartialLoaderProvider',
    ($translatePartialLoaderProvider) => {
      $translatePartialLoaderProvider.addPart('components/graph/i18n');
    }
  ]);

export default graphAuthoringComponentModule;
