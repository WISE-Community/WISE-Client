'use strict';

import * as angular from 'angular';
import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';
import { SummaryService } from './summaryService';
import { EditSummaryAdvancedComponent } from './edit-summary-advanced/edit-summary-advanced.component';
import { SummaryAuthoring } from './summary-authoring/summary-authoring.component';

const summaryAuthoringComponentModule = angular
  .module('summaryAuthoringComponentModule', [])
  .service('SummaryService', downgradeInjectable(SummaryService))
  .directive(
    'summaryAuthoring',
    downgradeComponent({ component: SummaryAuthoring }) as angular.IDirectiveFactory
  )
  .directive(
    'editSummaryAdvanced',
    downgradeComponent({ component: EditSummaryAdvancedComponent }) as angular.IDirectiveFactory
  );

export default summaryAuthoringComponentModule;
