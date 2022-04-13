'use strict';

import * as angular from 'angular';
import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';
import { OpenResponseService } from './openResponseService';
import { OpenResponseAuthoring } from './open-response-authoring/open-response-authoring.component';
import { EditOpenResponseAdvancedComponent } from './edit-open-response-advanced/edit-open-response-advanced.component';

const openResponseAuthoringComponentModule = angular
  .module('openResponseAuthoringComponentModule', [])
  .service('OpenResponseService', downgradeInjectable(OpenResponseService))
  .directive(
    'openResponseAuthoring',
    downgradeComponent({ component: OpenResponseAuthoring }) as angular.IDirectiveFactory
  )
  .directive(
    'editOpenResponseAdvanced',
    downgradeComponent({
      component: EditOpenResponseAdvancedComponent
    }) as angular.IDirectiveFactory
  );
export default openResponseAuthoringComponentModule;
