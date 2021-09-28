'use strict';

import * as angular from 'angular';
import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';
import { LabelService } from './labelService';
import { LabelAuthoring } from './label-authoring/label-authoring.component';
import { EditLabelConnectedComponentsComponent } from './edit-label-connected-components/edit-label-connected-components.component';
import { EditLabelAdvancedComponent } from './edit-label-advanced/edit-label-advanced.component';

const labelAuthoringComponentModule = angular
  .module('labelAuthoringComponentModule', [])
  .service('LabelService', downgradeInjectable(LabelService))
  .directive(
    'labelAuthoring',
    downgradeComponent({ component: LabelAuthoring }) as angular.IDirectiveFactory
  )
  .directive(
    'editLabelAdvanced',
    downgradeComponent({ component: EditLabelAdvancedComponent }) as angular.IDirectiveFactory
  )
  .directive(
    'editLabelConnectedComponents',
    downgradeComponent({
      component: EditLabelConnectedComponentsComponent
    }) as angular.IDirectiveFactory
  );
export default labelAuthoringComponentModule;
