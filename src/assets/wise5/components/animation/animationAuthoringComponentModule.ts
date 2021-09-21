'use strict';

import * as angular from 'angular';
import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';
import { AnimationService } from './animationService';
import { EditAnimationAdvancedComponent } from './edit-animation-advanced/edit-animation-advanced.component';
import { AnimationAuthoring } from './animation-authoring/animation-authoring.component';

const animationAuthoringComponentModule = angular
  .module('animationAuthoringComponentModule', [])
  .service('AnimationService', downgradeInjectable(AnimationService))
  .directive(
    'animationAuthoring',
    downgradeComponent({ component: AnimationAuthoring }) as angular.IDirectiveFactory
  )
  .directive(
    'editAnimationAdvanced',
    downgradeComponent({ component: EditAnimationAdvancedComponent }) as angular.IDirectiveFactory
  );
export default animationAuthoringComponentModule;
