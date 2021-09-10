'use strict';

import * as angular from 'angular';
import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';
import { DialogGuidanceService } from './dialogGuidanceService';
import { DialogGuidanceAuthoringComponent } from './dialog-guidance-authoring/dialog-guidance-authoring.component';
import { EditDialogGuidanceAdvancedComponent } from './edit-dialog-guidance-advanced/edit-dialog-guidance-advanced.component';

const dialogGuidanceAuthoringComponentModule = angular
  .module('dialogGuidanceAuthoringComponentModule', [])
  .service('DialogGuidanceService', downgradeInjectable(DialogGuidanceService))
  .directive(
    'dialogGuidanceAuthoring',
    downgradeComponent({ component: DialogGuidanceAuthoringComponent }) as angular.IDirectiveFactory
  )
  .component('editDialogGuidanceAdvanced', EditDialogGuidanceAdvancedComponent);

export default dialogGuidanceAuthoringComponentModule;
