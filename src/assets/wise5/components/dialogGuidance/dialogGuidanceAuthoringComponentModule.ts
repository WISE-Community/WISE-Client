'use strict';

import * as angular from 'angular';
import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';
import { DialogGuidanceService } from './dialogGuidanceService';
import { DialogGuidanceAuthoringComponent } from './dialog-guidance-authoring/dialog-guidance-authoring.component';
import { EditDialogGuidanceAdvancedComponent } from './edit-dialog-guidance-advanced/edit-dialog-guidance-advanced.component';
import { EditDialogGuidanceFeedbackRulesComponent } from './edit-dialog-guidance-feedback-rules/edit-dialog-guidance-feedback-rules.component';

const dialogGuidanceAuthoringComponentModule = angular
  .module('dialogGuidanceAuthoringComponentModule', [])
  .service('DialogGuidanceService', downgradeInjectable(DialogGuidanceService))
  .directive(
    'dialogGuidanceAuthoring',
    downgradeComponent({ component: DialogGuidanceAuthoringComponent }) as angular.IDirectiveFactory
  )
  .directive(
    'editDialogGuidanceAdvanced',
    downgradeComponent({ component: EditDialogGuidanceAdvancedComponent })
  )
  .component('editDialogGuidanceFeedbackRules', EditDialogGuidanceFeedbackRulesComponent);

export default dialogGuidanceAuthoringComponentModule;
