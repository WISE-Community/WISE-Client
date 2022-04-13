'use strict';

import * as angular from 'angular';
import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';
import { DrawService } from './drawService';
import { EditDrawAdvancedComponent } from './edit-draw-advanced/edit-draw-advanced.component';
import { DrawAuthoring } from './draw-authoring/draw-authoring.component';
import { EditDrawConnectedComponentsComponent } from './edit-draw-connected-components/edit-draw-connected-components.component';

const drawAuthoringComponentModule = angular
  .module('drawAuthoringComponentModule', [])
  .service('DrawService', downgradeInjectable(DrawService))
  .directive(
    'drawAuthoring',
    downgradeComponent({ component: DrawAuthoring }) as angular.IDirectiveFactory
  )
  .directive(
    'editDrawAdvanced',
    downgradeComponent({ component: EditDrawAdvancedComponent }) as angular.IDirectiveFactory
  )
  .directive(
    'editDrawConnectedComponents',
    downgradeComponent({
      component: EditDrawConnectedComponentsComponent
    }) as angular.IDirectiveFactory
  );
export default drawAuthoringComponentModule;
