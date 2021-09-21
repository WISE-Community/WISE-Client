'use strict';

import * as angular from 'angular';
import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';
import { ConceptMapService } from './conceptMapService';
import { EditConceptMapAdvancedComponent } from './edit-concept-map-advanced/edit-concept-map-advanced.component';
import { ConceptMapAuthoring } from './concept-map-authoring/concept-map-authoring.component';
import { EditConceptMapConnectedComponentsComponent } from './edit-concept-map-connected-components/edit-concept-map-connected-components.component';

const conceptMapAuthoringComponentModule = angular
  .module('conceptMapAuthoringComponentModule', [])
  .service('ConceptMapService', downgradeInjectable(ConceptMapService))
  .directive(
    'conceptMapAuthoring',
    downgradeComponent({ component: ConceptMapAuthoring }) as angular.IDirectiveFactory
  )
  .directive(
    'editConceptMapAdvanced',
    downgradeComponent({ component: EditConceptMapAdvancedComponent }) as angular.IDirectiveFactory
  )
  .directive(
    'editConceptMapConnectedComponents',
    downgradeComponent({
      component: EditConceptMapConnectedComponentsComponent
    }) as angular.IDirectiveFactory
  );

export default conceptMapAuthoringComponentModule;
