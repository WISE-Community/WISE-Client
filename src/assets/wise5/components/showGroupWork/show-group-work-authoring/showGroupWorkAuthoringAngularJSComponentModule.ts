'use strict';

import * as angular from 'angular';
import { downgradeInjectable } from '@angular/upgrade/static';
import { ShowGroupWorkService } from '../showGroupWorkService';

const showGroupWorkAuthoringAngularJSComponentModule = angular
  .module('showGroupWorkAuthoringAngularJSComponentModule', [])
  .service('ShowGroupWorkService', downgradeInjectable(ShowGroupWorkService));

export default showGroupWorkAuthoringAngularJSComponentModule;
