'use strict';

import * as angular from 'angular';
import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';
import { GraphService } from './graphService';
import { EditGraphAdvancedComponent } from './edit-graph-advanced/edit-graph-advanced.component';
import { GraphAuthoring } from './graph-authoring/graph-authoring.component';
import { EditGraphConnectedComponentsComponent } from './edit-graph-connected-components/edit-graph-connected-components.component';

const graphAuthoringComponentModule = angular
  .module('graphAuthoringComponentModule', [])
  .service('GraphService', downgradeInjectable(GraphService))
  .directive(
    'editGraphAdvanced',
    downgradeComponent({ component: EditGraphAdvancedComponent }) as angular.IDirectiveFactory
  )
  .directive(
    'editGraphConnectedComponents',
    downgradeComponent({
      component: EditGraphConnectedComponentsComponent
    }) as angular.IDirectiveFactory
  )
  .directive(
    'graphAuthoring',
    downgradeComponent({ component: GraphAuthoring }) as angular.IDirectiveFactory
  );
export default graphAuthoringComponentModule;
