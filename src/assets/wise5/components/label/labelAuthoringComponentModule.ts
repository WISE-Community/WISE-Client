'use strict';

import * as angular from 'angular';
import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';
import { LabelService } from './labelService';
import { EditLabelAdvancedComponent } from './edit-label-advanced/edit-label-advanced.component';
import { LabelAuthoring } from './label-authoring/label-authoring.component';
import { EditLabelConnectedComponentsComponent } from './edit-label-connected-components/edit-label-connected-components.component';

const labelAuthoringComponentModule = angular
  .module('labelAuthoringComponentModule', ['pascalprecht.translate'])
  .service('LabelService', downgradeInjectable(LabelService))
  .directive(
    'labelAuthoring',
    downgradeComponent({ component: LabelAuthoring }) as angular.IDirectiveFactory
  )
  .component('editLabelAdvanced', EditLabelAdvancedComponent)
  .directive(
    'editLabelConnectedComponents',
    downgradeComponent({
      component: EditLabelConnectedComponentsComponent
    }) as angular.IDirectiveFactory
  )
  .config([
    '$translatePartialLoaderProvider',
    ($translatePartialLoaderProvider) => {
      $translatePartialLoaderProvider.addPart('components/label/i18n');
    }
  ]);

export default labelAuthoringComponentModule;
