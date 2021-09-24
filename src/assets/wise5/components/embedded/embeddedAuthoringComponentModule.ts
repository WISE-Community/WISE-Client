'use strict';

import * as angular from 'angular';
import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';
import { EmbeddedService } from './embeddedService';
import { EditEmbeddedAdvancedComponent } from './edit-embedded-advanced/edit-embedded-advanced.component';
import { EmbeddedAuthoring } from './embedded-authoring/embedded-authoring.component';

const embeddedAuthoringComponentModule = angular
  .module('embeddedAuthoringComponentModule', [])
  .service('EmbeddedService', downgradeInjectable(EmbeddedService))
  .directive(
    'editEmbeddedAdvanced',
    downgradeComponent({ component: EditEmbeddedAdvancedComponent }) as angular.IDirectiveFactory
  )
  .directive(
    'embeddedAuthoring',
    downgradeComponent({ component: EmbeddedAuthoring }) as angular.IDirectiveFactory
  );

export default embeddedAuthoringComponentModule;
