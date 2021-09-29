'use strict';

import * as angular from 'angular';
import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';
import { MultipleChoiceService } from './multipleChoiceService';
import { EditMultipleChoiceAdvancedComponent } from './edit-multiple-choice-advanced/edit-multiple-choice-advanced.component';
import { MultipleChoiceAuthoring } from './multiple-choice-authoring/multiple-choice-authoring.component';
import { EditMultipleChoiceConnectedComponentsComponent } from './edit-multiple-choice-connected-components/edit-multiple-choice-connected-components.component';

const multipleChoiceAuthoringComponentModule = angular
  .module('multipleChoiceAuthoringComponentModule', [])
  .service('MultipleChoiceService', downgradeInjectable(MultipleChoiceService))
  .directive(
    'editMultipleChoiceAdvanced',
    downgradeComponent({
      component: EditMultipleChoiceAdvancedComponent
    }) as angular.IDirectiveFactory
  )
  .directive(
    'editMultipleChoiceConnectedComponents',
    downgradeComponent({
      component: EditMultipleChoiceConnectedComponentsComponent
    }) as angular.IDirectiveFactory
  )
  .directive(
    'multipleChoiceAuthoring',
    downgradeComponent({ component: MultipleChoiceAuthoring }) as angular.IDirectiveFactory
  );
export default multipleChoiceAuthoringComponentModule;
