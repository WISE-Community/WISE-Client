'use strict';

import * as angular from 'angular';
import { downgradeInjectable } from '@angular/upgrade/static';
import { ShowMyWorkService } from '../showMyWorkService';

const showMyWorkAuthoringAngularJSComponentModule = angular
  .module('showMyWorkAuthoringAngularJSComponentModule', [])
  .service('ShowMyWorkService', downgradeInjectable(ShowMyWorkService));

export default showMyWorkAuthoringAngularJSComponentModule;
