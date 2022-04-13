'use strict';

import * as angular from 'angular';
import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';
import { MatchService } from './matchService';
import { EditMatchAdvancedComponent } from './edit-match-advanced/edit-match-advanced.component';
import { MatchAuthoring } from './match-authoring/match-authoring.component';
import { EditMatchConnectedComponentsComponent } from './edit-match-connected-components/edit-match-connected-components.component';

let matchAuthoringComponentModule = angular
  .module('matchAuthoringComponentModule', [])
  .service('MatchService', downgradeInjectable(MatchService))
  .directive(
    'matchAuthoring',
    downgradeComponent({ component: MatchAuthoring }) as angular.IDirectiveFactory
  )
  .directive(
    'editMatchAdvanced',
    downgradeComponent({ component: EditMatchAdvancedComponent }) as angular.IDirectiveFactory
  )
  .directive(
    'editMatchConnectedComponents',
    downgradeComponent({
      component: EditMatchConnectedComponentsComponent
    }) as angular.IDirectiveFactory
  );
export default matchAuthoringComponentModule;
