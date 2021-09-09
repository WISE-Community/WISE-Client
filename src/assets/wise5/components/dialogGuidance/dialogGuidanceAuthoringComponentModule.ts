'use strict';

import * as angular from 'angular';
import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';
import { DialogGuidanceService } from './dialogGuidanceService';
import { DialogGuidanceAuthoringComponent } from './dialog-guidance-authoring/dialog-guidance-authoring.component';

const dialogGuidanceAuthoringComponentModule = angular
  .module('dialogGuidanceAuthoringComponentModule', [])
  .service('DialogGuidanceService', downgradeInjectable(DialogGuidanceService))
  .directive(
    'dialogGuidanceAuthoring',
    downgradeComponent({ component: DialogGuidanceAuthoringComponent }) as angular.IDirectiveFactory
  );

export default dialogGuidanceAuthoringComponentModule;
