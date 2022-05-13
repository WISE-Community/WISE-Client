'use strict';

import * as angular from 'angular';
import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';
import { ShowMyWorkService } from '../showMyWorkService';
import { ShowMyWorkAuthoringComponent } from './show-my-work-authoring.component';

const showMyWorkAuthoringAngularJSComponentModule = angular
  .module('showMyWorkAuthoringAngularJSComponentModule', [])
  .service('ShowMyWorkService', downgradeInjectable(ShowMyWorkService))
  .directive(
    'showMyWorkAuthoring',
    downgradeComponent({ component: ShowMyWorkAuthoringComponent }) as angular.IDirectiveFactory
  );

export default showMyWorkAuthoringAngularJSComponentModule;
