'use strict';

import * as angular from 'angular';
import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';
import { ShowGroupWorkService } from '../showGroupWorkService';
import { ShowGroupWorkAuthoringComponent } from './show-group-work-authoring.component';

const showGroupWorkAuthoringAngularJSComponentModule = angular
  .module('showGroupWorkAuthoringAngularJSComponentModule', [])
  .service('ShowGroupWorkService', downgradeInjectable(ShowGroupWorkService))
  .directive(
    'showGroupWorkAuthoring',
    downgradeComponent({ component: ShowGroupWorkAuthoringComponent }) as angular.IDirectiveFactory
  );

export default showGroupWorkAuthoringAngularJSComponentModule;
